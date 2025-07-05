import { useState, useCallback, useMemo } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { terrainService, CreateTerrainData } from '../services/terrainService';
import { validatePhoneNumber, cleanPhoneNumber } from '../components/PhoneInput';
import { useAppSelector } from '../store/hooks/hooks';
import { selectUser } from '../store/slices/userSlice';
import { FormData, initialTerrainFormData, ValidationErrors } from './useTerrainForm';
import { UseAddTerrainReturn } from './interface';

// Constantes
const MAX_IMAGES = 5;
const IMAGE_PICKER_OPTIONS = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [16, 9] as [number, number],
    quality: 0.8,
    base64: true,
};

const TIME_FORMAT_OPTIONS = {
    hour: '2-digit' as const,
    minute: '2-digit' as const,
};

/**
 * Objet contenant les fonctions de validation pour chaque type de champ
 */
const validateField = {
    /**
     * Valide qu'un champ requis n'est pas vide
     * @param value - Valeur à valider
     * @param fieldName - Nom du champ pour le message d'erreur
     * @returns {string | null} Message d'erreur ou null si valide
     */
    required: (value: string, fieldName: string): string | null => 
        !value.trim() ? `${fieldName} est requis` : null,
    
    /**
     * Valide un numéro de téléphone
     * @param value - Numéro de téléphone à valider
     * @returns {string | null} Message d'erreur ou null si valide
     */
    phone: (value: string): string | null => {
        if (!value.trim()) return 'Le contact est requis';
        const phoneError = validatePhoneNumber(value);
        return phoneError || null;
    },
    
    /**
     * Valide un prix (nombre positif)
     * @param value - Prix à valider
     * @returns {string | null} Message d'erreur ou null si valide
     */
    price: (value: string): string | null => {
        if (!value.trim()) return 'Le prix par heure est requis';
        if (isNaN(Number(value))) return 'Le prix doit être un nombre valide';
        if (Number(value) <= 0) return 'Le prix doit être supérieur à 0';
        return null;
    },
    
    /**
     * Valide qu'au moins une image est sélectionnée
     * @param images - Liste des images
     * @returns {string | null} Message d'erreur ou null si valide
     */
    images: (images: string[]): string | null => 
        images.length === 0 ? 'Au moins une photo de couverture est requise' : null,
};

/**
 * Traite un asset d'image et le convertit en base64
 * @param asset - Asset d'image à traiter
 * @returns {Promise<string>} Image en format base64 ou URI
 */
const processImageAsset = async (asset: ImagePicker.ImagePickerAsset): Promise<string> => {
    if (asset.base64) {
        return `data:image/jpeg;base64,${asset.base64}`;
    }
    
    if (asset.uri) {
        try {
            const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return `data:image/jpeg;base64,${base64}`;
        } catch (error) {
            console.warn('Erreur lors de la conversion en base64, utilisation de l\'URI:', error);
            return asset.uri;
        }
    }
    
    throw new Error('Format d\'image non supporté');
};

/**
 * Hook personnalisé pour gérer l'ajout de terrains
 * Fournit une interface complète pour créer des terrains avec gestion d'images,
 * validation et soumission
 * 
 * Fonctionnalités principales :
 * - Gestion du formulaire d'ajout de terrain
 * - Sélection et traitement d'images multiples
 * - Validation en temps réel des champs
 * - Gestion des horaires d'ouverture/fermeture
 * - Soumission du formulaire avec gestion d'erreur
 * - Optimisations avec useCallback et useMemo
 * 
 * @returns {UseAddTerrainReturn} Objet contenant l'état et les méthodes de gestion
 */
