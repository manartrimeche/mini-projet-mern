import { useState } from 'react';
import { BarChart3, TrendingUp, PieChart, LineChart as LineChartIcon, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAnalytics from '../hooks/useAnalytics';

const Analytics = () => {
  const navigate = useNavigate();
  const [powerBiUrl] = useState(import.meta.env.VITE_POWER_BI_URL || 'https://app.powerbi.com/');
  const { stats, loading, error } = useAnalytics();

  // Données par défaut
  const displayStats = loading ? null : stats ? [
    { label: 'Revenus Totaux', value: `$${parseFloat(stats.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: '#10b981' },
    { label: 'Commandes', value: stats.totalOrders || '0', icon: BarChart3, color: '#3b82f6' },
    { label: 'Produits', value: stats.totalProducts || '0', icon: PieChart, color: '#f59e0b' },
    { label: 'Taux de Conversion', value: `${stats.conversionRate || '0'}%`, icon: LineChartIcon, color: '#8b5cf6' },
  ] : [
    { label: 'Revenus Totaux', value: '$0', icon: TrendingUp, color: '#10b981' },
    { label: 'Commandes', value: '0', icon: BarChart3, color: '#3b82f6' },
    { label: 'Produits', value: '0', icon: PieChart, color: '#f59e0b' },
    { label: 'Taux de Conversion', value: '0%', icon: LineChartIcon, color: '#8b5cf6' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1f2937', marginBottom: '0.5rem' }}>
            📊 Analyse de Données
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem' }}>
            Suivez les performances de votre boutique en temps réel
          </p>
        </div>

        {/* States */}
        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#b91c1c',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={18} />
            <span>Erreur de chargement des statistiques: {error}</span>
          </div>
        )}
        {loading && (
          <div style={{
            background: '#f3f4f6',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem'
          }}>
            Chargement des statistiques...
          </div>
        )}

        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {displayStats?.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 10px 15px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>{stat.label}</p>
                    <p style={{ fontSize: '1.875rem', fontWeight: '700', color: '#1f2937', margin: '0.5rem 0 0 0' }}>
                      {stat.value}
                    </p>
                  </div>
                  <Icon size={32} color={stat.color} style={{ opacity: 0.7 }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Power BI Section */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '12px',
          padding: '2rem',
          color: '#fff',
          marginBottom: '2rem',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0, marginBottom: '0.5rem' }}>
                🎯 Dashboard Power BI
              </h2>
              <p style={{ margin: 0, opacity: 0.9, marginBottom: '1rem' }}>
                Explorez des visualisations détaillées et des insights avancés de votre activité commerciale
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', opacity: 0.95 }}>
                <li>📈 Tendances de ventes en temps réel</li>
                <li>👥 Analyse des clients et comportements</li>
                <li>📦 Performance des produits</li>
                <li>💰 ROI et indicateurs clés de performance</li>
              </ul>
            </div>
            <button
              onClick={() => window.open(powerBiUrl, '_blank')}
              style={{
                background: '#fff',
                color: '#667eea',
                border: 'none',
                padding: '1rem 2rem',
                fontSize: '1rem',
                fontWeight: '600',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
            >
              📊 Accéder au Dashboard
            </button>
          </div>
        </div>

        {/* Analytics Description */}
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '2rem'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937', marginTop: 0 }}>
            À propos de l'Analyse de Données
          </h3>
          <p style={{ color: '#6b7280', lineHeight: '1.6' }}>
            Notre système d'analyse de données collecte et traite les informations de votre boutique en temps réel. 
            Utilisez Power BI pour visualiser vos données, créer des rapports personnalisés et identifier les opportunités 
            de croissance. Les données sont mises à jour quotidiennement pour vous garantir une visibilité constante sur 
            les performances de votre entreprise.
          </p>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
              <h4 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>Données Analysées</h4>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Ventes, clients, produits, commandes</p>
            </div>
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
              <h4 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>Fréquence Mise à Jour</h4>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Quotidienne et en temps réel</p>
            </div>
            <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
              <h4 style={{ color: '#1f2937', margin: '0 0 0.5rem 0' }}>Accès Sécurisé</h4>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '0.875rem' }}>Authentification Power BI requise</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
