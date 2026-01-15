-- Dimensions
CREATE TABLE IF NOT EXISTS DimTime (
    DateID INTEGER PRIMARY KEY AUTOINCREMENT,
    FullDate DATE UNIQUE NOT NULL,
    Year INTEGER NOT NULL,
    Month INTEGER NOT NULL,
    Day INTEGER NOT NULL,
    Quarter INTEGER NOT NULL,
    DayOfWeek INTEGER NOT NULL,
    MonthName TEXT,
    DayName TEXT
);

CREATE TABLE IF NOT EXISTS DimProduct (
    ProductKey INTEGER PRIMARY KEY AUTOINCREMENT,
    OriginalID TEXT UNIQUE NOT NULL, -- MongoDB ObjectId
    Name TEXT NOT NULL,
    Category TEXT,
    Price REAL,
    Brand TEXT,
    Rating REAL
);

CREATE TABLE IF NOT EXISTS DimCustomer (
    CustomerKey INTEGER PRIMARY KEY AUTOINCREMENT,
    OriginalID TEXT UNIQUE NOT NULL, -- MongoDB ObjectId
    Name TEXT NOT NULL,
    Email TEXT,
    Role TEXT
);

-- Fact Table
CREATE TABLE IF NOT EXISTS FactSales (
    SaleID INTEGER PRIMARY KEY AUTOINCREMENT,
    OrderOriginalID TEXT NOT NULL,
    DateID INTEGER,
    ProductKey INTEGER,
    CustomerKey INTEGER,
    Quantity INTEGER DEFAULT 1,
    TotalAmount REAL,
    DiscountAmount REAL DEFAULT 0,
    PaymentMethod TEXT,
    Status TEXT,
    FOREIGN KEY (DateID) REFERENCES DimTime(DateID),
    FOREIGN KEY (ProductKey) REFERENCES DimProduct(ProductKey),
    FOREIGN KEY (CustomerKey) REFERENCES DimCustomer(CustomerKey)
);
