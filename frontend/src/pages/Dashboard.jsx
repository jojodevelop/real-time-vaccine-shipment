import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x33F4a2E02975Fe83516d122F4DA807f71836aAA8";
const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/43BB0KpCnJSqwnBmX4EkO";
const ABI = ["function shipmentTemperatures(uint256) public view returns (uint256)"];

const Dashboard = () => {
  const [temp, setTemp] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlockchainData = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
      const currentTemp = await contract.shipmentTemperatures(1);
      setTemp(Number(currentTemp));
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchBlockchainData();
    const interval = setInterval(fetchBlockchainData, 10000); // 10s refresh
    return () => clearInterval(interval);
  }, []);

  // --- LOGIC FOR GOOD, MODERATE, BAD ---
  const getStatus = (t) => {
    if (t > 39) return { label: "CRITICAL BREACH", color: "#ff4d4d", bg: "#4d1a1a", icon: "🚨" };
    if (t > 25) return { label: "MODERATE WARNING", color: "#ffae00", bg: "#4d3d1a", icon: "⚠️" };
    return { label: "OPTIMAL / GOOD", color: "#00ff88", bg: "#1a4d2e", icon: "✅" };
  };

  const status = getStatus(temp);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Live Shipment Tracking</h1>
      
      <div style={styles.statsGrid}>
        {/* TEMPERATURE CARD */}
        <div style={styles.card}>
          <h3 style={styles.cardLabel}>Current Temperature</h3>
          <p style={{...styles.tempValue, color: status.color}}>
            {isLoading ? '--' : `${temp}°C`}
          </p>
        </div>

        {/* DYNAMIC STATUS CARD */}
        <div style={{...styles.card, border: `1px solid ${status.color}`}}>
          <h3 style={styles.cardLabel}>Network Status</h3>
          <div style={{
            ...styles.statusBadge, 
            backgroundColor: status.bg,
            color: status.color
          }}>
            {status.icon} {status.label}
          </div>
          <p style={styles.subtext}>
            {temp <= 25 ? "Optimal cold chain maintained." : 
             temp <= 39 ? "Warning: Approaching V2 threshold." : 
             "Immediate Action Required: Data Reverted."}
          </p>
        </div>
      </div>

      {/* THRESHOLD LEGEND */}
      <div style={styles.legendContainer}>
        <div style={styles.legendItem}><span style={{color: '#00ff88'}}>●</span> 0-25°C: Good</div>
        <div style={styles.legendItem}><span style={{color: '#ffae00'}}>●</span> 26-39°C: Moderate</div>
        <div style={styles.legendItem}><span style={{color: '#ff4d4d'}}>●</span> &gt;39°C: Bad</div>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto' },
  title: { fontSize: '28px', marginBottom: '30px', fontWeight: '300', letterSpacing: '1px' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '30px' },
  card: { backgroundColor: '#161616', padding: '40px 20px', borderRadius: '16px', border: '1px solid #333', textAlign: 'center', transition: '0.3s' },
  cardLabel: { color: '#666', fontSize: '12px', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '2px' },
  tempValue: { fontSize: '64px', fontWeight: '800', margin: '0' },
  statusBadge: { padding: '12px 20px', borderRadius: '8px', display: 'inline-block', fontWeight: 'bold', marginTop: '10px', fontSize: '14px' },
  subtext: { fontSize: '13px', color: '#555', marginTop: '15px', fontStyle: 'italic' },
  legendContainer: { display: 'flex', justifyContent: 'center', gap: '30px', padding: '20px', backgroundColor: '#111', borderRadius: '12px', border: '1px dashed #333' },
  legendItem: { fontSize: '13px', color: '#888', fontWeight: '500' }
};

export default Dashboard;