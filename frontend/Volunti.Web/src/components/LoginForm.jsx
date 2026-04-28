import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Inloggningsförsök skickat för:", email);
  };

  return (
    <div className="form-card">
      <h2 style={{ marginBottom: '2rem' }}>Välkommen tillbaka</h2>
      <form onSubmit={handleLogin} className="form-group">
        <div>
          <label className="input-label">E-postadress</label>
          <input 
            type="email" 
            className="text-input" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>
        <div>
          <label className="input-label">Lösenord</label>
          <input 
            type="password" 
            className="text-input" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          Logga in
        </button>
      </form>
    </div>
  );
}