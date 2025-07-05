import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { selectAccessToken, selectRefreshToken, selectUser } from '../store/slices/userSlice';
import { ErrorType } from '../services/api';

export const GetIcon = (type: string) => {
    switch (type) {
        case 'match':
            return <FontAwesome5 name="futbol" size={24} color={COLORS.primary7} />;
        case 'reminder':
            return <Ionicons name="alarm-outline" size={24} color={COLORS.warning} />;
        case 'payment':
            return <MaterialIcons name="payment" size={24} color={COLORS.successGreen} />;
        case 'validation':
            return <MaterialIcons name="check-circle" size={24} color={COLORS.primary7} />;
        case 'cancel':
            return <MaterialIcons name="cancel" size={24} color={COLORS.danger} />;
        case 'credit':
            return <FontAwesome5 name="coins" size={22} color={COLORS.warning} />;
        case 'info':
            return <Ionicons name="information-circle-outline" size={24} color={COLORS.primary7} />;
        case 'email':
            return <MaterialIcons name="email" size={24} color={COLORS.info} />;
        case 'sms':
            return <MaterialIcons name="sms" size={24} color={COLORS.success} />;
        case 'push':
        default:
            return <Ionicons name="notifications-outline" size={24} color={COLORS.gray[500]} />;
    }
}

export const RenderFooter = (isLoading: boolean) => {
    if (!isLoading) return null;

    return (
        <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Chargement...</Text>
        </View>
    );
};

