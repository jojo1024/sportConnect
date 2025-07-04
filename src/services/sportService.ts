import api from './api';
import axios from 'axios';

// Types pour les sports
export interface Sport {
    sportId: number;
    sportNom: string;
    sportIcone: string;
    sportStatus: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSportData {
    sportNom: string;
    sportIcone?: string;
    sportStatus?: number;
}

export interface UpdateSportData {
    sportNom?: string;
    sportIcone?: string;
    sportStatus?: number;
}

export interface SportsResponse {
    success: boolean;
    message: string;
    data: Sport[];
}

export interface SingleSportResponse {
    success: boolean;
    message: string;
    data: Sport;
}

export interface CreateSportResponse {
    success: boolean;
    message: string;
    data: Sport;
}

export interface PaginatedSportsResponse {
    success: boolean;
    message: string;
    data: {
        sports: Sport[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface SportsStatistics {
    totalSports: number;
    activeSports: number;
    inactiveSports: number;
    mostUsedSports: Array<{
        sportId: number;
        sportNom: string;
        matchCount: number;
    }>;
}



export const sportService = {
    /**
     * Récupérer tous les sports avec pagination et filtres
     */
    getAllSports: async (): Promise<PaginatedSportsResponse['data']> => {
        try {
            const response = await api.get<PaginatedSportsResponse>(`/sports/active`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des sports:', error);
            throw error;
        }
    },

    /**
     * Récupérer un sport par son ID
     */
    getSportById: async (sportId: number): Promise<Sport> => {
        try {
            const response = await api.get<SingleSportResponse>(`/sports/${sportId}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération du sport:', error);
            throw error;
        }
    },

    /**
     * Récupérer tous les sports actifs (endpoint public)
     */
    getActiveSports: async (): Promise<Sport[]> => {
        try {
            // Utiliser axios directement pour éviter l'authentification automatique
            const response = await api.get<SportsResponse>(`/sports/active`);
            return response.data.data;
        } catch (error: any) {
            console.error('Erreur lors de la récupération des sports actifs:', error);
            throw error;
        }
    },

    /**
     * Créer un nouveau sport
     */
    createSport: async (sportData: CreateSportData): Promise<Sport> => {
        try {
            const response = await api.post<CreateSportResponse>('/sports', sportData);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la création du sport:', error);
            throw error;
        }
    },

    /**
     * Mettre à jour un sport
     */
    updateSport: async (sportId: number, sportData: UpdateSportData): Promise<Sport> => {
        try {
            const response = await api.put<SingleSportResponse>(`/sports/${sportId}`, sportData);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du sport:', error);
            throw error;
        }
    },

    /**
     * Supprimer un sport
     */
    deleteSport: async (sportId: number): Promise<boolean> => {
        try {
            await api.delete(`/sports/${sportId}`);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du sport:', error);
            throw error;
        }
    },

    /**
     * Activer un sport
     */
    activateSport: async (sportId: number): Promise<Sport> => {
        try {
            const response = await api.patch<SingleSportResponse>(`/sports/${sportId}/activate`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de l\'activation du sport:', error);
            throw error;
        }
    },

    /**
     * Désactiver un sport
     */
    deactivateSport: async (sportId: number): Promise<Sport> => {
        try {
            const response = await api.patch<SingleSportResponse>(`/sports/${sportId}/deactivate`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la désactivation du sport:', error);
            throw error;
        }
    },

    /**
     * Récupérer les statistiques des sports
     */
    getSportsStatistics: async (): Promise<SportsStatistics> => {
        try {
            const response = await api.get<{ success: boolean; message: string; data: SportsStatistics }>('/sports/statistics/overview');
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques des sports:', error);
            throw error;
        }
    },

    /**
     * Vérifier si un sport existe
     */
    checkSportExists: async (sportId: number): Promise<boolean> => {
        try {
            const response = await api.get<{ success: boolean; message: string; data: { sportId: number; exists: boolean } }>(`/sports/${sportId}/exists`);
            return response.data.data.exists;
        } catch (error) {
            console.error('Erreur lors de la vérification de l\'existence du sport:', error);
            throw error;
        }
    }
}; 