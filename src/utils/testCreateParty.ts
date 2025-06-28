// Fichier de test pour la création de partie
// Ce fichier peut être supprimé après les tests

import { matchService } from '../services/matchService';

export const testCreateParty = async () => {
    try {
        console.log('🧪 Test de création de partie...');
        
        // Données de test
        const testMatchData = {
            terrainId: 1,
            matchDateDebut: '2024-12-25 18:00:00',
            matchDateFin: '2024-12-25 20:00:00',
            matchDuree: 2,
            matchDescription: 'Test de création de partie',
            matchNbreParticipant: 10,
            capoId: 1,
        };
        
        console.log('📤 Envoi des données:', testMatchData);
        
        // Test de création
        const result = await matchService.createMatch(testMatchData);
        
        console.log('✅ Partie créée avec succès:', result);
        return result;
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        throw error;
    }
};

export const testGetMatches = async () => {
    try {
        console.log('🧪 Test de récupération des matchs...');
        
        const matches = await matchService.getMatches();
        
        console.log('✅ Matchs récupérés:', matches.length);
        return matches;
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        throw error;
    }
}; 