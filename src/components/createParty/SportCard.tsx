import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import SportIcon from '../SportIcon';

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




export const SportCard: React.FC<SportCardProps> = ({ sport, isSelected, onSelect }) => {
    return (
        <TouchableOpacity
            style={[styles.sportCard, isSelected && styles.sportCardSelected]}
            onPress={() => onSelect(sport)}
        >
            <SportIcon
                sportIcone={sport.sportIcone}
                size={24}
                color={isSelected ? COLORS.primary : '#666'}
            />
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