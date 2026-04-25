import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x25Cd92D549Cd32AfAF886613478b4305349AE448";
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/KRY3O9twLSOOUDoW5Kl9_";
const ABI = ["function shipmentTemperatures(uint256) public view returns (uint256)"];

const Dashboard = () => {
  const [temp, setTemp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  const fetchBlockchainData = async () => {
    try {
      setError(null);
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const currentTemp = await contract.shipmentTemperatures(1);
      setTemp(Number(currentTemp));
      setLastUpdated(new Date());
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Unable to fetch temperature data. Please check your connection.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatus = (t) => {
    if (t === null) return {
      label: "LOADING",
      color: "#64748B",
      bg: "#E2E8F0",
      icon: "⏳",
      message: "Fetching latest data from Sepolia testnet...",
      gradient: "linear-gradient(135deg, #E2E8F0, #CBD5E1)"
    };
    if (t > 39) return {
      label: "CRITICAL BREACH",
      color: "#B91C1C",
      bg: "#FEE2E2",
      icon: "🚨",
      message: "Immediate action required. Temperature exceeds 39°C safety limit.",
      gradient: "linear-gradient(135deg, #FEE2E2, #FECACA)"
    };
    if (t > 25) return {
      label: "MODERATE WARNING",
      color: "#D97706",
      bg: "#FEF3C7",
      icon: "⚠️",
      message: "Temperature elevated. Review cold chain logistics immediately.",
      gradient: "linear-gradient(135deg, #FEF3C7, #FB923C)"
    };
    return {
      label: "OPTIMAL",
      color: "#2563EB",
      bg: "#DBEAFE",
      icon: "✅",
      message: "Cold chain integrity maintained. All parameters within safe range.",
      gradient: "linear-gradient(135deg, #DBEAFE, #BFDBFE)"
    };
  };

  const status = getStatus(temp);
  const safeTemp = temp !== null ? temp : 0;

  const getTemperatureColor = () => {
    if (temp === null) return "#64748B";
    if (temp > 39) return "#DC2626";
    if (temp > 25) return "#D97706";
    return "#2563EB";
  };

  const getGaugePercentage = () => {
    return Math.min(100, Math.max(0, (safeTemp / 50) * 100));
  };

  const formatLastUpdated = () => {
    if (!lastUpdated) return "Never";
    return lastUpdated.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    });
  };

  // Circular gauge calculation
  const radius = 80;
  const stroke = 12;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (getGaugePercentage() / 100) * circumference;

  const styles = {
    dashboard: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    headerSection: {
      marginBottom: '2rem',
    },
    headerTitle: {
      fontSize: '2rem',
      fontWeight: 800,
      color: '#0F172A',
      letterSpacing: '-0.025em',
      marginBottom: '0.5rem',
    },
    headerSubtitle: {
      fontSize: '0.95rem',
      color: '#475569',
      fontWeight: 400,
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem',
    },
    heroCard: {
      background: '#FFFFFF',
      borderRadius: '24px',
      padding: '2rem',
      border: '1px solid #CBD5E1',
      boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    heroCardGlow: {
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: `radial-gradient(circle at 50% 50%, ${status.bg} 0%, transparent 70%)`,
      opacity: 0.6,
      pointerEvents: 'none',
    },
    gaugeContainer: {
      position: 'relative',
      width: '200px',
      height: '200px',
      marginBottom: '1.5rem',
    },
    gaugeValue: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      textAlign: 'center',
    },
    gaugeTemp: {
      fontSize: '3rem',
      fontWeight: 800,
      color: getTemperatureColor(),
      lineHeight: 1,
      letterSpacing: '-0.02em',
    },
    gaugeUnit: {
      fontSize: '1rem',
      color: '#64748B',
      fontWeight: 500,
    },
    gaugeLabel: {
      fontSize: '0.75rem',
      color: '#64748B',
      marginTop: '0.25rem',
      fontWeight: 500,
    },
    statusBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1.25rem',
      borderRadius: '9999px',
      fontWeight: 700,
      fontSize: '0.875rem',
      background: status.bg,
      color: status.color,
      border: `1.5px solid ${status.color}20`,
      marginBottom: '0.75rem',
    },
    statusMessage: {
      fontSize: '0.9rem',
      color: '#475569',
      lineHeight: 1.6,
      maxWidth: '280px',
    },
    infoCard: {
      background: '#FFFFFF',
      borderRadius: '24px',
      padding: '1.75rem',
      border: '1px solid #CBD5E1',
      boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
      display: 'flex',
      flexDirection: 'column',
    },
    infoCardHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '1.5rem',
    },
    infoCardTitle: {
      fontSize: '1.1rem',
      fontWeight: 700,
      color: '#0F172A',
    },
    liveIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem',
      fontSize: '0.75rem',
      fontWeight: 600,
      color: '#1D4ED8',
      background: '#EFF6FF',
      padding: '0.375rem 0.875rem',
      borderRadius: '9999px',
    },
    liveDot: {
      width: '6px',
      height: '6px',
      background: '#2563EB',
      borderRadius: '50%',
      animation: 'pulse 2s infinite',
    },
    metricRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0',
      borderBottom: '1px solid #F3F4F6',
    },
    metricRowLast: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1rem 0',
    },
    metricLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      fontSize: '0.9rem',
      color: '#475569',
      fontWeight: 500,
    },
    metricValue: {
      fontSize: '0.95rem',
      fontWeight: 700,
      color: '#0F172A',
      fontFamily: 'monospace',
    },
    progressSection: {
      marginTop: '0.5rem',
    },
    progressLabel: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem',
      color: '#475569',
      marginBottom: '0.5rem',
      fontWeight: 500,
    },
    progressTrack: {
      height: '10px',
      background: '#E2E8F0',
      borderRadius: '9999px',
      overflow: 'hidden',
      position: 'relative',
    },
    progressFill: {
      height: '100%',
      width: `${getGaugePercentage()}%`,
      background: `linear-gradient(90deg, ${getTemperatureColor()}, ${getTemperatureColor()}aa)`,
      borderRadius: '9999px',
      transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    thresholdMarkers: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '0.5rem',
      fontSize: '0.7rem',
      color: '#64748B',
      fontWeight: 500,
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    statCard: {
      background: '#FFFFFF',
      borderRadius: '20px',
      padding: '1.5rem',
      border: '1px solid #CBD5E1',
      boxShadow: '0 6px 18px rgba(15,23,42,0.06)',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    statIcon: {
      width: '44px',
      height: '44px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.25rem',
      flexShrink: 0,
    },
    statContent: {
      flex: 1,
    },
    statValue: {
      fontSize: '1.25rem',
      fontWeight: 800,
      color: '#0F172A',
      marginBottom: '0.25rem',
    },
    statLabel: {
      fontSize: '0.8rem',
      color: '#64748B',
      fontWeight: 500,
    },
    securityCard: {
      background: '#FFFFFF',
      borderRadius: '24px',
      padding: '1.75rem',
      border: '1px solid #CBD5E1',
      boxShadow: '0 8px 24px rgba(15,23,42,0.06)',
      display: 'flex',
      gap: '1.25rem',
      alignItems: 'flex-start',
    },
    securityIcon: {
      width: '52px',
      height: '52px',
      borderRadius: '16px',
      background: '#EFF6FF',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      flexShrink: 0,
    },
    securityTitle: {
      fontSize: '1.05rem',
      fontWeight: 700,
      color: '#0F172A',
      marginBottom: '0.375rem',
    },
    securityText: {
      fontSize: '0.875rem',
      color: '#64748B',
      lineHeight: 1.6,
    },
    errorCard: {
      background: '#FEE2E2',
      border: '1px solid #FECACA',
      borderRadius: '16px',
      padding: '1rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      color: '#B91C1C',
      fontSize: '0.9rem',
      fontWeight: 500,
      marginTop: '1.5rem',
    },
    shimmer: {
      background: 'linear-gradient(90deg, #EFF6FF 25%, #DBEAFE 50%, #EFF6FF 75%)',
      backgroundSize: '1000px 100%',
      animation: 'shimmer 2s infinite',
      borderRadius: '8px',
    },
  };

  return (
    <div style={styles.dashboard}>
      {/* Header */}
      <div style={styles.headerSection}>
        <h1 style={styles.headerTitle}>Dashboard</h1>
        <p style={styles.headerSubtitle}>
          Real-time cold chain monitoring for vaccine shipment #1
        </p>
      </div>

      {/* Stats Row */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#ECFDF5'}}>📦</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>#1</div>
            <div style={styles.statLabel}>Shipment ID</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#EFF6FF'}}>⛓️</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>Sepolia</div>
            <div style={styles.statLabel}>Network</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#DBEAFE'}}>🌡️</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>{isLoading ? '---' : `${safeTemp}°C`}</div>
            <div style={styles.statLabel}>Current Reading</div>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIcon, background: '#E0E7FF'}}>🔄</div>
          <div style={styles.statContent}>
            <div style={styles.statValue}>10s</div>
            <div style={styles.statLabel}>Refresh Interval</div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.mainGrid}>
        {/* Temperature Gauge Card */}
        <div style={styles.heroCard}>
          <div style={styles.heroCardGlow} />
          
          <div style={styles.gaugeContainer}>
            <svg
              height={radius * 2}
              width={radius * 2}
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                stroke="#E2E8F0"
                strokeWidth={stroke}
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke={getTemperatureColor()}
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                strokeLinecap="round"
                fill="transparent"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
            </svg>
            <div style={styles.gaugeValue}>
              {isLoading ? (
                <div style={{...styles.shimmer, width: '80px', height: '40px', margin: '0 auto'}} />
              ) : (
                <>
                  <div style={styles.gaugeTemp}>{safeTemp}°</div>
                  <div style={styles.gaugeUnit}>Celsius</div>
                </>
              )}
            </div>
          </div>

          <div style={styles.statusBadge}>
            <span>{status.icon}</span>
            <span>{status.label}</span>
          </div>
          
          <p style={styles.statusMessage}>
            {isLoading ? "Connecting to blockchain..." : status.message}
          </p>

          <div style={styles.progressSection}>
            <div style={styles.progressLabel}>
              <span>Thermal Load</span>
              <span>{getGaugePercentage().toFixed(0)}%</span>
            </div>
            <div style={styles.progressTrack}>
              <div style={styles.progressFill} />
            </div>
            <div style={styles.thresholdMarkers}>
              <span>0°C</span>
              <span>25°C</span>
              <span>39°C</span>
              <span>50°C</span>
            </div>
          </div>
        </div>

        {/* Details Card */}
        <div style={styles.infoCard}>
          <div style={styles.infoCardHeader}>
            <span style={styles.infoCardTitle}>Shipment Details</span>
            <span style={styles.liveIndicator}>
              <span style={styles.liveDot} />
              Live
            </span>
          </div>

          <div style={styles.metricRow}>
            <span style={styles.metricLabel}>
              <span>🌡️</span>
              Temperature
            </span>
            <span style={{...styles.metricValue, color: getTemperatureColor()}}>
              {isLoading ? '---' : `${safeTemp}°C`}
            </span>
          </div>

          <div style={styles.metricRow}>
            <span style={styles.metricLabel}>
              <span>📊</span>
              Status
            </span>
            <span style={{...styles.metricValue, color: status.color}}>
              {status.label}
            </span>
          </div>

          <div style={styles.metricRow}>
            <span style={styles.metricLabel}>
              <span>🕐</span>
              Last Updated
            </span>
            <span style={styles.metricValue}>
              {formatLastUpdated()}
            </span>
          </div>

          <div style={styles.metricRow}>
            <span style={styles.metricLabel}>
              <span>🔗</span>
              Contract
            </span>
            <span style={{...styles.metricValue, fontSize: '0.8rem'}}>
              {CONTRACT_ADDRESS.slice(0, 6)}...{CONTRACT_ADDRESS.slice(-4)}
            </span>
          </div>

          <div style={styles.metricRowLast}>
            <span style={styles.metricLabel}>
              <span>✅</span>
              Threshold
            </span>
            <span style={styles.metricValue}>
              ≤ 25°C (V1) / ≤ 39°C (V2)
            </span>
          </div>

          {temp !== null && temp > 25 && (
            <button 
              className="btn-primary" 
              style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
              onClick={() => window.location.href = '/audit'}
            >
              View Security Audit →
            </button>
          )}
        </div>
      </div>

      {/* Security Info */}
      <div style={styles.securityCard}>
        <div style={styles.securityIcon}>🔒</div>
        <div>
          <div style={styles.securityTitle}>Immutable Record Protection</div>
          <p style={styles.securityText}>
            All temperature readings are validated by the smart contract before being recorded 
            on the Sepolia blockchain. Transactions that exceed safety thresholds are automatically 
            reverted, creating a tamper-proof audit trail.
          </p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div style={styles.errorCard}>
          <span>⚠️</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
