import { useState } from 'react';
import { ExternalLink, Maximize2 } from 'lucide-react';

/**
 * Composant pour intégrer un rapport Power BI via iFrame
 * 
 * Usage:
 * <PowerBIEmbed 
 *   reportUrl="https://app.powerbi.com/reportEmbed?reportId=XXXX"
 *   title="Dashboard E-Commerce"
 *   height="600px"
 * />
 */
const PowerBIEmbed = ({ reportUrl, title = 'Power BI Dashboard', height = '600px' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Erreur lors du chargement du rapport Power BI');
  };

  const openInNewTab = () => {
    window.open(reportUrl, '_blank');
  };

  if (!reportUrl) {
    return (
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px',
        padding: '1rem',
        color: '#856404'
      }}>
        ⚠️ URL du rapport Power BI non configurée. Veuillez définir VITE_POWER_BI_URL dans .env
      </div>
    );
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        background: '#f9fafb',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
          {title}
        </h3>
        <button
          onClick={openInNewTab}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = '#2563eb'}
          onMouseLeave={(e) => e.target.style.background = '#3b82f6'}
          title="Ouvrir en plein écran"
        >
          <Maximize2 size={16} />
          Plein écran
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: height,
          background: '#f9fafb',
          color: '#6b7280'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p>Chargement du rapport Power BI...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: height,
          background: '#fee2e2',
          color: '#b91c1c',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <div>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>❌ {error}</p>
            <button
              onClick={() => window.open("/nadia", "_blank")}
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                background: '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Ouvrir dans un nouvel onglet
            </button>
          </div>
        </div>
      )}

      {/* iFrame */}
      <div style={{ display: isLoading || error ? 'none' : 'block' }}>
       <iframe title="Dashboard" width="600" height="373.5" src="https://app.powerbi.com/view?r=eyJrIjoiMGE2YzVhNzktYjIxNy00ZWFmLWJhOTEtNTBhMjc2OGY1NTEwIiwidCI6ImI3YmQ0NzE1LTQyMTctNDhjNy05MTllLTJlYTk3ZjU5MmZhNyJ9" frameborder="0" allowFullScreen="true"></iframe>
      </div>

      {/* CSS Animation pour le spinner */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PowerBIEmbed;
