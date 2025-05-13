import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { API_BASE_URL } from '../config/api';

// Define validation schemas for each field
const usernameSchema = z
  .string()
  .min(3, { message: 'Username must be at least 3 characters long' })
  .max(30, { message: 'Username cannot exceed 30 characters' });

const emailSchema = z
  .string()
  .email({ message: 'Invalid email address format' });

const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter',
  })
  .regex(/[0-9]/, {
    message: 'Password must contain at least one number',
  });

const motivationSchema = z.string().min(10, {
  message: 'Motivation text must be at least 10 characters long',
});

// Define the form schema
const formSchema = z
  .object({
    username: usernameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    motivationText: motivationSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// Type for form validation errors
type FormErrors = {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  motivationText?: string;
};

const SignupForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [motivationText, setMotivationText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<FormErrors>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validate form data using Zod
  const validateForm = useCallback(() => {
    // Reset validation errors
    setValidationErrors({});

    try {
      // Validate the form data against the schema
      formSchema.parse({
        username,
        email,
        password,
        confirmPassword,
        motivationText,
      });

      // If validation passes, set form as valid
      setIsFormValid(true);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to our FormErrors format
        const errors: FormErrors = {};

        error.errors.forEach(err => {
          const path = err.path[0] as keyof FormErrors;
          errors[path] = err.message;
        });

        setValidationErrors(errors);
        setIsFormValid(false);
      }
      return false;
    }
  }, [username, email, password, confirmPassword, motivationText]);

  // Validate form on input changes
  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    <div className="flex justify-center items-start bg-base-200 p-0 pt-3">
      <div className="w-full max-w-lg p-8 bg-white shadow-2xl rounded-xl space-y-6 mt-0">
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
              className={`input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500 ${
                validationErrors.username ? 'input-error' : ''
              }`}
            />
            {validationErrors.username && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.username}
              </p>
            )}
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
              className={`input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500 ${
                validationErrors.email ? 'input-error' : ''
              }`}
            />
            {validationErrors.email && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.email}
              </p>
            )}
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
              className={`input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500 ${
                validationErrors.password ? 'input-error' : ''
              }`}
            />
            {validationErrors.password && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.password}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Password must be at least 8 characters long, contain at least one
              uppercase letter and one number.
            </p>
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
              className={`input input-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500 ${
                validationErrors.confirmPassword ? 'input-error' : ''
              }`}
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.confirmPassword}
              </p>
            )}
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
              className={`textarea textarea-bordered w-full rounded-md focus:ring-2 focus:ring-blue-500 ${
                validationErrors.motivationText ? 'input-error' : ''
              }`}
            ></textarea>
            {validationErrors.motivationText && (
              <p className="text-red-500 text-xs mt-1">
                {validationErrors.motivationText}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="btn btn-primary w-full max-w-xs text-white"
              disabled={!isFormValid}
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
