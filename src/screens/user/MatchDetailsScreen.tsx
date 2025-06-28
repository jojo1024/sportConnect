import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    Pressable,
    Animated
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { Match, matchService, MatchParticipant } from '../../services/matchService';
import { calculateMatchDuration, extractHour } from '../../utils/functions';
import MapView, { Marker } from 'react-native-maps';
import { Linking } from 'react-native';

const { width: screenWidth, height } = Dimensions.get('window');

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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imagesFlatListRef = useRef<FlatList>(null);
    const [participants, setParticipants] = useState<MatchParticipant[]>([]);
    const [loadingParticipants, setLoadingParticipants] = useState(true);
    const [errorParticipants, setErrorParticipants] = useState<string | null>(null);
    const scaleAnim = useRef<Animated.Value[]>([]);

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

    const handleImageScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentImageIndex(index);
    };

    const renderImage = ({ item, index }: { item: string; index: number }) => (
        <Image
            source={{ uri: item }}
            style={styles.terrainImage}
            resizeMode="cover"
        />
    );

    const images = match.terrainImages && match.terrainImages.length > 0
        ? match.terrainImages
        : ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500'];

    const isMatchFull = match.nbreJoueursInscrits >= match.joueurxMax;
    const availableSpots = match.joueurxMax - match.nbreJoueursInscrits;

    if (scaleAnim.current.length !== match.joueurxMax) {
        scaleAnim.current = Array.from({ length: match.joueurxMax }, () => new Animated.Value(1));
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
            <View style={styles.container}>
                {/* Header avec gradient et bouton retour */}
                <LinearGradient
                    colors={['rgba(0,0,0,0.7)', 'transparent']}
                    style={styles.headerGradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <View style={styles.backButtonInner}>
                                <Ionicons name="arrow-back" size={20} color={COLORS.white} />
                            </View>
                        </TouchableOpacity>
                        {/* <Text style={styles.headerTitle}>Match</Text> */}
                        <View style={styles.placeholder} />
                    </View>
                </LinearGradient>

                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Images du terrain en scroll horizontal */}
                    <View style={styles.imagesContainer}>
                        <FlatList
                            ref={imagesFlatListRef}
                            data={images}
                            renderItem={renderImage}
                            keyExtractor={(item, index) => index.toString()}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            pagingEnabled
                            onMomentumScrollEnd={handleImageScroll}
                            style={styles.imagesScroll}
                        />
                        {images.length > 1 && (
                            <View style={styles.paginationContainer}>
                                {images.map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.paginationDot,
                                            index === currentImageIndex && styles.paginationDotActive
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Titre du match */}
                    <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 8, marginHorizontal: 5 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: COLORS.primary, letterSpacing: 0.5 }}>
                                Match à {`${match.joueurxMax}, ${match.terrainNom}`}
                            </Text>
                        </View>
                    </View>

                    {/* Carte infos principales */}
                    <View style={[styles.card, { marginTop: 10 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Ionicons name="calendar" size={22} color="#888" />
                                <Text style={{ marginTop: 4, fontWeight: '600', fontSize: 12, color: '#666', marginBottom: 2 }}>Date</Text>
                                <Text style={{ fontWeight: '600', fontSize: 14, color: '#222' }}>
                                    {formatDate(match.matchDateDebut)}, {formatTime(match.matchDateDebut)}
                                </Text>
                            </View>
                            <View style={{ width: 1, height: 50, backgroundColor: '#e0e0e0', marginHorizontal: 10 }} />
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Ionicons name="time-outline" size={22} color="#888" />
                                <Text style={{ marginTop: 4, fontWeight: '600', fontSize: 12, color: '#666', marginBottom: 2 }}>Durée</Text>
                                <Text style={{ fontWeight: '600', fontSize: 14, color: '#222' }}>{calculateMatchDuration(match.matchDateDebut, match.matchDateFin)}</Text>
                            </View>
                            <View style={{ width: 1, height: 50, backgroundColor: '#e0e0e0', marginHorizontal: 10 }} />
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <MaterialCommunityIcons name="cash-multiple" size={22} color="#888" />
                                <Text style={{ marginTop: 4, fontWeight: '600', fontSize: 12, color: '#666', marginBottom: 2 }}>Prix</Text>
                                <Text style={{ fontWeight: '600', fontSize: 14, color: '#222' }}>{match.matchPrixParJoueur} F CFA</Text>
                            </View>
                        </View>
                    </View>

                    {/* Consignes du capo */}
                    <View style={[styles.card, { marginTop: 18 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                            <MaterialCommunityIcons name="message-text-outline" size={22} color={COLORS.primary} style={{ marginRight: 6 }} />
                            <Text style={styles.sectionTitle}>Consignes du capo</Text>
                        </View>
                        <View style={{ borderRadius: 14, padding: 14, minHeight: 50, borderWidth: 1, borderColor: '#e3eafc', backgroundColor: '#F8FAFF' }}>
                            {match.matchDescription ? (
                                <Text style={{ fontSize: 15, color: COLORS.black, lineHeight: 22 }}>{match.matchDescription}</Text>
                            ) : (
                                <Text style={{ fontSize: 15, color: '#888', fontStyle: 'italic' }}>Aucune consigne particulière pour cette partie.</Text>
                            )}
                        </View>
                    </View>

                    {/* Participants */}
                    <View style={[styles.card, { marginTop: 18 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                            <MaterialCommunityIcons name="account-group" size={26} color={COLORS.primary} style={{ marginRight: 6 }} />
                            <Text style={styles.sectionTitle}>Participants</Text>
                        </View>
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
                    </View>

                    {/* Carte de localisation du terrain */}
                    <View style={[styles.card, { marginTop: 18 }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                            <Ionicons name="location" size={24} color={COLORS.primary} style={{ marginRight: 6 }} />
                            <Text style={styles.sectionTitle}>Localisation du terrain</Text>
                        </View>
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
                                backgroundColor: COLORS.primary,
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
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Ouvrir dans Google Maps</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Informations importantes */}
                    <View style={[styles.card, { marginTop: 18, marginBottom: 18 }]}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                            <Text style={styles.sectionTitle}>Informations importantes</Text>
                        </View>
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
                                        size={26}
                                        color={COLORS.white}
                                    />
                                    <Text style={[styles.joinButtonText, { fontSize: 20, marginLeft: 14 }]}>
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
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: 30,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    backButtonInner: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 20,
        padding: 8,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    placeholder: {
        width: 36,
    },
    scrollView: {
        flex: 1,
    },
    imagesContainer: {
        position: 'relative',
    },
    imagesScroll: {
        height: 280,
    },
    terrainImage: {
        width: screenWidth,
        height: 280,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        marginHorizontal: 6,
    },
    paginationDotActive: {
        backgroundColor: COLORS.white,
        width: 24,
    },
    imageCounter: {
        position: 'absolute',
        top: 60,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    imageCounterText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    statusBadge: {
        position: 'absolute',
        top: 60,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    statusText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    matchDetailsContainer: {
        padding: 20,
        marginTop: -20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.black,
        marginLeft: 10,
    },
    detailCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    iconContainer: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.black,
        marginBottom: 2,
    },
    detailSubValue: {
        fontSize: 14,
        color: '#888',
        fontWeight: '400',
    },
    separator: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginVertical: 10,
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    availabilityBadge: {
        backgroundColor: '#e8f5e8',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    availabilityBadgeFull: {
        backgroundColor: '#ffe8e8',
    },
    availabilityText: {
        fontSize: 11,
        color: '#2e7d32',
        fontWeight: '600',
    },
    availabilityTextFull: {
        color: '#d32f2f',
    },
    instructionsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    instructionsCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    instructionsText: {
        fontSize: 15,
        color: COLORS.black,
        lineHeight: 24,
        fontWeight: '400',
    },
    noInstructionsContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    noInstructionsText: {
        fontSize: 15,
        color: '#888',
        fontStyle: 'italic',
        lineHeight: 22,
        marginTop: 10,
        textAlign: 'center',
    },
    additionalInfoContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
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
    infoIconContainer: {
        backgroundColor: '#FFE8D6',
        borderRadius: 8,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
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
        paddingVertical: 18,
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
    participantsInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginLeft: 5,
    },
    participantsCount: {
        fontSize: 15,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    participantsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        gap: 10,
        marginBottom: 20,
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
    avatarWrapper: {
        marginBottom: 4,
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
    card: {
        backgroundColor: '#fff',
        borderRadius: 22,
        padding: 18,
        marginHorizontal: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
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
});

export default MatchDetailsScreen; 