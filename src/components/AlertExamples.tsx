import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useCustomAlert } from '../hooks/useCustomAlert';
import CustomAlert from './CustomAlert';
import { COLORS } from '../theme/colors';

const AlertExamples: React.FC = () => {
    const {
        alertConfig,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirmation,
        showAutoClose
    } = useCustomAlert();

    const examples = [
        {
            title: 'Succès',
            description: 'Alerte de succès avec icône verte',
            onPress: () => showSuccess(
                'Opération réussie !',
                'Votre action a été effectuée avec succès.'
            ),
            color: '#10B981'
        },
        {
            title: 'Erreur',
            description: 'Alerte d\'erreur avec icône rouge',
            onPress: () => showError(
                'Erreur !',
                'Une erreur est survenue lors de l\'opération.'
            ),
            color: '#EF4444'
        },
        {
            title: 'Avertissement',
            description: 'Alerte d\'avertissement avec icône orange',
            onPress: () => showWarning(
                'Attention !',
                'Cette action peut avoir des conséquences importantes.'
            ),
            color: '#F59E0B'
        },
        {
            title: 'Information',
            description: 'Alerte d\'information avec icône bleue',
            onPress: () => showInfo(
                'Information',
                'Voici une information importante pour vous.'
            ),
            color: '#3B82F6'
        },
        {
            title: 'Confirmation',
            description: 'Alerte avec boutons Confirmer/Annuler',
            onPress: () => showConfirmation(
                'Confirmer l\'action',
                'Êtes-vous sûr de vouloir effectuer cette action ?',
                () => console.log('Action confirmée'),
                () => console.log('Action annulée')
            ),
            color: '#8B5CF6'
        },
        {
            title: 'Auto-fermeture',
            description: 'Alerte qui se ferme automatiquement',
            onPress: () => showAutoClose(
                'Notification',
                'Cette alerte se fermera automatiquement dans 3 secondes.',
                'success',
                3000
            ),
            color: '#06B6D4'
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Exemples d'Alertes Personnalisées</Text>

            <ScrollView style={styles.scrollView}>
                {examples.map((example, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.exampleButton, { borderLeftColor: example.color }]}
                        onPress={example.onPress}
                        activeOpacity={0.8}
                    >
                        <View style={styles.exampleContent}>
                            <Text style={styles.exampleTitle}>{example.title}</Text>
                            <Text style={styles.exampleDescription}>{example.description}</Text>
                        </View>
                        <View style={[styles.exampleIcon, { backgroundColor: example.color }]}>
                            <Text style={styles.exampleIconText}>→</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Alerte personnalisée */}
            <CustomAlert
                visible={!!alertConfig}
                title={alertConfig?.title || ''}
                message={alertConfig?.message || ''}
                type={alertConfig?.type}
                confirmText={alertConfig?.confirmText}
                cancelText={alertConfig?.cancelText}
                showCancel={alertConfig?.showCancel}
                autoClose={alertConfig?.autoClose}
                autoCloseDelay={alertConfig?.autoCloseDelay}
                onConfirm={alertConfig?.onConfirm}
                onCancel={alertConfig?.onCancel}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        textAlign: 'center',
        marginVertical: 20,
        paddingHorizontal: 20,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    exampleButton: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    exampleContent: {
        flex: 1,
    },
    exampleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    exampleDescription: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    exampleIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    exampleIconText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AlertExamples; 