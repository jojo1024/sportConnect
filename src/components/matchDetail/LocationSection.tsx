import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Linking } from 'react-native';
import { Match } from '../../services/matchService';
import { COLORS } from '../../theme/colors';

// Constantes
const GOOGLE_MAPS_BASE_URL = 'https://www.google.com/maps/search/?api=1&query=';
const DEFAULT_COORDINATES = { lat: 5.3485, lng: -4.0275 };

interface LocationSectionProps {
    match: Match;
}

const LocationSection: React.FC<LocationSectionProps> = ({ match }) => {
    const handleOpenMaps = useCallback(() => {
        const url = `${GOOGLE_MAPS_BASE_URL}${DEFAULT_COORDINATES.lat},${DEFAULT_COORDINATES.lng}`;
        Linking.openURL(url);
    }, []);

    return (
        <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Localisation du terrain</Text>
            <View style={styles.mapContainer}>
                {/* MapView component would go here */}
            </View>
            <TouchableOpacity style={styles.mapsButton} onPress={handleOpenMaps}>
                <Text style={styles.mapsButtonText}>Ouvrir dans Google Maps</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    detailsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.almostBlack,
        marginBottom: 12,
    },
    mapContainer: {
        borderRadius: 16,
        overflow: 'hidden',
        height: 180,
        marginBottom: 12,
    },
    mapsButton: {
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    mapsButtonText: {
        color: COLORS.primary,
        fontWeight: '500',
        fontSize: 16,
    },
});

export default LocationSection; 