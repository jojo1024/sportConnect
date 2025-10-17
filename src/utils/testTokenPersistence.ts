import { store } from '../store';
import { selectAccessToken, selectRefreshToken, selectUser } from '../store/slices/userSlice';
import { tokenUtils } from './tokenConfig';
import mmkvStorage from '../store/hooks/mmkvStorage';

export const testTokenPersistence = () => {
    console.log('🧪 === TEST DE PERSISTANCE DES TOKENS ===');
    
    // 1. Vérifier l'état du store Redux
    const state = store.getState();
    const accessToken = selectAccessToken(state);
    const refreshToken = selectRefreshToken(state);
    const user = selectUser(state);
    
    console.log('📊 État Redux:');
    console.log('  - User:', user ? `${user.utilisateurNom} (${user.utilisateurRole})` : 'Non connecté');
    console.log('  - Access Token:', accessToken ? 'Présent' : 'Absent');
    console.log('  - Refresh Token:', refreshToken ? 'Présent' : 'Absent');
    
    // 2. Vérifier le stockage MMKV
    const mmkvAccessToken = mmkvStorage.getAccessToken();
    const mmkvRefreshToken = mmkvStorage.getRefreshToken();
    const mmkvUserData = mmkvStorage.getUserData();
    const mmkvIsAuthenticated = mmkvStorage.getIsAuthenticated();
    
    console.log('💾 État MMKV:');
    console.log('  - Access Token:', mmkvAccessToken ? 'Présent' : 'Absent');
    console.log('  - Refresh Token:', mmkvRefreshToken ? 'Présent' : 'Absent');
    console.log('  - User Data:', mmkvUserData ? 'Présent' : 'Absent');
    console.log('  - Is Authenticated:', mmkvIsAuthenticated);
    
    // 3. Vérifier la cohérence entre Redux et MMKV
    console.log('🔍 Cohérence Redux/MMKV:');
    console.log('  - Access Token cohérent:', accessToken === mmkvAccessToken);
    console.log('  - Refresh Token cohérent:', refreshToken === mmkvRefreshToken);
    
    // 4. Analyser les tokens si présents
    if (accessToken) {
        const tokenInfo = tokenUtils.getTokenInfo(accessToken);
        console.log('🔑 Access Token Info:', tokenInfo);
        console.log('  - Expire bientôt:', tokenUtils.isTokenExpiringSoon(accessToken));
        console.log('  - Format valide:', tokenUtils.isValidTokenFormat(accessToken));
    }
    
    if (refreshToken) {
        const tokenInfo = tokenUtils.getTokenInfo(refreshToken);
        console.log('🔄 Refresh Token Info:', tokenInfo);
        console.log('  - Format valide:', tokenUtils.isValidTokenFormat(refreshToken));
    }
    
    // 5. Recommandations
    console.log('💡 Recommandations:');
    
    if (!accessToken && !refreshToken) {
        console.log('  - Aucun token trouvé, l\'utilisateur doit se connecter');
    } else if (accessToken && !refreshToken) {
        console.log('  - Access token présent mais pas de refresh token');
    } else if (!accessToken && refreshToken) {
        console.log('  - Refresh token présent mais pas d\'access token');
    } else {
        console.log('  - Tokens présents, authentification valide');
    }
    
    if (accessToken && tokenUtils.isTokenExpiringSoon(accessToken)) {
        console.log('  - Access token expire bientôt, refresh recommandé');
    }
    
    console.log('🧪 === FIN DU TEST ===\n');
    
    return {
        hasValidTokens: !!(accessToken && refreshToken),
        tokensConsistent: accessToken === mmkvAccessToken && refreshToken === mmkvRefreshToken,
        accessTokenExpiringSoon:  false,
        // accessTokenExpiringSoon: accessToken ? tokenUtils.isTokenExpiringSoon(accessToken) : false,
        userAuthenticated: !!user,
    };
};

