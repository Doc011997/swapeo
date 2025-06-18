// Configuration API pour Swapeo
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Helper pour les appels API
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Ajouter le token JWT si disponible
  const token = localStorage.getItem("swapeo_token");
  if (token) {
    defaultOptions.headers = {
      ...defaultOptions.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Erreur réseau" }));
    throw new Error(error.error || `Erreur ${response.status}`);
  }

  return response.json();
}

// Fonctions d'authentification
export const auth = {
  login: (email: string, password: string) =>
    apiCall("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (userData: any) =>
    apiCall("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  logout: () => {
    localStorage.removeItem("swapeo_token");
    localStorage.removeItem("swapeo_user");
  },

  getToken: () => localStorage.getItem("swapeo_token"),

  setToken: (token: string) => localStorage.setItem("swapeo_token", token),

  getUser: () => {
    const user = localStorage.getItem("swapeo_user");
    return user ? JSON.parse(user) : null;
  },

  setUser: (user: any) =>
    localStorage.setItem("swapeo_user", JSON.stringify(user)),
};

// Fonctions pour les swaps
export const swaps = {
  getAll: () => apiCall("/api/swaps"),
  create: (swapData: any) =>
    apiCall("/api/swaps", {
      method: "POST",
      body: JSON.stringify(swapData),
    }),
  getById: (id: string) => apiCall(`/api/swaps/${id}`),
};

// Fonctions pour le wallet
export const wallet = {
  getInfo: () => apiCall("/api/wallet"),
  deposit: (amount: number) =>
    apiCall("/api/wallet/deposit", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  withdraw: (amount: number) =>
    apiCall("/api/wallet/withdraw", {
      method: "POST",
      body: JSON.stringify({ amount }),
    }),
  getMovements: () => apiCall("/api/wallet/movements"),
};

// Fonctions pour les utilisateurs
export const users = {
  getProfile: () => apiCall("/api/users/profile"),
  updateProfile: (profileData: any) =>
    apiCall("/api/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    }),
};

// Fonctions pour le matching
export const matching = {
  getCompatible: (params: any) => {
    const query = new URLSearchParams(params).toString();
    return apiCall(`/api/matching/compatible?${query}`);
  },
  getSuggestions: () => apiCall("/api/matching/suggestions"),
};
