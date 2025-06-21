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
        if (formData.date <= now) {
            errors.push('La date doit être dans le futur');
        }
    }

    if (formData.duration < 1) {
        errors.push('La durée doit être d\'au moins 1 heure');
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

    // Computed values
    const filteredFields = terrains.filter(terrain =>
        terrain.terrainNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        terrain.terrainLocalisation.toLowerCase().includes(searchQuery.toLowerCase())
    ).map(terrain => ({
        id: terrain.terrainId.toString(),
        name: terrain.terrainNom,
        location: terrain.terrainLocalisation,
        schedule: terrain.terrainHoraires ,
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
            const terrainsData = await terrainService.getAllTerrains();
            setTerrains(terrainsData);
        } catch (err: any) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
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

    // Submit handler
    const handleSubmit = useCallback(async () => {
        if (!validation.isValid) {
            showWarning(
                'Erreur de validation',
                validation.errors.join('\n')
            );
            return;
        }

        setIsSubmitting(true);
        try {
            // Récupérer l'ID de l'utilisateur connecté depuis le store
            const state = store.getState();
            const userId = state.user.user?.utilisateurId;
            
            if (!userId) {
                throw new Error('Utilisateur non connecté');
            }

            // Calculer la date de fin
            const dateDebut = new Date(formData.date);
            const dateFin = new Date(dateDebut.getTime() + formData.duration * 60 * 60 * 1000);

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

            // Préparer les données pour l'API
            const matchData: CreateMatchData = {
                terrainId: parseInt(formData.selectedFieldId),
                matchDateDebut: formatDateForMySQL(dateDebut),
                matchDateFin: formatDateForMySQL(dateFin),
                matchDuree: formData.duration,
                matchDescription: formData.description,
                matchNbreParticipant: formData.numberOfParticipants,
                capoId: userId,
            };

            console.log('🚀 ~ Données envoyées au backend:', matchData);

            // Appel API pour créer le match
            const createdMatch = await matchService.createMatch(matchData);
            
            showSuccess(
                'Partie créée !',
                `Votre partie a été créée avec succès !\nCode: ${createdMatch.codeMatch}`
            );

            // Reset du formulaire après succès
            setFormData({
                selectedFieldId: '',
                selectedFieldName: '',
                date: new Date(),
                duration: 1,
                numberOfParticipants: PARTICIPANTS_LIMITS.DEFAULT,
                description: '',
            });

        } catch (error: any) {
            console.error('Erreur lors de la création de la partie:', error);
            
            // La gestion globale des erreurs s'occupe déjà d'afficher les alertes
            // On peut juste gérer les cas spécifiques ici si nécessaire
            if (error?.type === ErrorType.VALIDATION) {
                // Erreur de validation déjà gérée globalement
                return;
            }
            
            // Pour les autres erreurs, elles sont déjà gérées globalement
            // Pas besoin de faire quoi que ce soit ici
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validation, showSuccess, showWarning]);

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

    return {
        // State
        formData,
        searchQuery,
        showDatePicker,
        showTimePicker,
        isSubmitting,
        isLoadingTerrains,
        error,
        
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
    };
}; 