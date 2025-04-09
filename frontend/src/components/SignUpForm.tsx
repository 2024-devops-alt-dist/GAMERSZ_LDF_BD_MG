import React, { useState } from 'react';

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [motivationText, setMotivationText] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Nom d\'utilisateur :', username);
    console.log('Email :', email);
    console.log('Mot de passe :', password);
    console.log('Date de naissance :', birthDate);
    console.log('Texte de motivation :', motivationText);
    
  };

  return (
    <div className="container">
      <h1>Rejoignez notre communauté de joueurs !</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Nom d'utilisateur :</label>
        <input
          type="text"
          id="username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="email">Email :</label>
        <input
          type="email"  
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirm-password">Confirmer le mot de passe :</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <label htmlFor="birth-date">Date de naissance :</label>
        <input
          type="date"
          id="birth-date"
          name="birth-date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          required
        />

        <label htmlFor="motivation-text">Texte de motivation :</label>
        <textarea
          id="motivation-text"
          name="motivation-text"
          value={motivationText}
          onChange={(e) => setMotivationText(e.target.value)}
          required
        ></textarea>

        <button type="submit">Soumettre ma candidature</button>
      </form>
      <p>Votre inscription sera examinée par un administrateur. Merci de votre patience !</p>
    </div>
  );
};

export default SignupForm;
