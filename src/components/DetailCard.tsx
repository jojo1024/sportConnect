import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface InfoItemRowProps {
    icon: string;
    label: string;
    value: string;
    onCopy?: () => void;
    copied?: boolean;
    iconColor?: string;
}

interface InfoSectionCardProps {
    title: string;
    children: React.ReactNode;
    style?: any;
}

export const InfoItemRow: React.FC<InfoItemRowProps> = ({
    icon,
    label,
    value,
    onCopy,
    copied = false,
    iconColor = COLORS.primary
}) => (
    <View style={styles.infoItemRow}>
        <View style={styles.infoItemIcon}>
            <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <View style={styles.infoItemContent}>
            <Text style={styles.infoItemLabel}>{label}</Text>
            <Text style={styles.infoItemValue}>{value}</Text>
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

const InfoSectionCard: React.FC<InfoSectionCardProps> = ({ title, children, style }) => (
    <View style={[styles.infoSection, style]}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <View style={styles.infoSectionCard}>
            {children}
        </View>
    </View>
);

const styles = StyleSheet.create({
    infoSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    infoSectionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    infoItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    infoItemContent: {
        flex: 1,
    },
    infoItemLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    infoItemValue: {
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

export default InfoSectionCard; 