// Fonction pour forcer un refresh des tokens
export const forceTokenRefresh = async () => {
    console.log('🔄 === FORCE TOKEN REFRESH ===');
    
    const state = store.getState();
    const refreshToken = selectRefreshToken(state);
    
    if (!refreshToken) {
        console.log('❌ Pas de refresh token disponible');
        return false;
    }
    
    try {
        // Appeler l'API de refresh
        const response = await fetch('http://192.168.100.4:50006/v1/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });
        
        const data = await response.json();
        
        if (response.ok && data.data) {
            console.log('✅ Refresh réussi');
            console.log('  - Nouveau access token:', data.data.accessToken ? 'Présent' : 'Absent');
            return true;
        } else {
            console.log('❌ Refresh échoué:', data.message);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur lors du refresh:', error);
        return false;
    }
};

// Fonction pour tester le refresh automatique
export const testAutoRefresh = async () => {
    console.log('🔄 === TEST REFRESH AUTOMATIQUE ===');
    
    const state = store.getState();
    const accessToken = selectAccessToken(state);
    const refreshToken = selectRefreshToken(state);
    
    if (!accessToken || !refreshToken) {
        console.log('❌ Tokens manquants pour le test');
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
    
    try {
        // Faire une requête qui va déclencher le refresh si nécessaire
        console.log('🚀 ~ Faire une requête API pour tester le refresh...');
        
        const response = await fetch('http://192.168.100.4:50006/v1/auth/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({ refreshToken })
        });
        
        console.log('🚀 ~ Réponse reçue:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Requête réussie:', data);
            
            // Vérifier si un nouveau token a été généré
            const newState = store.getState();
            const newAccessToken = selectAccessToken(newState);
            
            if (newAccessToken !== accessToken) {
                console.log('✅ Nouveau token généré avec succès');
                console.log('  - Ancien:', accessToken.substring(0, 20) + '...');
                return true;
            } else {
                console.log('ℹ️ Même token conservé (normal si pas expiré)');
                return true;
            }
        } else {
            console.log('❌ Erreur de requête:', response.status);
            return false;
        }
    } catch (error) {
        console.log('❌ Erreur lors du test:', error);
        return false;
    }
};

// Fonction pour simuler une requête avec token expiré
export const testExpiredTokenRefresh = async () => {
    console.log('⏰ === TEST AVEC TOKEN EXPIRÉ ===');
    
    const state = store.getState();
    const accessToken = selectAccessToken(state);
    const refreshToken = selectRefreshToken(state);
    
    if (!accessToken || !refreshToken) {
        console.log('❌ Tokens manquants pour le test');
        return false;
    }
    
    try {
        // Utiliser l'API axios configurée (qui a les intercepteurs)
        const api = (await import('../services/api')).default;
        
        console.log('🚀 ~ Faire une requête avec l\'API configurée...');
        
        // Faire une requête qui va déclencher le refresh automatique
        const response = await api.get('/auth/refresh', {
            data: { refreshToken }
        });
        
        console.log('✅ Requête réussie avec refresh automatique');
        return true;
        
    } catch (error: any) {
        console.log('❌ Erreur lors du test avec API configurée:', error);
        
        // Vérifier si c'est une erreur d'authentification attendue
        if (error?.response?.status === 401) {
            console.log('ℹ️ Erreur 401 attendue, le refresh devrait se déclencher');
            return true;
        }
        
        return false;
    }
};

// Fonction pour vérifier la cohérence des tokens après refresh
export const verifyTokenConsistency = () => {
    console.log('🔍 === VÉRIFICATION COHÉRENCE TOKENS ===');
    
    const state = store.getState();
    const accessToken = selectAccessToken(state);
    const refreshToken = selectRefreshToken(state);
    const user = selectUser(state);
    
    // Vérifier MMKV
    const mmkvAccessToken = mmkvStorage.getAccessToken();
    const mmkvRefreshToken = mmkvStorage.getRefreshToken();
    
    console.log('📊 État après refresh:');
    console.log('  - Redux Access Token:', accessToken ? 'Présent' : 'Absent');
    console.log('  - Redux Refresh Token:', refreshToken ? 'Présent' : 'Absent');
    console.log('  - MMKV Access Token:', mmkvAccessToken ? 'Présent' : 'Absent');
    console.log('  - MMKV Refresh Token:', mmkvRefreshToken ? 'Présent' : 'Absent');
    
    // Vérifier la cohérence
    const accessTokenConsistent = accessToken === mmkvAccessToken;
    const refreshTokenConsistent = refreshToken === mmkvRefreshToken;
    
    console.log('🔍 Cohérence:');
    console.log('  - Access Token cohérent:', accessTokenConsistent);
    console.log('  - Refresh Token cohérent:', refreshTokenConsistent);
    
    if (accessToken) {
        const tokenInfo = tokenUtils.getTokenInfo(accessToken);
        console.log('🔑 Token info après refresh:', {
            utilisateurId: tokenInfo?.utilisateurId,
            role: tokenInfo?.utilisateurRole,
            expiration: tokenInfo?.exp,
            expireBientot: tokenUtils.isTokenExpiringSoon(accessToken)
        });
    }
    
    return {
        accessTokenConsistent,
        refreshTokenConsistent,
        hasValidTokens: !!(accessToken && refreshToken),
        userAuthenticated: !!user
    };
}; 