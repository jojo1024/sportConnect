import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

interface ErrorCardProps {
    error: {
        message: string;
        type?: string;
        code?: number;
    };
    onClose: () => void;
    onRetry?: () => void;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ error, onClose, onRetry }) => {
    const getErrorIcon = () => {
        switch (error.type) {
            case 'already_registered':
                return 'account-alert';
            case 'match_full':
                return 'account-group-off';
            case 'match_not_confirmed':
                return 'clock-alert';
            case 'payment_failed':
                return 'credit-card-off';
            default:
                return 'alert-circle';
        }
    };

    const getErrorColor = () => {
        switch (error.type) {
            case 'already_registered':
                return ['#FF9800', '#F57C00'];
            case 'match_full':
                return ['#F44336', '#D32F2F'];
            case 'match_not_confirmed':
                return ['#FF9800', '#F57C00'];
            case 'payment_failed':
                return ['#F44336', '#D32F2F'];
            default:
                return ['#F44336', '#D32F2F'];
        }
    };

    const getErrorTitle = () => {
        switch (error.type) {
            case 'already_registered':
                return 'Déjà inscrit';
            case 'match_full':
                return 'Match complet';
            case 'match_not_confirmed':
                return 'Match non confirmé';
            case 'payment_failed':
                return 'Paiement échoué';
            default:
                return 'Erreur';
        }
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <LinearGradient
                    colors={getErrorColor()}
                    style={styles.header}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons name={getErrorIcon()} size={40} color={COLORS.white} />
                    </View>
                    <Text style={styles.title}>{getErrorTitle()}</Text>
                    <Text style={styles.subtitle}>Impossible de rejoindre ce match</Text>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.errorMessage}>
                        <MaterialCommunityIcons name="alert" size={20} color="#F44336" />
                        <Text style={styles.errorText}>{error.message}</Text>
                    </View>

                    {error.type === 'already_registered' && (
                        <View style={styles.infoBox}>
                            <MaterialCommunityIcons name="information" size={16} color="#2196F3" />
                            <Text style={styles.infoText}>
                                Vous êtes déjà inscrit à ce match. Consultez vos matchs dans votre profil.
                            </Text>
                        </View>
                    )}

                    {error.type === 'match_full' && (
                        <View style={styles.infoBox}>
                            <MaterialCommunityIcons name="information" size={16} color="#2196F3" />
                            <Text style={styles.infoText}>
                                Ce match a atteint le nombre maximum de participants.
                                Consultez d'autres matchs disponibles.
                            </Text>
                        </View>
                    )}

                    {error.type === 'match_not_confirmed' && (
                        <View style={styles.infoBox}>
                            <MaterialCommunityIcons name="information" size={16} color="#2196F3" />
                            <Text style={styles.infoText}>
                                Ce match est en attente de confirmation par le gérant du terrain.
                                Réessayez plus tard.
                            </Text>
                        </View>
                    )}

                    {error.type === 'payment_failed' && (
                        <View style={styles.infoBox}>
                            <MaterialCommunityIcons name="information" size={16} color="#2196F3" />
                            <Text style={styles.infoText}>
                                Le paiement n'a pas pu être traité. Vérifiez votre connexion et réessayez.
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.buttonContainer}>
                    {onRetry && (
                        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                            <Text style={styles.retryButtonText}>Réessayer</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        margin: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        maxWidth: 400,
        width: '100%',
    },
    header: {
        padding: 24,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.white,
        textAlign: 'center',
        opacity: 0.9,
    },
    content: {
        padding: 24,
    },
    errorMessage: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFEBEE',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    errorText: {
        flex: 1,
        fontSize: 16,
        color: '#D32F2F',
        marginLeft: 12,
        lineHeight: 22,
        fontWeight: '500',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        padding: 16,
        borderRadius: 12,
        alignItems: 'flex-start',
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#1976D2',
        marginLeft: 8,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        padding: 24,
        gap: 12,
    },
    retryButton: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ErrorCard; 