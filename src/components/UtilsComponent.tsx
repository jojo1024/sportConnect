import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { PRIMARY_COLOR } from '../utils/constant';
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
            <ActivityIndicator size="small" color={PRIMARY_COLOR} />
            <Text style={styles.loadingText}>Chargement...</Text>
        </View>
    );
};

export  const RetryComponent = ({ onRetry }: { onRetry: () => void }) => {
    return (
        <View style={styles.errorContainer}>
                {/* <Text style={styles.errorText}>Erreur: {error}</Text> */}
                <Text style={styles.errorText}>Erreur: un problème est survenu</Text>
                <Text style={styles.retryText} onPress={onRetry}>
                    Réessayer
                </Text>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.danger,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryText: {
        fontSize: 16,
        color: COLORS.danger,
        textDecorationLine: 'underline',
    },
});