import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL_IMAGES } from '../../services/api';
import { Terrain } from '../../services/terrainService';
import { formatHoraires, getStatusColor, getStatusText, getTerrainImage } from '../../utils/functions';
import { COLORS } from '../../theme/colors';

export interface TerrainCardProps {
    terrain: Terrain;
    onPress: (terrain: Terrain) => void;
}

const TerrainCard: React.FC<TerrainCardProps> = ({ terrain, onPress }) => {


    return (
        <TouchableOpacity
            style={styles.terrainCard}
            onPress={() => onPress(terrain)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: `${BASE_URL_IMAGES}/${getTerrainImage(terrain.terrainImages)}` }}
                    style={styles.terrainImage}
                />
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(terrain.terrainDisponibilite) }]}>
                    <Text style={[
                        styles.statusText,
                        { color: COLORS.white }
                    ]}>
                        {getStatusText(terrain.terrainDisponibilite)}
                    </Text>
                </View>
            </View>
            <View style={styles.terrainInfo}>
                <Text style={styles.terrainName}>{terrain.terrainNom}</Text>
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color={COLORS.darkGray} />
                    <Text style={styles.terrainLocation}>{terrain.terrainLocalisation}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="time-outline" size={16} color={COLORS.darkGray} />
                            <Text style={styles.detailValue}>{formatHoraires(terrain.terrainHoraires)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="people-outline" size={16} color={COLORS.darkGray} />
                            <Text style={styles.detailValue}>{terrain?.reservationsEnAttenteCount || 0} réservations</Text>
                        </View>
                    </View>
                    <View style={styles.priceContainer}>
                        <Ionicons name="cash-outline" size={16} color={COLORS.darkGray} />
                        <Text style={styles.priceText}>{terrain.terrainPrixParHeure} XOF/heure</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    terrainCard: {
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
    },
    terrainImage: {
        width: '100%',
        height: 200,
    },
    statusBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 12,
    },
    terrainInfo: {
        padding: 16,
    },
    terrainName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.almostBlack,
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    terrainLocation: {
        fontSize: 14,
        color: COLORS.darkGray,
        marginLeft: 4,
    },
    detailsContainer: {
        backgroundColor: COLORS.gray[100],
        padding: 12,
        borderRadius: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailValue: {
        fontSize: 14,
        color: COLORS.almostBlack,
        marginLeft: 6,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.gray[200],
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    priceText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.almostBlack,
        marginLeft: 6,
    },
});

export default TerrainCard;
