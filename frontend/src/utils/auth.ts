/**
 * Authentication utilities
 * 
 * This file contains utility functions for handling authentication:
 * - getAuthToken: Gets the authentication token from localStorage or cookies
 * - setAuthToken: Sets the authentication token in localStorage
 * - clearAuthToken: Clears the authentication token from localStorage
 */

// Get the authentication token from localStorage or cookies
export const getAuthToken = (): string | null => {
  // First try to get the token from localStorage
  const token = localStorage.getItem("authToken");
  if (token) {
    return token;
  }
  
  // If not in localStorage, try to extract from cookies
  const tokenCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  
  if (tokenCookie) {
    const extractedToken = tokenCookie.split("=")[1];
    // Store in localStorage for future use
    localStorage.setItem("authToken", extractedToken);
    return extractedToken;
  }
  
  return null;
};

// Set the authentication token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem("authToken", token);
};

// Clear the authentication token from localStorage
export const clearAuthToken = (): void => {
  localStorage.removeItem("authToken");
};
