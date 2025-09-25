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
        const response = await api.get<RoleRequestResponse>(`/role-requests/user/${utilisateurId}`);
        return response.data.data;
    },

    // Récupérer les demandes en attente d'un utilisateur
    getPendingRoleRequestsByUserId: async (utilisateurId: number): Promise<RoleRequest[]> => {
        const response = await api.get<RoleRequestResponse>(`/role-requests/user/${utilisateurId}/pending`);
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
    }
};
