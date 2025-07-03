import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface DetailRowProps {
    icon: string;
    label: string;
    value: string;
    onCopy?: () => void;
    copied?: boolean;
    iconColor?: string;
}

interface DetailCardProps {
    title: string;
    children: React.ReactNode;
    style?: any;
}

export const DetailRow: React.FC<DetailRowProps> = ({
    icon,
    label,
    value,
    onCopy,
    copied = false,
    iconColor = COLORS.primary
}) => (
    <View style={styles.detailRow}>
        <View style={styles.detailIcon}>
            <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
        {onCopy && (
            <TouchableOpacity
                style={[styles.copyButton, copied && styles.copyButtonActive]}
                onPress={onCopy}
            >
                <Ionicons
                    name={copied ? "checkmark" : "copy-outline"}
                    size={20}
                    color={copied ? "#4CAF50" : COLORS.primary}
                />
            </TouchableOpacity>
        )}
    </View>
);

const DetailCard: React.FC<DetailCardProps> = ({ title, children, style }) => (
    <View style={[styles.detailsSection, style]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.detailCard}>
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
    detailsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    detailCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    copyButton: {
        padding: 4,
        borderRadius: 6,
    },
    copyButtonActive: {
        backgroundColor: '#e8f5e8',
    },
});

export default DetailCard; 