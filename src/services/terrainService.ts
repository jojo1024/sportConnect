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
    terrainDisponibilite: "confirme" | "en_attente";
}

export interface CreateTerrainData {
    terrainNom: string;
    terrainLocalisation: string;
    terrainDescription?: string;
    terrainContact?: string;
    terrainPrixParHeure: number;
    terrainHoraires: any;
    terrainImages: string[];
    gerantId: number;
}

export interface UpdateTerrainData {
    terrainNom: string;
    terrainLocalisation: string;
    terrainDescription?: string;
    terrainContact: string;
    terrainPrixParHeure: number;
    terrainHoraires: any;
    terrainImages: string[];
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
    // URL de base pour les images
    BASE_URL: api.defaults.baseURL,

    // Créer un nouveau terrain
    createTerrain: async (terrainData: CreateTerrainData): Promise<Terrain> => {
        const response = await api.post<SingleTerrainResponse>('/terrains/create', terrainData);
        return response.data.data;
    },

    // Mettre à jour un terrain existant
    updateTerrain: async (terrainId: number, terrainData: UpdateTerrainData): Promise<Terrain> => {
        const response = await api.put<SingleTerrainResponse>(`/terrains/update/${terrainId}`, terrainData);
        return response.data.data;
    },

    // Récupérer tous les terrains disponibles
    getAllTerrains: async (terrainDisponibilite: "confirme" | "en_attente"): Promise<Terrain[]> => {
        const response = await api.get<TerrainResponse>(`/terrains/fetchAll/${terrainDisponibilite}`);
        return response.data.data;
    },

    // Récupérer les terrains d'un manager spécifique
    getManagerTerrains: async (managerId: number): Promise<Terrain[]> => {
        const response = await api.get<TerrainResponse>('/terrains/my-terrains');
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