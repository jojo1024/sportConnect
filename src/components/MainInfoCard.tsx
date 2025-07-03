import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface MainInfoCardProps {
    title: string;
    location: string;
    onEdit?: () => void;
    showEditButton?: boolean;
}

const MainInfoCard: React.FC<MainInfoCardProps> = ({
    title,
    location,
    onEdit,
    showEditButton = false
}) => (
    <View style={styles.mainInfo}>
        <View style={styles.titleRow}>
            <Text style={styles.terrainName}>{title}</Text>
            {showEditButton && onEdit && (
                <TouchableOpacity style={styles.editIconButton} onPress={onEdit}>
                    <Ionicons name="create-outline" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            )}
        </View>
        <View style={styles.locationContainer}>
            <Ionicons name="location" size={20} color={COLORS.primary} />
            <Text style={styles.locationText}>{location}</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    mainInfo: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    terrainName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
    },
    editIconButton: {
        padding: 8,
    },
});

export default MainInfoCard; 