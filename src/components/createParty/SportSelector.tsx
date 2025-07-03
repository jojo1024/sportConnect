import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

export interface Sport {
    sportId: number;
    sportNom: string;
    sportIcone: string;
    sportStatus: boolean;
}

interface SportSelectorProps {
    selectedSport?: Sport | null;
    sports: Sport[];
    loading: boolean;
    onSportSelect: (sport: Sport) => void;
}

export const SportSelector: React.FC<SportSelectorProps> = ({
    selectedSport,
    sports,
    loading,
    onSportSelect,
}) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={COLORS.primary} />
                <Text style={styles.loadingText}>Chargement des sports...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {selectedSport ? (
                <TouchableOpacity
                    style={styles.selectedSportContainer}
                    onPress={() => {
                        // Ouvrir la liste des sports pour changer
                        // Pour l'instant, on peut sélectionner le premier sport disponible
                        if (sports.length > 0) {
                            const currentIndex = sports.findIndex(s => s.sportId === selectedSport.sportId);
                            const nextIndex = (currentIndex + 1) % sports.length;
                            onSportSelect(sports[nextIndex]);
                        }
                    }}
                >
                    <View style={styles.sportInfo}>
                        <Ionicons
                            name={selectedSport.sportIcone as any}
                            size={24}
                            color={COLORS.primary}
                        />
                        <Text style={styles.sportName}>{selectedSport.sportNom}</Text>
                    </View>
                    <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
                </TouchableOpacity>
            ) : (
                <TouchableOpacity
                    style={styles.placeholderContainer}
                    onPress={() => {
                        if (sports.length > 0) {
                            onSportSelect(sports[0]);
                        }
                    }}
                >
                    <Text style={styles.placeholderText}>Sélectionner un sport</Text>
                    <Ionicons name="chevron-down" size={20} color={COLORS.gray} />
                </TouchableOpacity>
            )}

            {/* Liste des sports disponibles (version simple) */}
            {sports.length > 0 && (
                <View style={styles.sportsList}>
                    {sports.slice(0, 3).map((sport) => (
                        <TouchableOpacity
                            key={sport.sportId}
                            style={[
                                styles.sportOption,
                                selectedSport?.sportId === sport.sportId && styles.selectedSportOption
                            ]}
                            onPress={() => onSportSelect(sport)}
                        >
                            <Ionicons
                                name={sport.sportIcone as any}
                                size={20}
                                color={selectedSport?.sportId === sport.sportId ? COLORS.white : COLORS.primary}
                            />
                            <Text style={[
                                styles.sportOptionText,
                                selectedSport?.sportId === sport.sportId && styles.selectedSportOptionText
                            ]}>
                                {sport.sportNom}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    {sports.length > 3 && (
                        <Text style={styles.moreSportsText}>+{sports.length - 3} autres sports</Text>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        gap: 12,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 8,
    },
    loadingText: {
        fontSize: 14,
        color: COLORS.gray,
    },
    selectedSportContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    sportInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    sportName: {
        fontSize: 16,
        fontWeight: '500',
        color: COLORS.dark,
    },
    placeholderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        backgroundColor: COLORS.white,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    placeholderText: {
        fontSize: 16,
        color: COLORS.gray,
    },
    sportsList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    sportOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: COLORS.white,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    selectedSportOption: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    sportOptionText: {
        fontSize: 14,
        color: COLORS.dark,
    },
    selectedSportOptionText: {
        color: COLORS.white,
        fontWeight: '500',
    },
    moreSportsText: {
        fontSize: 12,
        color: COLORS.gray,
        fontStyle: 'italic',
        alignSelf: 'center',
        marginTop: 4,
    },
}); 