import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../theme/colors';

interface BarChartProps {
  data: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
  title?: string;
  height?: number;
  showValues?: boolean;
  isLoading?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  height = 200,
  showValues = true,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View style={[styles.container, { height }]}>
        {title && <View style={styles.loadingTitle} />}
        <View style={styles.chartContainer}>
          {Array.from({ length: 7 }).map((_, index) => (
            <View key={index} style={styles.loadingBar} />
          ))}
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        {title && <Text style={styles.title}>{title}</Text>}
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucune donnée disponible</Text>
        </View>
      </View>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value));
  const barWidth = (screenWidth - 80) / data.length - 8; // 80 pour les marges, 8 pour l'espacement

  return (
    <View style={[styles.container, { height }]}>
      {title && <Text style={styles.title}>{title}</Text>}
      <View style={styles.chartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    width: barWidth,
                    height: maxValue > 0 ? (item.value / maxValue) * (height - 80) : 0,
                    backgroundColor: item.color || COLORS.primary,
                  },
                ]}
              />
              {showValues && (
                <Text style={styles.barValue}>{item.value}</Text>
              )}
            </View>
            <Text style={styles.barLabel} numberOfLines={2}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
            backgroundColor: COLORS.backgroundWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
            shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
            color: COLORS.almostBlack,
    marginBottom: 16,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    alignItems: 'center',
    marginBottom: 8,
  },
  bar: {
    borderRadius: 4,
    minHeight: 4,
  },
  barValue: {
    fontSize: 10,
    fontWeight: '500',
            color: COLORS.gray[600],
    marginTop: 4,
  },
  barLabel: {
    fontSize: 10,
    color: COLORS.gray[400],
    textAlign: 'center',
    fontWeight: '400',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray[400],
    fontStyle: 'italic',
  },
  // Styles pour le loading
  loadingTitle: {
    height: 16,
    backgroundColor: COLORS.gray[300],
    borderRadius: 4,
    marginBottom: 16,
    width: '40%',
  },
  loadingBar: {
    width: 20,
    height: 100,
    backgroundColor: COLORS.gray[300],
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default BarChart; 