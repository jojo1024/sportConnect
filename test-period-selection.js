// Script de test pour vérifier la sélection de période avec gestion d'erreur
// Ce script simule les changements de période pour tester l'affichage des Toast

console.log('🧪 Test de la sélection de période avec gestion d\'erreur');
console.log('========================================================');

// Simulation des périodes disponibles
const periods = [
    { label: 'Aujourd\'hui', key: 'today' },
    { label: 'Cette semaine', key: 'week' },
    { label: 'Ce mois', key: 'month' },
    { label: '3 mois', key: '3months' },
    { label: '6 mois', key: '6months' },
    { label: '1 an', key: 'year' },
    { label: 'Tous', key: 'all' },
    { label: 'Personnalisé', key: 'custom' },
];

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
    return error;
};

// Test de la fonction loadDataWithFilter avec succès
const testLoadDataWithFilterSuccess = () => {
    console.log('🔍 Test de loadDataWithFilter avec succès...');

    const loadDataWithFilter = async () => {
        console.log('🔄 Chargement des données avec filtre...');

        // Simuler un chargement réussi
        await new Promise(resolve => setTimeout(resolve, 100));

        console.log('✅ Chargement des données avec filtre terminé');
        return { success: true };
    };

    return loadDataWithFilter;
};

// Test de la fonction loadDataWithFilter avec erreur
const testLoadDataWithFilterError = () => {
    console.log('🔍 Test de loadDataWithFilter avec erreur...');

    const loadDataWithFilter = async () => {
        console.log('🔄 Chargement des données avec filtre...');

        // Simuler une erreur
        const error = simulateServerError();
        const errorMsg = error?.response?.data?.message || 'Erreur lors du chargement des données';

        console.error('Erreur générale lors du chargement des données avec filtre:', error);
        return { success: false, error: errorMsg };
    };

    return loadDataWithFilter;
};

// Test de handlePeriodSelect avec succès
const testHandlePeriodSelectSuccess = async () => {
    console.log('\n🔍 Test de handlePeriodSelect avec succès...');

    const showSuccess = (message, duration) => {
        console.log(`✅ Toast Success affiché: ${message} (${duration}ms)`);
    };

    const showError = (message, duration) => {
        console.log(`❌ Toast Error affiché: ${message} (${duration}ms)`);
    };

    const loadDataWithFilter = testLoadDataWithFilterSuccess();

    const handlePeriodSelect = async (periodKey) => {
        try {
            console.log(`🔄 Changement de période vers: ${periodKey}`);

            // Charger les données pour la nouvelle période
            const result = await loadDataWithFilter(periodKey);

            if (result.success) {
                // Afficher un toast de succès pour confirmer le changement de période
                const periodLabel = periods.find(p => p.key === periodKey)?.label || periodKey;
                showSuccess(`Période changée : ${periodLabel}`, 2000);
            } else {
                // Afficher un toast d'erreur
                showError(result.error || 'Erreur lors du changement de période', 3000);
            }
        } catch (error: any) {
            console.error('❌ Erreur lors du changement de période:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du changement de période';
            showError(errorMsg, 3000);
        }
    };

    // Tester avec différentes périodes
    await handlePeriodSelect('week');
    await handlePeriodSelect('month');
    await handlePeriodSelect('year');
};

// Test de handlePeriodSelect avec erreur
const testHandlePeriodSelectError = async () => {
    console.log('\n🔍 Test de handlePeriodSelect avec erreur...');

    const showSuccess = (message, duration) => {
        console.log(`✅ Toast Success affiché: ${message} (${duration}ms)`);
    };

    const showError = (message, duration) => {
        console.log(`❌ Toast Error affiché: ${message} (${duration}ms)`);
    };

    const loadDataWithFilter = testLoadDataWithFilterError();

    const handlePeriodSelect = async (periodKey) => {
        try {
            console.log(`🔄 Changement de période vers: ${periodKey}`);

            // Charger les données pour la nouvelle période
            const result = await loadDataWithFilter(periodKey);

            if (result.success) {
                // Afficher un toast de succès pour confirmer le changement de période
                const periodLabel = periods.find(p => p.key === periodKey)?.label || periodKey;
                showSuccess(`Période changée : ${periodLabel}`, 2000);
            } else {
                // Afficher un toast d'erreur
                showError(result.error || 'Erreur lors du changement de période', 3000);
            }
        } catch (error: any) {
            console.error('❌ Erreur lors du changement de période:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du changement de période';
            showError(errorMsg, 3000);
        }
    };

    // Tester avec une erreur
    await handlePeriodSelect('week');
};

// Test de handleDateChange avec succès
const testHandleDateChangeSuccess = async () => {
    console.log('\n🔍 Test de handleDateChange avec succès...');

    const showSuccess = (message, duration) => {
        console.log(`✅ Toast Success affiché: ${message} (${duration}ms)`);
    };

    const showError = (message, duration) => {
        console.log(`❌ Toast Error affiché: ${message} (${duration}ms)`);
    };

    const loadDataWithFilter = testLoadDataWithFilterSuccess();

    const handleDateChange = async (date) => {
        try {
            console.log('🔄 Sélection de date personnalisée');

            // Charger les données pour la date spécifique
            const result = await loadDataWithFilter('custom', date);

            if (result.success) {
                // Afficher un toast de succès pour confirmer la sélection de date
                const formattedDate = date.toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
                showSuccess(`Date sélectionnée : ${formattedDate}`, 2000);
            } else {
                // Afficher un toast d'erreur
                showError(result.error || 'Erreur lors du chargement de la date', 3000);
            }
        } catch (error: any) {
            console.error('❌ Erreur lors du chargement de la date spécifique:', error);
            const errorMsg = error?.response?.data?.message || 'Erreur lors du chargement de la date';
            showError(errorMsg, 3000);
        }
    };

    // Tester avec une date
    const testDate = new Date('2024-01-15');
    await handleDateChange(testDate);
};

// Exécuter tous les tests
const runTests = async () => {
    await testHandlePeriodSelectSuccess();
    await testHandlePeriodSelectError();
    await testHandleDateChangeSuccess();
};

runTests();

console.log('\n📋 Instructions pour tester dans l\'app:');
console.log('1. Ouvrir l\'écran des statistiques');
console.log('2. Tester les changements de période avec succès:');
console.log('   - Cliquer sur "Cette semaine" → Toast vert: "Période changée : Cette semaine"');
console.log('   - Cliquer sur "Ce mois" → Toast vert: "Période changée : Ce mois"');
console.log('3. Tester les changements de période avec erreur:');
console.log('   - Provoquer une erreur serveur (désactiver le WiFi)');
console.log('   - Cliquer sur une période → Toast rouge avec message d\'erreur');
console.log('4. Vérifier qu\'aucun Toast de succès n\'apparaît en cas d\'erreur');

console.log('\n🎯 Points à vérifier:');
console.log('- ✅ Succès → Toast vert avec message de confirmation');
console.log('- ✅ Erreur → Toast rouge avec message d\'erreur');
console.log('- ✅ Aucun Toast de succès en cas d\'erreur');
console.log('- ✅ Gestion cohérente des erreurs');
console.log('- ✅ Messages appropriés selon le contexte');

console.log('\n🔧 Corrections apportées:');
console.log('- loadDataWithFilter: Retourne { success: boolean, error?: string }');
console.log('- handlePeriodSelect: Vérifie result.success avant d\'afficher le Toast');
console.log('- handleDateChange: Vérifie result.success avant d\'afficher le Toast');
console.log('- onRefresh: Gestion améliorée des erreurs avec Promise.allSettled'); 