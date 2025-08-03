// Script de test pour vérifier les notifications d'erreur de 3 secondes
// Ce script simule une erreur serveur pour tester l'affichage des notifications

console.log('🧪 Test des notifications d\'erreur de 3 secondes');
console.log('==============================================');

// Simulation d'une erreur serveur
const simulateServerError = () => {
    const error = {
        response: {
            data: {
                message: 'Erreur de connexion au serveur - Service temporairement indisponible'
            }
        }
    };

    console.log('❌ Erreur simulée:', error.response.data.message);
    console.log('📱 Notification d\'erreur de 3 secondes devrait s\'afficher...');

    return error;
};

// Test de la fonction showAutoClose
const testShowAutoClose = () => {
    console.log('🔍 Test de la fonction showAutoClose...');

    // Simuler l'appel de showAutoClose
    const showAutoClose = (title, message, type, delay) => {
        console.log(`✅ Notification affichée:`);
        console.log(`   - Titre: ${title}`);
        console.log(`   - Message: ${message}`);
        console.log(`   - Type: ${type}`);
        console.log(`   - Délai: ${delay}ms`);
        console.log(`   - Auto-fermeture: Oui`);
    };

    const error = simulateServerError();
    const errorMsg = error?.response?.data?.message || 'Erreur inconnue';

    showAutoClose(
        'Erreur de chargement',
        errorMsg,
        'error',
        3000
    );
};

// Exécuter le test
testShowAutoClose();

console.log('\n📋 Instructions pour tester dans l\'app:');
console.log('1. Ouvrir l\'écran des statistiques');
console.log('2. Simuler une erreur réseau (désactiver le WiFi)');
console.log('3. Essayer de charger les données');
console.log('4. Vérifier qu\'une notification rouge apparaît pendant 3 secondes');
console.log('5. La notification doit se fermer automatiquement');

console.log('\n🎯 Points à vérifier:');
console.log('- La notification apparaît immédiatement');
console.log('- Le titre est "Erreur de chargement"');
console.log('- Le message contient l\'erreur du serveur');
console.log('- L\'icône est rouge (type: error)');
console.log('- La notification disparaît après 3 secondes');
console.log('- Pas de bouton "OK" visible (auto-fermeture)'); 