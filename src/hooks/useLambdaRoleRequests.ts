import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'react-native';
import { selectUser, updateUser } from '../store/slices/userSlice';
import { roleRequestService, RoleRequest } from '../services/roleRequestService';

export interface LambdaRoleRequestState {
    hasPendingRequest: boolean;
    currentRequest: RoleRequest | null;
    isLoading: boolean;
    error: string | null;
}

export const useLambdaRoleRequests = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    
    const [state, setState] = useState<LambdaRoleRequestState>({
        hasPendingRequest: false,
        currentRequest: null,
        isLoading: false,
        error: null
    });

    // Vérifier le statut des demandes de rôle
    const checkRoleRequestStatus = useCallback(async () => {
        if (!user?.utilisateurId) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            console.log('🔍 Vérification du statut des demandes de rôle...');
            
            const response = await roleRequestService.getPendingRoleRequestsByUserId(user.utilisateurId);
            const hasPendingRequest = response && response.length > 0;
            const currentRequest = hasPendingRequest ? response[0] : null;
            
            setState({
                hasPendingRequest,
                currentRequest,
                isLoading: false,
                error: null
            });

            console.log('📊 Statut des demandes:', { hasPendingRequest, currentRequest });
            return { hasPendingRequest, currentRequest };
        } catch (error: any) {
            console.error('❌ Erreur lors de la vérification des demandes:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Erreur lors de la vérification des demandes'
            }));
            return { hasPendingRequest: false, currentRequest: null };
        }
    }, [user?.utilisateurId]);

    // Demander le rôle capo
    const requestCapoRole = useCallback(async () => {
        if (!user?.utilisateurId) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            console.log('🎯 Demande du rôle Capo...');
            
            const newRequest = await roleRequestService.createRoleRequest({
                utilisateurId: user.utilisateurId,
                requestedRole: 'capo'
            });

            setState(prev => ({
                ...prev,
                hasPendingRequest: true,
                currentRequest: newRequest,
                isLoading: false,
                error: null
            }));

            console.log('✅ Demande Capo créée avec succès');
            return newRequest;
        } catch (error: any) {
            console.error('❌ Erreur lors de la demande Capo:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Erreur lors de la demande Capo'
            }));
            throw error;
        }
    }, [user?.utilisateurId]);

    // Demander le rôle gerant
    const requestGerantRole = useCallback(async () => {
        if (!user?.utilisateurId) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            console.log('🎯 Demande du rôle Gérant...');
            
            const newRequest = await roleRequestService.createRoleRequest({
                utilisateurId: user.utilisateurId,
                requestedRole: 'gerant'
            });

            setState(prev => ({
                ...prev,
                hasPendingRequest: true,
                currentRequest: newRequest,
                isLoading: false,
                error: null
            }));

            console.log('✅ Demande Gérant créée avec succès');
            return newRequest;
        } catch (error: any) {
            console.error('❌ Erreur lors de la demande Gérant:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Erreur lors de la demande Gérant'
            }));
            throw error;
        }
    }, [user?.utilisateurId]);

    // Annuler une demande de rôle
    const cancelRoleRequest = useCallback(async () => {
        if (!user?.utilisateurId) return;

        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            console.log('🗑️ Annulation de la demande de rôle...');
            
            await roleRequestService.cancelRoleRequest(user.utilisateurId);

            setState(prev => ({
                ...prev,
                hasPendingRequest: false,
                currentRequest: null,
                isLoading: false,
                error: null
            }));

            console.log('✅ Demande annulée avec succès');
            return true;
        } catch (error: any) {
            console.error('❌ Erreur lors de l\'annulation:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error.message || 'Erreur lors de l\'annulation'
            }));
            throw error;
        }
    }, [user?.utilisateurId]);

    // Changer de demande (annuler l'ancienne et créer une nouvelle)
    const changeRoleRequest = useCallback(async (newRole: 'capo' | 'gerant') => {
        if (!user?.utilisateurId) return;

        try {
            console.log(`🔄 Changement de demande vers ${newRole}...`);
            
            // 1. Annuler l'ancienne demande si elle existe
            if (state.hasPendingRequest) {
                await cancelRoleRequest();
            }

            // 2. Créer la nouvelle demande
            if (newRole === 'capo') {
                return await requestCapoRole();
            } else {
                return await requestGerantRole();
            }
        } catch (error) {
            console.error('❌ Erreur lors du changement de demande:', error);
            throw error;
        }
    }, [user?.utilisateurId, state.hasPendingRequest, cancelRoleRequest, requestCapoRole, requestGerantRole]);

    // Vérification automatique lors du retour de l'app
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active' && user?.utilisateurId) {
                console.log('📱 App revenue au premier plan - vérification des demandes');
                checkRoleRequestStatus();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        
        return () => {
            subscription?.remove();
        };
    }, [user?.utilisateurId]);

    // Vérification initiale au chargement
    useEffect(() => {
        if (user?.utilisateurId) {
            console.log('🚀 Chargement initial - vérification des demandes');
            checkRoleRequestStatus();
        }
    }, [user?.utilisateurId]);

    // Fonctions utilitaires
    const canRequestCapo = !state.hasPendingRequest && !state.isLoading;
    const canRequestGerant = !state.hasPendingRequest && !state.isLoading;
    const canCancelRequest = state.hasPendingRequest && !state.isLoading;
    const canChangeRequest = state.hasPendingRequest && !state.isLoading;

    return {
        // État
        ...state,
        
        // Actions
        checkRoleRequestStatus,
        requestCapoRole,
        requestGerantRole,
        cancelRoleRequest,
        changeRoleRequest,
        
        // Utilitaires
        canRequestCapo,
        canRequestGerant,
        canCancelRequest,
        canChangeRequest,
        
        // Informations sur la demande actuelle
        currentRequestRole: state.currentRequest?.requestedRole,
        currentRequestStatus: state.currentRequest?.status,
        currentRequestDate: state.currentRequest?.requestDate
    };
};

