import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Erreur profil :', error.response?.data || error.message);
        navigate('/login');
      }
    };

    fetchProfile();
  }, [navigate]);

  return (
    <div>
      <h2>Profil utilisateur</h2>
      {user ? (
        <>
          <p><strong>Nom :</strong> {user.nom}</p>
          <p><strong>Prénom :</strong> {user.prenom}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Pays :</strong> {user.pays}</p>
          <p><strong>Langue :</strong> {user.language}</p>
        </>
      ) : (
        <p>Chargement du profil...</p>
      )}
    </div>
  );
}
