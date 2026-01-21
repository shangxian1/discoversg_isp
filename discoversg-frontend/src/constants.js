const { VITE_NODE_ENV } = import.meta.env;

export const BACKEND_URL = VITE_NODE_ENV === "production" ? "https://discoversg-7nyft.ondigitalocean.app/discoversg-backend" : "http://${BACKEND_URL}:3000";
export const FRONTEND_URL = VITE_NODE_ENV === "production" ? "https://discoversg-7nyft.ondigitalocean.app" : "http://${BACKEND_URL}:5173";