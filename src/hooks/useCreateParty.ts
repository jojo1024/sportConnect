import { useCallback, useEffect, useState } from 'react';
import { matchService, CreateMatchData } from '../services/matchService';
import { terrainService, Terrain } from '../services/terrainService';
import { store } from '../store';
import { ErrorType } from '../services/api';
import { useApiError } from './useApiError';
import { useCustomAlert } from './useCustomAlert';

// Types
export interface Field {
    id: string;
    name: string;
    location: string;
    schedule: string;
    pricePerHour: number;
    image: string;
}

export interface CreatePartyFormData {
    selectedFieldId: string;
    selectedFieldName: string;
    date: Date;
    duration: number;
    numberOfParticipants: number;
    description: string;
}

export interface CreatePartyValidation {
    isValid: boolean;
    errors: string[];
}

// Constants
export const DURATION_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 72];

export const PARTICIPANTS_LIMITS = {
    MIN: 2,
    MAX: 50,
    DEFAULT: 10,
} as const;

// Validation functions
const validateForm = (formData: CreatePartyFormData): CreatePartyValidation => {
    const errors: string[] = [];

    if (!formData.selectedFieldId) {
        errors.push('Veuillez sélectionner un terrain');
    }

    if (!formData.date) {
        errors.push('Veuillez sélectionner une date');
    } else {
        const now = new Date();
        const selectedDate = new Date(formData.date);
        
        // Vérifier que la date est dans le futur
        if (selectedDate <= now) {
            errors.push('La date doit être dans le futur');
        }
        
        // Vérifier que la date n'est pas trop éloignée (max 3 mois)
        const threeMonthsFromNow = new Date();
        threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
        if (selectedDate > threeMonthsFromNow) {
            errors.push('La date ne peut pas être plus de 3 mois dans le futur');
        }
    }

    if (formData.duration < 1) {
        errors.push('La durée doit être d\'au moins 1 heure');
    }

    if (formData.duration > 24) {
        errors.push('La durée ne peut pas dépasser 24 heures');
    }

    if (formData.numberOfParticipants < PARTICIPANTS_LIMITS.MIN || 
        formData.numberOfParticipants > PARTICIPANTS_LIMITS.MAX) {
        errors.push(`Le nombre de participants doit être entre ${PARTICIPANTS_LIMITS.MIN} et ${PARTICIPANTS_LIMITS.MAX}`);
    }

    if (formData.description.length > 170) {
        errors.push('La description ne peut pas dépasser 170 caractères');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

// Hook principal
export const useCreateParty = () => {
    const { handleApiError, requiresReconnection } = useApiError();
    const { showError, showSuccess, showWarning } = useCustomAlert();

    // State principal
    const [formData, setFormData] = useState<CreatePartyFormData>({
        selectedFieldId: '',
        selectedFieldName: '',
        date: new Date(),
        duration: 1,
        numberOfParticipants: PARTICIPANTS_LIMITS.DEFAULT,
        description: '',
    });

    // State UI
    const [searchQuery, setSearchQuery] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingTerrains, setIsLoadingTerrains] = useState(false);
    const [terrains, setTerrains] = useState<Terrain[]>([]);
    const [error, setError] = useState<string | null>(null);

    // State pour le modal de succès
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [createdMatch, setCreatedMatch] = useState<any>(null);

    // Computed values
    const filteredFields = terrains.filter(terrain =>
        terrain.terrainNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        terrain.terrainLocalisation.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(terrain => ({
        id: terrain.terrainId.toString(),
        name: terrain.terrainNom,
        location: terrain.terrainLocalisation,
        schedule: terrain.terrainHoraires,
        pricePerHour: terrain.terrainPrixParHeure,
        image: terrain.terrainImages?.[0] || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    }));

    const validation = validateForm(formData);

    const selectedField = terrains.find(terrain => terrain.terrainId.toString() === formData.selectedFieldId);

    // Charger les terrains depuis l'API
    const loadTerrains = useCallback(async () => {
        try {
            setIsLoadingTerrains(true);
            setError(null);
            const terrainsData = await terrainService.getAllTerrains("confirme");
            setTerrains(terrainsData);
        } catch (err: any) {
            const errorResult = handleApiError(err);
            setError(errorResult.message);
            console.error('Erreur lors du chargement des terrains:', err);
        } finally {
            setIsLoadingTerrains(false);
        }
    }, [handleApiError]);

    // Fonction de retry pour charger les terrains
    const retryLoadTerrains = useCallback(() => {
        loadTerrains();
    }, [loadTerrains]);

    // Charger les terrains au montage du composant
    useEffect(() => {
        loadTerrains();
    }, [loadTerrains]);

    // Form update handlers
    const updateFormData = useCallback((updates: Partial<CreatePartyFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    }, []);

    const setSelectedField = useCallback((field: Field) => {
        updateFormData({
            selectedFieldId: field.id,
            selectedFieldName: field.name,
        });
    }, [updateFormData]);

    const setDate = useCallback((date: Date) => {
        updateFormData({ date });
    }, [updateFormData]);

    const setDuration = useCallback((duration: number) => {
        updateFormData({ duration });
    }, [updateFormData]);

    const setNumberOfParticipants = useCallback((numberOfParticipants: number) => {
        updateFormData({ numberOfParticipants });
    }, [updateFormData]);

    const setDescription = useCallback((description: string) => {
        updateFormData({ description });
    }, [updateFormData]);

    // Participants handlers
    const increaseParticipants = useCallback(() => {
        if (formData.numberOfParticipants < PARTICIPANTS_LIMITS.MAX) {
            setNumberOfParticipants(formData.numberOfParticipants + 1);
        }
    }, [formData.numberOfParticipants, setNumberOfParticipants]);

    const decreaseParticipants = useCallback(() => {
        if (formData.numberOfParticipants > PARTICIPANTS_LIMITS.MIN) {
            setNumberOfParticipants(formData.numberOfParticipants - 1);
        }
    }, [formData.numberOfParticipants, setNumberOfParticipants]);

    // Date/Time handlers
    const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        setShowTimePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    }, [setDate]);

    const openDatePicker = useCallback(() => {
        setShowDatePicker(true);
    }, []);

    const openTimePicker = useCallback(() => {
        setShowTimePicker(true);
    }, []);

    // Search handlers
    const updateSearchQuery = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    // Formater les dates au format attendu par MySQL (YYYY-MM-DD HH:MM:SS)
    const formatDateForMySQL = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    // Submit handler
    const handleSubmit = useCallback(async () => {
        if (!validation.isValid) {
            showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const user = store.getState().user.user;
            if (!user) {
                showError('Erreur d\'authentification', 'Utilisateur non connecté');
                return;
            }

            // Calculer les dates de début et fin
            const dateDebut = new Date(formData.date);
            const dateFin = new Date(dateDebut.getTime() + formData.duration * 60 * 60 * 1000);

            // Préparer les données pour l'API
            const matchData: CreateMatchData = {
                terrainId: parseInt(formData.selectedFieldId),
                matchDateDebut: formatDateForMySQL(dateDebut),
                matchDateFin: formatDateForMySQL(dateFin),
                matchDuree: formData.duration,
                matchDescription: formData.description,
                matchNbreParticipant: formData.numberOfParticipants,
                capoId: user.utilisateurId,
            };

            console.log('🚀 ~ Données envoyées au backend:', matchData);

            // Appel API pour créer le match
            const createdMatch = await matchService.createMatch(matchData);
            
            // Sauvegarder les détails du match créé pour le modal
            setCreatedMatch(createdMatch);
            setShowSuccessModal(true);

            // Reset du formulaire après succès
            setFormData({
                selectedFieldId: '',
                selectedFieldName: '',
                date: new Date(),
                duration: 1,
                numberOfParticipants: PARTICIPANTS_LIMITS.DEFAULT,
                description: '',
            });

        } catch (err: any) {
            console.error('Erreur lors de la création du match:', err);
            
            // Gestion spécifique des erreurs de disponibilité de terrain
            if (err?.response?.status === 400) {
                const errorMessage = err?.response?.data?.message || 'Erreur lors de la création du match';
                console.log('🚀 ~ Message d\'erreur de terrain:', errorMessage);
                setError(errorMessage);
            } else {
                const errorResult = handleApiError(err);
                setError(errorResult.message);
            }
        } finally {
            setIsSubmitting(false);
        }
    }, [validation.isValid, formData, showError, handleApiError]);

    // Reset handler
    const resetForm = useCallback(() => {
        setFormData({
            selectedFieldId: '',
            selectedFieldName: '',
            date: new Date(),
            duration: 1,
            numberOfParticipants: PARTICIPANTS_LIMITS.DEFAULT,
            description: '',
        });
        setSearchQuery('');
        setShowDatePicker(false);
        setShowTimePicker(false);
    }, []);

    // Utility functions
    const formatDate = useCallback((date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }, []);

    const formatTime = useCallback((date: Date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    const isMinParticipantsReached = formData.numberOfParticipants <= PARTICIPANTS_LIMITS.MIN;
    const isMaxParticipantsReached = formData.numberOfParticipants >= PARTICIPANTS_LIMITS.MAX;

    // Modal handlers
    const closeSuccessModal = useCallback(() => {
        setShowSuccessModal(false);
        setCreatedMatch(null);
    }, []);

    return {
        // State
        formData,
        searchQuery,
        showDatePicker,
        showTimePicker,
        isSubmitting,
        isLoadingTerrains,
        error,
        showSuccessModal,
        createdMatch,
        
        // Computed values
        filteredFields,
        validation,
        selectedField,
        isMinParticipantsReached,
        isMaxParticipantsReached,
        
        // Form handlers
        updateFormData,
        setSelectedField,
        setDate,
        setDuration,
        setNumberOfParticipants,
        setDescription,
        
        // Participants handlers
        increaseParticipants,
        decreaseParticipants,
        
        // Date/Time handlers
        handleDateChange,
        openDatePicker,
        openTimePicker,
        
        // Search handlers
        updateSearchQuery,
        
        // Submit handlers
        handleSubmit,
        resetForm,
        
        // Utility functions
        formatDate,
        formatTime,
        
        // Data loading
        loadTerrains,
        retryLoadTerrains,
        
        // Modal handlers
        closeSuccessModal,
    };
}; 