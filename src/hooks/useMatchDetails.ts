import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { Match, matchService, MatchParticipant } from '../services/matchService';

interface UseMatchDetailsProps {
    match: Match;
    navigation: any;
}

interface UseMatchDetailsReturn {
    // États
    isJoining: boolean;
    participants: MatchParticipant[];
    loadingParticipants: boolean;
    errorParticipants: string | null;
    
    // Calculs mémorisés
    isMatchFull: boolean;
    participantsCount: {
        current: number;
        max: number;
    };
    
    // Fonctions
    handleJoinMatch: () => Promise<void>;
    handleRetryParticipants: () => void;
}

/**
 * Hook personnalisé pour gérer les détails d'un match
 * Fournit une interface pour afficher les informations détaillées d'un match
 * et gérer les interactions utilisateur
 * 
 * Fonctionnalités principales :
 * - Chargement des participants du match
 * - Vérification si le match est complet
 * - Gestion de la participation au match
 * - Calculs mémorisés pour les performances
 * 
 * @param match - Objet match contenant les informations du match
 * @param navigation - Objet de navigation React Navigation
 * @returns {UseMatchDetailsReturn} Objet contenant l'état et les méthodes de gestion
 */
export const useMatchDetails = ({ match, navigation }: UseMatchDetailsProps): UseMatchDetailsReturn => {
    // États
    const [isJoining, setIsJoining] = useState(false);
    const [participants, setParticipants] = useState<MatchParticipant[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [errorParticipants, setErrorParticipants] = useState<string | null>(null);

    // Mémoisation
    /**
     * Vérifie si le match est complet (nombre maximum de participants atteint)
     */
    const isMatchFull = useMemo(() => 
        match.nbreJoueursInscrits >= match.joueurxMax, 
        [match.nbreJoueursInscrits, match.joueurxMax]
    );

    /**
     * Calcule le nombre actuel et maximum de participants
     */
    const participantsCount = useMemo(() => ({
        current: participants.length,
        max: match.joueurxMax
    }), [participants.length, match.joueurxMax]);

    // Callbacks
    /**
     * Récupère la liste des participants du match depuis l'API
     */
    const fetchParticipants = useCallback(async () => {
        setLoadingParticipants(true);
        setErrorParticipants(null);
        try {
            const data = await matchService.fetchMatchParticipants(match.matchId);
            setParticipants(data);
        } catch (err: any) {
            setErrorParticipants('Erreur lors du chargement des participants');
        } finally {
            setLoadingParticipants(false);
        }
    }, [match.matchId]);

    /**
     * Gère l'action de rejoindre le match
     * Navigue vers l'écran de résumé du match pour finaliser la participation
     */
    const handleJoinMatch = useCallback(async () => {
        setIsJoining(true);
        try {
            navigation.navigate('MatchSummary', { match });
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de rejoindre la partie pour le moment.');
        } finally {
            setIsJoining(false);
        }
    }, [match, navigation]);

    /**
     * Réessaie de charger les participants en cas d'erreur
     */
    const handleRetryParticipants = useCallback(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    // Effets
    /**
     * Charge les participants au montage du composant
     */
    useEffect(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    return {
        // États
        isJoining,
        participants,
        loadingParticipants,
        errorParticipants,
        
        // Calculs mémorisés
        isMatchFull,
        participantsCount,
        
        // Fonctions
        handleJoinMatch,
        handleRetryParticipants,
    };
};

 