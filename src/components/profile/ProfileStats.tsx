import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

interface ProfileStatsProps {
    games: number;
    fields: number;
    hours: number;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ games, fields, hours }) => (
    <View style={styles.container}>
        <View style={styles.statItem}>
                <FontAwesome5 name="futbol" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{games}</Text>
            <Text style={styles.statLabel}>Parties</Text>
        </View>
        <View style={styles.statItem}>
            <MaterialCommunityIcons name="soccer-field" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{fields}</Text>
            <Text style={styles.statLabel}>Terrains</Text>
        </View>
        <View style={styles.statItem}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statNumber}>{hours}</Text>
            <Text style={styles.statLabel}>Heures</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        paddingVertical: 13,
        borderRadius: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    statItem: { alignItems: 'center', flex: 1 },
    statNumber: { fontSize: 20, fontWeight: 'bold', color: '#222', marginTop: 6 },
    statLabel: { fontSize: 13, color: '#888', marginTop: 2 },
});

export default ProfileStats; 