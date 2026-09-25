import { SHEETS_SCRIPT_URL } from "./config";

/**
 * Submits data to the Google Apps Script Web App endpoint.
 *
 * IMPORTANT: this always uses GET + mode: "no-cors" per the Apps Script
 * deployment constraints. That means the response is opaque — we can never
 * actually confirm success or failure from the browser side. We resolve on
 * the fetch completing (not throwing) and treat any network-level failure
 * (e.g. offline, blocked) as an error. If the script itself fails after
 * receiving the request (e.g. bad params), the browser has no way to know.
 *
 * @param {string} formType - which handler in Code.gs should process this (e.g. "registration")
 * @param {Record<string, string>} data - form fields to submit
 * @returns {Promise<{ok: boolean}>}
 */
export async function submitToSheet(formType, data) {
  if (!SHEETS_SCRIPT_URL) {
    console.warn("Sheets script URL not configured; skipping submission.");
    return { ok: false };
  }

  const params = new URLSearchParams({ formType, ...data });
  const url = `${SHEETS_SCRIPT_URL}?${params.toString()}`;

  try {
    await fetch(url, { method: "GET", mode: "no-cors" });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
