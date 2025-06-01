import React, { useState } from 'react';
import axios from 'axios';

const ChallengeForm = () => {
  const [messages, setMessages] = useState([
    {
      from: 'ai',
      text:
        "Bienvenue sur Khatwa — votre premier pas vers une meilleure version de vous-même. Dis-moi quel est ton objectif ou le défi que tu veux relever.",
    },
  ]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState(0);
  const [challenge, setChallenge] = useState({
    title: '',
    duration: '',
    difficulty: '',
    days: [],
  });

  const sendMessage = (text, from = 'user') => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const askAI = async (message, context = null) => {
    const systemPrompt = context ?? 
      `Tu es un assistant intelligent qui aide les utilisateurs à créer des challenges personnalisés. 
      Pose des questions à l'utilisateur pour :
      1. Comprendre son objectif ou le thème de son challenge (ex : apprendre une langue, améliorer sa santé, etc.).
      2. Connaître son niveau actuel ou son expérience sur le sujet.
      3. Identifier ses disponibilités quotidiennes (heures ou moments de la journée).
      4. Savoir combien de temps il peut consacrer chaque jour (ex : 15 min, 30 min, 1h...).

      En fonction de ces réponses, propose une durée idéale (30, 60, ou 90 jours) avec une justification motivante.
      Puis génère un plan détaillé avec une tâche pour chaque jour.

      Sois conversationnel, pose des questions étape par étape.`;

    const response = await axios.post('https://api.aimlapi.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer fb53bd46731047579d096ab4373428f4',
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  };

  const handleInput = async () => {
    const trimmed = input.trim();
    sendMessage(trimmed, 'user');
    setInput('');

    try {
      switch (step) {
        case 0:
          // Dès la première réponse, l’IA commence la conversation
          const reply0 = await askAI(`L'utilisateur a dit : "${trimmed}". 
            Pose-lui des questions pour comprendre son objectif, niveau, disponibilité, etc.`);
          sendMessage(reply0, 'ai');
          setStep(1);
          break;

        case 1:
          // On laisse la conversation libre à l’IA jusqu’à ce que l'utilisateur donne un nombre de jours
          const nb = parseInt(trimmed);
          if (!isNaN(nb) && nb > 0) {
            setChallenge((prev) => ({ ...prev, duration: nb }));
            const reply2 = await askAI(`Le challenge dure ${nb} jours. Demande maintenant le niveau de difficulté (facile, moyenne, difficile).`);
            sendMessage(reply2, 'ai');
            setStep(2);
          } else {
            const replyFallback = await askAI(`L'utilisateur a répondu : "${trimmed}". 
              Continue à poser des questions sur la difficulté ou les disponibilités.`);
            sendMessage(replyFallback, 'ai');
          }
          break;

        case 2:
          const difficulty = trimmed.toLowerCase();
          if (['facile', 'moyenne', 'difficile'].includes(difficulty)) {
            setChallenge((prev) => {
              const updated = { ...prev, difficulty };
              const days = [];
              for (let i = 1; i <= parseInt(updated.duration); i++) {
                days.push({ day_number: i, content: `Tâche générée pour jour ${i}` });
              }
              updated.days = days;
              return updated;
            });

            const reply3 = await askAI(`Le challenge est prêt. Propose un plan détaillé jour par jour et demande confirmation ou modification.`);
            sendMessage(reply3, 'ai');
            setStep(3);
          } else {
            sendMessage("Merci de choisir entre : facile, moyenne ou difficile.", 'ai');
          }
          break;

        case 3:
          const lower = trimmed.toLowerCase();
          if (lower === 'valider') {
            try {
              await axios.post('http://127.0.0.1:8000/api/challenges', {
                title: challenge.title || "Challenge personnalisé",
                description: `Challenge généré sur ${challenge.duration} jours`,
                duration: challenge.duration,
                difficulty: challenge.difficulty,
                days: challenge.days,
              });
              sendMessage('✅ Ton challenge a été créé avec succès !', 'ai');
              setStep(4);
            } catch (err) {
              console.error('Erreur backend :', err);
              sendMessage("Oups, une erreur est survenue lors de la création du challenge.", 'ai');
            }
          } else if (lower.startsWith('jour')) {
            const parts = trimmed.split(':');
            if (parts.length === 2) {
              const jourNum = parseInt(parts[0].replace('jour', '').trim());
              const newText = parts[1].trim();
              if (!isNaN(jourNum) && jourNum >= 1 && jourNum <= challenge.days.length) {
                const updatedDays = [...challenge.days];
                updatedDays[jourNum - 1].content = newText;
                setChallenge((prev) => ({ ...prev, days: updatedDays }));
                sendMessage(`Jour ${jourNum} mis à jour. Tape 'valider' si tu as terminé.`, 'ai');
              } else {
                sendMessage("Format invalide. Exemple : jour 2: Nouvelle tâche", 'ai');
              }
            }
          } else {
            sendMessage("Tape 'valider' quand tu es prêt ou modifie une tâche avec le format 'jour X: contenu'", 'ai');
          }
          break;

        default:
          sendMessage("Je n'ai pas compris. Réessaie.", 'ai');
      }
    } catch (e) {
      sendMessage("Une erreur est survenue. Réessaie plus tard.", 'ai');
    }
  };

  return (
    <div>
      <h2>Créer un challenge personnalisé avec Khatwa</h2>
      <div style={{ backgroundColor: '#f0f0f0', padding: '1rem', marginBottom: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.from === 'ai' ? 'left' : 'right', margin: '0.5rem 0' }}>
            <strong>{msg.from === 'ai' ? 'Khatwa IA' : 'Vous'} :</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleInput()}
        placeholder="Votre réponse ici..."
      />
      <button onClick={handleInput}>Envoyer</button>
    </div>
  );
};

export default ChallengeForm;
