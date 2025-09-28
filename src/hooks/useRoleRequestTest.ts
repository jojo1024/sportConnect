import { useState, useCallback } from 'react';
import { useLambdaRoleRequests } from './useLambdaRoleRequests';
import { useRoleCheck } from './useRoleCheck';

export const useRoleRequestTest = () => {
    const [testMode, setTestMode] = useState(false);
    
    // Hooks pour les demandes de rôles
    const lambdaRoleRequests = useLambdaRoleRequests();
    
    // Hook pour la vérification de rôle
    const roleCheck = useRoleCheck();

    // Fonction pour simuler un changement de rôle (pour les tests)
    const simulateRoleChange = useCallback((newRole: string) => {
        console.log(`🧪 Simulation du changement de rôle vers: ${newRole}`);
        // Ici vous pouvez simuler un changement de rôle pour les tests
        // En production, cela se ferait via l'approbation admin
    }, []);

    // Fonction pour tester le flux complet
    const testCompleteFlow = useCallback(async () => {
        console.log('🧪 Test du flux complet des demandes de rôles...');
        
        try {
            // 1. Vérifier le statut initial
            await lambdaRoleRequests.checkRoleRequestStatus();
            console.log('✅ Statut initial vérifié');
            
            // 2. Simuler une demande capo
            if (lambdaRoleRequests.canRequestCapo) {
                await lambdaRoleRequests.requestCapoRole();
                console.log('✅ Demande capo créée');
            }
            
            // 3. Simuler un changement de demande
            if (lambdaRoleRequests.canChangeRequest) {
                await lambdaRoleRequests.changeRoleRequest('gerant');
                console.log('✅ Demande changée pour gerant');
            }
            
            // 4. Simuler l'annulation
            if (lambdaRoleRequests.canCancelRequest) {
                await lambdaRoleRequests.cancelRoleRequest();
                console.log('✅ Demande annulée');
            }
            
            console.log('🎉 Test du flux complet terminé avec succès');
        } catch (error) {
            console.error('❌ Erreur lors du test:', error);
        }
    }, [lambdaRoleRequests]);

    // Fonction pour tester la vérification de rôle
    const testRoleCheck = useCallback(async () => {
        console.log('🧪 Test de la vérification de rôle...');
        
        try {
            const hasRoleChanged = await roleCheck.checkRoleOnAction();
            console.log(`✅ Vérification de rôle: ${hasRoleChanged ? 'Changement détecté' : 'Aucun changement'}`);
        } catch (error) {
            console.error('❌ Erreur lors de la vérification:', error);
        }
    }, [roleCheck]);

    return {
        // État des demandes de rôles
        ...lambdaRoleRequests,
        
        // État de la vérification de rôle
        ...roleCheck,
        
        // Mode test
        testMode,
        setTestMode,
        
        // Fonctions de test
        simulateRoleChange,
        testCompleteFlow,
        testRoleCheck,
        
        // Informations de debug
        debugInfo: {
            hasPendingRequest: lambdaRoleRequests.hasPendingRequest,
            currentRequest: lambdaRoleRequests.currentRequest,
            isLoading: lambdaRoleRequests.isLoading,
            error: lambdaRoleRequests.error,
            showRoleChangeModal: roleCheck.showRoleChangeModal,
            newRole: roleCheck.newRole
        }
    };
};

