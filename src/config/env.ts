export const env = {
    apiBaseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    resturantName: import.meta.env.VITE_RESTURANT_NAME || 'Placeholder Name',
    resturantLocation: import.meta.env.VITE_RETURANT_LOCATION || "Placeholder Location"
} as const;
