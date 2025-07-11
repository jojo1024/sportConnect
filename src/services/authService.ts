import api from "./api";

export interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string;
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

export interface ChangePasswordData {
    ancienMotDePasse: string;
    nouveauMotDePasse: string;
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
            console.log('🚀 ~ Tentative de rafraîchissement du token...');
            const response = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken });
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message || 'Erreur de rafraîchissement du token');
            }
            
            if (!response.data.data) {
                throw new Error('Réponse invalide du serveur');
            }
            
            console.log('🚀 ~ Token rafraîchi avec succès');
            return response.data.data;
        } catch (error: any) {
            console.log('🚀 ~ Erreur lors du rafraîchissement du token:', error);
            
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            
            if (error.response?.status === 401 || error.response?.status === 403) {
                throw new Error('Session expirée. Veuillez vous reconnecter.');
            }
            
            throw new Error('Erreur de rafraîchissement du token');
        }
    },

    // Changement de mot de passe
    changePassword: async (data: ChangePasswordData): Promise<{ success: boolean; message?: string }> => {
        try {
            console.log('🚀 ~ Tentative de changement de mot de passe...');
            const response = await api.post<ApiResponse<{ success: boolean; message?: string }>>('/auth/change-password', data);
            
            console.log('🚀 ~ Réponse du changement de mot de passe:', response.data);
            
            if (response.data.status === 'error') {
                throw new Error(response.data.message || 'Erreur lors du changement de mot de passe');
            }
            
            return {
                success: true,
                message: response.data.message || 'Mot de passe modifié avec succès'
            };
        } catch (error: any) {
            console.log('🚀 ~ Erreur lors du changement de mot de passe:', error);
            console.log('🚀 ~ Détails de l\'erreur:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                headers: error.response?.headers
            });
            
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erreur lors du changement de mot de passe. Veuillez réessayer.');
        }
    }
};

// Export direct de la fonction changePassword pour faciliter l'utilisation
export const changePassword = authService.changePassword;

export default authService;