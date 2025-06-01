import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ChallengeList() {
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8000/api/challenges')
      .then(res => setChallenges(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Liste des Challenges</h2>
      <ul>
        {challenges.map(c => (
          <li key={c.id}>
            {c.title} - {c.duration} jours
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChallengeList;
