import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TabIndicatorProps {
    title: string;
    count?: number;
    icon?: string;
    isActive?: boolean;
}

export const TabIndicator: React.FC<TabIndicatorProps> = ({
    title,
    count = 0,
    icon,
    isActive = false
}) => {
    return (
        <View style={[styles.container, isActive && styles.activeContainer]}>
            {icon && (
                <Ionicons
                    name={icon as any}
                    size={16}
                    color={isActive ? '#1a1a1a' : '#888'}
                    style={styles.icon}
                />
            )}
            <Text style={[styles.title, isActive && styles.activeTitle]}>
                {title}
            </Text>
            {count > 0 && (
                <View style={[styles.badge, isActive && styles.activeBadge]}>
                    <Text style={[styles.badgeText, isActive && styles.activeBadgeText]}>
                        {count > 99 ? '99+' : count}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    activeContainer: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    icon: {
        marginRight: 6,
    },
    title: {
        fontSize: 14,
        fontWeight: '500',
        color: '#888',
    },
    activeTitle: {
        color: '#1a1a1a',
        fontWeight: '600',
    },
    badge: {
        backgroundColor: '#E2E8F0',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 6,
        minWidth: 20,
        alignItems: 'center',
    },
    activeBadge: {
        backgroundColor: '#10B981',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
    },
    activeBadgeText: {
        color: '#fff',
    },
}); 