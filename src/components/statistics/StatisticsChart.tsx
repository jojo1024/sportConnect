import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { COLORS } from '../../theme/colors';
import { FONTS } from '../../theme/typography';
import { formatShortCurrency } from '../../utils/functions';

interface StatisticsChartProps {
    chartData: {
        labels: string[];
        datasets: Array<{
            data: number[];
        }>;
    };
    chartWidth: number;
    chartHeight: number;
    loadingChart: boolean;
}

const StatisticsChart: React.FC<StatisticsChartProps> = ({
    chartData,
    chartWidth,
    chartHeight,
    loadingChart,
}) => {
    const chartConfig = {
        backgroundGradientFrom: COLORS.white,
        backgroundGradientTo: COLORS.white,
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(56, 182, 249, ${opacity})`, // Utilise COLORS.primary
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity * 0.7})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: COLORS.primary,
        },
        barPercentage: 0.8,
        useShadowColorFromDataset: false,
        formatYLabel: (value: string) => formatShortCurrency(parseInt(value)),
    };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Activité de la semaine (F CFA)</Text>
            {loadingChart ? (
                <View style={[styles.chartContainer, { height: chartHeight, justifyContent: 'center', alignItems: 'center' }]}>
                    <Text style={styles.loadingText}>Chargement...</Text>
                </View>
            ) : (
                <BarChart
                    data={chartData}
                    width={chartWidth}
                    height={chartHeight}
                    yAxisLabel=""
                    yAxisSuffix=""
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    fromZero={true}
                    showBarTops={true}
                    showValuesOnTopOfBars={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginHorizontal: 16,
        marginBottom: 10,
        padding: 20,
        shadowColor: COLORS.black,
        shadowOpacity: 0.07,
        shadowRadius: 8,
        // elevation: 2,
    },
    cardTitle: {
        ...FONTS.fontLg,
        color: COLORS.textLight,
        marginBottom: 6,
    },
    chartContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: 60,
        marginTop: 8,
        marginBottom: 4,
        justifyContent: 'space-between',
    },
    loadingText: {
        ...FONTS.font,
        color: COLORS.textLight,
        textAlign: 'center',
    },
});

export default StatisticsChart; 