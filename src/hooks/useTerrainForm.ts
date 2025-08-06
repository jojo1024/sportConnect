import { useState, useCallback, useEffect, useRef } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { terrainService, CreateTerrainData, Terrain } from '../services/terrainService';
import { validatePhoneNumber, cleanPhoneNumber } from '../components/PhoneInput';
import { useAppSelector } from '../store/hooks/hooks';
import { selectUser } from '../store/slices/userSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenNavigationProps, ScreenRouteProps } from '../navigation/types';
import { TextInput } from 'react-native';
import { Sport } from '../components/createParty/SportCard';
import { useSport } from './useSport';

export const initialTerrainFormData: FormData = {
    terrainNom: '',
    terrainLocalisation: '',
    terrainDescription: '',
    terrainContact: '',
    terrainPrixParHeure: '',
    terrainHoraires: {
        ouverture: '07:00',
        fermeture: '22:00',
    },
    terrainImages: [],
}   
export interface FormData {
    terrainNom: string;
    terrainLocalisation: string;
    terrainDescription: string;
    terrainContact: string;
    terrainPrixParHeure: string;
    terrainHoraires: {
        ouverture: string;
        fermeture: string;
    };
    terrainImages: string[];
}

export interface ValidationErrors {
    terrainNom?: string;
    terrainLocalisation?: string;
    terrainContact?: string;
    terrainPrixParHeure?: string;
    terrainImages?: string;
    selectedSports?: string;
}


interface UseTerrainFormReturn {
    formData: FormData;
    errors: ValidationErrors;
    isSubmitting: boolean;
    isLoading: boolean;
    showStartTimePicker: boolean;
    showEndTimePicker: boolean;
    mode: 'create' | 'edit';
    nomRef: React.RefObject<TextInput | null>;
    localisationRef: React.RefObject<TextInput | null>;
    descriptionRef: React.RefObject<TextInput | null>;
    contactRef: React.RefObject<TextInput | null>;
    prixRef: React.RefObject<TextInput | null>;
    
    // États de succès et d'erreur
    successMessage: string | null;
    errorMessage: string | null;
    
    // États pour les sports
    selectedSports: Sport[];
    filteredSports: Sport[];
    sportsLoading: boolean;
    sportsError: string | null;
    searchQuery: string;
    
    // Form handlers
    setTerrainNom: (value: string) => void;
    setTerrainLocalisation: (value: string) => void;
    setTerrainDescription: (value: string) => void;
    setTerrainContact: (value: string) => void;
    setTerrainPrixParHeure: (value: string) => void;
    
    // Sports handlers
    handleSportSelect: (sport: Sport) => void;
    handleSearchChange: (query: string) => void;
    isSportSelected: (sportId: number) => boolean;
    refreshSports: () => Promise<void>;
    
    // Time handlers
    setShowStartTimePicker: (show: boolean) => void;
    setShowEndTimePicker: (show: boolean) => void;
    handleStartTimeChange: (event: any, selectedDate?: Date) => void;
    handleEndTimeChange: (event: any, selectedDate?: Date) => void;
    
    // Image handlers
    pickImage: () => Promise<void>;
    removeImage: (index: number) => void;
    
    // Submit handlers
    handleSubmit: () => Promise<void>;
    
    // Validation
    validateForm: () => boolean;
    isFormReady: boolean;
    
    // Clear messages
    clearSuccessMessage: () => void;
    clearErrorMessage: () => void;

    // Back handlers
    handleBack: () => void;
    handleRetry: () => void;
}

const MAX_IMAGES = 5;

