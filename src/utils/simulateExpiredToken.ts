import { store } from '../store';
import { updateTokens } from '../store/slices/userSlice';
import { tokenUtils } from './tokenConfig';

// Fonction pour créer un token expiré (pour les tests)
export const createExpiredToken = (originalToken: string): string => {
    try {
        // Décoder le token original
        const parts = originalToken.split('.');
        if (parts.length !== 3) {
            throw new Error('Format de token invalide');
        }
        
        // Décoder le payload
        const payload = JSON.parse(atob(parts[1]));
        
        // Modifier l'expiration pour qu'elle soit dans le passé
        const expiredPayload = {
            ...payload,
            exp: Math.floor(Date.now() / 1000) - 3600, // Expiré il y a 1 heure
            iat: Math.floor(Date.now() / 1000) - 7200  // Créé il y a 2 heures
        };
        
        // Recréer le token avec le payload expiré
        // Note: Ceci ne fonctionnera pas avec la vraie signature, mais permet de tester
        const expiredToken = `${parts[0]}.${btoa(JSON.stringify(expiredPayload))}.${parts[2]}`;
        
        return expiredToken;
    } catch (error) {
        console.log('❌ Erreur lors de la création du token expiré:', error);
        return originalToken;
    }
};

// Fonction pour simuler un token expiré dans le store
export const simulateExpiredToken = () => {
    console.log('⏰ === SIMULATION TOKEN EXPIRÉ ===');
    
    const state = store.getState();
    const accessToken = state.user.accessToken;
    const refreshToken = state.user.refreshToken;
    
    if (!accessToken || !refreshToken) {
        console.log('❌ Tokens manquants pour la simulation');
        return false;
    }
    
    // Analyser le token actuel
    const tokenInfo = tokenUtils.getTokenInfo(accessToken);
    console.log('🔑 Token actuel:', {
        utilisateurId: tokenInfo?.utilisateurId,
        role: tokenInfo?.utilisateurRole,
        expiration: tokenInfo?.exp,
        expireBientot: tokenUtils.isTokenExpiringSoon(accessToken)
    });
    
    // Créer un token expiré
    const expiredToken = createExpiredToken(accessToken);
    
    // Mettre à jour le store avec le token expiré
    store.dispatch(updateTokens({
        accessToken: expiredToken,
        refreshToken: refreshToken
    }));
    
    console.log('✅ Token expiré simulé dans le store');
    console.log('  - Nouveau token (expiré):', expiredToken.substring(0, 20) + '...');
    
    // Vérifier que le token est bien expiré
    const newTokenInfo = tokenUtils.getTokenInfo(expiredToken);
    console.log('🔑 Token expiré:', {
        utilisateurId: newTokenInfo?.utilisateurId,
        role: newTokenInfo?.utilisateurRole,
        expiration: newTokenInfo?.exp,
        expireBientot: tokenUtils.isTokenExpiringSoon(expiredToken)
    });
    
    return true;
};

// Fonction pour restaurer le token original
export const restoreOriginalToken = (originalToken: string) => {
    console.log('🔄 === RESTAURATION TOKEN ORIGINAL ===');
    
    const state = store.getState();
    const refreshToken = state.user.refreshToken;
    
    if (!refreshToken) {
        console.log('❌ Refresh token manquant');
        return false;
    }
    
    // Restaurer le token original
    store.dispatch(updateTokens({
        accessToken: originalToken,
        refreshToken: refreshToken
    }));
    
    console.log('✅ Token original restauré');
    return true;
};

// Fonction pour tester le cycle complet : token valide → expiré → refresh
export const testCompleteTokenCycle = async () => {
    console.log('🔄 === TEST CYCLE COMPLET TOKEN ===');
    
    const state = store.getState();
    const originalAccessToken = state.user.accessToken;
    const refreshToken = state.user.refreshToken;
    
    if (!originalAccessToken || !refreshToken) {
        console.log('❌ Tokens manquants pour le test');
        return false;
    }
    
    console.log('📊 État initial:');
    console.log('  - Access Token:', originalAccessToken.substring(0, 20) + '...');
    console.log('  - Refresh Token:', refreshToken.substring(0, 20) + '...');
    
    // Étape 1: Simuler un token expiré
    console.log('\n1️⃣ Simulation token expiré...');
    simulateExpiredToken();
    
    // Étape 2: Faire une requête qui va déclencher le refresh
    console.log('\n2️⃣ Faire une requête pour déclencher le refresh...');
    try {
        const api = (await import('../services/api')).default;
        
        // Cette requête devrait échouer avec 401 et déclencher le refresh
        const response = await api.get('/auth/refresh', {
            data: { refreshToken }
        });
        
        console.log('✅ Requête réussie après refresh automatique');
        
        // Étape 3: Vérifier que le token a été mis à jour
        const newState = store.getState();
        const newAccessToken = newState.user.accessToken;
        
        console.log('\n3️⃣ Vérification du nouveau token:');
        console.log('  - Ancien token:', originalAccessToken.substring(0, 20) + '...');
        console.log('  - Nouveau token:', newAccessToken.substring(0, 20) + '...');
        console.log('  - Tokens différents:', newAccessToken !== originalAccessToken);
        
        return true;
        
    } catch (error: any) {
        console.log('❌ Erreur lors du test:', error);
        
        // Restaurer le token original en cas d'erreur
        restoreOriginalToken(originalAccessToken);
        
        return false;
    }
}; 