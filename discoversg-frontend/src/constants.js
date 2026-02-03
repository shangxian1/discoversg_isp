const { VITE_NODE_ENV } = import.meta.env;

export const BACKEND_URL = VITE_NODE_ENV === "production" ? "https://discoversg-dgvbj.ondigitalocean.app/discoversg-backend" : "http://localhost:3000";
export const FRONTEND_URL = VITE_NODE_ENV === "production" ? "https://discoversg-dgvbj.ondigitalocean.app" : "http://localhost:5173";