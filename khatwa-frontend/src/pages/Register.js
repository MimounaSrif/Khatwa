import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    age: '',
    pays: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/register', form);
      navigate('/login');
    } catch (err) {
      console.error('Erreur d’inscription:', err.response?.data || err);
    }
  };

  return (
    <div>
      <h1>Inscription</h1>
      {Object.keys(form).map((field) => (
        <div key={field}>
          <input
            name={field}
            type={field === 'password' ? 'password' : 'text'}
            placeholder={field}
            value={form[field]}
            onChange={handleChange}
          />
        </div>
      ))}
      <button onClick={handleRegister}>S'inscrire</button>
    </div>
  );
}
