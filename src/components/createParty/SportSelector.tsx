import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import SportIcon from '../SportIcon';

export interface Sport {
    sportId: number;
    sportNom: string;
    sportIcone: string;
    sportStatus: number;
}

interface SportSelectorProps {
    selectedSport?: Sport | null;
    loading: boolean;
    error?: string | null;
    onPress: () => void;
    onRetry?: () => void;
}


export const SportSelector: React.FC<SportSelectorProps> = ({
    selectedSport,
    loading,
    error,
    onPress,
    onRetry,
}) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>Chargement des sports...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <View style={styles.errorContent}>
                    <Ionicons name="alert-circle-outline" size={20} color={COLORS.danger} />
                    <Text style={styles.errorText}>Erreur de chargement</Text>
                </View>
                {onRetry && (
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                        <Ionicons name="refresh" size={20} color={COLORS.primary} />
                    </TouchableOpacity>
                )}
            </View>
        );
    }

    const renderSportIcon = () => {
        if (!selectedSport) {
            return <Ionicons name="football-outline" size={20} color="#999" />;
        }

        return <SportIcon sportIcone={selectedSport.sportIcone} size={20} color={COLORS.primary} />;
    };

    return (
        <TouchableOpacity style={styles.sportSelector} onPress={onPress}>
            {selectedSport ? (
                <View style={styles.selectedSportContainer}>
                    {renderSportIcon()}
                    <Text style={styles.selectedSportText}>{selectedSport.sportNom}</Text>
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <Ionicons name="football-outline" size={20} color="#999" />
                    <Text style={styles.placeholderText}>Sélectionner un sport</Text>
                </View>
            )}
            <Ionicons
                name="chevron-down"
                size={24}
                color={selectedSport ? COLORS.primary : "#999"}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sportSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        minHeight: 56,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    loadingText: {
        fontSize: 14,
        color: '#666',
    },
    errorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff5f5',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fed7d7',
        minHeight: 56,
    },
    errorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    errorText: {
        fontSize: 14,
        color: COLORS.danger,
        fontWeight: '500',
    },
    retryButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0f9ff',
    },

    selectedSportContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    selectedSportText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    placeholderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },
}); 