import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { calculateMatchDuration, extractHour, getTerrainImage, formatDate, getDateSectionLabel, extractDate } from '../utils/functions';
import { BASE_URL_IMAGES } from '../services/api';
import { Match } from '../services/matchService';

interface MatchCardProps {
    match: Match;
    onPress: (match: Match) => void;
    compact?: boolean; // Option pour un affichage plus compact
    isNewMatch?: boolean;
}

export const MatchCard: React.FC<MatchCardProps> = ({ match, onPress, compact = false, isNewMatch = false }) => {
    const handlePress = () => onPress(match);

    // Extraire la date et l'heure du match
    const matchTime = extractHour(match.matchDateDebut);


    return (
        <TouchableOpacity
            style={styles.cardWrapper}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <View style={styles.card}>
                {/* Indicateur de nouveau match - seulement le petit point orange */}
                {isNewMatch && (
                    <View style={styles.newMatchIndicator}>
                        <View style={styles.newMatchDot} />
                    </View>
                )}
                <Image
                    source={{ uri: `${BASE_URL_IMAGES}/${getTerrainImage(match.terrainImages)}` }}
                    style={styles.image}
                    defaultSource={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500' }}
                />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{match.terrainNom}</Text>
                        <View style={styles.dateTimeBadge}>
                            <Text style={styles.timeLabel}>{matchTime}</Text>
                        </View>
                    </View>
                    <Text style={styles.cardLocation}>{match.terrainLocalisation}</Text>

                    <View style={styles.cardFieldRow}>
                        <Text style={styles.cardFormat}>
                            Temps de jeu: {calculateMatchDuration(match.matchDateDebut, match.matchDateFin)}
                        </Text>
                    </View>
                    <View style={styles.cardCodeRow}>
                        <Text style={styles.cardCode}>Code: {match.codeMatch}</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.capo}>Capo: {match?.capoNomUtilisateur?.slice(0, 15)}</Text>
                        <View style={styles.playersRow}>
                            <Text style={styles.players}>
                                {match.nbreJoueursInscrits}/{match.joueurxMax}
                            </Text>
                            <MaterialCommunityIcons
                                name="account"
                                size={16}
                                color="#bbb"
                                style={{ marginLeft: 3 }}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.clickIndicator}>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    cardWrapper: {
        marginBottom: 15,
        marginHorizontal: 2,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 22,
        overflow: 'hidden',
        elevation: 0.3,
        shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.10,
        shadowRadius: 6,
        minHeight: 110,
        position: 'relative',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 18,
        margin: 10,
    },
    cardContent: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 14,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#222',
        flex: 1,
        flexWrap: 'wrap',
    },
    dateTimeBadge: {
        backgroundColor: '#f2f3f7',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: 'flex-start',
        marginLeft: 8,
        alignItems: 'center',
    },
    dateLabel: {
        fontSize: 11,
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 1,
    },
    timeLabel: {
        fontSize: 13,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    cardLocation: {
        fontSize: 13,
        color: '#666',
        marginBottom: 2,
        marginTop: 2,
    },
    cardDateRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 4,
    },
    dateIcon: {
        marginRight: 4,
    },
    cardDate: {
        fontSize: 12,
        color: '#777',
        fontWeight: '500',
    },
    cardFieldRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 4,
    },
    cardFormat: {
        fontSize: 13,
        color: '#555',
    },
    cardCodeRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardCode: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    capo: {
        fontSize: 12,
        color: COLORS.primary,
    },
    playersRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    players: {
        fontSize: 12,
        color: '#888',
    },
    clickIndicator: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -10 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    newMatchIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },
    newMatchDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
}); 