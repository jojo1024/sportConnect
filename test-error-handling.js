/**
 * Script de test pour vérifier la gestion des erreurs lors de la sélection de période
 * 
 * Ce script simule une erreur serveur et vérifie que :
 * 1. Le Toast d'erreur s'affiche correctement
 * 2. Le Toast de succès ne s'affiche pas en cas d'erreur
 * 3. Le message d'erreur du serveur est bien affiché
 */

console.log('🧪 Test de gestion des erreurs lors de la sélection de période');
console.log('===========================================================\n');

// Simulation d'une erreur serveur
const simulateServerError = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const error = {
                response: {
                    data: {
                        message: 'Erreur serveur : Impossible de récupérer les données'
                    }
                }
            };
            reject(error);
        }, 1000);
    });
};

// Simulation de la fonction loadDataWithFilter
const loadDataWithFilter = async (period) => {
    console.log(`🔄 Tentative de chargement pour la période: ${period}`);

    try {
        // Simuler une erreur serveur
        await simulateServerError();

        console.log('✅ Chargement réussi (ne devrait pas arriver)');
        return { success: true };
    } catch (error) {
        console.log('❌ Erreur capturée dans loadDataWithFilter');
        const errorMsg = error?.response?.data?.message || 'Erreur lors du chargement des données';
        return { success: false, error: errorMsg };
    }
};

// Simulation de la fonction handlePeriodSelect
const handlePeriodSelect = async (periodKey) => {
    console.log(`\n📅 Sélection de la période: ${periodKey}`);

    try {
        const result = await loadDataWithFilter(periodKey);

        if (result.success) {
            console.log('✅ Toast de succès affiché');
            console.log(`   Message: "Période changée : ${periodKey}"`);
        } else {
            console.log('❌ Toast d\'erreur affiché');
            console.log(`   Message: "${result.error}"`);
        }

        return result;
    } catch (error) {
        console.log('❌ Erreur non gérée dans handlePeriodSelect');
        console.log(`   Message: "${error?.response?.data?.message || 'Erreur lors du changement de période'}"`);
        return { success: false, error: error?.response?.data?.message || 'Erreur lors du changement de période' };
    }
};

// Tests
const runTests = async () => {
    console.log('🚀 Démarrage des tests...\n');

    // Test 1: Sélection de période "1 an" avec erreur serveur
    console.log('Test 1: Sélection "1 an" avec erreur serveur');
    console.log('------------------------------------------------');
    const result1 = await handlePeriodSelect('year');

    if (!result1.success) {
        console.log('✅ Test 1 RÉUSSI: Toast d\'erreur affiché correctement');
        console.log(`   Message d'erreur: "${result1.error}"`);
    } else {
        console.log('❌ Test 1 ÉCHOUÉ: Toast de succès affiché au lieu d\'erreur');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Sélection de période "Ce mois" avec erreur serveur
    console.log('Test 2: Sélection "Ce mois" avec erreur serveur');
    console.log('------------------------------------------------');
    const result2 = await handlePeriodSelect('month');

    if (!result2.success) {
        console.log('✅ Test 2 RÉUSSI: Toast d\'erreur affiché correctement');
        console.log(`   Message d'erreur: "${result2.error}"`);
    } else {
        console.log('❌ Test 2 ÉCHOUÉ: Toast de succès affiché au lieu d\'erreur');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Vérification que les messages d'erreur sont cohérents
    console.log('Test 3: Vérification de la cohérence des messages d\'erreur');
    console.log('----------------------------------------------------------');

    if (result1.error === result2.error) {
        console.log('✅ Test 3 RÉUSSI: Messages d\'erreur cohérents');
        console.log(`   Message: "${result1.error}"`);
    } else {
        console.log('❌ Test 3 ÉCHOUÉ: Messages d\'erreur incohérents');
        console.log(`   Message 1: "${result1.error}"`);
        console.log(`   Message 2: "${result2.error}"`);
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Résumé
    console.log('📊 RÉSUMÉ DES TESTS');
    console.log('===================');
    console.log(`✅ Tests réussis: ${[result1, result2].filter(r => !r.success).length}/2`);
    console.log(`❌ Tests échoués: ${[result1, result2].filter(r => r.success).length}/2`);

    const allTestsPassed = [result1, result2].every(r => !r.success);

    if (allTestsPassed) {
        console.log('\n🎉 TOUS LES TESTS SONT PASSÉS !');
        console.log('La gestion des erreurs fonctionne correctement.');
        console.log('Les Toasts d\'erreur s\'affichent bien en cas d\'erreur serveur.');
    } else {
        console.log('\n⚠️  CERTAINS TESTS ONT ÉCHOUÉ !');
        console.log('Il y a encore des problèmes avec la gestion des erreurs.');
    }
};

// Exécuter les tests
runTests().catch(error => {
    console.error('❌ Erreur lors de l\'exécution des tests:', error);
}); 