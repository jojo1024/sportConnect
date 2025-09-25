import api from "./api";

export interface User {
    utilisateurId: number;
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string; // Format string depuis l'API
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurRole: 'lambda' | 'capo' | 'gerant';
    utilisateurStatus: number;
    utilisateurAvatar?: string;
    utilisateurRefreshToken?: string;
    sportId?: number;
}

export interface UpdateProfileData {
    utilisateurNom?: string;
    utilisateurCommune?: string;
    utilisateurDateNaiss?: string;
    utilisateurSexe?: 'Homme' | 'Femme';
    utilisateurAvatar?: string;
}

export interface ProfileStatistics {
    totalMatchs: number;
    totalTerrains: number;
    totalHeures: number;
    statsParSport: Array<{
        sportId: number;
        sportNom: string;
        sportIcone: string;
        nombreMatchs: number;
        heuresTotales: number;
    }>;
}

export interface UserActivity {
    matchId: number;
    matchDateDebut: string;
    matchDateFin: string;
    matchDuree: number;
    matchDescription: string;
    matchNbreParticipant: number;
    matchStatus: string;
    codeMatch: string;
    matchDateCreation: string;
    matchPrixParJoueur: number;
    sportId: number;
    sportNom: string;
    sportIcone: string;
    capoNomUtilisateur: string;
    capoTelephone: string;
    capoCommune: string;
    terrainNom: string;
    terrainLocalisation: string;
    terrainDescription: string;
    terrainContact: string;
    terrainPrixParHeure: number;
    terrainHoraires: string;
    terrainImages: string;
    dateParticipation: string;
    statutParticipation: string;
}

export interface ProfileDataResponse {
    statistics: ProfileStatistics;
    recentActivities: UserActivity[];
}

export interface ProfileResponse {
    success: boolean;
    message: string;
    data: User;
}

export interface ProfileDataApiResponse {
    success: boolean;
    message: string;
    data: ProfileDataResponse;
}

export interface StatisticsResponse {
    success: boolean;
    message: string;
    data: ProfileStatistics;
}

export interface ActivitiesResponse {
    success: boolean;
    message: string;
    data: UserActivity[];
}

export const profileService = {
    // URL de base pour les avatars
    BASE_URL: api.defaults.baseURL,

    // Récupérer le profil de l'utilisateur connecté
    getCurrentProfile: async (): Promise<User> => {
        const response = await api.get<ProfileResponse>('/users/profile');
        return response.data.data;
    },

    // Mettre à jour le profil de l'utilisateur
    updateProfile: async (profileData: UpdateProfileData): Promise<User> => {
        console.log("🚀 ~ updateProfile: ~ profileData:", profileData)
        const response = await api.put<ProfileResponse>('/users/profile', profileData);
        return response.data.data;
    },

    // Récupérer les données complètes du profil (statistiques et activités)
    getProfileData: async (): Promise<ProfileDataResponse> => {
        const response = await api.get<ProfileDataApiResponse>('/users/profile-data');
        return response.data.data;
    },

    // Récupérer uniquement les statistiques du profil
    getProfileStatistics: async (): Promise<ProfileStatistics> => {
        const response = await api.get<StatisticsResponse>('/users/statistics');
        return response.data.data;
    },

    // Récupérer les activités récentes de l'utilisateur
    getRecentActivities: async (): Promise<UserActivity[]> => {
        const response = await api.get<ActivitiesResponse>('/users/activities');
        return response.data.data;
    },

    // Changer le mot de passe de l'utilisateur
    changePassword: async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.put('/users/password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },

    // Supprimer le compte de l'utilisateur
    deleteAccount: async (password: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete('/users/account', {
            data: { password },
        });
        return response.data;
    },

    // Demander une évolution de rôle
    requestRoleEvolution: async (nouveauRole: 'capo' | 'gerant'): Promise<User> => {
        const response = await api.post<ProfileResponse>('/users/evolution-role', {
            nouveauRole
        });
        return response.data.data;
    },
}; 