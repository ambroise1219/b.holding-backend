// config/api.js

const getApiUrl = () => {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL;
    }
    if (process.env.NODE_ENV === 'production') {
      return 'https://b-holding-backend.onrender.com'; // URL de production
    }
    return 'http://localhost:5000'; // URL de développement par défaut
  };
  
  export const API_URL = getApiUrl();