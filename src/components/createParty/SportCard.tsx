import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export interface Sport {
    sportId: number;
    sportNom: string;
    sportIcone: string;
    sportStatus: number;
}

interface SportCardProps {
    sport: Sport;
    isSelected: boolean;
    onSelect: (sport: Sport) => void;
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

export const SportCard: React.FC<SportCardProps> = ({ sport, isSelected, onSelect }) => {
    const iconConfig = getSportIcon(sport.sportIcone);
    const sportColor = getSportColor(sport.sportIcone);

    return (
        <TouchableOpacity
            style={[styles.sportCard, isSelected && styles.sportCardSelected]}
            onPress={() => onSelect(sport)}
        >
            {iconConfig.library === 'Ionicons' ? (
                <Ionicons
                    name={iconConfig.name as any}
                    size={24}
                    color={isSelected ? sportColor : '#666'}
                />
            ) : (
                <MaterialCommunityIcons
                    name={iconConfig.name as any}
                    size={24}
                    color={isSelected ? sportColor : '#666'}
                />
            )}
            <Text style={[styles.sportName, isSelected && styles.sportNameSelected]}>
                {sport.sportNom}
            </Text>
            {isSelected && (
                <Ionicons name="checkmark" size={20} color={COLORS.primary} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    sportCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    sportCardSelected: {
        backgroundColor: '#f8f9fa',
        borderColor: COLORS.primary,
    },
    sportName: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
    sportNameSelected: {
        color: COLORS.primary,
        fontWeight: '600',
    },
}); 