import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [motivationText, setMotivationText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }
    if (!motivationText) {
      alert('Please enter your motivation text');
      return;
    }
    if (!email) {
      alert('Please enter your email');
      return;
    }
    if (!username) {
      alert('Please enter your username');
      return;
    }
    if (!password) {
      alert('Please enter your password');
      return;
    }
    if (!confirmPassword) {
      alert('Please confirm your password');
      return;
    }
    try {
      const response = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          motivation: motivationText,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Registration successful! Please log in.');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200 p-6">
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-xl space-y-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Join our gaming community!
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              className="input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="motivation-text"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Motivation Text:
            </label>
            <textarea
              id="motivation-text"
              name="motivation-text"
              value={motivationText}
              onChange={e => setMotivationText(e.target.value)}
              required
              className="textarea textarea-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full max-w-xs text-white"
            >
              Submit Application
            </button>
          </div>
        </form>
        {successMessage && (
          <p className="text-center text-sm text-green-500 mt-4">
            {successMessage}
          </p>
        )}
        {error && (
          <p className="text-center text-sm text-red-500 mt-4">{error}</p>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Your registration will be reviewed by an admin. Thank you for your
          patience!
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
