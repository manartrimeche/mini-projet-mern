import pandas as pd
from sqlalchemy import create_engine, text
from pymongo import MongoClient
import sqlite3
import datetime
import os

# --- Configurations ---
MONGO_URI = "mongodb://localhost:27017"
DB_NAME = "mern-project"
SQLITE_DB = "data_warehouse.db"

def get_engine():
    return create_engine(f'sqlite:///{SQLITE_DB}')

# --- 1. Extraction ---
def extract_from_mongo():
    print("Connecting to MongoDB...")
    client = MongoClient(MONGO_URI)
    
    # Auto-detect DB
    db_name = DB_NAME
    if DB_NAME not in client.list_database_names():
        potential = [d for d in client.list_database_names() if d not in ['admin', 'config', 'local']]
        if potential:
            db_name = potential[0]
            print(f"Using found database: '{db_name}'")
    
    db = client[db_name]
    
    # Extract Collections
    print("Extracting data...")
    users = list(db.users.find())
    products = list(db.products.find())
    orders = list(db.orders.find())
    # Try different casing for orderItems
    order_items = []
    if 'orderitems' in db.list_collection_names():
        order_items = list(db.orderitems.find())
    elif 'orderItems' in db.list_collection_names():
        order_items = list(db.orderItems.find())
    else:
        print("WARNING: 'orderitems' collection not found. Fact table might be empty.")

    print(f"Extracted: {len(users)} users, {len(products)} products, {len(orders)} orders, {len(order_items)} items.")
    return users, products, orders, order_items

