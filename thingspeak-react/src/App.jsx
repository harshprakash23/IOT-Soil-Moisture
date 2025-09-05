import React, { useEffect, useState, useRef } from "react";
import { Line } from "recharts";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Droplets, Thermometer, Activity, RefreshCw, Clock } from "lucide-react";

const CHANNEL_ID = "3063379"; 
const READ_KEY = "BBWH9Q93ZAHWFTKB"; 
const RESULTS = 50;
const REFRESH_SEC = 20;

function classify(v) {
  if (v < 30) return "DRY";
  if (v > 70) return "WET";
  return "NORMAL";
}

function getStatusColor(status) {
  switch (status) {
    case "DRY": return "linear-gradient(135deg, #ef4444, #f97316)";
    case "WET": return "linear-gradient(135deg, #3b82f6, #14b8a6)";
    default: return "linear-gradient(135deg, #10b981, #059669)";
  }
}

function getStatusIcon(status) {
  switch (status) {
    case "DRY": return <Thermometer style={{ width: 16, height: 16 }} />;
    case "WET": return <Droplets style={{ width: 16, height: 16 }} />;
    default: return <Activity style={{ width: 16, height: 16 }} />;
  }
}

const styles = {
  container: {
    minHeight: '100vh',
    width:'100vw',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e0e7ff 100%)',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  maxWidth: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  headerIcon: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    borderRadius: '20px',
    boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3), 0 10px 10px -5px rgba(37, 99, 235, 0.04)',
    marginBottom: '24px',
    transform: 'perspective(1000px) rotateX(10deg)',
    transition: 'all 0.3s ease'
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #1e293b, #475569, #2563eb)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '16px 0 8px 0',
    letterSpacing: '-0.02em'
  },
  subtitle: {
    color: '#64748b',
    fontSize: '1.25rem',
    margin: 0,
    fontWeight: '500'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statsCard: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: '28px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  statsCardHover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 32px 64px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.4)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  },
  cardIcon: {
    padding: '16px',
    borderRadius: '20px',
    boxShadow: '0 8px 16px -4px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease'
  },
  cardEmoji: {
    fontSize: '2rem',
    filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1))'
  },
  cardTitle: {
    color: '#64748b',
    fontWeight: '600',
    marginBottom: '12px',
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  cardValue: {
    fontSize: '2.5rem',
    fontWeight: '900',
    color: '#1e293b',
    margin: '0 0 16px 0',
    letterSpacing: '-0.02em'
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '12px',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: 'white',
    border: 'none',
    alignSelf: 'flex-start',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    textTransform: 'uppercase',
    letterSpacing: '0.025em'
  },
  cardSubtext: {
    color: '#64748b',
    fontSize: '0.875rem',
    marginTop: 'auto',
    fontWeight: '500'
  },
  chartSection: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '36px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '32px'
  },
  chartHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '20px'
  },
  chartHeaderContent: {
    flex: '1',
    minWidth: '280px'
  },
  chartTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#1e293b',
    margin: '0 0 8px 0',
    letterSpacing: '-0.01em'
  },
  chartSubtitle: {
    color: '#64748b',
    margin: 0,
    fontSize: '1rem',
    fontWeight: '500'
  },
  legend: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    fontSize: '0.875rem',
    color: '#64748b',
    flexWrap: 'wrap',
    fontWeight: '500'
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0'
  },
  legendDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  },
  chartContainer: {
    height: '360px',
    width: '100%',
    borderRadius: '16px',
    overflow: 'hidden'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  loadingContent: {
    textAlign: 'center'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid rgba(59, 130, 246, 0.2)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 20px'
  },
  tableSection: {
    background: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: '28px',
    padding: '36px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginBottom: '32px'
  },
  tableTitle: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '28px',
    letterSpacing: '-0.01em'
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '16px',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0
  },
  tableHeader: {
    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
  },
  th: {
    textAlign: 'left',
    padding: '20px 24px',
    fontWeight: '700',
    color: '#374151',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: '2px solid #e2e8f0'
  },
  tableRow: {
    transition: 'all 0.2s ease',
    borderBottom: '1px solid rgba(241, 245, 249, 0.8)'
  },
  tableRowHover: {
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    transform: 'scale(1.005)'
  },
  td: {
    padding: '20px 24px',
    color: '#64748b',
    fontSize: '0.95rem',
    fontWeight: '500'
  },
  valueCell: {
    fontWeight: '700',
    color: '#1e293b',
    fontSize: '1.1rem'
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    marginTop: '20px'
  },
  footerText: {
    color: '#64748b',
    fontSize: '0.875rem',
    margin: 0,
    fontWeight: '500'
  },
  refreshIcon: {
    padding: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  // Responsive styles
  '@media (max-width: 768px)': {
    title: {
      fontSize: '2.5rem'
    },
    statsGrid: {
      gridTemplateColumns: '1fr',
      gap: '20px'
    },
    chartSection: {
      padding: '24px'
    },
    tableSection: {
      padding: '24px'
    },
    chartHeader: {
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    legend: {
      justifyContent: 'flex-start'
    }
  }
};

// Enhanced keyframe animations and responsive styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  @keyframes slideUp {
    0% { transform: translateY(20px); opacity: 0; }
    100% { transform: translateY(0); opacity: 1; }
  }
  
  .stats-card {
    animation: slideUp 0.6s ease-out;
  }
  
  .stats-card:nth-child(1) { animation-delay: 0.1s; }
  .stats-card:nth-child(2) { animation-delay: 0.2s; }
  .stats-card:nth-child(3) { animation-delay: 0.3s; }
  
  .header-icon:hover {
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg) !important;
    box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.4) !important;
  }
  
  @media (max-width: 1200px) {
    .responsive-container {
      padding: 16px !important;
    }
  }
  
  @media (max-width: 768px) {
    .responsive-title {
      font-size: 2.5rem !important;
    }
    .responsive-padding {
      padding: 20px !important;
    }
    .responsive-grid {
      grid-template-columns: 1fr !important;
      gap: 16px !important;
    }
    .responsive-flex {
      flex-direction: column !important;
      align-items: flex-start !important;
    }
    .responsive-container {
      padding: 12px !important;
    }
  }
  
  @media (max-width: 480px) {
    .responsive-title {
      font-size: 2rem !important;
    }
    .responsive-card {
      padding: 16px !important;
      min-height: 140px !important;
    }
    .responsive-container {
      padding: 8px !important;
    }
  }
