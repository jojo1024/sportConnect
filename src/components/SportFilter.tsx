import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../theme/colors';
import SportIcon from './SportIcon';

export interface Sport {
    sportId: number;
    sportNom: string;
    sportIcone: string;
    sportStatus: number;
}

interface SportFilterProps {
    sports: Sport[];
    selectedSportId: number;
    onSportSelect: (sportId: number) => void;
    isLoading?: boolean;
}

const SportFilter: React.FC<SportFilterProps> = ({
    sports,
    selectedSportId,
    onSportSelect,
    isLoading = false
}) => {
    const handleSportPress = (sportId: number) => {
        onSportSelect(sportId);
    };

    if (isLoading) {
        return (
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {[1, 2, 3, 4].map((item) => (
                        <View key={item} style={[styles.sportItem, styles.loadingItem]}>
                            <View style={styles.loadingIcon} />
                        </View>
                    ))}
                </ScrollView>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Sports disponibles - seulement les icônes */}
                {sports.map((sport) => (
                    <TouchableOpacity
                        key={sport.sportId}
                        style={[
                            styles.sportItem,
                            selectedSportId === sport.sportId && styles.selectedSportItem
                        ]}
                        onPress={() => handleSportPress(sport.sportId)}
                        activeOpacity={0.7}
                    >
                        <SportIcon
                            sportIcone={sport.sportIcone}
                            size={28}
                            color={selectedSportId === sport.sportId ? COLORS.primary : '#666'}
                        />
                        {selectedSportId === sport.sportId && (
                            <Text style={styles.sportName}>{sport.sportNom}</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    sportItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        minWidth: 44,
        minHeight: 44,
    },
    selectedSportItem: {
        // Pas de style spécial pour la sélection, juste la couleur de l'icône change
    },
    sportName: {
        fontSize: 10,
        color: COLORS.primary,
        fontWeight: '600',
        marginTop: 2,
        textAlign: 'center',
    },
    loadingItem: {
        opacity: 0.6,
    },
    loadingIcon: {
        width: 28,
        height: 28,
        backgroundColor: '#e9ecef',
    },
    loadingText: {
        width: 40,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#e9ecef',
    },
});

export default SportFilter; 