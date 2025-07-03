import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    Animated,
    Image
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { Match, matchService, MatchParticipant } from '../../services/matchService';
import { calculateMatchDuration } from '../../utils/functions';
import { Linking } from 'react-native';
import ImageGallery from '../../components/ImageGallery';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import DetailCard, { DetailRow } from '../../components/DetailCard';
import MainInfoCard from '../../components/MainInfoCard';

interface MatchDetailsScreenProps {
    route: {
        params: {
            match: Match;
        };
    };
    navigation: any;
}

const MatchDetailsScreen: React.FC<MatchDetailsScreenProps> = ({ route, navigation }) => {
    const { match } = route.params;
    console.log("🚀 ~ match:", match)
    const [isJoining, setIsJoining] = useState(false);
    const [participants, setParticipants] = useState<MatchParticipant[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [errorParticipants, setErrorParticipants] = useState<string | null>(null);
    const scaleAnim = React.useRef<Animated.Value[]>([]);

    useEffect(() => {
        const fetchParticipants = async () => {
            setLoadingParticipants(true);
            setErrorParticipants(null);
            try {
                const data = await matchService.fetchMatchParticipants(match.matchId);
                setParticipants(data);
            } catch (err: any) {
                setErrorParticipants('Erreur lors du chargement des participants');
            } finally {
                setLoadingParticipants(false);
            }
        };
        fetchParticipants();
    }, [match.matchId]);

    const handleJoinMatch = async () => {
        setIsJoining(true);
        try {
            // Rediriger vers l'écran de résumé de la partie
            navigation.navigate('MatchSummary', { match });
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de rejoindre la partie pour le moment.');
        } finally {
            setIsJoining(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const isMatchFull = match.nbreJoueursInscrits >= match.joueurxMax;
    const availableSpots = match.joueurxMax - match.nbreJoueursInscrits;

    if (scaleAnim.current.length !== match.joueurxMax) {
        scaleAnim.current = Array.from({ length: match.joueurxMax }, () => new Animated.Value(1));
    }

    const rightComponent = (
        <View style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 }}>
            <Text style={{ fontSize: 15, textAlign: 'center', color: COLORS.white }}>{participants.length}/{match.joueurxMax} joueurs</Text>
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
            <View style={styles.container}>
                <HeaderWithBackButton
                    onBack={() => navigation.goBack()}
                    rightComponent={rightComponent}
                />

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <ImageGallery
                        images={match.terrainImages || []}
                        height={280}
                    />

                    <MainInfoCard
                        title={match.terrainNom}
                        location={match.terrainLocalisation}
                    />

                    {/* Informations du match */}
                    <DetailCard title="Informations du match">
                        <DetailRow
                            icon="calendar-outline"
                            label="Date et heure"
                            value={`${formatDate(match.matchDateDebut)}, ${formatTime(match.matchDateDebut)}`}
                        />
                        <DetailRow
                            icon="time-outline"
                            label="Durée du match"
                            value={calculateMatchDuration(match.matchDateDebut, match.matchDateFin)}
                        />
                        <DetailRow
                            icon="cash-outline"
                            label="Prix par joueur"
                            value={`${match.matchPrixParJoueur} F CFA`}
                            iconColor={COLORS.primary}
                        />
                    </DetailCard>

                    {/* Consignes du capo */}
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Consignes du capo</Text>
                        <View style={styles.descriptionCard}>
                            {match.matchDescription ? (
                                <Text style={styles.descriptionText}>{match.matchDescription}</Text>
                            ) : (
                                <Text style={styles.descriptionText}>Aucune consigne particulière pour cette partie.</Text>
                            )}
                        </View>
                    </View>

                    {/* Participants */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Participants</Text>

                        {loadingParticipants ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Chargement des participants...</Text>
                            </View>
                        ) : errorParticipants ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle-outline" size={48} color="#FF6B35" />
                                <Text style={styles.errorTitle}>Erreur de chargement</Text>
                                <Text style={styles.errorText}>{errorParticipants}</Text>
                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={() => {
                                        setLoadingParticipants(true);
                                        setErrorParticipants(null);
                                        matchService.fetchMatchParticipants(match.matchId)
                                            .then(data => setParticipants(data))
                                            .catch(() => setErrorParticipants('Erreur lors du chargement des participants'))
                                            .finally(() => setLoadingParticipants(false));
                                    }}
                                >
                                    <Text style={styles.retryButtonText}>Réessayer</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <Text style={{ marginBottom: 12, fontSize: 15, textAlign: 'center' }}>{participants.length}/{match.joueurxMax} joueurs</Text>
                                <FlatList
                                    data={[...participants, ...Array(Math.max(0, match.joueurxMax - participants.length)).fill(null)]}
                                    keyExtractor={(item, idx) => item ? String(item.participantId) : `empty-${idx}`}
                                    numColumns={3}
                                    columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 18, paddingHorizontal: 2 }}
                                    renderItem={({ item: p, index: idx }) => (
                                        p ? (
                                            <View style={[styles.participantItem, idx === 0 && styles.capoItem]}>
                                                {idx === 0 && (
                                                    <View style={styles.capoBadge}>
                                                        <MaterialCommunityIcons name="crown" size={13} color="#fff" style={{ marginRight: 3 }} />
                                                        <Text style={styles.capoText}>Capo</Text>
                                                    </View>
                                                )}
                                                <View style={[styles.avatarContainer, idx === 0 && styles.capoAvatar]}>
                                                    {p.utilisateurPhoto ? (
                                                        <Image source={{ uri: p.utilisateurPhoto }} style={styles.avatar} />
                                                    ) : (
                                                        <Ionicons name="person-circle-outline" size={54} color="#bbb" />
                                                    )}
                                                </View>
                                                <Text style={[styles.participantName, idx === 0 && styles.capoName]} numberOfLines={1}>
                                                    {p.utilisateurNom}
                                                </Text>
                                                {p.utilisateurTelephone && (
                                                    <Text style={styles.participantPhone} numberOfLines={1}>
                                                        {p.utilisateurTelephone}
                                                    </Text>
                                                )}
                                            </View>
                                        ) : (
                                            <View style={styles.emptySlot}>
                                                <Ionicons name="add-circle-outline" size={38} color="#ccc" />
                                            </View>
                                        )
                                    )}
                                />
                            </>
                        )}
                    </View>

                    {/* Carte de localisation du terrain */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Localisation du terrain</Text>
                        <View style={{ borderRadius: 16, overflow: 'hidden', height: 180, marginBottom: 12 }}>
                            {/* <MapView
                                style={{ flex: 1 }}
                                initialRegion={{
                                    latitude: 5.3485,
                                    longitude: -4.0275,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01,
                                }}
                                scrollEnabled={false}
                                zoomEnabled={false}
                            >
                                <Marker
                                    coordinate={{
                                        latitude: 5.3485,
                                        longitude: -4.0275,
                                    }}
                                    title={match.terrainNom}
                                    description={match.terrainLocalisation}
                                />
                            </MapView> */}
                        </View>
                        <TouchableOpacity
                            style={{
                                // backgroundColor: COLORS.primary,
                                borderWidth: 1,
                                borderColor: COLORS.primary,
                                borderRadius: 12,
                                paddingVertical: 12,
                                alignItems: 'center',
                                marginHorizontal: 10,
                            }}
                            onPress={() => {
                                const lat = 5.3485;
                                const lng = -4.0275;
                                const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
                                Linking.openURL(url);
                            }}
                        >
                            <Text style={{ color: COLORS.primary, fontWeight: '500', fontSize: 16 }}>Ouvrir dans Google Maps</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Informations importantes */}
                    <View style={styles.detailsSection}>
                        <Text style={styles.sectionTitle}>Informations importantes</Text>
                        <View style={styles.infoCard}>
                            <View style={styles.infoRow}>
                                <Ionicons name="checkmark-circle-outline" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                                <Text style={styles.infoText}>Vous vous inscrivez pour réserver votre place</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Ionicons name="location-outline" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                                <Text style={styles.infoText}>Vous vous rendez sur le lieu à l'heure</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="account-star-outline" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                                <Text style={styles.infoText}>Le capo vous accueillera sur place</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="tshirt-crew-outline" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                                <Text style={styles.infoText}>Venez avec un t-shirt clair et sombre</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="soccer" size={18} color={COLORS.primary} style={{ marginRight: 10 }} />
                                <Text style={styles.infoText}>Tout le monde joue le gardien une fois</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={18} color="#FF6B35" style={{ marginRight: 10 }} />
                                <Text style={[styles.infoText, { color: '#FF6B35', fontWeight: 'bold' }]}>Important : Veuillez vous retirer au moins 24 heures avant le début du match pour être remboursé en crédit</Text>
                            </View>
                        </View>
                    </View>

                    {/* Espace en bas pour le bouton */}
                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Bouton rejoindre la partie amélioré */}
                <View style={[styles.joinButtonContainer, { paddingHorizontal: 30 }]}>
                    <LinearGradient
                        colors={isMatchFull ? ['#ccc', '#bbb'] : [COLORS.primary, '#FF6B35']}
                        style={[styles.joinButtonGradient, { borderRadius: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <TouchableOpacity
                            style={[styles.joinButton, { paddingVertical: 14 }]}
                            onPress={handleJoinMatch}
                            disabled={isMatchFull || isJoining}
                            activeOpacity={0.85}
                        >
                            {isJoining ? (
                                <ActivityIndicator color={COLORS.white} size="small" />
                            ) : (
                                <>
                                    <Ionicons
                                        name={isMatchFull ? "close-circle" : "add-circle"}
                                        size={20}
                                        color={COLORS.white}
                                    />
                                    <Text style={[styles.joinButtonText, { fontSize: 16, marginLeft: 14 }]}>
                                        {isMatchFull ? 'Partie complète' : 'Rejoindre la partie'}
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    scrollView: {
        flex: 1,
    },
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
    descriptionSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    descriptionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    infoCard: {
        backgroundColor: '#FFF8F0',
        borderRadius: 20,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        fontWeight: '400',
    },
    joinButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: COLORS.white,
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    joinButtonGradient: {
        borderRadius: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    joinButton: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    joinButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    participantItem: {
        width: '28%',
        alignItems: 'center',
        margin: '2%',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#eee',
    },
    participantName: {
        fontSize: 13,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        marginBottom: 2,
    },
    participantPhone: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
    },
    capoItem: {
        backgroundColor: '#FFF8F0',
        borderColor: COLORS.primary,
    },
    capoBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        zIndex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    capoText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: 'bold',
    },
    avatarContainer: {
        marginBottom: 6,
        borderRadius: 40,
        padding: 2,
    },
    capoAvatar: {
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    capoName: {
        color: COLORS.primary,
    },
    emptySlot: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f6f6f6',
        borderRadius: 18,
        paddingVertical: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        justifyContent: 'center',
        minWidth: 90,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 20,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6B35',
        marginTop: 12,
        marginBottom: 8,
    },
    errorText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 8,
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default MatchDetailsScreen; 