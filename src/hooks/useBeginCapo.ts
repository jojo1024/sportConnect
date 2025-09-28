import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { addRoleRequest } from '../store/slices/userSlice';

interface BeginCapoResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const useBeginCapo = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const beginCapo = async (utilisateurId: number): Promise<BeginCapoResponse> => {
        // Vérification de sécurité pour iOS
        if (!utilisateurId || utilisateurId <= 0) {
            const errorMsg = 'ID utilisateur invalide';
            setError(errorMsg);
            return {
                success: false,
                message: errorMsg
            };
        }

        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.post(`/users/begin-capo/${utilisateurId}`, {nouveauRole: 'capo'});
            console.log("🚀 ~ beginCapo ~ response:", response)
            
            if (response.data && response.data.status === 'success') {
                // DÉSACTIVÉ TEMPORAIREMENT POUR iOS - setSuccess(true);
                
                // Ajouter la demande au store Redux
                const roleRequest = {
                    requestId: response.data.data?.requestId || Date.now(),
                    utilisateurId,
                    requestedRole: 'capo' as const,
                    status: 'pending' as const,
                    requestDate: new Date().toISOString()
                };
                dispatch(addRoleRequest(roleRequest));
                
                return {
                    success: true,
                    message: response.data.message || 'Demande de devenir capo envoyée avec succès',
                    data: response.data.data
                };
            } else {
                const errorMsg = response.data?.message || 'Erreur lors de la demande';
                setError(errorMsg);
                return {
                    success: false,
                    message: errorMsg
                };
            }
        } catch (err: any) {
            console.log("🚀 ~ beginCapo ~ err:", err)
            const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la demande de devenir capo';
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
        beginCapo,
        isLoading,
        error,
        success,
        reset
    };
}; 