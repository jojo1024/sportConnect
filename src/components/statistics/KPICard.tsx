import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: keyof typeof Ionicons.glyphMap;
    color?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    isLoading?: boolean;
}

const KPICard: React.FC<KPICardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color = COLORS.primary,
    trend,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <View style={styles.card}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                        <Ionicons name="ellipsis-horizontal" size={20} color={color} />
                    </View>
                </View>
                <View style={styles.content}>
                    <View style={styles.loadingTitle} />
                    <View style={styles.loadingValue} />
                    {subtitle && <View style={styles.loadingSubtitle} />}
                </View>
            </View>
        );
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Ionicons name={icon} size={20} color={color} />
                </View>
                {trend && (
                    <View style={[styles.trendContainer, { backgroundColor: trend.isPositive ? '#10B981' + '20' : '#EF4444' + '20' }]}>
                        <Ionicons
                            name={trend.isPositive ? 'trending-up' : 'trending-down'}
                            size={12}
                            color={trend.isPositive ? '#10B981' : '#EF4444'}
                        />
                        <Text style={[styles.trendText, { color: trend.isPositive ? '#10B981' : '#EF4444' }]}>
                            {trend.isPositive ? '+' : ''}{trend.value.toFixed(1)}%
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.value}>{value}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    trendText: {
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 4,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '400',
    },
    // Styles pour le loading
    loadingTitle: {
        height: 14,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 8,
        width: '60%',
    },
    loadingValue: {
        height: 24,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 4,
        width: '80%',
    },
    loadingSubtitle: {
        height: 12,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        width: '40%',
    },
});

export default KPICard; 