import api from "./api";

export interface Terrain {
    terrainId: number;
    terrainNom: string;
    terrainLocalisation: string;
    terrainDescription: string;
    terrainContact: string;
    terrainPrixParHeure: number;
    terrainHoraires: any;
    terrainImages: string[];
    terrainStatus: number;
}

export interface TerrainResponse {
    success: boolean;
    message: string;
    data: Terrain[];
}

export interface SingleTerrainResponse {
    success: boolean;
    message: string;
    data: Terrain;
}

export const terrainService = {
    // Récupérer tous les terrains disponibles
    getAllTerrains: async (): Promise<Terrain[]> => {
        const response = await api.get<TerrainResponse>('/terrains/fetchAll');
        return response.data.data;
    },

    // Récupérer un terrain par ID
    getTerrainById: async (terrainId: number): Promise<Terrain> => {
        const response = await api.get<SingleTerrainResponse>(`/terrains/fetchById/${terrainId}`);
        return response.data.data;
    },

    // Rechercher des terrains
    searchTerrains: async (filters: any): Promise<Terrain[]> => {
        const response = await api.get<TerrainResponse>('/terrains/search', { params: filters });
        return response.data.data;
    },

    // Vérifier la disponibilité d'un terrain
    checkAvailability: async (terrainId: number, dateTime: string): Promise<any> => {
        const response = await api.get(`/terrains/${terrainId}/check-availability`, {
            params: { dateTime }
        });
        return response.data.data;
    },
}; 