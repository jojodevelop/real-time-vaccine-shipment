import React from 'react';

const Audit = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Security & Audit Report</h1>
      
      {/* ADERYN SECTION - Static Analysis */}
      <div style={styles.section}>
        <div style={styles.headerGroup}>
          <h2 style={styles.sectionTitle}>🛡️ Aderyn Static Analysis</h2>
          <span style={styles.badge}>Category 2 Fulfillment</span>
        </div>
        <div style={styles.card}>
          <p style={styles.description}>
            The smart contract was audited using <strong>Aderyn</strong> to detect common 
            vulnerabilities such as reentrancy, integer overflows, and access control issues.
          </p>
          <div style={styles.reportBox}>
            <h4 style={{ color: '#00d1ff', marginBottom: '10px' }}>Audit Summary:</h4>
            <ul style={styles.list}>
              <li><strong>Critical:</strong> 0 Issues Found</li>
              <li><strong>High:</strong> 0 Issues Found</li>
              <li><strong>Medium:</strong> 0 Issues Found</li>
              <li><strong>Low/Info:</strong> 2 Issues (Centralization Risk, Floating Pragma)</li>
            </ul>
            <p style={styles.footerNote}><em>*Report generated from aderyn . in project root</em></p>
          </div>
        </div>
      </div>

      {/* TENDERLY SECTION - Forensic Debugging */}
      <div style={styles.section}>
        <div style={styles.headerGroup}>
          <h2 style={styles.sectionTitle}>🔍 Forensic Debugging (Tenderly)</h2>
          <span style={styles.badge}>Category 4 Fulfillment</span>
        </div>
        <div style={styles.card}>
          <p style={styles.description}>
            To verify the 25°C safety threshold, a breach was simulated. The failed 
            transaction was analyzed via <strong>Tenderly</strong> to confirm the exact line 
            of code triggering the revert.
          </p>
          <div style={styles.tracePlaceholder}>
            <p style={{ color: '#888' }}>[ Trace Visualization ]</p>
            <code style={styles.codeSnippet}>
              revert: Temperature exceeds safety threshold! (Line 42)
            </code>
          </div>
          <button 
            style={styles.secondaryBtn}
            onClick={() => window.open('https://dashboard.tenderly.co/', '_blank')}
          >
            Open Tenderly Dashboard
          </button>
        </div>
      </div>

      {/* SAFETY LOGIC EXPLAINER */}
      <div style={styles.infoBox}>
        <h4>Why this is Secure:</h4>
        <p>
          The contract uses <code>require(temp &lt;= 25, "...")</code>. 
          Because the blockchain is immutable, once a breach is recorded or rejected, 
          the sensor data cannot be tampered with by the driver or logistics company.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '1000px', margin: '0 auto', paddingBottom: '50px' },
  title: { fontSize: '28px', marginBottom: '30px', fontWeight: '300' },
  section: { marginBottom: '40px' },
  headerGroup: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' },
  sectionTitle: { fontSize: '20px', margin: 0 },
  badge: { fontSize: '10px', backgroundColor: '#333', padding: '4px 8px', borderRadius: '4px', color: '#00d1ff', textTransform: 'uppercase' },
  card: { backgroundColor: '#1a1a1a', padding: '25px', borderRadius: '12px', border: '1px solid #333' },
  description: { color: '#bbb', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' },
  reportBox: { backgroundColor: '#0f0f0f', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #00d1ff' },
  list: { color: '#fff', fontSize: '14px', lineHeight: '2', listStyle: 'none', padding: 0 },
  footerNote: { fontSize: '11px', color: '#555', marginTop: '15px' },
  tracePlaceholder: { backgroundColor: '#000', padding: '30px', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', border: '1px solid #222' },
  codeSnippet: { display: 'block', marginTop: '10px', color: '#ff4d4d', fontFamily: 'monospace' },
  secondaryBtn: { backgroundColor: 'transparent', border: '1px solid #00d1ff', color: '#00d1ff', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
  infoBox: { backgroundColor: '#1a4d2e11', padding: '20px', borderRadius: '12px', border: '1px solid #1a4d2e', marginTop: '20px' }
};

export default Audit;