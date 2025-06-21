import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface CompactErrorCardProps {
    message?: string;
    onRetry: () => void;
    style?: any;
}

const CompactErrorCard: React.FC<CompactErrorCardProps> = ({
    message = 'Erreur: un problème est survenu',
    onRetry,
    style
}) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const handleRetry = () => {
        // Animation de pression
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        onRetry();
    };

    return (
        <View style={[styles.container, style]}>
            <Animated.View
                style={[
                    styles.card,
                    { transform: [{ scale: scaleAnim }] }
                ]}
            >
                {/* Icône d'erreur */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color={COLORS.danger}
                    />
                </View>

                {/* Message d'erreur */}
                <Text style={styles.errorText} numberOfLines={2}>
                    {message}
                </Text>

                {/* Bouton de rafraîchissement */}
                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={handleRetry}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="refresh"
                        size={16}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    card: {
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
    iconContainer: {
        marginRight: 8,
    },
    errorText: {
        flex: 1,
        fontSize: 14,
        color: '#DC2626',
        fontWeight: '500',
        lineHeight: 18,
    },
    refreshButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
});

export default CompactErrorCard; 