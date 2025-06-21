import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export const GetIcon = (type: string) => {
    switch (type) {
        case 'match':
            return <FontAwesome5 name="futbol" size={24} color="#007b83" />;
        case 'reminder':
            return <Ionicons name="alarm-outline" size={24} color="#f5a623" />;
        case 'payment':
            return <MaterialIcons name="payment" size={24} color="#4caf50" />;
        case 'validation':
            return <MaterialIcons name="check-circle" size={24} color="#007b83" />;
        case 'cancel':
            return <MaterialIcons name="cancel" size={24} color="#e74c3c" />;
        case 'credit':
            return <FontAwesome5 name="coins" size={22} color="#f5a623" />;
        case 'info':
            return <Ionicons name="information-circle-outline" size={24} color="#007b83" />;
        case 'email':
            return <MaterialIcons name="email" size={24} color="#4285F4" />;
        case 'sms':
            return <MaterialIcons name="sms" size={24} color="#34A853" />;
        case 'push':
        default:
            return <Ionicons name="notifications-outline" size={24} color="#888" />;
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

export const RetryComponent = ({ onRetry }: { onRetry: () => void }) => {
    return (
        <View style={styles.retryContainer}>
            <View style={styles.retryCard}>
                {/* Icône d'erreur */}
                <View style={styles.retryIconContainer}>
                    <Ionicons name="alert-circle-outline" size={24} color={COLORS.danger} />
                </View>

                {/* Message d'erreur */}
                <Text style={styles.retryErrorText} numberOfLines={2}>
                    Erreur: un problème est survenu
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
            <Ionicons name="notifications-off-outline" size={80} color="#888" />
        </View>
        <Text style={styles.emptyTitle}>Pas de notifications</Text>
        <Text style={styles.emptyMessage}>
            Revenir plus tard pour avoir des infos sur les invitations de parties, demande d'amis et plus encore
        </Text>
    </View>
);

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
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    retryIconContainer: {
        marginRight: 8,
    },
    retryErrorText: {
        flex: 1,
        fontSize: 14,
        color: '#DC2626',
        fontWeight: '500',
        lineHeight: 18,
    },
    retryRefreshButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
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
        color: '#1a1a1a',
        marginBottom: 12,
        textAlign: 'center',
    },
    emptyMessage: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        // lineHeight: 24,
    },
});