export const useTerrainForm = (): UseTerrainFormReturn => {
 
    const navigation = useNavigation<ScreenNavigationProps>();

    const route = useRoute<ScreenRouteProps<'TerrainForm'>>();

    // Récupérer les paramètres de navigation
    const mode = route.params?.mode || 'create';
    const terrainData = route.params?.terrainData;
    const onTerrainUpdated = route.params?.onTerrainUpdated;

    // Refs pour la navigation entre les champs
    const nomRef = useRef<TextInput>(null);
    const localisationRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const contactRef = useRef<TextInput>(null);
    const prixRef = useRef<TextInput>(null);
    const user = useAppSelector(selectUser);
    const [formData, setFormData] = useState<FormData>(initialTerrainFormData);

    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Plus besoin de loading initial
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    
    // États pour les messages de succès et d'erreur
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // États pour les sports
    const [selectedSports, setSelectedSports] = useState<Sport[]>([]);
    const [filteredSports, setFilteredSports] = useState<Sport[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cachedSports, setCachedSports] = useState<Sport[]>([]);
    const [sportsLoading, setSportsLoading] = useState(false);
    const [sportsError, setSportsError] = useState<string | null>(null);
    const [lastFetched, setLastFetched] = useState<number | null>(null);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    // Hook pour les sports
    const { activeSports, loading: apiLoading, error: apiError, fetchActiveSports } = useSport();

    // Sports handlers
    const loadSportsWithCache = useCallback(async () => {
        const now = Date.now();
        
        // Si on a des sports en cache et que le cache n'est pas expiré, on les utilise
        if (cachedSports.length > 0 && lastFetched && (now - lastFetched) < CACHE_DURATION) {
            setFilteredSports(cachedSports);
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

    const handleSportSelect = useCallback((sport: Sport) => {
        const isSelected = selectedSports.some(s => s.sportId === sport.sportId);

        if (isSelected) {
            // Désélectionner le sport
            setSelectedSports(prev => prev.filter(s => s.sportId !== sport.sportId));
        } else {
            // Sélectionner le sport
            setSelectedSports(prev => [...prev, sport]);
        }
    }, [selectedSports]);

    const handleSearchChange = useCallback((query: string) => {
        setSearchQuery(query);
        const filtered = cachedSports.filter(sport =>
            sport.sportNom.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredSports(filtered);
    }, [cachedSports]);

    const isSportSelected = useCallback((sportId: number) => {
        return selectedSports.some(s => s.sportId === sportId);
    }, [selectedSports]);

    // Charger les données du terrain en mode édition
    useEffect(() => {
        if (mode === 'edit' && terrainData) {
            // loadTerrainData();

            setFormData({
                terrainNom: terrainData.terrainNom,
                terrainLocalisation: terrainData.terrainLocalisation,
                terrainDescription: terrainData.terrainDescription || '',
                terrainContact: terrainData.terrainContact,
                terrainPrixParHeure: terrainData.terrainPrixParHeure.toString(),
                terrainHoraires: terrainData.terrainHoraires,
                terrainImages: terrainData.terrainImages,
            });
        }
    }, [mode, terrainData]);

    // Charger les sports déjà sélectionnés pour ce terrain (séparé pour gérer l'asynchrone)
    useEffect(() => {
        if (mode === 'edit' && terrainData && terrainData.terrainSports && cachedSports.length > 0) {
            const selectedSportsForTerrain = cachedSports.filter(sport => 
                terrainData.terrainSports!.includes(sport.sportId)
            );
            setSelectedSports(selectedSportsForTerrain);
        }
    }, [mode, terrainData, cachedSports]);

    // Initialiser les sports en cache quand ils sont chargés
    useEffect(() => {
        if (activeSports.length > 0) {
            setCachedSports(activeSports);
            setFilteredSports(activeSports);
            setLastFetched(Date.now());
        }
    }, [activeSports]);

    // Charger les sports au montage si nécessaire
    useEffect(() => {
        loadSportsWithCache();
    }, [loadSportsWithCache]);

    // Form handlers
    const setTerrainNom = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, terrainNom: value }));
        if (errors.terrainNom) {
            setErrors(prev => ({ ...prev, terrainNom: undefined }));
        }
    }, [errors.terrainNom]);

    const setTerrainLocalisation = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, terrainLocalisation: value }));
        if (errors.terrainLocalisation) {
            setErrors(prev => ({ ...prev, terrainLocalisation: undefined }));
        }
    }, [errors.terrainLocalisation]);

    const setTerrainDescription = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, terrainDescription: value }));
    }, []);

    const setTerrainContact = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, terrainContact: value }));
        if (errors.terrainContact) {
            setErrors(prev => ({ ...prev, terrainContact: undefined }));
        }
    }, [errors.terrainContact]);

    const setTerrainPrixParHeure = useCallback((value: string) => {
        setFormData(prev => ({ ...prev, terrainPrixParHeure: value }));
        if (errors.terrainPrixParHeure) {
            setErrors(prev => ({ ...prev, terrainPrixParHeure: undefined }));
        }
    }, [errors.terrainPrixParHeure]);

    // Time handlers
    const handleStartTimeChange = useCallback((event: any, selectedDate?: Date) => {
        setShowStartTimePicker(false);
        if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                terrainHoraires: {
                    ...prev.terrainHoraires,
                    ouverture: selectedDate.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                }
            }));
        }
    }, []);

    const handleEndTimeChange = useCallback((event: any, selectedDate?: Date) => {
        setShowEndTimePicker(false);
        if (selectedDate) {
            setFormData(prev => ({
                ...prev,
                terrainHoraires: {
                    ...prev.terrainHoraires,
                    fermeture: selectedDate.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                }
            }));
        }
    }, []);

    // Image handlers
    const pickImage = useCallback(async () => {
        if (formData.terrainImages.length >= MAX_IMAGES) {
            console.error('Limite atteinte');
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [16, 9],
                quality: 0.8,
                base64: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const asset = result.assets[0];
                
                if (asset.base64) {
                    const base64String = `data:image/jpeg;base64,${asset.base64}`;
                    setFormData(prev => ({
                        ...prev,
                        terrainImages: [...prev.terrainImages, base64String]
                    }));
                } else if (asset.uri) {
                    try {
                        const base64 = await FileSystem.readAsStringAsync(asset.uri, {
                            encoding: FileSystem.EncodingType.Base64,
                        });
                        const base64String = `data:image/jpeg;base64,${base64}`;
                        setFormData(prev => ({
                            ...prev,
                            terrainImages: [...prev.terrainImages, base64String]
                        }));
                    } catch (conversionError) {
                        console.error('Erreur lors de la conversion en base64:', conversionError);
                        setFormData(prev => ({
                            ...prev,
                            terrainImages: [...prev.terrainImages, asset.uri]
                        }));
                    }
                }
                
                if (errors.terrainImages) {
                    setErrors(prev => ({ ...prev, terrainImages: undefined }));
                }
            }
        } catch (error) {
            console.error('Erreur lors de la sélection de l\'image:', error);
        }
    }, [formData.terrainImages.length, errors.terrainImages]);

    const removeImage = useCallback((index: number) => {
        setFormData(prev => ({
            ...prev,
            terrainImages: prev.terrainImages.filter((_, i) => i !== index)
        }));
    }, []);

    // Validation
    const validateForm = useCallback(() => {
        const newErrors: ValidationErrors = {};

        if (!formData.terrainNom.trim()) {
            newErrors.terrainNom = 'Le nom du terrain est requis';
        }
        if (!formData.terrainLocalisation.trim()) {
            newErrors.terrainLocalisation = 'La localisation est requise';
        }
        if (!formData.terrainContact.trim()) {
            newErrors.terrainContact = 'Le contact est requis';
        } else {
            const contactError = validatePhoneNumber(formData.terrainContact);
            if (contactError) {
                newErrors.terrainContact = contactError;
            }
        }
        if (!formData.terrainPrixParHeure.trim()) {
            newErrors.terrainPrixParHeure = 'Le prix par heure est requis';
        } else if (isNaN(Number(formData.terrainPrixParHeure))) {
            newErrors.terrainPrixParHeure = 'Le prix doit être un nombre valide';
        }
        if (formData.terrainImages.length === 0) {
            newErrors.terrainImages = 'Au moins une photo de couverture est requise';
        }
        if (selectedSports.length === 0) {
            newErrors.selectedSports = 'Au moins un sport doit être sélectionné';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData, selectedSports]);

    const isFormReady = Object.keys(errors).length === 0 && 
        formData.terrainNom.trim() !== '' && 
        formData.terrainLocalisation.trim() !== '' && 
        formData.terrainContact.trim() !== '' && 
        formData.terrainPrixParHeure.trim() !== '' &&
        formData.terrainImages.length > 0 &&
        selectedSports.length > 0;

    // Submit handlers
    const handleSubmit = useCallback(async () => {
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrorMessage(null);
        setSuccessMessage(null);
        
        try {
            if (mode === 'create') {
                // Mode création
                const terrainData: CreateTerrainData = {
                    terrainNom: formData.terrainNom.trim(),
                    terrainLocalisation: formData.terrainLocalisation.trim(),
                    terrainDescription: formData.terrainDescription.trim() || undefined,
                    terrainContact: cleanPhoneNumber(formData.terrainContact),
                    terrainPrixParHeure: Number(formData.terrainPrixParHeure),
                    terrainHoraires: formData.terrainHoraires,
                    terrainImages: formData.terrainImages,
                    gerantId: user?.utilisateurId || 0,
                    terrainSports: selectedSports.map(sport => sport.sportId),
                };

                await terrainService.createTerrain(terrainData);
                setSuccessMessage('Terrain créé avec succès ! Il sera visible après validation par l\'administrateur.');

                // Reset form
                setFormData(initialTerrainFormData);
                setSelectedSports([]);
            } else {
                // Mode modification
                if (!terrainData) {
                    setErrorMessage('Données du terrain manquantes');
                    return;
                }
                
                const updateData = {
                    terrainNom: formData.terrainNom.trim(),
                    terrainLocalisation: formData.terrainLocalisation.trim(),
                    terrainDescription: formData.terrainDescription.trim() || undefined,
                    terrainContact: cleanPhoneNumber(formData.terrainContact),
                    terrainPrixParHeure: Number(formData.terrainPrixParHeure),
                    terrainHoraires: formData.terrainHoraires,
                    terrainImages: formData.terrainImages,
                    terrainSports: selectedSports.map(sport => sport.sportId),
                };

                const response = await terrainService.updateTerrain(terrainData.terrainId, updateData);
                setSuccessMessage('Terrain modifié avec succès !');

                // Notifier le parent avec les données mises à jour
                if (onTerrainUpdated && terrainData) {
                    onTerrainUpdated(response);
                }
            }

        } catch (error: any) {
            console.error(`Erreur lors de la ${mode === 'create' ? 'création' : 'modification'} du terrain:`, error);
            const errorMessage = error.response?.data?.message || 
                `Impossible de ${mode === 'create' ? 'créer' : 'modifier'} le terrain. Veuillez réessayer.`;
            setErrorMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, validateForm, mode, terrainData, user?.utilisateurId, onTerrainUpdated, selectedSports]);

    const clearSuccessMessage = useCallback(() => {
        setSuccessMessage(null);
    }, []);

    const clearErrorMessage = useCallback(() => {
        setErrorMessage(null);
    }, []);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, []);

    const handleRetry = useCallback(() => {
        clearErrorMessage();
        if (isFormReady) {
            handleSubmit();
        }
    }, [isFormReady, handleSubmit, clearErrorMessage]);

    return {
        formData,
        errors,
        isSubmitting,
        isLoading,
        showStartTimePicker,
        showEndTimePicker,
        successMessage,
        errorMessage,
        mode,
        nomRef,
        localisationRef,
        descriptionRef,
        contactRef,
        prixRef,
        
        // États pour les sports
        selectedSports,
        filteredSports,
        sportsLoading,
        sportsError,
        searchQuery,
        
        setTerrainNom,
        setTerrainLocalisation,
        setTerrainDescription,
        setTerrainContact,
        setTerrainPrixParHeure,
        
        // Sports handlers
        handleSportSelect,
        handleSearchChange,
        isSportSelected,
        refreshSports,
        
        setShowStartTimePicker,
        setShowEndTimePicker,
        handleStartTimeChange,
        handleEndTimeChange,
        pickImage,
        removeImage,
        handleSubmit,
        validateForm,
        isFormReady,
        clearSuccessMessage,
        clearErrorMessage,
        handleBack,
        handleRetry,
    };
}; 