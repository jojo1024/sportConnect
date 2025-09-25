import api from "./api";

export interface Match {
    matchId: number;
    matchDateDebut: string;
    matchDateFin: string;
    matchDuree: number;
    matchDescription: string;
    matchNbreParticipant: number;
    matchStatus: 'en_attente' | 'confirme' | 'annule' | 'termine';
    codeMatch: string;
    matchDateCreation: string;
    capoNomUtilisateur: string;
    capoTelephone: string;
    capoCommune: string;
    terrainNom: string;
    terrainLocalisation: string;
    terrainDescription: string;
    terrainContact: string;
    terrainPrixParHeure: number;
    terrainHoraires: any;
    terrainImages: string[];
    terrainStatut: 'en_attente' | 'valide' | 'refuse';
    nbreJoueursInscrits: number;
    joueurxMax: number;
    matchPrixParJoueur: number;
    sportId?: number;
    sportNom?: string;
    sportIcone?: string;
}

export interface CreateMatchData {
    terrainId: number;
    matchDateDebut: string;
    matchDateFin: string;
    matchDuree: number;
    matchDescription: string;
    matchNbreParticipant: number;
    capoId: number;
    sportId?: number;
}

export interface MatchResponse {
    success: boolean;
    message: string;
    data: Match[];
}

export interface SingleMatchResponse {
    success: boolean;
    message: string;
    data: Match;
}

export interface CreateMatchResponse {
    success: boolean;
    message: string;
    data: Match;
}

export interface MatchParticipant {
    participantId: number;
    utilisateurNom: string;
    utilisateurTelephone?: string;
    utilisateurCommune?: string;
    utilisateurPhoto?: string;
    utilisateurAvatar?: string;
}

export interface MatchParticipantsResponse {
    success: boolean;
    message: string;
    data: MatchParticipant[];
}

export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ReservationsResponse {
    reservations: Match[];
    pagination: PaginationInfo;
}

export interface WeeklyChartResponse {
    success: boolean;
    message: string;
    data: {
        dailyRevenue: number[];
    };
}

