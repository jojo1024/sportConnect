import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { COLORS } from '../../theme/colors';

interface TerrainSelectorProps {
    selectedField: string;
    loading?: boolean;
    error?: string | null;
    onPress: () => void;
    onRetry?: () => void;
}

export const TerrainSelector: React.FC<TerrainSelectorProps> = ({
    selectedField,
    loading = false,
    error = null,
    onPress,
    onRetry
}) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>Chargement des terrains...</Text>
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

    return (
        <TouchableOpacity style={styles.TerrainSelector} onPress={onPress}>
            {selectedField ? (
                <View style={styles.selectedFieldContainer}>
                    <Ionicons name="location" size={20} color={COLORS.primary} />
                    <Text style={styles.selectedFieldText}>{selectedField}</Text>
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <Ionicons name="location-outline" size={20} color="#999" />
                    <Text style={styles.placeholderText}>Sélectionner un terrain</Text>
                </View>
            )}
            <Ionicons name="chevron-down" size={24} color={selectedField ? COLORS.primary : "#999"} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    TerrainSelector: {
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
    selectedFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    selectedFieldText: {
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