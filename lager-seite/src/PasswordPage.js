import React, { useState } from 'react';
import './PasswordPage.css';
const PASSWORD = 'LagerKap2'; 

const PasswordPage = ({ onAccessGranted }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === PASSWORD) {
      onAccessGranted();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ textAlign: 'center'}} id='einlogg-Fenster'>
      <h1>Bitte Passwort eingeben</h1>
      <form onSubmit={handleSubmit}>

        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Passwort" />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>Falsches Passwort!</p>}
    </div>
  );
};

export default PasswordPage;