// Nouvelles interfaces pour les statistiques et activités
export interface UserStatistics {
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

export interface ProfileData {
    statistics: UserStatistics;
    recentActivities: UserActivity[];
}

export interface ProfileDataResponse {
    success: boolean;
    message: string;
    data: ProfileData;
}

export const matchService = {
    getMatches: async (): Promise<Match[]> => {
        try {
            const response = await api.get<MatchResponse>('/matchs/fetchAll');
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des matchs:', error);
            throw error;
        }
    },

    getMatchesWithPagination: async (page: number = 1, limit: number = 10, sportId?: number): Promise<Match[]> => {
        try {
            let url = `/matchs/fetchAllPaginated?page=${page}&limit=${limit}`;
            if (sportId) {
                url += `&sportId=${sportId}`;
            }
            const response = await api.get<MatchResponse>(url);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des matchs paginés:', error);
            throw error;
        }
    },

    // Créer un nouveau match
    createMatch: async (matchData: CreateMatchData): Promise<Match> => {
        try {
            console.log('🚀 ~ Envoi des données de création de match:', matchData);
            const response = await api.post<CreateMatchResponse>('/matchs/create', matchData);
            console.log('🚀 ~ Réponse de création de match:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('Erreur lors de la création du match:', error);
            
            // Gestion spécifique des erreurs de disponibilité de terrain
            if (error?.response?.status === 400) {
                const errorMessage = error?.response?.data?.message || 'Erreur lors de la création du match';
                throw new Error(errorMessage);
            }
            
            throw error;
        }
    },

    // Participer à un match
    participateInMatch: async (matchId: number, utilisateurId: number): Promise<any> => {
        try {
            console.log("🚀 ~ participateInMatch: ~ matchId:", matchId)
            const response = await api.post(`/matchs/participate/${utilisateurId}`, { 
                matchId
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la participation au match:', error);
           
            throw error;
        }
    },

    // Se retirer d'un match
    withdrawFromMatch: async (matchId: number, participantId: number): Promise<any> => {
        try {
            const response = await api.post('/matchs/withdraw', { matchId, lambdaId: participantId });
            return response.data;
        } catch (error) {
            console.error('Erreur lors du retrait du match:', error);
            throw error;
        }
    },

    // Confirmer un match (pour les gérants)
    confirmMatch: async (matchId: number, gerantId: number): Promise<any> => {
        try {
            const response = await api.post('/matchs/confirm', { matchId, gerantId });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la confirmation du match:', error);
            throw error;
        }
    },

    // Annuler un match
    cancelMatch: async (matchId: number, raison?: string, gerantId?: number): Promise<any> => {
        console.log("🚀 ~ cancelMatch: ~ gerantId:", gerantId)
        try {
            const response = await api.post('/matchs/cancel', { matchId, raison, gerantId });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de l\'annulation du match:', error);
            throw error;
        }
    },

    // Finaliser un match
    finalizeMatch: async (matchId: number): Promise<any> => {
        try {
            const response = await api.post('/matchs/finalize', { matchId });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la finalisation du match:', error);
            throw error;
        }
    },

    // Rechercher des matchs
    searchMatches: async (filters: any): Promise<Match[]> => {
        try {
            const response = await api.get<MatchResponse>('/matchs/search', { params: filters });
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la recherche de matchs:', error);
            throw error;
        }
    },

    // Rechercher des matchs par code avec pagination
    searchMatchesByCode: async (code: string, page: number = 1, limit: number = 10): Promise<{matches: Match[], pagination: PaginationInfo}> => {
        try {
            const response = await api.get<{success: boolean, message: string, data: {matches: Match[], pagination: PaginationInfo}}>(`/matchs/search-by-code?code=${code}&page=${page}&limit=${limit}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la recherche de matchs par code:', error);
            throw error;
        }
    },

    // Vérifier la disponibilité d'un terrain
    checkTerrainAvailability: async (terrainId: number, dateDebut: string, dateFin: string): Promise<any> => {
        try {
            const response = await api.get(`/matchs/check-availability`, {
                params: { terrainId, dateDebut, dateFin }
            });
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la vérification de disponibilité:', error);
            throw error;
        }
    },

    fetchMatchParticipants: async (matchId: number): Promise<MatchParticipant[]> => {
        try {
            const response = await api.get<MatchParticipantsResponse>(`/matchs/fetchMatchParticipants?matchId=${matchId}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des participants:', error);
            throw error;
        }
    },

    // Récupérer les réservations d'un gérant
    getGerantReservations: async (status?: string, terrainId?: number | null, page: number = 1, limit: number = 10): Promise<ReservationsResponse> => {
        try {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (terrainId) params.append('terrainId', terrainId.toString());
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            
            const response = await api.get<{ success: boolean; message: string; data: ReservationsResponse }>(`/matchs/gerant-reservations?${params.toString()}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations:', error);
            throw error;
        }
    },

    // Récupérer les réservations d'un gérant avec filtrage par date
    getGerantReservationsByDate: async (status?: string,  page: number = 1, limit: number = 10, dateDebut?: string, dateFin?: string, terrainId?: number | null): Promise<ReservationsResponse> => {
        try {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (terrainId) params.append('terrainId', terrainId.toString());
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (dateDebut) params.append('dateDebut', dateDebut);
            if (dateFin) params.append('dateFin', dateFin);
            
            const response = await api.get<{ success: boolean; message: string; data: ReservationsResponse }>(`/matchs/gerant-reservations-by-date?${params.toString()}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des réservations par date:', error);
            throw error;
        }
    },

    // Récupérer les données d'activité hebdomadaire d'un gérant
    getGerantWeeklyChart: async (dateDebut: string, dateFin: string, terrainId?: number | null): Promise<{dailyRevenue: number[]}> => {
        try {
            const params = new URLSearchParams();
            params.append('dateDebut', dateDebut);
            params.append('dateFin', dateFin);
            if (terrainId) params.append('terrainId', terrainId.toString());
            const response = await api.get<WeeklyChartResponse>(`/matchs/gerant-weekly-chart?${params.toString()}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données d\'activité hebdomadaire:', error);
            throw error;
        }
    },

    // Récupérer les statistiques d'un utilisateur
    getUserStatistics: async (): Promise<UserStatistics> => {
        try {
            const response = await api.get<{ success: boolean; message: string; data: UserStatistics }>('/matchs/user-statistics');
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
            throw error;
        }
    },

    // Récupérer les activités récentes d'un utilisateur
    getUserRecentActivities: async (limit: number = 5): Promise<UserActivity[]> => {
        try {
            const response = await api.get<{ success: boolean; message: string; data: UserActivity[] }>(`/matchs/user-activities?limit=${limit}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des activités récentes:', error);
            throw error;
        }
    },

    // Récupérer les données complètes du profil utilisateur
    getUserProfileData: async (utilisateurId: number): Promise<ProfileData> => {
        try {
            const response = await api.get<ProfileDataResponse>(`/matchs/user-profile-data/${utilisateurId}`);
            return response.data.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des données du profil:', error);
            throw error;
        }
    },
};
