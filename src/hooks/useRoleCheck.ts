import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { AppState } from 'react-native';
import { selectUser, updateUser } from '../store/slices/userSlice';
import { authService } from '../services/authService';
import { roleRequestService } from '../services/roleRequestService';

export const useRoleCheck = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(selectUser);
    
    // État pour le modal de reconnexion
    const [showRoleChangeModal, setShowRoleChangeModal] = useState(false);
    const [newRole, setNewRole] = useState<string>('');

    const checkRoleUpdate = useCallback(async () => {
        if (!user?.utilisateurId) return;

        try {
            console.log('🔍 Vérification du rôle utilisateur...');
            console.log('👤 Rôle actuel dans le store:', user.utilisateurRole);
            
            // 1. Récupérer toutes les demandes de rôle de l'utilisateur
            const allRequests = await roleRequestService.getRoleRequestsByUserId(user.utilisateurId);
            console.log('📋 Toutes les demandes:', allRequests.map(r => ({ id: r.requestId, status: r.status, requestedRole: r.requestedRole })));
            
            // 2. Vérifier s'il y a des demandes approuvées récemment
            const approvedRequests = allRequests.filter(request => {
                const isApproved = request.status === 'approved';
                const hasProcessedDate = request.processedDate;
                const isRecent = hasProcessedDate && request.processedDate && new Date(request.processedDate) > new Date(Date.now() - 24 * 60 * 60 * 1000);
                
                console.log(`🔍 Demande ${request.requestId}:`, {
                    isApproved,
                    hasProcessedDate,
                    isRecent,
                    requestedRole: request.requestedRole,
                    currentRole: user.utilisateurRole
                });
                
                return isApproved && hasProcessedDate && isRecent;
            });
            
            console.log('✅ Demandes approuvées récentes:', approvedRequests.length);
            
            if (approvedRequests.length > 0) {
                const latestApprovedRequest = approvedRequests[0];
                const newRole = latestApprovedRequest.requestedRole;
                
                // 3. Vérifier si l'utilisateur n'a pas déjà ce rôle
                if (user.utilisateurRole !== newRole) {
                    console.log('🎉 Changement de rôle détecté:', {
                        ancien: user.utilisateurRole,
                        nouveau: newRole,
                        requestId: latestApprovedRequest.requestId
                    });
                    
                    // 4. Mettre à jour le store Redux
                    dispatch(updateUser({ 
                        utilisateurRole: newRole as 'lambda' | 'capo' | 'gerant'
                    }));
                    
                    // 5. Afficher le modal de reconnexion
                    setNewRole(newRole);
                    setShowRoleChangeModal(true);
                    
                    console.log(`🎊 Félicitations ! Vous êtes maintenant ${newRole}`);
                    
                    return true; // Rôle mis à jour
                } else {
                    console.log('ℹ️ L\'utilisateur a déjà le rôle', newRole);
                }
            }
            
            return false; // Pas de changement
        } catch (error) {
            console.error('❌ Erreur lors de la vérification du rôle:', error);
            return false;
        }
    }, [user?.utilisateurId, user?.utilisateurRole, dispatch]);

    // Vérification lors des actions utilisateur
    const checkRoleOnAction = useCallback(async () => {
        return await checkRoleUpdate();
    }, [checkRoleUpdate]);


    // Vérification lors du retour de l'app
    useEffect(() => {
        const handleAppStateChange = (nextAppState: string) => {
            if (nextAppState === 'active' && user?.utilisateurId) {
                console.log('📱 App revenue au premier plan - vérification du rôle');
                checkRoleUpdate();
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        
        return () => {
            subscription?.remove();
        };
    }, [user?.utilisateurId]);

    // Vérification lors du focus de l'écran
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            if (user?.utilisateurId) {
                console.log('🎯 Écran en focus - vérification du rôle');
                checkRoleUpdate();
            }
        });

        return unsubscribe;
    }, [navigation, user?.utilisateurId]);

    // Fonction pour gérer la reconnexion
    const handleReconnect = useCallback(() => {
        setShowRoleChangeModal(false);
        console.log('🔄 Redirection vers l\'écran d\'accueil pour accéder aux nouvelles fonctionnalités...');
        // Rediriger vers l'écran d'accueil des matchs
        navigation.navigate('MainTabs' as never);
    }, [navigation]);

    // Fonction pour fermer le modal
    const closeRoleChangeModal = useCallback(() => {
        setShowRoleChangeModal(false);
    }, []);

    return {
        checkRoleUpdate,
        checkRoleOnAction,
        // État du modal
        showRoleChangeModal,
        newRole,
        // Actions du modal
        handleReconnect,
        closeRoleChangeModal
    };
};
