import React, { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = "0x33F4a2E02975Fe83516d122F4DA807f71836aAA8";
const ABI = [
  "function updateStatus(uint256 shipmentId, uint256 temp) public",
  "function shipmentTemperatures(uint256) public view returns (uint256)"
];

const Sensor = ({ setAccount }) => {
  const [tempInput, setTempInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setTxHash('');

    if (!window.ethereum) {
      setError("Please install MetaMask to update the blockchain.");
      return;
    }

    try {
      setLoading(true);
      
      // 1. Request Account Access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]); // Updates the Layout header

      // 2. Setup Signer and Contract
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      // 3. Execute Transaction
      // Using shipmentId = 1 for the demo
      const tx = await contract.updateStatus(1, tempInput);
      setTxHash(tx.hash);
      
      console.log("Transaction Sent:", tx.hash);
      
      // 4. Wait for confirmation
      await tx.wait();
      setLoading(false);
      alert("Blockchain Updated Successfully!");
      setTempInput('');

    } catch (err) {
      setLoading(false);
      console.error(err);
      
      // Category 4: Tooling (Tenderly/Debugging)
      // This catch block captures the 'revert' from your Smart Contract
      if (Number(tempInput) > 25) {
        setError("🚨 Transaction Rejected: Temperature exceeds safety threshold (25°C). Use this failed attempt for your Tenderly trace!");
      } else {
        setError("Transaction failed or was rejected by user.");
      }
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Sensor Simulation Control</h1>
      
      <div style={styles.card}>
        <h3>Push Manual Temperature Reading</h3>
        <p style={styles.description}>
          Acting as an IoT Sensor, this form sends a signed transaction to the 
          Ethereum Sepolia network to update the immutable shipment log.
        </p>

        <form onSubmit={handleUpdate} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Temperature (°C)</label>
            <input 
              type="number" 
              value={tempInput}
              onChange={(e) => setTempInput(e.target.value)}
              placeholder="e.g. 22"
              style={styles.input}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{...styles.button, backgroundColor: loading ? '#444' : '#00d1ff'}}
          >
            {loading ? 'Processing Transaction...' : 'Update Blockchain'}
          </button>
        </form>

        {txHash && (
          <div style={styles.successBox}>
            <p>✅ Transaction Sent!</p>
            <a 
              href={`https://sepolia.etherscan.io/tx/${txHash}`} 
              target="_blank" 
              rel="noreferrer"
              style={styles.link}
            >
              View on Etherscan
            </a>
          </div>
        )}

        {error && (
          <div style={styles.errorBox}>
            <p>{error}</p>
          </div>
        )}
      </div>

      <div style={styles.infoCard}>
        <h4>Guidance for Submission</h4>
        <ul style={styles.list}>
          <li><strong>Success Case:</strong> Enter 15-25. The transaction will be mined and the Dashboard graph will update.</li>
          <li><strong>Failure Case:</strong> Enter 30. MetaMask will warn you of a failure. Proceed to generate a <strong>Tenderly trace</strong> for the "Security Audit" section of your assignment.</li>
        </ul>
      </div>
    </div>
  );
};

const styles = {
  container: { maxWidth: '800px', margin: '0 auto' },
  title: { fontSize: '28px', marginBottom: '20px', fontWeight: '300' },
  card: { backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '12px', border: '1px solid #333' },
  description: { color: '#888', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '14px', color: '#aaa' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#0f0f0f', color: '#fff', fontSize: '16px' },
  button: { padding: '14px', borderRadius: '8px', border: 'none', color: '#000', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: '0.2s' },
  successBox: { marginTop: '20px', padding: '15px', backgroundColor: '#1a4d2e', borderRadius: '8px', border: '1px solid #00ff88', textAlign: 'center' },
  errorBox: { marginTop: '20px', padding: '15px', backgroundColor: '#4d1a1a', borderRadius: '8px', border: '1px solid #ff4d4d', color: '#ff4d4d' },
  link: { color: '#00d1ff', fontSize: '12px', textDecoration: 'none' },
  infoCard: { marginTop: '20px', padding: '20px', backgroundColor: '#151515', borderRadius: '12px', border: '1px dashed #333' },
  list: { color: '#aaa', fontSize: '13px', lineHeight: '2' }
};

export default Sensor;