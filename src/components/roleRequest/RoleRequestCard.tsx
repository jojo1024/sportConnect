import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { COLORS } from '../../theme/colors';
import { CustomButton } from '../CustomButton';
import { CustomOutlineButton } from '../CustomOutlineButton';

interface RoleRequestCardProps {
    hasPendingRequest: boolean;
    currentRequest: any;
    isLoading: boolean;
    error: string | null;
    canRequestCapo: boolean;
    canRequestGerant: boolean;
    canCancelRequest: boolean;
    canChangeRequest: boolean;
    onRequestCapo: () => void;
    onRequestGerant: () => void;
    onCancelRequest: () => void;
    onChangeRequest: (newRole: 'capo' | 'gerant') => void;
}

export const RoleRequestCard: React.FC<RoleRequestCardProps> = ({
    hasPendingRequest,
    currentRequest,
    isLoading,
    error,
    canRequestCapo,
    canRequestGerant,
    canCancelRequest,
    canChangeRequest,
    onRequestCapo,
    onRequestGerant,
    onCancelRequest,
    onChangeRequest
}) => {
    const renderPendingRequest = () => {
        if (!currentRequest) return null;

        const { requestedRole, requestDate, status } = currentRequest;
        const roleText = requestedRole === 'capo' ? 'Capo' : 'Gérant';
        const statusText = status === 'pending' ? 'En attente' : status === 'approved' ? 'Approuvée' : 'Rejetée';
        const statusColor = status === 'pending' ? COLORS.warning : status === 'approved' ? COLORS.success : COLORS.error;

        return (
            <View style={styles.pendingContainer}>
                <View style={styles.pendingHeader}>
                    <Text style={styles.pendingTitle}>Demande en cours</Text>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                        <Text style={styles.statusText}>{statusText}</Text>
                    </View>
                </View>

                <View style={styles.pendingContent}>
                    <Text style={styles.roleText}>Demande pour devenir {roleText}</Text>
                    <Text style={styles.dateText}>Demandé le {new Date(requestDate).toLocaleDateString('fr-FR')}</Text>
                </View>

                {status === 'pending' && (
                    <View style={styles.pendingActions}>
                        <CustomOutlineButton
                            title="Annuler"
                            onPress={onCancelRequest}
                            disabled={!canCancelRequest}
                            style={styles.cancelButton}
                        />

                        {requestedRole === 'capo' && (
                            <CustomButton
                                title="Changer pour Gérant"
                                onPress={() => onChangeRequest('gerant')}
                                disabled={!canChangeRequest}
                                style={styles.changeButton}
                            />
                        )}

                        {requestedRole === 'gerant' && (
                            <CustomButton
                                title="Changer pour Capo"
                                onPress={() => onChangeRequest('capo')}
                                disabled={!canChangeRequest}
                                style={styles.changeButton}
                            />
                        )}
                    </View>
                )}
            </View>
        );
    };

    const renderNoRequest = () => (
        <View style={styles.noRequestContainer}>
            <Text style={styles.noRequestTitle}>Demander une évolution de rôle</Text>
            <Text style={styles.noRequestSubtitle}>
                Vous pouvez demander à devenir Capo ou Gérant pour accéder à plus de fonctionnalités.
            </Text>

            <View style={styles.requestActions}>
                <CustomButton
                    title="Devenir Capo"
                    onPress={onRequestCapo}
                    disabled={!canRequestCapo}
                    style={styles.requestButton}
                />

                <CustomButton
                    title="Devenir Gérant"
                    onPress={onRequestGerant}
                    disabled={!canRequestGerant}
                    style={[styles.requestButton, styles.gerantButton]}
                />
            </View>
        </View>
    );

    const renderLoading = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
        </View>
    );

    const renderError = () => (
        <View style={styles.errorContainer}>
            <Text style={styles.errorText}>❌ {error}</Text>
            <CustomButton
                title="Réessayer"
                onPress={() => window.location.reload()}
                style={styles.retryButton}
            />
        </View>
    );

    if (isLoading) return renderLoading();
    if (error) return renderError();
    if (hasPendingRequest) return renderPendingRequest();
    return renderNoRequest();
};

const styles = StyleSheet.create({
    // Container principal
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },

    // Demande en cours
    pendingContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: COLORS.warning,
    },
    pendingHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    pendingTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    pendingContent: {
        marginBottom: 16,
    },
    roleText: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 4,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    pendingActions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
    },
    changeButton: {
        flex: 1,
    },

    // Aucune demande
    noRequestContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
    },
    noRequestTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    noRequestSubtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 16,
        lineHeight: 20,
    },
    requestActions: {
        gap: 12,
    },
    requestButton: {
        marginBottom: 8,
    },
    gerantButton: {
        backgroundColor: COLORS.success,
    },

    // Loading
    loadingContainer: {
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textSecondary,
    },

    // Error
    errorContainer: {
        backgroundColor: COLORS.errorLight,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 14,
        color: COLORS.error,
        textAlign: 'center',
        marginBottom: 12,
    },
    retryButton: {
        backgroundColor: COLORS.error,
    },
});

