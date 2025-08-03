import { useState } from 'react';
import api from '../services/api';

interface BeginCapoResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const useBeginCapo = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const beginCapo = async (): Promise<BeginCapoResponse> => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await api.post('/utilisateurs/begin-capo');
            console.log("🚀 ~ beginCapo ~ response:", response)
            
            if (response.data.status === 'success') {
                setSuccess(true);
                return {
                    success: true,
                    message: response.data.message || 'Demande de devenir capo envoyée avec succès',
                    data: response.data.data
                };
            } else {
                throw new Error(response.data.message || 'Erreur lors de la demande');
            }
        } catch (err: any) {
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