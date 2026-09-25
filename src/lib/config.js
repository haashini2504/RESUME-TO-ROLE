// Frontend API configuration.
// Set VITE_API_URL in .env.local when the backend is not on localhost:5000.
export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");

// Google Apps Script Web App used for the legacy/role-selection Sheets integration.
export const SHEETS_SCRIPT_URL =
  import.meta.env.VITE_SHEETS_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbwFzVk22gSlNpj9PwO_KnxO1u3CHaCDHbb-zADcrKOkECTLalEZKJJm3K4dMCF8syAGew/exec";
