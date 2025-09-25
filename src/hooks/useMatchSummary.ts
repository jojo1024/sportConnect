import { useState } from 'react';
import { Alert } from 'react-native';
import { useAppSelector } from '../store/hooks/hooks';
import { selectUser } from '../store/slices/userSlice';
import { matchService } from '../services/matchService';
import { Match } from '../services/matchService';

interface UseMatchSummaryProps {
    match: Match;
    navigation: any;
}

interface SuccessData {
    matchCode: string;
    participantsCount: number;
    prixPaye: number;
}

/**
 * Hook personnalisé pour gérer le résumé et la finalisation d'un match
 * Fournit une interface pour gérer le processus de paiement et de participation
 * 
 * Fonctionnalités principales :
 * - Validation de l'authentification utilisateur
 * - Gestion de l'acceptation des conditions
 * - Traitement du paiement et participation
 * - Affichage des données de succès
 * - Gestion des erreurs de paiement
 * 
 * @param match - Objet match contenant les informations du match
 * @param navigation - Objet de navigation React Navigation
 * @returns {Object} Objet contenant l'état et les méthodes de gestion
 */
export const useMatchSummary = ({ match, navigation }: UseMatchSummaryProps) => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<SuccessData | null>(null);
    
    const user = useAppSelector(selectUser);

    /**
     * Valide que l'utilisateur est bien authentifié
     * @returns {boolean} True si l'utilisateur est connecté
     */
    const validateUserAuthentication = (): boolean => {
        if (!user?.utilisateurId) {
            Alert.alert('Erreur', 'Utilisateur non connecté.');
            return false;
        }
        return true;
    };

    /**
     * Valide que l'utilisateur a accepté les conditions
     * @returns {boolean} True si les conditions sont acceptées
     */
    const validateTermsAcceptance = (): boolean => {
        if (!acceptedTerms) {
            Alert.alert('Conditions requises', 'Veuillez accepter les termes et conditions pour continuer.');
            return false;
        }
        return true;
    };

    /**
     * Gère le processus de paiement et de participation au match
     * Valide les conditions et effectue l'appel API
     */
    const handlePayment = async (): Promise<void> => {
        if (!validateTermsAcceptance() || !validateUserAuthentication()) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const result = await matchService.participateInMatch(match.matchId, user?.utilisateurId!);
            console.log('🚀 ~ handlePayment ~ result:', result);

            setSuccessData(result.data);
            setShowSuccessCard(true);
        } catch (error: any) {
            console.error('Erreur lors du paiement:', error);
            
            const errorMessage = error?.response?.data?.message || 
                               error?.message || 
                               'Une erreur est survenue lors du paiement.';
            
            setErrorMessage(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Gère la fermeture de l'écran de succès
     * Navigue vers l'écran principal et efface les messages d'erreur
     */
    const handleSuccessClose = (): void => {
        setShowSuccessCard(false);
        setErrorMessage(null);
        navigation.navigate('MainTabs');
    };

    /**
     * Réessaie le processus de paiement en cas d'erreur
     */
    const handleRetry = (): void => {
        setErrorMessage(null);
        handlePayment();
    };

    /**
     * Bascule l'état d'acceptation des conditions
     */
    const toggleTermsAcceptance = (): void => {
        setAcceptedTerms(!acceptedTerms);
    };

    /**
     * Efface le message d'erreur affiché
     */
    const clearError = (): void => {
        setErrorMessage(null);
    };

    return {
        // États
        acceptedTerms,
        isProcessing,
        showSuccessCard,
        errorMessage,
        successData,
        user,
        
        // Actions
        handlePayment,
        handleSuccessClose,
        handleRetry,
        toggleTermsAcceptance,
        clearError,
        
        // Validation
        validateUserAuthentication,
        validateTermsAcceptance,
    };
}; 