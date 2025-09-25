import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { clearRoleRequests } from '../store/slices/userSlice';

interface CancelRoleRequestResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const useCancelRoleRequest = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const cancelRoleRequest = async (utilisateurId: number): Promise<CancelRoleRequestResponse> => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.delete(`/users/cancel-role-request/${utilisateurId}`);
            console.log("🚀 ~ cancelRoleRequest ~ response:", response);
            
            if (response.data.status === 'success') {
                setSuccess(true);
                
                // Supprimer la demande du store Redux
                // On supprime toutes les demandes en attente pour cet utilisateur
                // Note: removeRoleRequest supprime par requestId, pas par utilisateurId
                // On va utiliser clearRoleRequests et recharger les données
                dispatch(clearRoleRequests());
                
                return {
                    success: true,
                    message: response.data.message || 'Demande de rôle annulée avec succès',
                    data: response.data.data
                };
            } else {
                throw new Error(response.data.message || 'Erreur lors de l\'annulation');
            }
        } catch (err: any) {
            console.log("🚀 ~ cancelRoleRequest ~ err:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de l\'annulation de la demande';
            setError(errorMessage);
            return {
                success: false,
                message: errorMessage
            };
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
        setIsLoading(false);
    };

    return {
        cancelRoleRequest,
        isLoading,
        error,
        success,
        reset
    };
};
