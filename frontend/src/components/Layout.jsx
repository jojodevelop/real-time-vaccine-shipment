import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Added onConnect to the destructured props
const Layout = ({ children, account, onConnect }) => {
  const location = useLocation();

  return (
    <div style={styles.appContainer}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.logo}>❄️ COLDCHAIN PRO</div>
        
        {/* Added onClick and cursor style to make it clickable */}
        <div 
          style={{ ...styles.walletBox, cursor: 'pointer' }} 
          onClick={onConnect}
        >
          {account === 'Not Connected' ? 'Connect Wallet' : `ID: ${account.slice(0,6)}...`}
        </div>
      </header>

      <div style={styles.bodyWrapper}>
        {/* SIDEBAR */}
        <nav style={styles.sidebar}>
          <Link to="/" style={location.pathname === '/' ? styles.activeLink : styles.navLink}>📊 Dashboard</Link>
          <Link to="/sensor" style={location.pathname === '/sensor' ? styles.activeLink : styles.navLink}>🌡️ Sensor Control</Link>
          <Link to="/audit" style={location.pathname === '/audit' ? styles.activeLink : styles.navLink}>🛡️ Audit & Security</Link>
        </nav>

        {/* PAGE CONTENT */}
        <main style={styles.mainContent}>{children}</main>
      </div>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span>Network: Sepolia Testnet</span>
        <span>Status: ● Live Monitoring</span>
      </footer>
    </div>
  );
};

const styles = {
  appContainer: { display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f0f0f', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px', height: '60px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' },
  logo: { fontSize: '18px', fontWeight: 'bold', color: '#00d1ff' },
  walletBox: { 
    backgroundColor: '#333', 
    padding: '5px 15px', 
    borderRadius: '4px', 
    fontSize: '12px',
    border: '1px solid #444',
    transition: '0.3s'
  },
  bodyWrapper: { display: 'flex', flex: 1, overflow: 'hidden' },
  sidebar: { width: '220px', backgroundColor: '#151515', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', padding: '20px' },
  navLink: { padding: '12px', color: '#aaa', textDecoration: 'none', marginBottom: '5px', borderRadius: '4px' },
  activeLink: { padding: '12px', color: '#00d1ff', textDecoration: 'none', backgroundColor: '#00d1ff11', marginBottom: '5px', borderRadius: '4px', fontWeight: 'bold' },
  mainContent: { flex: 1, padding: '30px', overflowY: 'auto' },
  footer: { height: '35px', backgroundColor: '#1a1a1a', borderTop: '1px solid #333', display: 'flex', justifyContent: 'space-around', alignItems: 'center', fontSize: '11px', color: '#666' }
};

export default Layout;