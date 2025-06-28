import React, { useState, useRef } from 'react';
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
    FlatList
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { Match } from '../../services/matchService';
import { calculateMatchDuration, extractHour } from '../../utils/functions';

const { width: screenWidth } = Dimensions.get('window');

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
    const [isJoining, setIsJoining] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imagesFlatListRef = useRef<FlatList>(null);

    const handleJoinMatch = async () => {
        setIsJoining(true);
        try {
            // TODO: Implémenter la logique pour rejoindre le match
            Alert.alert(
                'Rejoindre la partie',
                `Voulez-vous rejoindre la partie sur ${match.terrainNom} ?`,
                [
                    {
                        text: 'Annuler',
                        style: 'cancel',
                    },
                    {
                        text: 'Rejoindre',
                        onPress: () => {
                            // Appel API pour rejoindre le match
                            console.log('Rejoindre le match:', match.matchId);
                            Alert.alert('Succès', 'Vous avez rejoint la partie avec succès !');
                        },
                    },
                ]
            );
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

    return (
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
                    <Text style={styles.headerTitle}>Match</Text>
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

                    {/* Indicateurs de pagination améliorés */}
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

                    {/* Compteur d'images amélioré */}
                    {images.length > 1 && (
                        <View style={styles.imageCounter}>
                            <Text style={styles.imageCounterText}>
                                {currentImageIndex + 1} / {images.length}
                            </Text>
                        </View>
                    )}

                    {/* Badge de statut du match */}
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>
                            {isMatchFull ? 'COMPLET' : 'DISPONIBLE'}
                        </Text>
                    </View>
                </View>

                {/* Détails du match avec design amélioré */}
                <View style={styles.matchDetailsContainer}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="information-circle" size={24} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Informations de la partie</Text>
                    </View>

                    <View style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="location" size={20} color={COLORS.white} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Terrain</Text>
                                <Text style={styles.detailValue}>{match.terrainNom}</Text>
                                <Text style={styles.detailSubValue}>{match.terrainLocalisation}</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="calendar" size={20} color={COLORS.white} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Date et heure</Text>
                                <Text style={styles.detailValue}>{formatDate(match.matchDateDebut)}</Text>
                                <Text style={styles.detailSubValue}>
                                    {formatTime(match.matchDateDebut)} - {formatTime(match.matchDateFin)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="clock-outline" size={20} color={COLORS.white} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Durée</Text>
                                <Text style={styles.detailValue}>
                                    {calculateMatchDuration(match.matchDateDebut, match.matchDateFin)}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="account-group" size={20} color={COLORS.white} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Participants</Text>
                                <View style={styles.participantsContainer}>
                                    <Text style={styles.detailValue}>
                                        {match.nbreJoueursInscrits}/{match.joueurxMax} joueurs
                                    </Text>
                                    <View style={[
                                        styles.availabilityBadge,
                                        isMatchFull && styles.availabilityBadgeFull
                                    ]}>
                                        <Text style={[
                                            styles.availabilityText,
                                            isMatchFull && styles.availabilityTextFull
                                        ]}>
                                            {isMatchFull ? 'COMPLET' : `${availableSpots} place(s)`}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="currency-cny" size={20} color={COLORS.white} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Prix par heure</Text>
                                <Text style={styles.detailValue}>{match.terrainPrixParHeure} FCFA</Text>
                            </View>
                        </View>

                        <View style={styles.separator} />

                        <View style={styles.detailRow}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="account" size={20} color={COLORS.white} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Organisateur (Capo)</Text>
                                <Text style={styles.detailValue}>{match.capoNomUtilisateur}</Text>
                                <Text style={styles.detailSubValue}>{match.capoCommune}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Consignes du capo avec design amélioré */}
                <View style={styles.instructionsContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="message-text" size={24} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Consignes du Capo</Text>
                    </View>
                    <View style={styles.instructionsCard}>
                        {match.matchDescription ? (
                            <Text style={styles.instructionsText}>{match.matchDescription}</Text>
                        ) : (
                            <View style={styles.noInstructionsContainer}>
                                <MaterialCommunityIcons name="message-outline" size={32} color="#ccc" />
                                <Text style={styles.noInstructionsText}>
                                    Aucune consigne particulière pour cette partie.
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Informations importantes avec design amélioré */}
                <View style={styles.additionalInfoContainer}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="shield-checkmark" size={24} color={COLORS.primary} />
                        <Text style={styles.sectionTitle}>Informations importantes</Text>
                    </View>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <Ionicons name="time" size={16} color="#FF6B35" />
                            </View>
                            <Text style={styles.infoText}>
                                Vous pouvez vous retirer jusqu'à 2h avant le début de la partie
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialCommunityIcons name="credit-card" size={16} color="#FF6B35" />
                            </View>
                            <Text style={styles.infoText}>
                                Le paiement est obligatoire pour confirmer votre participation
                            </Text>
                        </View>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconContainer}>
                                <MaterialCommunityIcons name="cash-refund" size={16} color="#FF6B35" />
                            </View>
                            <Text style={styles.infoText}>
                                Remboursement en crédits en cas d'annulation
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Espace en bas pour le bouton */}
                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bouton rejoindre la partie amélioré */}
            <View style={styles.joinButtonContainer}>
                <LinearGradient
                    colors={isMatchFull ? ['#ccc', '#bbb'] : [COLORS.primary, '#FF6B35']}
                    style={styles.joinButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <TouchableOpacity
                        style={styles.joinButton}
                        onPress={handleJoinMatch}
                        disabled={isMatchFull || isJoining}
                    >
                        {isJoining ? (
                            <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                            <>
                                <Ionicons
                                    name={isMatchFull ? "close-circle" : "add-circle"}
                                    size={24}
                                    color={COLORS.white}
                                />
                                <Text style={styles.joinButtonText}>
                                    {isMatchFull ? 'Partie complète' : 'Rejoindre la partie'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
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
        borderLeftColor: '#FF6B35',
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
});

export default MatchDetailsScreen; 