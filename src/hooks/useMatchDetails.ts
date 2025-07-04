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

export const useMatchDetails = ({ match, navigation }: UseMatchDetailsProps): UseMatchDetailsReturn => {
    // États
    const [isJoining, setIsJoining] = useState(false);
    const [participants, setParticipants] = useState<MatchParticipant[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [errorParticipants, setErrorParticipants] = useState<string | null>(null);

    // Mémoisation
    const isMatchFull = useMemo(() => 
        match.nbreJoueursInscrits >= match.joueurxMax, 
        [match.nbreJoueursInscrits, match.joueurxMax]
    );

    const participantsCount = useMemo(() => ({
        current: participants.length,
        max: match.joueurxMax
    }), [participants.length, match.joueurxMax]);

    // Callbacks
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

    const handleRetryParticipants = useCallback(() => {
        fetchParticipants();
    }, [fetchParticipants]);

    // Effets
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

 