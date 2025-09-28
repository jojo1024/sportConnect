import { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TextInput } from 'react-native';
import { changePassword } from '../services/authService';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/userSlice';

interface ChangePasswordFormData {
    ancienMotDePasse: string;
    nouveauMotDePasse: string;
    confirmationMotDePasse: string;
}

export const useChangePassword = () => {
    const user = useSelector(selectUser);
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [formData, setFormData] = useState<ChangePasswordFormData>({
        ancienMotDePasse: '',
        nouveauMotDePasse: '',
        confirmationMotDePasse: '',
    });

    // Refs pour la navigation entre les champs
    const newPasswordRef = useRef<TextInput>(null);
    const confirmPasswordRef = useRef<TextInput>(null);

    const handleInputChange = (field: keyof ChangePasswordFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(''); // Clear error when user starts typing
        setSuccessMessage(''); // Clear success message when user starts typing
    };



    // Focus automatique sur le champ approprié en cas d'erreur
    useEffect(() => {
        if (error) {
            if (!formData.nouveauMotDePasse.trim()) {
                newPasswordRef.current?.focus();
            } else if (!formData.confirmationMotDePasse.trim()) {
                confirmPasswordRef.current?.focus();
            }
        }
    }, [error, formData]);

    const clearSuccessMessage = () => {
        setSuccessMessage('');
    };

    const handleRetry = () => {
        setError('');
        setSuccessMessage('');
    };

    const validateForm = (): boolean => {
        // Vérifier que tous les champs sont remplis
        if (!formData.ancienMotDePasse.trim()) {
            setError('Veuillez entrer votre ancien mot de passe');
            return false;
        }

        if (!formData.nouveauMotDePasse.trim()) {
            setError('Veuillez entrer votre nouveau mot de passe');
            return false;
        }

        if (!formData.confirmationMotDePasse.trim()) {
            setError('Veuillez confirmer votre nouveau mot de passe');
            return false;
        }

        // Vérifier que le nouveau mot de passe fait au moins 6 caractères
        if (formData.nouveauMotDePasse.length < 4) {
            setError('Le nouveau mot de passe doit contenir au moins 4 caractères');
            return false;
        }

        // Vérifier que les nouveaux mots de passe correspondent
        if (formData.nouveauMotDePasse !== formData.confirmationMotDePasse) {
            setError('Les nouveaux mots de passe ne correspondent pas');
            return false;
        }

        // Vérifier que l'ancien et le nouveau mot de passe sont différents
        if (formData.ancienMotDePasse === formData.nouveauMotDePasse) {
            setError('Le nouveau mot de passe doit être différent de l\'ancien');
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            console.log('🚀 ~ Tentative de changement de mot de passe depuis le hook...');
            const response = await changePassword(user?.utilisateurId!, {
                ancienMotDePasse: formData.ancienMotDePasse,
                nouveauMotDePasse: formData.nouveauMotDePasse,
            });

            if (response.success) {
                setSuccessMessage('Votre mot de passe a été modifié avec succès');
                // Reset form
                setFormData({
                    ancienMotDePasse: '',
                    nouveauMotDePasse: '',
                    confirmationMotDePasse: '',
                });
          
            } else {
                setError(response.message || 'Erreur lors de la modification du mot de passe');
            }
        } catch (err: any) {
            console.error('🚀 ~ Erreur lors du changement de mot de passe:', err);
            
            // Utiliser directement le message d'erreur du service
            const errorMessage = err.message || 'Erreur de connexion. Veuillez réessayer.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    return {
        formData,
        loading,
        error,
        successMessage,
        newPasswordRef,
        confirmPasswordRef,
        handleInputChange,
        handleSave,
        clearSuccessMessage,
        handleRetry,
        goBack,
    };
}; 