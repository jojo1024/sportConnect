import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export interface Sport {
    sportId: number;
    sportNom: string;
    sportIcone: string;
    sportStatus: boolean;
}

interface SportSelectorBottomSheetProps {
    selectedSport?: Sport | null;
    loading: boolean;
    error?: string | null;
    onPress: () => void;
    onRetry?: () => void;
}

// Fonction pour mapper les icônes avec les bonnes bibliothèques
const getSportIcon = (iconName: string): { name: string; library: 'Ionicons' | 'MaterialCommunityIcons' } => {
    const iconMapping: { [key: string]: { name: string; library: 'Ionicons' | 'MaterialCommunityIcons' } } = {
        'football-outline': { name: 'football-outline', library: 'Ionicons' },
        'basketball-outline': { name: 'basketball-outline', library: 'Ionicons' },
        'tennisball-outline': { name: 'tennisball-outline', library: 'Ionicons' },
        'handball-outline': { name: 'basketball', library: 'MaterialCommunityIcons' },
        'paddle-outline': { name: 'table-tennis', library: 'MaterialCommunityIcons' },
        'golf-outline': { name: 'golf', library: 'MaterialCommunityIcons' },
        'volleyball-outline': { name: 'volleyball', library: 'MaterialCommunityIcons' },
        'badminton-outline': { name: 'badminton', library: 'MaterialCommunityIcons' },
    };

    return iconMapping[iconName] || { name: 'football-outline', library: 'Ionicons' };
};

// Fonction pour obtenir la couleur spécifique au sport
const getSportColor = (iconName: string): string => {
    const colorMapping: { [key: string]: string } = {
        'football-outline': '#FF6600',
        'basketball-outline': '#FF6B35',
        'tennisball-outline': '#4CAF50',
        'handball-outline': '#2196F3',
        'paddle-outline': '#9C27B0',
        'golf-outline': '#4CAF50',
        'volleyball-outline': '#FF9800',
        'badminton-outline': '#E91E63',
    };

    return colorMapping[iconName] || COLORS.primary;
};

export const SportSelectorBottomSheet: React.FC<SportSelectorBottomSheetProps> = ({
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

        const iconConfig = getSportIcon(selectedSport.sportIcone);
        const sportColor = getSportColor(selectedSport.sportIcone);

        if (iconConfig.library === 'Ionicons') {
            return <Ionicons name={iconConfig.name as any} size={20} color={sportColor} />;
        } else {
            return <MaterialCommunityIcons name={iconConfig.name as any} size={20} color={sportColor} />;
        }
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