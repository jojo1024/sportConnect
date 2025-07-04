import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateMatchData, matchService } from '../services/matchService';
import { Terrain, terrainService } from '../services/terrainService';
import { useSport } from './useSport';
import { store } from '../store';
import { useApiError } from './useApiError';
import { useCustomAlert } from './useCustomAlert';
import { PARTICIPANTS_LIMITS } from '../utils/constant';
import { formatDateForMySQL } from '../utils/functions';

// Types
// export interface TerrainOption {
//     id: string;
//     name: string;
//     location: string;
//     schedule: string;
//     pricePerHour: number;
//     image: string;
// }

export interface CreatePartyFormData {
    selectedTerrainId: string;
    selectedTerrainName: string;
    selectedDate: Date;
    durationHours: number;
    participantCount: number;
    description: string;
    selectedSportId: number | null;
}

export interface FormValidationResult {
    isValid: boolean;
    errorMessages: string[];
}

// Validation functions
const validateCreatePartyForm = (formData: CreatePartyFormData): FormValidationResult => {
    const errorMessages: string[] = [];

    if (!formData.selectedTerrainId) {
        errorMessages.push('Veuillez sélectionner un terrain');
    }

    if (!formData.selectedSportId) {
        errorMessages.push('Veuillez sélectionner un sport');
    }

    if (!formData.selectedDate) {
        errorMessages.push('Veuillez sélectionner une date');
    } else {
        const currentDate = new Date();
        const selectedDate = new Date(formData.selectedDate);
        
        // Vérifier que la date est dans le futur
        if (selectedDate <= currentDate) {
            errorMessages.push('La date doit être dans le futur');
        }
        
        // Vérifier que la date n'est pas trop éloignée (max 3 mois)
        const maxAllowedDate = new Date();
        maxAllowedDate.setMonth(maxAllowedDate.getMonth() + 3);
        if (selectedDate > maxAllowedDate) {
            errorMessages.push('La date ne peut pas être plus de 3 mois dans le futur');
        }
    }

    if (formData.durationHours < 1) {
        errorMessages.push('La durée doit être d\'au moins 1 heure');
    }

    if (formData.durationHours > 24) {
        errorMessages.push('La durée ne peut pas dépasser 24 heures');
    }

    if (formData.participantCount < PARTICIPANTS_LIMITS.MIN || 
        formData.participantCount > PARTICIPANTS_LIMITS.MAX) {
        errorMessages.push(`Le nombre de participants doit être entre ${PARTICIPANTS_LIMITS.MIN} et ${PARTICIPANTS_LIMITS.MAX}`);
    }

    if (formData.description.length > 170) {
        errorMessages.push('La description ne peut pas dépasser 170 caractères');
    }

    return {
        isValid: errorMessages.length === 0,
        errorMessages,
    };
};