# --- 2. Transformation & Load ---
def run_etl():
    engine = get_engine()
    
    # A. Execute Schema Creation
    print("Initializing Database Schema...")
    with open('etl/schema_star.sql', 'r') as f:
        schema_sql = f.read()
    
    with sqlite3.connect(SQLITE_DB) as conn:
        conn.executescript(schema_sql)

    # B. Extract
    users, products, orders, order_items = extract_from_mongo()
    
    if not users or not products:
        print("No data found in Users or Products. Aborting.")
        return

    # --- Dimensions ---
    print("Processing Dimensions...")
    
    # DimCustomer
    df_users = pd.DataFrame(users)
    df_cust = pd.DataFrame()
    df_cust['OriginalID'] = df_users['_id'].astype(str)
    df_cust['Name'] = df_users['username']
    df_cust['Email'] = df_users['email']
    df_cust['Role'] = df_users.get('role', 'user')
    
    df_cust.to_sql('DimCustomer', engine, if_exists='append', index=False)
    print(f"Loaded {len(df_cust)} customers.")

    # DimProduct
    df_prods = pd.DataFrame(products)
    df_prod = pd.DataFrame()
    df_prod['OriginalID'] = df_prods['_id'].astype(str)
    df_prod['Name'] = df_prods['name']
    df_prod['Category'] = df_prods.get('category', 'Uncategorized')
    df_prod['Price'] = df_prods['price']
    df_prod['Brand'] = df_prods.get('brand', 'Unknown')
    df_prod['Rating'] = df_prods.get('rating', 0)
    
    df_prod.to_sql('DimProduct', engine, if_exists='append', index=False)
    print(f"Loaded {len(df_prod)} products.")

    # DimTime (2 years)
    dates = pd.date_range(start='2023-01-01', end='2024-12-31')
    df_time = pd.DataFrame({'FullDate': dates})
    df_time['DateID'] = df_time['FullDate'].dt.strftime('%Y%m%d').astype(int)
    # Re-format FullDate to string for SQLite DATE compatibility
    df_time['FullDateStr'] = df_time['FullDate'].dt.strftime('%Y-%m-%d')
    df_time['Year'] = df_time['FullDate'].dt.year
    df_time['Month'] = df_time['FullDate'].dt.month
    df_time['Day'] = df_time['FullDate'].dt.day
    df_time['Quarter'] = df_time['FullDate'].dt.quarter
    df_time['DayOfWeek'] = df_time['FullDate'].dt.dayofweek
    df_time['MonthName'] = df_time['FullDate'].dt.month_name()
    df_time['DayName'] = df_time['FullDate'].dt.day_name()
    
    # Rename for SQL
    df_time = df_time.drop(columns=['FullDate'])
    df_time = df_time.rename(columns={'FullDateStr': 'FullDate'})
    # Write
    df_time.to_sql('DimTime', engine, if_exists='append', index=False)
    print(f"Loaded {len(df_time)} dates.")

    # --- Reload Keys for Fact Mapping ---
    print("Mapping Keys...")
    # Read back to get the AutoIncrement IDs
    with engine.connect() as conn:
        map_cust = pd.read_sql("SELECT OriginalID, CustomerKey FROM DimCustomer", conn)
        map_prod = pd.read_sql("SELECT OriginalID, ProductKey FROM DimProduct", conn)
    
    cust_dict = dict(zip(map_cust['OriginalID'], map_cust['CustomerKey']))
    prod_dict = dict(zip(map_prod['OriginalID'], map_prod['ProductKey']))

    # --- FactSales ---
    print("Processing Fact Table...")
    
    df_orders = pd.DataFrame(orders)
    df_items = pd.DataFrame(order_items)
    
    fact_rows = []
    
    for _, order in df_orders.iterrows():
        order_id = str(order['_id'])
        user_id = str(order.get('user'))
        
        # Parse Date
        created_at = order.get('createdAt')
        if isinstance(created_at, str):
            dt = pd.to_datetime(created_at)
        else:
            dt = pd.to_datetime(datetime.datetime.now())
        date_id = int(dt.strftime('%Y%m%d'))
        
        cust_key = cust_dict.get(user_id)
        
        # Link items
        # Case 1: Order has 'orderItems' array of IDs, and we have an 'orderitems' collection
        # Case 2: Order has embedded items (if no collection found)
        
        items_in_order = []
        
        if not df_items.empty and 'order' in df_items.columns:
             # Find items where item.order == order_id
             # Convert order refs to string if needed
             # This depends on OrderItem schema. Usually it points to Order.
             # Taking a closer look at Order model: `items: [{ ref: 'OrderItem' }]`
             # Usually means OrderItem exists independently.
             pass
        
        # Fallback: Many MERN tutorials save items inside the Order schema too or populate them.
        # But here we have IDs.
        
        # Let's try to find items for this order. 
        # If 'items' in order is list of IDs:
        item_ids = [str(x) for x in order.get('items', [])]
        
        if df_items.empty:
             # Maybe items are embedded in a differnt way? 
             # For now, let's assume we might fail to link if collection is empty.
             continue
             
        # Filter df_items
        # df_items should have '_id'.
        df_items['_id_str'] = df_items['_id'].astype(str)
        order_items_subset = df_items[df_items['_id_str'].isin(item_ids)]
        
        for _, item in order_items_subset.iterrows():
            prod_id = str(item.get('product'))
            prod_key = prod_dict.get(prod_id)
            
            qty = item.get('qty', 1)
            price = item.get('price', 0) # Unit price
            discount = 0 
            
            total = qty * price
            
            fact_rows.append({
                'OrderOriginalID': order_id,
                'DateID': date_id,
                'ProductKey': prod_key,
                'CustomerKey': cust_key,
                'Quantity': qty,
                'TotalAmount': total,
                'DiscountAmount': discount,
                'PaymentMethod': order.get('paymentMethod'),
                'Status': order.get('status')
            })

    if fact_rows:
        df_fact = pd.DataFrame(fact_rows)
        df_fact.to_sql('FactSales', engine, if_exists='append', index=False)
        print(f"Loaded {len(df_fact)} sales records.")
    else:
        print("No fact rows created. Check Order-Item linking.")

if __name__ == "__main__":
    if os.path.exists(SQLITE_DB):
        os.remove(SQLITE_DB)
    run_etl()