export const RetryComponent = ({
    onRetry,
    errorType = ErrorType.UNKNOWN,
    customMessage
}: {
    onRetry: () => void;
    errorType?: ErrorType;
    customMessage?: string;
}) => {
    // Fonction pour obtenir le message d'erreur approprié
    const getErrorMessage = () => {
        if (customMessage) return customMessage;

        switch (errorType) {
            case ErrorType.NETWORK:
                return "Pas de connexion internet. Vérifiez votre réseau et réessayez.";
            case ErrorType.TIMEOUT:
                return "Délai d'attente dépassé. Vérifiez votre connexion et réessayez.";
            case ErrorType.SESSION_EXPIRED:
                return "Votre session a expiré. Veuillez vous reconnecter.";
            case ErrorType.VALIDATION:
                return "Données invalides. Veuillez vérifier vos informations.";
            case ErrorType.SERVER:
                return "Erreur serveur. Veuillez réessayer plus tard.";
            case ErrorType.UNAUTHORIZED:
                return "Accès non autorisé. Veuillez vous reconnecter.";
            case ErrorType.FORBIDDEN:
                return "Accès interdit. Vous n'avez pas les permissions nécessaires.";
            default:
                return "Une erreur inattendue est survenue. Veuillez réessayer.";
        }
    };

    // Fonction pour obtenir l'icône appropriée
    const getErrorIcon = () => {
        switch (errorType) {
            case ErrorType.NETWORK:
                return <Ionicons name="wifi-outline" size={24} color={COLORS.danger} />;
            case ErrorType.TIMEOUT:
                return <Ionicons name="time-outline" size={24} color={COLORS.warning} />;
            case ErrorType.SESSION_EXPIRED:
                return <Ionicons name="lock-closed-outline" size={24} color={COLORS.danger} />;
            case ErrorType.SERVER:
                return <Ionicons name="server-outline" size={24} color={COLORS.danger} />;
            default:
                return <Ionicons name="alert-circle-outline" size={24} color={COLORS.danger} />;
        }
    };

    return (
        <View style={styles.retryContainer}>
            <View style={styles.retryCard}>
                {/* Icône d'erreur */}
                <View style={styles.retryIconContainer}>
                    {getErrorIcon()}
                </View>

                {/* Message d'erreur */}
                <Text style={styles.retryErrorText} numberOfLines={3}>
                    {getErrorMessage()}
                </Text>

                {/* Bouton de rafraîchissement */}
                <TouchableOpacity
                    style={styles.retryRefreshButton}
                    onPress={onRetry}
                    activeOpacity={0.7}
                >
                    <Ionicons name="refresh" size={18} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Composant pour l'état vide
export const EmptyState = () => (
    <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
            <Ionicons name="notifications-off-outline" size={80} color={COLORS.gray[500]} />
        </View>
        <Text style={styles.emptyTitle}>Pas de notifications</Text>
        <Text style={styles.emptyMessage}>
            Revenir plus tard pour avoir des infos sur les invitations de parties, demande d'amis et plus encore
        </Text>
    </View>
);

interface DebugTokenProps {
    visible?: boolean;
}

export const DebugTokenInfo: React.FC<DebugTokenProps> = ({ visible = false }) => {
    const accessToken = useSelector(selectAccessToken);
    const refreshToken = useSelector(selectRefreshToken);
    const user = useSelector(selectUser);

    if (!visible) return null;

    return (
        <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>🔍 Debug Tokens</Text>
            <Text style={styles.debugText}>
                User: {user ? `${user.utilisateurNom} (${user.utilisateurRole})` : 'Non connecté'}
            </Text>
            <Text style={styles.debugText}>
                Access Token: {accessToken ? `${accessToken.substring(0, 20)}...` : 'Non défini'}
            </Text>
            <Text style={styles.debugText}>
                Refresh Token: {refreshToken ? `${refreshToken.substring(0, 20)}...` : 'Non défini'}
            </Text>
        </View>
    );
};

// Composant de démonstration pour tester les erreurs (à supprimer en production)
export const ErrorDemoComponent = () => {
    const [currentErrorType, setCurrentErrorType] = useState<ErrorType>(ErrorType.NETWORK);

    const errorTypes = [
        { type: ErrorType.NETWORK, label: 'Erreur Réseau' },
        { type: ErrorType.TIMEOUT, label: 'Timeout' },
        { type: ErrorType.SESSION_EXPIRED, label: 'Session Expirée' },
        { type: ErrorType.VALIDATION, label: 'Validation' },
        { type: ErrorType.SERVER, label: 'Erreur Serveur' },
        { type: ErrorType.UNAUTHORIZED, label: 'Non Autorisé' },
        { type: ErrorType.FORBIDDEN, label: 'Interdit' },
        { type: ErrorType.UNKNOWN, label: 'Inconnu' },
    ];

    return (
        <View style={styles.demoContainer}>
            <Text style={styles.demoTitle}>Démonstration des Messages d'Erreur</Text>

            {/* Boutons pour changer le type d'erreur */}
            <View style={styles.demoButtons}>
                {errorTypes.map(({ type, label }) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.demoButton,
                            currentErrorType === type && styles.demoButtonActive
                        ]}
                        onPress={() => setCurrentErrorType(type)}
                    >
                        <Text style={[
                            styles.demoButtonText,
                            currentErrorType === type && styles.demoButtonTextActive
                        ]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Affichage du composant d'erreur */}
            <RetryComponent
                onRetry={() => console.log('Retry pressed')}
                errorType={currentErrorType}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    loadingFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    retryContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    retryCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.redLight,
        borderWidth: 1,
        borderColor: COLORS.red,
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        minHeight: 60,
    },
    retryIconContainer: {
        marginRight: 12,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    retryErrorText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.danger,
        fontWeight: '500',
        lineHeight: 20,
        marginRight: 8,
    },
    retryRefreshButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[300],
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    emptyIconContainer: {
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '500',
        color: COLORS.almostBlack,
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyMessage: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        // lineHeight: 24,
    },
    debugContainer: {
        position: 'absolute',
        top: 50,
        right: 10,
        backgroundColor: COLORS.overlayVeryDark,
        padding: 10,
        borderRadius: 8,
        maxWidth: 300,
        zIndex: 9999,
    },
    debugTitle: {
        color: COLORS.white,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    debugText: {
        color: COLORS.white,
        fontSize: 12,
        marginBottom: 2,
    },
    demoContainer: {
        padding: 20,
        backgroundColor: COLORS.background,
    },
    demoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkestGray,
        marginBottom: 20,
        textAlign: 'center',
    },
    demoButtons: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 8,
        marginBottom: 20,
    },
    demoButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLORS.gray[100],
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
    },
    demoButtonActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    demoButtonText: {
        fontSize: 12,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    demoButtonTextActive: {
        color: COLORS.white,
    },
});