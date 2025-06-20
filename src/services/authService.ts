
import api from "./api";

export interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: Date;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole: 'lambda' | 'capo' | 'gerant';
    utilisateurAvatar?: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterData {
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole?: 'lambda' | 'capo' | 'gerant';
    utilisateurMotDePasse: string;
}

export interface LoginData {
    utilisateurTelephone: string;
    utilisateurMotDePasse: string;
}

export interface ApiResponse<T> {
    status: 'success' | 'error';
    data?: T;
    message?: string;
    type?: string;
    errors?: any[];
}

// Service d'authentification
export const authService = {
    // Inscription
    register: async (data: RegisterData): Promise<AuthResponse> => {
        try {
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message || 'Erreur d\'inscription');
            }
            
            if (!response.data.data) {
                throw new Error('Réponse invalide du serveur');
            }
            
            return response.data.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erreur d\'inscription. Veuillez réessayer.');
        }
    },

    // Connexion
    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message || 'Erreur de connexion');
            }
            
            if (!response.data.data) {
                throw new Error('Réponse invalide du serveur');
            }
            
            return response.data.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erreur de connexion. Veuillez réessayer.');
        }
    },

    // Déconnexion
    // logout: async (utilisateurId: number): Promise<void> => {
    //     try {
    //         await api.post(`/auth/logout/${utilisateurId}`);
    //     } catch (error) {
    //         // On ignore les erreurs de logout
    //         console.log('Erreur lors du logout:', error);
    //     }
    // },

    refreshToken: async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> => {
        try {
            const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken });
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message || 'Erreur de rafraîchissement du token');
            }
            
            if (!response.data.data) {
                throw new Error('Réponse invalide du serveur');
            }
            
            return response.data.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erreur de rafraîchissement du token');
        }
    }
};