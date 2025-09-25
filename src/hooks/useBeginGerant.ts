import { useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '../services/api';
import { addRoleRequest } from '../store/slices/userSlice';

interface BeginGerantResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const useBeginGerant = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const beginGerant = async (utilisateurId: number): Promise<BeginGerantResponse> => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.post(`/users/begin-gerant/${utilisateurId}`, {
                nouveauRole: 'gerant'
            });
            console.log("🚀 ~ beginGerant ~ response:", response)
            
            if (response.data.status === 'success') {
                setSuccess(true);
                
                // Ajouter la demande au store Redux
                const roleRequest = {
                    requestId: response.data.data?.requestId || Date.now(),
                    utilisateurId,
                    requestedRole: 'gerant' as const,
                    status: 'pending' as const,
                    requestDate: new Date().toISOString()
                };
                dispatch(addRoleRequest(roleRequest));
                
                return {
                    success: true,
                    message: response.data.message || 'Demande de devenir gérant envoyée avec succès',
                    data: response.data.data
                };
            } else {
                throw new Error(response.data.message || 'Erreur lors de la demande');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Erreur lors de la demande de devenir gérant';
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
        beginGerant,
        isLoading,
        error,
        success,
        reset
    };
};
