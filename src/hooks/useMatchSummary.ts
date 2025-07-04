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

export const useMatchSummary = ({ match, navigation }: UseMatchSummaryProps) => {
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<SuccessData | null>(null);
    
    const user = useAppSelector(selectUser);

    const validateUserAuthentication = (): boolean => {
        if (!user?.utilisateurId) {
            Alert.alert('Erreur', 'Utilisateur non connecté.');
            return false;
        }
        return true;
    };

    const validateTermsAcceptance = (): boolean => {
        if (!acceptedTerms) {
            Alert.alert('Conditions requises', 'Veuillez accepter les termes et conditions pour continuer.');
            return false;
        }
        return true;
    };

    const handlePayment = async (): Promise<void> => {
        if (!validateTermsAcceptance() || !validateUserAuthentication()) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);

        try {
            const result = await matchService.participateInMatch(match.matchId);
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

    const handleSuccessClose = (): void => {
        setShowSuccessCard(false);
        setErrorMessage(null);
        navigation.navigate('MainTabs');
    };

    const handleRetry = (): void => {
        setErrorMessage(null);
        handlePayment();
    };

    const toggleTermsAcceptance = (): void => {
        setAcceptedTerms(!acceptedTerms);
    };

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