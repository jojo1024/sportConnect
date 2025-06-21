import api from "./api";

export interface Match {
    matchId: number;
    matchDateDebut: string;
    matchDateFin: string;
    matchDuree: number;
    matchDescription: string;
    matchNbreParticipant: number;
    matchStatus: 'enAttente' | 'confirme' | 'annule' | 'termine';
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
    terrainStatut: 'enAttente' | 'valide' | 'refuse';
    nbreJoueursInscrits: number;
    joueurxMax: number;
}

export interface CreateMatchData {
    terrainId: number;
    matchDateDebut: string;
    matchDateFin: string;
    matchDuree: number;
    matchDescription: string;
    matchNbreParticipant: number;
    capoId: number;
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

export const matchService = {
    getMatches: async (): Promise<Match[]> => {
        const response = await api.get<MatchResponse>('/matchs/fetchAll');
        return response.data.data;
    },

    getMatchesWithPagination: async (page: number = 1, limit: number = 10): Promise<Match[]> => {
        const response = await api.get<MatchResponse>(`/matchs/fetchAllPaginated?page=${page}&limit=${limit}`);
        return response.data.data;
    },

    // Créer un nouveau match
    createMatch: async (matchData: CreateMatchData): Promise<Match> => {
        const response = await api.post<SingleMatchResponse>('/matchs/create', matchData);
        return response.data.data;
    },
};
