// In dev these resolve to direct service ports.
// In prod they are relative paths routed through the nginx gateway.
export const authUrl    = import.meta.env.VITE_AUTH_URL    ?? 'http://localhost:5001';
export const contentUrl = import.meta.env.VITE_CONTENT_URL ?? 'http://localhost:5002';
export const codeUrl = import.meta.env.VITE_CODE_URL ?? 'http://localhost:5003';
export const proctorUrl = import.meta.env.VITE_PROCTOR_URL ?? 'http://localhost:5004';