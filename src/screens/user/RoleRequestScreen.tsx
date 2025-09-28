import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLambdaRoleRequests } from '../../hooks/useLambdaRoleRequests';
import { useRoleCheck } from '../../hooks/useRoleCheck';
import { RoleRequestCard, RoleChangeModal } from '../../components/roleRequest';
import { COLORS } from '../../theme/colors';
import { Header } from '../../components/Header';

export const RoleRequestScreen: React.FC = () => {
    // Hooks pour les demandes de rôles
    const {
        hasPendingRequest,
        currentRequest,
        isLoading,
        error,
        canRequestCapo,
        canRequestGerant,
        canCancelRequest,
        canChangeRequest,
        checkRoleRequestStatus,
        requestCapoRole,
        requestGerantRole,
        cancelRoleRequest,
        changeRoleRequest,
        currentRequestRole,
        currentRequestStatus,
        currentRequestDate
    } = useLambdaRoleRequests();

    // Hook pour la vérification de rôle
    const {
        showRoleChangeModal,
        newRole,
        handleReconnect,
        closeRoleChangeModal
    } = useRoleCheck();

    const handleRequestCapo = async () => {
        try {
            await requestCapoRole();
            Alert.alert('Succès', 'Demande de rôle Capo créée avec succès !');
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors de la demande');
        }
    };

    const handleRequestGerant = async () => {
        try {
            await requestGerantRole();
            Alert.alert('Succès', 'Demande de rôle Gérant créée avec succès !');
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors de la demande');
        }
    };

    const handleCancelRequest = async () => {
        try {
            await cancelRoleRequest();
            Alert.alert('Succès', 'Demande annulée avec succès !');
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors de l\'annulation');
        }
    };

    const handleChangeRequest = async (newRole: 'capo' | 'gerant') => {
        try {
            await changeRoleRequest(newRole);
            Alert.alert('Succès', `Demande changée pour ${newRole} avec succès !`);
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors du changement');
        }
    };

    // La fonction handleReconnect est maintenant fournie par useRoleCheck

    const handleRefresh = async () => {
        try {
            await checkRoleRequestStatus();
        } catch (error: any) {
            Alert.alert('Erreur', error.message || 'Erreur lors du rafraîchissement');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Demandes de Rôles"
                showBackButton
                rightComponent={
                    <Text style={styles.refreshText} onPress={handleRefresh}>
                        Actualiser
                    </Text>
                }
            />

            <ScrollView style={styles.content}>
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Gestion des Demandes</Text>
                    <Text style={styles.sectionSubtitle}>
                        Gérez vos demandes d'évolution de rôle pour accéder à plus de fonctionnalités.
                    </Text>
                </View>

                <RoleRequestCard
                    hasPendingRequest={hasPendingRequest}
                    currentRequest={currentRequest}
                    isLoading={isLoading}
                    error={error}
                    canRequestCapo={canRequestCapo}
                    canRequestGerant={canRequestGerant}
                    canCancelRequest={canCancelRequest}
                    canChangeRequest={canChangeRequest}
                    onRequestCapo={handleRequestCapo}
                    onRequestGerant={handleRequestGerant}
                    onCancelRequest={handleCancelRequest}
                    onChangeRequest={handleChangeRequest}
                />

                {/* Informations de debug */}
                <View style={styles.debugSection}>
                    <Text style={styles.debugTitle}>Informations de Debug</Text>
                    <Text style={styles.debugText}>
                        Demande en cours: {hasPendingRequest ? 'Oui' : 'Non'}
                    </Text>
                    <Text style={styles.debugText}>
                        Rôle demandé: {currentRequestRole || 'Aucun'}
                    </Text>
                    <Text style={styles.debugText}>
                        Statut: {currentRequestStatus || 'Aucun'}
                    </Text>
                    <Text style={styles.debugText}>
                        Date: {currentRequestDate || 'Aucune'}
                    </Text>
                    <Text style={styles.debugText}>
                        Peut demander Capo: {canRequestCapo ? 'Oui' : 'Non'}
                    </Text>
                    <Text style={styles.debugText}>
                        Peut demander Gérant: {canRequestGerant ? 'Oui' : 'Non'}
                    </Text>
                </View>
            </ScrollView>

            <RoleChangeModal
                visible={showRoleChangeModal}
                newRole={newRole}
                onReconnect={handleReconnect}
                onClose={closeRoleChangeModal}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    sectionSubtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        lineHeight: 22,
    },
    refreshText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '500',
    },
    debugSection: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    debugTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 12,
    },
    debugText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
});
