import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import { PERIODS } from '../../utils/constant';

interface StatisticsFilterProps {
    selectedPeriod: string;
    onPeriodSelect: (period: string) => void;
    onCalendarPress: () => void;
    loadingFilter?: boolean;
}

const StatisticsFilter: React.FC<StatisticsFilterProps> = ({
    selectedPeriod,
    onPeriodSelect,
    onCalendarPress,
    loadingFilter = false,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.filterRow}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.filterScrollView}
                    contentContainerStyle={styles.filterContainer}
                >
                    {PERIODS.map((period) => (
                        <TouchableOpacity
                            key={period.key}
                            style={[
                                styles.filterButton,
                                selectedPeriod === period.key && styles.filterButtonActive,
                            ]}
                            onPress={() => {
                            console.log('Filter button pressed:', period.key, 'loading:', loadingFilter);
                            if (!loadingFilter) {
                                onPeriodSelect(period.key);
                            }
                        }}
                            disabled={loadingFilter}
                        >
                            <Text
                                style={[
                                    styles.filterButtonText,
                                    selectedPeriod === period.key && styles.filterButtonTextActive,
                                    loadingFilter && styles.filterButtonTextDisabled,
                                ]}
                            >
                                {period.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                    style={styles.calendarButton}
                    onPress={onCalendarPress}
                    activeOpacity={0.7}
                    disabled={loadingFilter}
                >
                    <Ionicons
                        name="calendar-outline"
                        size={24}
                        color={COLORS.primary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        marginVertical: 8,
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    filterScrollView: {
        flex: 1,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        backgroundColor: COLORS.light,
        marginRight: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: COLORS.primary,
    },
    filterButtonText: {
        ...FONTS.font,
        color: COLORS.textLight,
        fontWeight: '500',
    },
    filterButtonTextActive: {
        color: COLORS.white,
        fontWeight: '600',
    },
    filterButtonTextDisabled: {
        opacity: 0.5,
    },
    calendarButton: {
        padding: 8,
        backgroundColor: COLORS.background,
    },
});

export default StatisticsFilter; 