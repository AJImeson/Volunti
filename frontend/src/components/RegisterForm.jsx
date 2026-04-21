import React, { useState } from 'react';

export default function RegisterForm() {
  const [role, setRole] = useState('volunteer');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const updateField = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegistration = (e) => {

    e.preventDefault();

    const payload = { ...formData, role };
    console.log("Registreringsdata klar för backend:", payload);
  };

  return (
    <div className="form-card">
      <h2 style={{ marginBottom: '0.5rem' }}>Skapa ett konto</h2>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Välj din roll i Volunti-communityt.</p>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          type="button"
          onClick={() => setRole('volunteer')}
          className={role === 'volunteer' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1 }}
        >
          Volontär
        </button>
        <button 
          type="button"
          onClick={() => setRole('organization')}
          className={role === 'organization' ? 'btn-primary' : 'btn-secondary'}
          style={{ flex: 1 }}
        >
          Organisation
        </button>
      </div>

      <form onSubmit={handleRegistration} className="form-group">
        <div>
          <label className="input-label">
            {role === 'volunteer' ? 'Fullständigt namn' : 'Organisationens namn'}
          </label>
          <input name="name" className="text-input" onChange={updateField} required />
        </div>
        <div>
          <label className="input-label">E-postadress</label>
          <input type="email" name="email" className="text-input" onChange={updateField} required />
        </div>
        <div>
          <label className="input-label">Lösenord</label>
          <input type="password" name="password" className="text-input" onChange={updateField} required />
        </div>
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          Slutför registrering
        </button>
      </form>
    </div>
  );
}