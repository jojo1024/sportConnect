import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { authService } from '../services/authService';
import { useAuthLogout } from '../store/hooks/hooks';

export const useDeleteAccount = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const { logout } = useAuthLogout();

    const deleteAccount = useCallback(async (password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await authService.deleteAccount({ motDePasse: password });
            
            if (result.success) {
                // Fermer le modal
                setShowModal(false);
                
                // Déconnexion après suppression réussie
                await logout();
                
                Alert.alert(
                    'Compte supprimé',
                    'Votre compte a été supprimé avec succès.',
                    [
                        {
                            text: 'OK',
                            onPress: () => {
                                // La navigation sera gérée par le logout
                            }
                        }
                    ]
                );
            }
        } catch (err: any) {
            console.log('🚀 ~ Erreur dans useDeleteAccount:', err);
            
            // Utiliser directement le message d'erreur du service
            const errorMessage = err.message || 'Erreur lors de la suppression du compte';
            
            setError(errorMessage);
            // Ne pas afficher d'Alert ici, l'erreur sera affichée dans le modal
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    const showDeleteConfirmation = useCallback(() => {
        setShowModal(true);
    }, []);

    const hideModal = useCallback(() => {
        setShowModal(false);
        setError(null);
    }, []);

    return {
        deleteAccount,
        showDeleteConfirmation,
        hideModal,
        showModal,
        isLoading,
        error,
    };
}; 