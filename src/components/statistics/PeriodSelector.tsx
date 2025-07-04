import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../../theme/colors';

export type PeriodType = 'today' | 'week' | 'month' | '3months' | '6months' | 'year';

interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

const periods = [
  { key: 'today' as PeriodType, label: 'Aujourd\'hui' },
  { key: 'week' as PeriodType, label: '1 semaine' },
  { key: 'month' as PeriodType, label: '1 mois' },
  { key: '3months' as PeriodType, label: '3 mois' },
  { key: '6months' as PeriodType, label: '6 mois' },
  { key: 'year' as PeriodType, label: '1 an' },
];

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.periodButton,
              selectedPeriod === period.key && styles.periodButtonActive,
            ]}
            onPress={() => onPeriodChange(period.key)}
          >
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.key && styles.periodButtonTextActive,
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    marginBottom: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundWhite,
    marginRight: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
  },
  periodButtonText: {
    color: COLORS.gray[600],
    fontWeight: '500',
    fontSize: 14,
  },
  periodButtonTextActive: {
    color: COLORS.white,
  },
});

export default PeriodSelector; 