// Hook principal
export const useCreateParty = () => {
    const { handleApiError } = useApiError();
    const { showError } = useCustomAlert();
    const { 
        activeSports, 
        loading: isLoadingSports, 
        error: sportsError, 
        fetchActiveSports 
    } = useSport();

    // Refs pour les bottom sheets
    const terrainBottomSheetRef = useRef<any>(null);
    const sportBottomSheetRef = useRef<any>(null);

    // État principal du formulaire
    const [formData, setFormData] = useState<CreatePartyFormData>({
        selectedTerrainId: '',
        selectedTerrainName: '',
        selectedDate: new Date(),
        durationHours: 1,
        participantCount: PARTICIPANTS_LIMITS.DEFAULT,
        description: '',
        selectedSportId: null,
    });

    // État de l'interface utilisateur
    const [terrainSearchTerm, setTerrainSearchTerm] = useState('');
    const [sportSearchTerm, setSportSearchTerm] = useState('');
    const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
    const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [isLoadingTerrains, setIsLoadingTerrains] = useState(false);
    const [availableTerrains, setAvailableTerrains] = useState<Terrain[]>([]);
    const [formError, setFormError] = useState<string | null>(null);

    // État du modal de succès
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [createdMatchData, setCreatedMatchData] = useState<any>(null);

    // Valeurs calculées
    const filteredTerrains = availableTerrains
        .filter(terrain =>
            terrain.terrainNom.toLowerCase().includes(terrainSearchTerm.toLowerCase()) ||
            terrain.terrainLocalisation.toLowerCase().includes(terrainSearchTerm.toLowerCase())
        )
        // .map(terrain => ({
        //     id: terrain.terrainId.toString(),
        //     name: terrain.terrainNom,
        //     location: terrain.terrainLocalisation,
        //     schedule: terrain.terrainHoraires,
        //     pricePerHour: terrain.terrainPrixParHeure,
        //     image: terrain.terrainImages?.[0] || 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
        // }));

    const filteredSports = activeSports.filter(sport =>
        sport.sportNom.toLowerCase().includes(sportSearchTerm.toLowerCase())
    );

    const formValidation = validateCreatePartyForm(formData);

    const selectedTerrain = availableTerrains.find(
        terrain => terrain.terrainId.toString() === formData.selectedTerrainId
    );
    const selectedSport = activeSports.find(
        sport => sport.sportId === formData.selectedSportId
    );

    // Charger les terrains depuis l'API
    const loadAvailableTerrains = useCallback(async () => {
        try {
            setIsLoadingTerrains(true);
            setFormError(null);
            const terrainsData = await terrainService.getAllTerrains("confirme");
            setAvailableTerrains(terrainsData);
        } catch (error: any) {
            const errorResult = handleApiError(error);
            setFormError(errorResult.message);
            console.error('Erreur lors du chargement des terrains:', error);
        } finally {
            setIsLoadingTerrains(false);
        }
    }, [handleApiError]);

    // Fonction de retry pour charger les terrains
    const retryLoadTerrains = useCallback(() => {
        loadAvailableTerrains();
    }, [loadAvailableTerrains]);

    // Fonction de retry pour charger les sports
    const retryLoadSports = useCallback(() => {
        fetchActiveSports();
    }, [fetchActiveSports]);

    // Charger les terrains au montage du composant
    useEffect(() => {
        loadAvailableTerrains();
    }, [loadAvailableTerrains]);

    // Charger les sports actifs au montage du composant
    useEffect(() => {
        fetchActiveSports();
    }, []);

    // Gestionnaires de mise à jour du formulaire
    const updateFormData = useCallback((updates: Partial<CreatePartyFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    }, []);

    const selectTerrain = useCallback((terrain: Terrain) => {
        updateFormData({
            selectedTerrainId: terrain?.terrainId.toString(),
            selectedTerrainName: terrain.terrainNom,
        });
    }, [updateFormData]);

    const selectSport = useCallback((sport: any) => {
        updateFormData({ selectedSportId: sport.sportId });
    }, [updateFormData]);

    const updateSelectedDate = useCallback((date: Date) => {
        updateFormData({ selectedDate: date });
    }, [updateFormData]);

    const updateDurationHours = useCallback((durationHours: number) => {
        updateFormData({ durationHours });
    }, [updateFormData]);

    const updateParticipantCount = useCallback((participantCount: number) => {
        updateFormData({ participantCount });
    }, [updateFormData]);

    const updateDescription = useCallback((description: string) => {
        updateFormData({ description });
    }, [updateFormData]);

    // Gestionnaires des participants
    const incrementParticipantCount = useCallback(() => {
        setFormData(prev => {
            if (prev.participantCount < PARTICIPANTS_LIMITS.MAX) {
                return { ...prev, participantCount: prev.participantCount + 1 };
            }
            return prev;
        });
    }, []);

    const decrementParticipantCount = useCallback(() => {
        setFormData(prev => {
            if (prev.participantCount > PARTICIPANTS_LIMITS.MIN) {
                return { ...prev, participantCount: prev.participantCount - 1 };
            }
            return prev;
        });
    }, []);

    // Gestionnaires de date/heure
    const handleDateTimeChange = useCallback((event: any, selectedDate?: Date) => {
        setIsDatePickerVisible(false);
        setIsTimePickerVisible(false);
        if (selectedDate) {
            updateSelectedDate(selectedDate);
        }
    }, [updateSelectedDate]);

    const showDatePicker = useCallback(() => {
        setIsDatePickerVisible(true);
    }, []);

    const showTimePicker = useCallback(() => {
        setIsTimePickerVisible(true);
    }, []);

    // Gestionnaires de recherche
    const updateTerrainSearchTerm = useCallback((searchTerm: string) => {
        setTerrainSearchTerm(searchTerm);
    }, []);

    const updateSportSearchTerm = useCallback((searchTerm: string) => {
        setSportSearchTerm(searchTerm);
    }, []);

    // Gestionnaires des bottom sheets
    const openTerrainSelector = useCallback(() => {
        terrainBottomSheetRef.current?.open();
    }, []);

    const closeTerrainSelector = useCallback(() => {
        terrainBottomSheetRef.current?.close();
    }, []);

    const openSportSelector = useCallback(() => {
        sportBottomSheetRef.current?.open();
    }, []);

    const closeSportSelector = useCallback(() => {
        sportBottomSheetRef.current?.close();
    }, []);

    // Gestionnaires de sélection
    const handleTerrainSelection = useCallback((terrain: Terrain) => {
        selectTerrain(terrain);
        closeTerrainSelector();
    }, [selectTerrain, closeTerrainSelector]);

    const handleSportSelection = useCallback((sport: any) => {
        selectSport(sport);
        closeSportSelector();
    }, [selectSport, closeSportSelector]);

    // Gestionnaire de soumission
    const submitCreatePartyForm = useCallback(async () => {
        console.log('🚀 submitCreatePartyForm appelé');
        console.log('🚀 formValidation.isValid:', formValidation.isValid);
        
        if (!formValidation.isValid) {
            showError('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
            return;
        }

        try {
            setIsSubmittingForm(true);
            setFormError(null);

            const currentUser = store.getState().user.user;
            if (!currentUser) {
                showError('Erreur d\'authentification', 'Utilisateur non connecté');
                return;
            }

            // Calculer les dates de début et fin
            const startDate = new Date(formData.selectedDate);
            const endDate = new Date(startDate.getTime() + formData.durationHours * 60 * 60 * 1000);

            // Préparer les données pour l'API
            const matchCreationData: CreateMatchData = {
                terrainId: parseInt(formData.selectedTerrainId),
                matchDateDebut: formatDateForMySQL(startDate),
                matchDateFin: formatDateForMySQL(endDate),
                matchDuree: formData.durationHours,
                matchDescription: formData.description,
                matchNbreParticipant: formData.participantCount,
                capoId: currentUser.utilisateurId,
                sportId: formData.selectedSportId!, // On sait que selectedSportId n'est pas null grâce à la validation
            };

            console.log('🚀 ~ Données envoyées au backend:', matchCreationData);

            // Appel API pour créer le match
            const newMatch = await matchService.createMatch(matchCreationData);
            
            // Sauvegarder les détails du match créé pour le modal
            setCreatedMatchData(newMatch);
            setIsSuccessModalVisible(true);

            // Reset du formulaire après succès
            setFormData({
                selectedTerrainId: '',
                selectedTerrainName: '',
                selectedDate: new Date(),
                durationHours: 1,
                participantCount: PARTICIPANTS_LIMITS.DEFAULT,
                description: '',
                selectedSportId: null,
            });

        } catch (error: any) {
            console.error('Erreur lors de la création du match:', error);
            
            // Gestion spécifique des erreurs de disponibilité de terrain
            if (error?.response?.status === 400) {
                const errorMessage = error?.response?.data?.message || 'Erreur lors de la création du match';
                console.log('🚀 ~ Message d\'erreur de terrain:', errorMessage);
                setFormError(errorMessage);
            } else {
                const errorResult = handleApiError(error);
                setFormError(errorResult.message);
            }
        } finally {
            setIsSubmittingForm(false);
        }
    }, [
        formValidation.isValid,
        formData,
        showError,
        handleApiError,
        setFormData,
        setCreatedMatchData,
        setIsSuccessModalVisible,
        setFormError
    ]);



    // Valeurs calculées pour l'interface
    const isMinParticipantCountReached = formData.participantCount <= PARTICIPANTS_LIMITS.MIN;
    const isMaxParticipantCountReached = formData.participantCount >= PARTICIPANTS_LIMITS.MAX;

    // Gestionnaires du modal
    const hideSuccessModal = useCallback(() => {
        setIsSuccessModalVisible(false);
        setCreatedMatchData(null);
    }, []);

    return {
        // Refs
        terrainBottomSheetRef,
        sportBottomSheetRef,

        // État du formulaire
        formData,
        terrainSearchTerm,
        sportSearchTerm,
        isDatePickerVisible,
        isTimePickerVisible,
        isSubmittingForm,
        isLoadingTerrains,
        formError,
        isSuccessModalVisible,
        createdMatchData,
        
        // État des sports
        activeSports,
        isLoadingSports,
        sportsError,
        selectedSport,
        
        // Valeurs calculées
        filteredTerrains,
        filteredSports,
        formValidation,
        selectedTerrain,
        isMinParticipantCountReached,
        isMaxParticipantCountReached,
        
        // Gestionnaires du formulaire
        updateFormData,
        selectTerrain,
        selectSport,
        updateSelectedDate,
        updateDurationHours,
        updateParticipantCount,
        updateDescription,
        
        // Gestionnaires des participants
        incrementParticipantCount,
        decrementParticipantCount,
        
        // Gestionnaires de date/heure
        handleDateTimeChange,
        showDatePicker,
        showTimePicker,
        
        // Gestionnaires de recherche
        updateTerrainSearchTerm,
        updateSportSearchTerm,

        // Gestionnaires des bottom sheets
        openTerrainSelector,
        closeTerrainSelector,
        openSportSelector,
        closeSportSelector,

        // Gestionnaires de sélection
        handleTerrainSelection,
        handleSportSelection,
        
        // Gestionnaires de soumission
        submitCreatePartyForm,

        // Chargement des données
        loadAvailableTerrains,
        retryLoadTerrains,
        retryLoadSports,
        
        // Gestionnaires du modal
        hideSuccessModal,
    };
}; 