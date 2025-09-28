import api from "./api";

export interface RoleRequest {
    requestId: number;
    utilisateurId: number;
    requestedRole: 'capo' | 'gerant';
    status: 'pending' | 'approved' | 'rejected';
    requestDate: string;
    processedDate?: string;
    rejectionReason?: string;
}

export interface RoleRequestResponse {
    success: boolean;
    message: string;
    data: RoleRequest[];
}

export const roleRequestService = {
    // Récupérer toutes les demandes de rôle d'un utilisateur
    getRoleRequestsByUserId: async (utilisateurId: number): Promise<RoleRequest[]> => {
        console.log("🚀 ~ xxxxgetRoleRequestsByUserId: ~ utilisateurId:", utilisateurId)
        const response = await api.get<RoleRequestResponse>(`/users/role-requests/user/${utilisateurId}`);
        console.log("🚀 ~ getRoleRequestsByUserId: ~ response:", response)
        return response.data.data;
    },

    // Récupérer les demandes en attente d'un utilisateur
    getPendingRoleRequestsByUserId: async (utilisateurId: number): Promise<RoleRequest[]> => {
        const response = await api.get<RoleRequestResponse>(`/users/role-requests/user/${utilisateurId}/pending`);
        return response.data.data;
    },

    // Créer une nouvelle demande de rôle
    createRoleRequest: async (data: {
        utilisateurId: number;
        requestedRole: 'capo' | 'gerant';
    }): Promise<RoleRequest> => {
        const response = await api.post<{ success: boolean; message: string; data: RoleRequest }>('/role-requests', data);
        return response.data.data;
    },

    // Annuler une demande de rôle
    cancelRoleRequest: async (utilisateurId: number): Promise<any> => {
        const response = await api.delete(`/users/cancel-role-request/${utilisateurId}`);
        return response.data;
    },

    // =============================================
    // MÉTHODES SPÉCIFIQUES POUR LAMBDA
    // =============================================

    // Vérifier le statut des demandes de rôle pour un lambda
    checkRoleRequestStatus: async (utilisateurId: number): Promise<{
        hasPendingRequest: boolean;
        currentRequest: RoleRequest | null;
        requests: RoleRequest[];
    }> => {
        const response = await api.get<{
            success: boolean;
            message: string;
            data: {
                hasPendingRequest: boolean;
                currentRequest: RoleRequest | null;
                request: RoleRequest | null;
            }
        }>(`/users/role-requests/check/${utilisateurId}`);
        
        // Adapter la réponse pour inclure requests
        const data = response.data.data;
        return {
            hasPendingRequest: data.hasPendingRequest,
            currentRequest: data.currentRequest,
            requests: data.currentRequest ? [data.currentRequest] : []
        };
    },

    // Demander le rôle capo (spécifique lambda)
    requestCapoRole: async (utilisateurId: number): Promise<RoleRequest> => {
        const response = await api.post<{ success: boolean; message: string; data: RoleRequest }>(`/users/request-capo/${utilisateurId}`);
        return response.data.data;
    },

    // Demander le rôle gerant (spécifique lambda)
    requestGerantRole: async (utilisateurId: number): Promise<RoleRequest> => {
        const response = await api.post<{ success: boolean; message: string; data: RoleRequest }>(`/users/request-gerant/${utilisateurId}`);
        return response.data.data;
    },

    // Annuler une demande de rôle (alias)
    cancelRequest: async (utilisateurId: number): Promise<any> => {
        const response = await api.delete(`/users/cancel-request/${utilisateurId}`);
        return response.data;
    }
};