export const useAddTerrain = (): UseAddTerrainReturn => {
    const user = useAppSelector(selectUser);
    
    // États principaux
    const [formData, setFormData] = useState<FormData>(initialTerrainFormData);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    /**
     * Crée un handler générique pour les champs de formulaire
     * Met à jour la valeur et efface l'erreur correspondante
     * @param field - Nom du champ à gérer
     * @returns {Function} Handler pour le champ spécifié
     */
    const createFieldHandler = useCallback((field: keyof FormData) => {
        return (value: string) => {
            setFormData(prev => ({ ...prev, [field]: value }));
            // Clear error for this field if it exists
            if (errors[field as keyof ValidationErrors]) {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
        };
    }, [errors]);

    const setTerrainNom = createFieldHandler('terrainNom');
    const setTerrainLocalisation = createFieldHandler('terrainLocalisation');
    const setTerrainDescription = createFieldHandler('terrainDescription');
    const setTerrainContact = createFieldHandler('terrainContact');
    const setTerrainPrixParHeure = createFieldHandler('terrainPrixParHeure');

    /**
     * Crée un handler générique pour les champs de temps
     * Gère la sélection d'heure et met à jour le formulaire
     * @param timeField - Type de champ de temps ('ouverture' ou 'fermeture')
     * @param setShowPicker - Fonction pour afficher/masquer le picker
     * @returns {Function} Handler pour le champ de temps
     */
    const createTimeHandler = useCallback((timeField: 'ouverture' | 'fermeture', setShowPicker: (show: boolean) => void) => {
        return (event: any, selectedDate?: Date) => {
            setShowPicker(false);
            if (selectedDate) {
                setFormData(prev => ({
                    ...prev,
                    terrainHoraires: {
                        ...prev.terrainHoraires,
                        [timeField]: selectedDate.toLocaleTimeString('fr-FR', TIME_FORMAT_OPTIONS)
                    }
                }));
            }
        };
    }, []);

    const handleStartTimeChange = createTimeHandler('ouverture', setShowStartTimePicker);
    const handleEndTimeChange = createTimeHandler('fermeture', setShowEndTimePicker);

    /**
     * Sélectionne une image depuis la galerie
     * Vérifie les limites et traite l'image sélectionnée
     */
    const pickImage = useCallback(async () => {
        if (formData.terrainImages.length >= MAX_IMAGES) {
            setErrorMessage(`Limite de ${MAX_IMAGES} images atteinte`);
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync(IMAGE_PICKER_OPTIONS);

            if (!result.canceled && result.assets?.[0]) {
                const processedImage = await processImageAsset(result.assets[0]);
                
                setFormData(prev => ({
                    ...prev,
                    terrainImages: [...prev.terrainImages, processedImage]
                }));

                // Clear image error if it exists
                if (errors.terrainImages) {
                    setErrors(prev => ({ ...prev, terrainImages: undefined }));
                }
            }
        } catch (error) {
            console.error('Erreur lors de la sélection de l\'image:', error);
            setErrorMessage('Erreur lors de la sélection de l\'image');
        }
    }, [formData.terrainImages.length, errors.terrainImages]);

    /**
     * Supprime une image de la liste
     * @param index - Index de l'image à supprimer
     */
    const removeImage = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            terrainImages: prev.terrainImages.filter((_, i) => i !== index)
        }));
    }, []);

    /**
     * Valide tous les champs du formulaire
     * @returns {boolean} True si le formulaire est valide
     */
    const validateForm = useCallback(() => {
        const newErrors: ValidationErrors = {};

        // Validation des champs requis
        const nomError = validateField.required(formData.terrainNom, 'Le nom du terrain');
        if (nomError) newErrors.terrainNom = nomError;

        const localisationError = validateField.required(formData.terrainLocalisation, 'La localisation');
        if (localisationError) newErrors.terrainLocalisation = localisationError;

        const contactError = validateField.phone(formData.terrainContact);
        if (contactError) newErrors.terrainContact = contactError;

        const priceError = validateField.price(formData.terrainPrixParHeure);
        if (priceError) newErrors.terrainPrixParHeure = priceError;

        const imagesError = validateField.images(formData.terrainImages);
        if (imagesError) newErrors.terrainImages = imagesError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    /**
     * Vérifie si le formulaire est prêt à être soumis
     * Calculé avec useMemo pour optimiser les performances
     */
    const isFormReady = useMemo(() => {
        return Object.keys(errors).length === 0 && 
            formData.terrainNom.trim() !== '' && 
            formData.terrainLocalisation.trim() !== '' && 
            formData.terrainContact.trim() !== '' && 
            formData.terrainPrixParHeure.trim() !== '' &&
            formData.terrainImages.length > 0;
    }, [errors, formData]);

    /**
     * Soumet le formulaire et crée le terrain
     * Valide les données et appelle l'API de création
     */
    const handleSubmit = useCallback(async () => {
        if (!validateForm() || !user?.utilisateurId) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        try {
            const terrainData: CreateTerrainData = {
                terrainNom: formData.terrainNom.trim(),
                terrainLocalisation: formData.terrainLocalisation.trim(),
                terrainDescription: formData.terrainDescription.trim() || undefined,
                terrainContact: cleanPhoneNumber(formData.terrainContact),
                terrainPrixParHeure: Number(formData.terrainPrixParHeure),
                terrainHoraires: formData.terrainHoraires,
                terrainImages: formData.terrainImages,
                gerantId: user.utilisateurId,
            };

            await terrainService.createTerrain(terrainData);
            
            setSuccessMessage('Terrain créé avec succès ! Les capo pourront réserver ce terrain après validation par l\'administrateur.');
            setFormData(initialTerrainFormData);

        } catch (error: any) {
            console.error('Erreur lors de la création du terrain:', error);
            const errorMessage = error.response?.data?.message || 
                'Impossible de créer le terrain. Veuillez réessayer.';
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm, user?.utilisateurId]);

    /**
     * Efface le message de succès
     */
    const clearSuccessMessage = useCallback(() => setSuccessMessage(null), []);
    
    /**
     * Efface le message d'erreur
     */
    const clearErrorMessage = useCallback(() => setErrorMessage(null), []);

    return {
        // États
        formData,
        errors,
        isSubmitting,
        isFormReady,
        showStartTimePicker,
        showEndTimePicker,
        successMessage,
        errorMessage,
        
        // Handlers de formulaire
        setTerrainNom,
        setTerrainLocalisation,
        setTerrainDescription,
        setTerrainContact,
        setTerrainPrixParHeure,
        
        // Handlers de temps
        setShowStartTimePicker,
        setShowEndTimePicker,
        handleStartTimeChange,
        handleEndTimeChange,
        
        // Handlers d'images
        pickImage,
        removeImage,
        
        // Handlers de soumission
        handleSubmit,
        
        // Utilitaires
        validateForm,
        clearSuccessMessage,
        clearErrorMessage,
    };
}; 