`;

if (!document.head.querySelector('style[data-enhanced-soil-monitor]')) {
  styleSheet.setAttribute('data-enhanced-soil-monitor', 'true');
  document.head.appendChild(styleSheet);
}

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);
  const timerRef = useRef();

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const sampleData = [];
    const now = new Date();
    for (let i = 0; i < RESULTS; i++) {
      const timestamp = new Date(now.getTime() - (RESULTS - i) * 60000);
      const baseValue = 45 + Math.sin(i / 10) * 20;
      const noise = (Math.random() - 0.5) * 10;
      const value = Math.max(0, Math.min(100, baseValue + noise));
      
      sampleData.push({
        created_at: timestamp.toISOString(),
        value: Math.round(value),
        status: classify(value),
        timestamp: timestamp.getTime()
      });
    }
    return sampleData;
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const sampleData = generateSampleData();
      setRows(sampleData);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    timerRef.current = setInterval(fetchData, REFRESH_SEC * 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const chartData = rows.map(r => ({
    timestamp: new Date(r.created_at).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    value: r.value,
    fullTimestamp: r.created_at
  }));

  const currentReading = rows[rows.length - 1];
  const avgMoisture = rows.length ? Math.round(rows.reduce((sum, r) => sum + r.value, 0) / rows.length) : 0;

  return (
    <div style={styles.container} className="responsive-container">
      <div style={styles.maxWidth}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon} className="header-icon">
            <Droplets style={{ width: 36, height: 36, color: 'white' }} />
          </div>
          <h1 style={styles.title} className="responsive-title">Soil Moisture Monitor</h1>
          <p style={styles.subtitle}>Real-time environmental monitoring dashboard</p>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid} className="responsive-grid">
          <div 
            style={{
              ...styles.statsCard,
              ...(hoveredCard === 'current' ? styles.statsCardHover : {})
            }}
            className="stats-card responsive-card"
            onMouseEnter={() => setHoveredCard('current')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{
                ...styles.cardIcon,
                background: 'linear-gradient(135deg, #3b82f6, #2563eb)'
              }}>
                <Droplets style={{ width: 28, height: 28, color: 'white' }} />
              </div>
              <span style={styles.cardEmoji}>💧</span>
            </div>
            <h3 style={styles.cardTitle}>Current Moisture</h3>
            <p style={styles.cardValue}>
              {currentReading ? `${currentReading.value}%` : '--'}
            </p>
            {currentReading && (
              <div style={{
                ...styles.statusBadge,
                background: getStatusColor(currentReading.status)
              }}>
                {getStatusIcon(currentReading.status)}
                {currentReading.status}
              </div>
            )}
          </div>

          <div 
            style={{
              ...styles.statsCard,
              ...(hoveredCard === 'average' ? styles.statsCardHover : {})
            }}
            className="stats-card responsive-card"
            onMouseEnter={() => setHoveredCard('average')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{
                ...styles.cardIcon,
                background: 'linear-gradient(135deg, #10b981, #059669)'
              }}>
                <Activity style={{ width: 28, height: 28, color: 'white' }} />
              </div>
              <span style={styles.cardEmoji}>📊</span>
            </div>
            <h3 style={styles.cardTitle}>Average Moisture</h3>
            <p style={styles.cardValue}>{avgMoisture}%</p>
            <p style={styles.cardSubtext}>Last {RESULTS} readings</p>
          </div>

          <div 
            style={{
              ...styles.statsCard,
              ...(hoveredCard === 'update' ? styles.statsCardHover : {})
            }}
            className="stats-card responsive-card"
            onMouseEnter={() => setHoveredCard('update')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div style={styles.cardHeader}>
              <div style={{
                ...styles.cardIcon,
                background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'
              }}>
                <Clock style={{ width: 28, height: 28, color: 'white' }} />
              </div>
              <div style={{
                ...styles.refreshIcon,
                backgroundColor: loading ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                ...(loading ? { animation: 'spin 1s linear infinite' } : {})
              }}>
                <RefreshCw style={{
                  width: 18,
                  height: 18,
                  color: loading ? '#2563eb' : '#059669'
                }} />
              </div>
            </div>
            <h3 style={styles.cardTitle}>Last Update</h3>
            <p style={styles.cardValue}>
              {lastUpdate ? lastUpdate.toLocaleTimeString() : '--'}
            </p>
            <p style={styles.cardSubtext}>Auto-refresh: {REFRESH_SEC}s</p>
          </div>
        </div>

        {/* Chart Section */}
        <div style={styles.chartSection} className="responsive-padding">
          <div style={styles.chartHeader} className="responsive-flex">
            <div style={styles.chartHeaderContent}>
              <h2 style={styles.chartTitle}>Moisture Trends</h2>
              <p style={styles.chartSubtitle}>Real-time soil moisture levels over time</p>
            </div>
            <div style={styles.legend}>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: '#ef4444'}}></div>
                <span>Dry (&lt;30%)</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: '#10b981'}}></div>
                <span>Normal (30-70%)</span>
              </div>
              <div style={styles.legendItem}>
                <div style={{...styles.legendDot, backgroundColor: '#3b82f6'}}></div>
                <span>Wet (&gt;70%)</span>
              </div>
            </div>
          </div>
          
          <div style={styles.chartContainer}>
            {chartData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      backdropFilter: 'blur(10px)'
                    }}
                    labelStyle={{ color: '#1e293b', fontWeight: '600' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="url(#gradient)"
                    strokeWidth={4}
                    dot={{ fill: '#3b82f6', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 7, fill: '#1d4ed8', strokeWidth: 3, stroke: '#ffffff' }}
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingContent}>
                  {loading ? (
                    <>
                      <div style={styles.spinner}></div>
                      <p style={{ color: '#64748b', fontWeight: '500' }}>Loading data...</p>
                    </>
                  ) : (
                    <p style={{ color: '#64748b', fontWeight: '500' }}>No data available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Readings Table */}
        <div style={styles.tableSection} className="responsive-padding">
          <h2 style={styles.tableTitle}>Recent Readings</h2>
          
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.th}>Timestamp</th>
                  <th style={styles.th}>Moisture</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(-10).reverse().map((r, i) => (
                  <tr 
                    key={i} 
                    style={{
                      ...styles.tableRow,
                      ...(hoveredRow === i ? styles.tableRowHover : {})
                    }}
                    onMouseEnter={() => setHoveredRow(i)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td style={styles.td}>
                      {new Date(r.created_at).toLocaleString()}
                    </td>
                    <td style={{...styles.td, ...styles.valueCell}}>
                      {r.value}%
                    </td>
                    <td style={styles.td}>
                      <div style={{
                        ...styles.statusBadge,
                        background: getStatusColor(r.status)
                      }}>
                        {getStatusIcon(r.status)}
                        {r.status}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            🌱 Monitoring soil health • Updates every {REFRESH_SEC} seconds
          </p>
        </div>
      </div>
    </div>
  );
}