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
    utilisateurId?: number;
}

export interface DeleteAccountData {
    motDePasse: string;
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
        console.log("🚀 ~ login: ~ data:", data)
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

    updateFCMToken: async (utilisateurId: number, fcmToken: string): Promise<void> => {
        console.log("🚀 ~ updateFCMToken: ~ utilisateurId:", utilisateurId, fcmToken)
        try {
            const response = await api.put<ApiResponse<void>>('/users/update-fcm-token', { utilisateurId, fcmToken });
        return response.data.data;
        } catch (error: any) {
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            throw new Error('Erreur de mise à jour du FCM token. Veuillez réessayer.');
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
    changePassword: async (utilisateurId: number, data: ChangePasswordData): Promise<{ success: boolean; message?: string }> => {
        try {
            console.log('🚀 ~ Tentative de changement de mot de passe...');
            const response = await api.post<ApiResponse<{ success: boolean; message?: string }>>(`/auth/change-password/${utilisateurId}`, {
                ...data,
            });
            
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
            
            // Gestion améliorée des erreurs
            let errorMessage = 'Erreur lors du changement de mot de passe. Veuillez réessayer.';
            
            // Essayer d'extraire le message d'erreur du serveur
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message && error.message !== 'Erreur lors du changement de mot de passe. Veuillez réessayer.') {
                errorMessage = error.message;
            }
            
            throw new Error(errorMessage);
        }
    },

    // Suppression de compte
    deleteAccount: async (data: DeleteAccountData): Promise<{ success: boolean; message?: string }> => {
        try {
            console.log('🚀 ~ Tentative de suppression de compte...');
            const response = await api.delete<ApiResponse<{ success: boolean; message?: string }>>('/auth/delete', {
                data: data
            });
            
            console.log('🚀 ~ Réponse de la suppression de compte:', response.data);
              
            if (response.data.status === 'error') {
                throw new Error(response.data.message || 'Erreur lors de la suppression du compte');
            }
            
            return {
                success: true,
                message: response.data.message || 'Compte supprimé avec succès'
            };
        } catch (error: any) {
            console.log('🚀 ~ Erreur lors de la suppression de compte:', error);
            
            // D'après les logs, l'erreur a cette structure :
            // {"message": "Mot de passe incorrect", "originalError": [AxiosError], "status": 400, "type": "VALIDATION"}
            
            // Essayer d'extraire le message directement de l'erreur
            let errorMessage = 'Erreur lors de la suppression du compte';
            
            if (error.message && error.message !== 'Erreur lors de la suppression du compte. Veuillez réessayer.') {
                errorMessage = error.message;
            }
            
            throw new Error(errorMessage);
        }
    }
};

// Export direct de la fonction changePassword pour faciliter l'utilisation
export const changePassword = authService.changePassword;

export default authService;