import { useCallback, useEffect, useRef, useState } from 'react';
import { CreateMatchData, matchService } from '../services/matchService';
import { Terrain, terrainService } from '../services/terrainService';
import { Sport } from '../components/createParty/SportCard';
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

/**
 * Hook personnalisé pour gérer la création de parties/matches
 * Fournit une interface complète pour créer des parties avec sélection de terrain,
 * sport, date, durée et participants
 * 
 * Fonctionnalités principales :
 * - Gestion du formulaire de création de partie
 * - Sélection de terrain et sport avec recherche
 * - Validation des données du formulaire
 * - Gestion des états de chargement et d'erreur
 * - Soumission du formulaire et création du match
 * - Interface utilisateur avec bottom sheets et pickers
 * 
 * @returns {Object} Objet contenant l'état et les méthodes de gestion du formulaire
 */
export const useCreateParty = () => {
    const { handleApiError } = useApiError();
    const { showError } = useCustomAlert();
    const { 
        activeSports, 
        loading: apiLoading, 
        error: apiError, 
        fetchActiveSports 
    } = useSport();

    // États pour le cache des sports
    const [cachedSports, setCachedSports] = useState<Sport[]>([]);
    const [sportsLoading, setSportsLoading] = useState(false);
    const [sportsError, setSportsError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<number | null>(null);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // États pour le cache des terrains
    const [cachedTerrains, setCachedTerrains] = useState<Terrain[]>([]);
    const [terrainsLoading, setTerrainsLoading] = useState(false);
    const [terrainsError, setTerrainsError] = useState<string | null>(null);
    const [lastTerrainsFetched, setLastTerrainsFetched] = useState<number | null>(null);

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
    const [terrainLoadingError, setTerrainLoadingError] = useState<string | null>(null);

    // État du modal de succès
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [createdMatchData, setCreatedMatchData] = useState<any>(null);

    /**
     * Valide les données du formulaire de création de partie
     * Vérifie tous les champs requis et leurs contraintes
     * 
     * @param formData - Données du formulaire à valider
     * @returns {FormValidationResult} Résultat de la validation avec messages d'erreur
     */
    const validateCreatePartyForm = useCallback((formData: CreatePartyFormData): FormValidationResult => {
        const errorMessages: string[] = [];

        if (!formData.selectedTerrainId) {
            errorMessages.push('Veuillez sélectionner un terrain');
        }

        if (!formData.selectedSportId) {
            errorMessages.push('Veuillez sélectionner un sport');
        } else {
            // Vérifier que le sport sélectionné est disponible sur le terrain sélectionné
            const selectedTerrain = cachedTerrains.find(
                (terrain: Terrain) => terrain.terrainId.toString() === formData.selectedTerrainId
            );
            
            if (selectedTerrain && selectedTerrain.terrainSports) {
                const isSportAvailable = selectedTerrain.terrainSports.includes(formData.selectedSportId);
                if (!isSportAvailable) {
                    errorMessages.push('Le sport sélectionné n\'est pas disponible sur ce terrain');
                }
            }
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
    }, [cachedTerrains]);

    // Fonction pour charger les terrains avec cache
    const loadTerrainsWithCache = useCallback(async () => {
        const now = Date.now();
        
        // Si on a des terrains en cache et que le cache n'est pas expiré, on les utilise
        if (cachedTerrains.length > 0 && lastTerrainsFetched && (now - lastTerrainsFetched) < CACHE_DURATION) {
            return;
        }

        // Sinon, on charge depuis l'API
        try {
            setTerrainsLoading(true);
            setTerrainsError(null);
            const terrainsData = await terrainService.getAllTerrains("confirme");
            setCachedTerrains(terrainsData);
            setLastTerrainsFetched(Date.now());
        } catch (error: any) {
            const errorResult = handleApiError(error);
            setTerrainsError(errorResult.message);
        } finally {
            setTerrainsLoading(false);
        }
    }, [cachedTerrains.length, lastTerrainsFetched, handleApiError]);

    // Fonction pour forcer le rafraîchissement des terrains
    const refreshTerrains = useCallback(async () => {
        setLastTerrainsFetched(null); // Invalider le cache
        setTerrainsLoading(true);
        setTerrainsError(null);
        try {
            const terrainsData = await terrainService.getAllTerrains("confirme");
            console.log("🚀 ~ refreshTerrains ~ terrainsDatallll:", terrainsData.slice(0,2))
            setCachedTerrains(terrainsData);
            setLastTerrainsFetched(Date.now());
        } catch (error: any) {
            const errorResult = handleApiError(error);
            setTerrainsError(errorResult.message);
        } finally {
            setTerrainsLoading(false);
        }
    }, [handleApiError]);

    // Valeurs calculées
    const filteredTerrains = cachedTerrains
        .filter(terrain =>
            terrain.terrainNom.toLowerCase().includes(terrainSearchTerm.toLowerCase()) ||
            terrain.terrainLocalisation.toLowerCase().includes(terrainSearchTerm.toLowerCase())
        )

    // Fonction pour charger les sports avec cache
    const loadSportsWithCache = useCallback(async () => {
        const now = Date.now();
        
        // Si on a des sports en cache et que le cache n'est pas expiré, on les utilise
        if (cachedSports.length > 0 && lastFetched && (now - lastFetched) < CACHE_DURATION) {
            return;
        }

        // Sinon, on charge depuis l'API
        try {
            setSportsLoading(true);
            setSportsError(null);
            await fetchActiveSports();
        } catch (error) {
            setSportsError('Erreur lors du chargement des sports');
        } finally {
            setSportsLoading(false);
        }
    }, [cachedSports.length, lastFetched, fetchActiveSports]);

    // Fonction pour forcer le rafraîchissement des sports
    const refreshSports = useCallback(async () => {
        setLastFetched(null); // Invalider le cache
        setSportsLoading(true);
        setSportsError(null);
        try {
            await fetchActiveSports();
        } catch (error) {
            setSportsError('Erreur lors du rafraîchissement des sports');
        } finally {
            setSportsLoading(false);
        }
    }, [fetchActiveSports]);

    // Initialiser les sports en cache quand ils sont chargés
    useEffect(() => {
        if (activeSports.length > 0) {
            setCachedSports(activeSports);
            setLastFetched(Date.now());
        }
    }, [activeSports]);

    // Charger les sports au montage si nécessaire
    useEffect(() => {
        loadSportsWithCache();
    }, [loadSportsWithCache]);

    // Filtrer les sports en fonction du terrain sélectionné
    const getAvailableSportsForSelectedTerrain = useCallback(() => {
        if (!formData.selectedTerrainId || !cachedSports.length) {
            return [];
        }

        const selectedTerrain = cachedTerrains.find(
            terrain => terrain.terrainId.toString() === formData.selectedTerrainId
        );

        if (!selectedTerrain || !selectedTerrain.terrainSports) {
            return [];
        }

        // Filtrer les sports qui sont disponibles sur le terrain sélectionné
        return cachedSports.filter(sport => 
            selectedTerrain.terrainSports!.includes(sport.sportId)
        );
    }, [formData.selectedTerrainId, cachedSports, cachedTerrains]);

    // Sports disponibles pour le terrain sélectionné
    const availableSportsForTerrain = getAvailableSportsForSelectedTerrain();

    // Filtrer les sports disponibles par le terme de recherche
    const filteredSports = availableSportsForTerrain.filter(sport =>
        sport.sportNom.toLowerCase().includes(sportSearchTerm.toLowerCase())
    );

    const formValidation = validateCreatePartyForm(formData);

    const selectedTerrain = cachedTerrains.find(
        terrain => terrain.terrainId.toString() === formData.selectedTerrainId
    );
    const selectedSport = cachedSports.find(
        sport => sport.sportId === formData.selectedSportId
    );

    /**
     * Réessaie de charger les terrains en cas d'erreur
     */
    const retryLoadTerrains = useCallback(() => {
        refreshTerrains();
    }, [refreshTerrains]);

    /**
     * Réessaie de charger les sports en cas d'erreur
     */
    const retryLoadSports = useCallback(() => {
        refreshSports();
    }, [refreshSports]);

    // Charger les terrains au montage du composant
    useEffect(() => {
        loadTerrainsWithCache();
    }, [loadTerrainsWithCache]);

    // Charger les sports actifs au montage du composant
    useEffect(() => {
        fetchActiveSports();
    }, []);

    /**
     * Met à jour les données du formulaire de manière générique
     * @param updates - Objet contenant les champs à mettre à jour
     */
    const updateFormData = useCallback((updates: Partial<CreatePartyFormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    }, []);

    /**
     * Sélectionne un terrain et met à jour le formulaire
     * @param terrain - Terrain sélectionné
     */
    const selectTerrain = useCallback((terrain: Terrain) => {
        // Vérifier si le sport actuellement sélectionné est disponible sur le nouveau terrain
        const currentSportId = formData.selectedSportId;
        const isCurrentSportAvailable = terrain.terrainSports?.includes(currentSportId || 0);
        
        // Vérifier s'il n'y a qu'un seul sport disponible sur ce terrain
        const availableSportsForThisTerrain = cachedSports.filter(sport => 
            terrain.terrainSports?.includes(sport.sportId)
        );
        
        // Si il n'y a qu'un seul sport disponible, le sélectionner automatiquement
        const autoSelectSportId = availableSportsForThisTerrain.length === 1 
            ? availableSportsForThisTerrain[0].sportId 
            : null;
        
        console.log('🚀 ~ selectTerrain ~ terrain:', terrain.terrainNom);
        console.log('🚀 ~ selectTerrain ~ availableSportsForThisTerrain:', availableSportsForThisTerrain.length);
        console.log('🚀 ~ selectTerrain ~ autoSelectSportId:', autoSelectSportId);
        
        updateFormData({
            selectedTerrainId: terrain?.terrainId.toString(),
            selectedTerrainName: terrain.terrainNom,
            // Réinitialiser le sport si il n'est pas disponible sur le nouveau terrain
            // ou sélectionner automatiquement s'il n'y en a qu'un seul
            selectedSportId: autoSelectSportId || (isCurrentSportAvailable ? currentSportId : null),
        });
    }, [updateFormData, formData.selectedSportId, cachedSports]);

    /**
     * Sélectionne un sport et met à jour le formulaire
     * @param sport - Sport sélectionné
     */
    const selectSport = useCallback((sport: any) => {
        updateFormData({ selectedSportId: sport.sportId });
    }, [updateFormData]);

    /**
     * Met à jour la date sélectionnée
     * @param date - Nouvelle date sélectionnée
     */
    const updateSelectedDate = useCallback((date: Date) => {
        updateFormData({ selectedDate: date });
    }, [updateFormData]);

    /**
     * Met à jour la durée en heures
     * @param durationHours - Nouvelle durée en heures
     */
    const updateDurationHours = useCallback((durationHours: number) => {
        updateFormData({ durationHours });
    }, [updateFormData]);

    /**
     * Met à jour le nombre de participants
     * @param participantCount - Nouveau nombre de participants
     */
    const updateParticipantCount = useCallback((participantCount: number) => {
        updateFormData({ participantCount });
    }, [updateFormData]);

    /**
     * Met à jour la description
     * @param description - Nouvelle description
     */
    const updateDescription = useCallback((description: string) => {
        updateFormData({ description });
    }, [updateFormData]);

    /**
     * Incrémente le nombre de participants (avec limite maximale)
     */
    const incrementParticipantCount = useCallback(() => {
        setFormData(prev => {
            if (prev.participantCount < PARTICIPANTS_LIMITS.MAX) {
                return { ...prev, participantCount: prev.participantCount + 1 };
            }
            return prev;
        });
    }, []);

    /**
     * Décrémente le nombre de participants (avec limite minimale)
     */
    const decrementParticipantCount = useCallback(() => {
        setFormData(prev => {
            if (prev.participantCount > PARTICIPANTS_LIMITS.MIN) {
                return { ...prev, participantCount: prev.participantCount - 1 };
            }
            return prev;
        });
    }, []);

    /**
     * Gère le changement de date/heure depuis les pickers
     * @param event - Événement du picker
     * @param selectedDate - Date sélectionnée
     */
    const handleDateTimeChange = useCallback((event: any, selectedDate?: Date) => {
        setIsDatePickerVisible(false);
        setIsTimePickerVisible(false);
        if (selectedDate) {
            updateSelectedDate(selectedDate);
        }
    }, [updateSelectedDate]);

    /**
     * Affiche le picker de date
     */
    const showDatePicker = useCallback(() => {
        setIsDatePickerVisible(true);
    }, []);

    /**
     * Affiche le picker d'heure
     */
    const showTimePicker = useCallback(() => {
        setIsTimePickerVisible(true);
    }, []);

    /**
     * Met à jour le terme de recherche pour les terrains
     * @param searchTerm - Terme de recherche
     */
    const updateTerrainSearchTerm = useCallback((searchTerm: string) => {
        setTerrainSearchTerm(searchTerm);
    }, []);

    /**
     * Met à jour le terme de recherche pour les sports
     * @param searchTerm - Terme de recherche
     */
    const updateSportSearchTerm = useCallback((searchTerm: string) => {
        setSportSearchTerm(searchTerm);
    }, []);

    /**
     * Ouvre le sélecteur de terrain (bottom sheet)
     */
    const openTerrainSelector = useCallback(() => {
        terrainBottomSheetRef.current?.open();
    }, []);

    /**
     * Ferme le sélecteur de terrain (bottom sheet)
     */
    const closeTerrainSelector = useCallback(() => {
        terrainBottomSheetRef.current?.close();
    }, []);

    /**
     * Ouvre le sélecteur de sport (bottom sheet)
     */
    const openSportSelector = useCallback(() => {
        sportBottomSheetRef.current?.open();
    }, []);

    /**
     * Ferme le sélecteur de sport (bottom sheet)
     */
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
        isLoadingTerrains: terrainsLoading,
        formError,
        terrainLoadingError: terrainsError,
        isSuccessModalVisible,
        createdMatchData,
        
        // État des sports
        activeSports: cachedSports,
        isLoadingSports: sportsLoading,
        sportsError,
        selectedSport,
        
        // Valeurs calculées
        filteredTerrains,
        filteredSports,
        availableSportsForTerrain,
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
        retryLoadTerrains,
        retryLoadSports,
        refreshSports,
        refreshTerrains,
        
        // Gestionnaires du modal
        hideSuccessModal,
    };
}; 