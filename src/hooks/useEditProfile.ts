import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { selectUser, updateUser } from '../store/slices/userSlice';
import { profileService, User } from '../services';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from '../navigation/types';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface EditProfileForm {
    utilisateurNom: string;
    utilisateurTelephone: string;
    utilisateurCommune: string;
    utilisateurDateNaiss: string;
    utilisateurSexe: 'Homme' | 'Femme';
    utilisateurAvatar?: string;
}

interface UseEditProfileReturn {
    formData: EditProfileForm;
    loading: boolean;
    error: string | null;
    successMessage: string;
    handleInputChange: (field: keyof EditProfileForm, value: string) => void;
    pickProfileImage: () => Promise<void>;
    handleSave: () => Promise<boolean>;
    validateForm: () => string | null;
    resetForm: () => void;
    clearSuccessMessage: () => void;
    handleRetry: () => void;
    goBack: () => void;
}

export const useEditProfile = (): UseEditProfileReturn => {

    const navigation = useNavigation<ScreenNavigationProps>();
    const dispatch = useAppDispatch();
    const user = useAppSelector(selectUser);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [formData, setFormData] = useState<EditProfileForm>({
        utilisateurNom: user?.utilisateurNom || '',
        utilisateurTelephone: user?.utilisateurTelephone || '',
        utilisateurCommune: user?.utilisateurCommune || '',
        utilisateurDateNaiss: user?.utilisateurDateNaiss || '',
        utilisateurSexe: user?.utilisateurSexe || 'Homme',
        utilisateurAvatar: user?.utilisateurAvatar || '',
    });

    const handleInputChange = (field: keyof EditProfileForm, value: string) => {
        console.log(`📝 handleInputChange - field: ${field}, value length: ${value.length}`);
        if (field === 'utilisateurAvatar') {
            console.log(`📝 Avatar update - value starts with: ${value.substring(0, 50)}...`);
        }
        
        setFormData(prev => {
            const newData = {
                ...prev,
                [field]: value,
            };
            console.log(`📝 State updated for ${field}, new avatar length: ${newData.utilisateurAvatar?.length || 0}`);
            return newData;
        });
        // Effacer l'erreur et le message de succès quand l'utilisateur commence à modifier
        if (error) {
            setError(null);
        }
        if (successMessage) {
            setSuccessMessage('');
        }
    };

    // Fonction pour sélectionner une image de profil avec conversion en base64
    const pickProfileImage = useCallback(async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1], // Format carré pour la photo de profil
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                
                if (asset.base64) {
                    const base64String = `data:image/jpeg;base64,${asset.base64}`;
                    setFormData(prev => ({
                        ...prev,
                        utilisateurAvatar: base64String
                    }));
                } else if (asset.uri) {
                    try {
                        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        const base64String = `data:image/jpeg;base64,${base64}`;
                        setFormData(prev => ({
                            ...prev,
                            utilisateurAvatar: base64String
                        }));
                    } catch (conversionError) {
                        console.error('Erreur lors de la conversion en base64:', conversionError);
                        setFormData(prev => ({
                            ...prev,
                            utilisateurAvatar: asset.uri
                        }));
                    }
                }
                
                // Effacer l'erreur si elle existe
                if (error) {
                    setError(null);
                }
            }
        } catch (error) {
            console.error('Erreur lors de la sélection de l\'image:', error);
            setError('Erreur lors de la sélection de l\'image');
        }
    }, [error]);

    const validateForm = (): string | null => {
        if (!formData.utilisateurNom.trim()) {
            return 'Le nom est obligatoire';
        }

        if (formData.utilisateurNom.trim().length < 2) {
            return 'Le nom doit contenir au moins 2 caractères';
        }

        if (!formData.utilisateurTelephone.trim()) {
            return 'Le téléphone est obligatoire';
        }

        // Validation basique du format téléphone (peut être améliorée)
        const phoneRegex = /^[0-9+\-\s()]+$/;
        if (!phoneRegex.test(formData.utilisateurTelephone)) {
            return 'Format de téléphone invalide';
        }

        if (!formData.utilisateurCommune.trim()) {
            return 'La commune est obligatoire';
        }

        // Validation de la date de naissance
        if (formData.utilisateurDateNaiss) {
            const birthDate = new Date(formData.utilisateurDateNaiss);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            
            if (age < 13 || age > 100) {
                return 'L\'âge doit être entre 13 et 100 ans';
            }
        }

        // Validation de l'avatar si fourni
        if (formData.utilisateurAvatar && formData.utilisateurAvatar.startsWith('data:image')) {
            // Vérifier la taille approximative (1 caractère base64 ≈ 0.75 bytes)
            const estimatedSize = formData.utilisateurAvatar.length * 0.75;
            if (estimatedSize > 5 * 1024 * 1024) { // 5MB
                return 'L\'image est trop volumineuse. Taille maximum : 5MB';
            }
        }

        return null;
    };

    const handleSave = async (): Promise<boolean> => {
        console.log('💾 Starting profile saveyyy...');
        const validationError = validateForm();
        if (validationError) {
            console.log('💾 Validation error:', validationError);
            setError(validationError);
            return false;
        }

        setLoading(true);
        setError(null);

        try {
            // Préparer les données pour l'API
            const updateData = {
                utilisateurNom: formData.utilisateurNom,
                utilisateurCommune: formData.utilisateurCommune,
                utilisateurDateNaiss: formData.utilisateurDateNaiss.split('T')[0],
                utilisateurSexe: formData.utilisateurSexe,
                utilisateurAvatar: formData.utilisateurAvatar,
            };

            console.log('💾 Update data prepared:', {
                ...updateData,
                utilisateurAvatar: updateData.utilisateurAvatar ? 
                    `Avatar present (${updateData.utilisateurAvatar.length} chars)` : 
                    'No avatar'
            });

            // Appel API pour mettre à jour le profil
            console.log('💾 Calling profileService.updateProfile...');
            const updatedUser = await profileService.updateProfile(updateData);
            console.log('💾 Profile service response:', updatedUser);
            
            console.log('💾 Profile update successful, updating Redux store...');
            // Mise à jour du store Redux avec les données du serveur
            dispatch(updateUser(updatedUser));
            setSuccessMessage('Profil mis à jour avec succès');
            return true;
        } catch (err) {
            console.error('💾 Error during profile save:', err);
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la mise à jour du profil';
            setError(errorMessage);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            utilisateurNom: user?.utilisateurNom || '',
            utilisateurTelephone: user?.utilisateurTelephone || '',
            utilisateurCommune: user?.utilisateurCommune || '',
            utilisateurDateNaiss: user?.utilisateurDateNaiss || '',
            utilisateurSexe: user?.utilisateurSexe || 'Homme',
            utilisateurAvatar: user?.utilisateurAvatar || '',
        });
        setError(null);
        setSuccessMessage('');
    };

    const clearSuccessMessage = () => {
        setSuccessMessage('');
    };

    const handleRetry = () => {
        setError(null);
        setSuccessMessage('');
    };

    const goBack = () => {
        navigation.goBack();
    };

    return {
        formData,
        loading,
        error,
        successMessage,
        handleInputChange,
        pickProfileImage,
        handleSave,
        validateForm,
        resetForm,
        clearSuccessMessage,
        handleRetry,
        goBack
    };
}; 