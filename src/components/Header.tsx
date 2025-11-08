import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface HeaderProps {
    title: string;
    showFilter?: boolean;
    onFilterPress?: () => void;
    filterActive?: boolean;
    selectedTerrainName?: string | null;
    onResetFilter?: () => void;
    showBackButton?: boolean;
    onBackPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
    title,
    showFilter = false,
    onFilterPress,
    filterActive = false,
    selectedTerrainName,
    onResetFilter,
    showBackButton = false,
    onBackPress
}) => {
    // Fonction pour tronquer le nom du terrain s'il est trop long
    const truncateTerrainName = (name: string, maxLength: number = 40) => {
        if (name.length <= maxLength) return name;
        return name.substring(0, maxLength) + '...';
    };

    return (
        <View style={styles.header}>
            {/* Bouton retour */}
            {showBackButton && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBackPress}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            )}

            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                {selectedTerrainName && (
                    <View style={styles.selectedTerrainContainer}>
                        <Text style={styles.selectedTerrainName} numberOfLines={1}>
                            {truncateTerrainName(selectedTerrainName)}
                        </Text>
                        <TouchableOpacity
                            style={styles.resetButton}
                            onPress={onResetFilter}
                        >
                            <Ionicons
                                name="close-circle"
                                size={16}
                                color={COLORS.gray[500]}
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
            {showFilter && (
                <TouchableOpacity
                    style={[
                        styles.filterButton,
                        filterActive && styles.filterButtonActive
                    ]}
                    onPress={onFilterPress}
                >
                    <Ionicons
                        name="filter"
                        size={20}
                        color={filterActive ? COLORS.white : COLORS.primary}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        paddingTop: 10,
        paddingHorizontal: 20,
        paddingBottom: 10,        
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 15,
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    selectedTerrainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginRight: 15, // Ajouter de l'espace à droite
    },
    selectedTerrainLabel: {
        fontSize: 12,
        color: COLORS.gray[600],
        marginRight: 4,
    },
    selectedTerrainName: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
        flex: 1,
        marginRight: 8, // Ajouter de l'espace avant le bouton de fermeture
    },
    resetButton: {
        marginLeft: 6,
        padding: 4, // Augmenter le padding pour une meilleure zone de clic
    },
    filterButton: {
        padding: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: 'transparent',
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
    },
}); 