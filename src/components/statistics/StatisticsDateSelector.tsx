import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';

interface StatisticsDateSelectorProps {
    selectedPeriod: string;
    selectedDate: Date;
    onCalendarPress: () => void;
    loadingFilter?: boolean;
}

const StatisticsDateSelector: React.FC<StatisticsDateSelectorProps> = ({
    selectedPeriod,
    selectedDate,
    onCalendarPress,
    loadingFilter = false,
}) => {
    if (selectedPeriod !== 'custom') {
        return null;
    }

    return (
        <View style={styles.dateSelectionContainer}>
            <View style={styles.dateSelectionHeader}>
                <Text style={styles.dateSelectionTitle}>Date spécifique</Text>
                <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={onCalendarPress}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={24}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>
            {loadingFilter ? (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            ) : (
                <Text style={styles.dateDisplayText}>
                    {selectedDate.toLocaleDateString('fr-FR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    dateSelectionContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 2,
    },
    dateSelectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateSelectionTitle: {
        ...FONTS.fontLg,
        color: COLORS.textLight,
        marginBottom: 6,
    },
    dateDisplayText: {
        ...FONTS.font,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    calendarButton: {
        padding: 8,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    loadingText: {
        ...FONTS.font,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});

export default StatisticsDateSelector; 