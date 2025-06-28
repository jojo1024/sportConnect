import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../theme/colors';
import { Match } from '../../services/matchService';
import { calculateMatchDuration } from '../../utils/functions';
import { matchService } from '../../services/matchService';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectUser } from '../../store/slices/userSlice';
import { SuccessModal } from '../../components/SuccessModal';
import CompactErrorCard from '../../components/CompactErrorCard';

interface MatchSummaryScreenProps {
    route: {
        params: {
            match: Match;
        };
    };
    navigation: any;
}

const MatchSummaryScreen: React.FC<MatchSummaryScreenProps> = ({ route, navigation }) => {
    const { match } = route.params;
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccessCard, setShowSuccessCard] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<any>(null);
    const user = useAppSelector(selectUser);

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

    const handlePayment = async () => {
        if (!acceptedTerms) {
            Alert.alert('Conditions requises', 'Veuillez accepter les termes et conditions pour continuer.');
            return;
        }

        if (!user?.utilisateurId) {
            Alert.alert('Erreur', 'Utilisateur non connecté.');
            return;
        }

        setIsProcessing(true);
        try {
            const result = await matchService.participateInMatch(match.matchId);
            console.log(`🚀 ~ handlePayment ~ result:`, result)

            // Effacer toute erreur précédente
            setErrorMessage(null);

            // Afficher la carte de succès
            setSuccessData(result.data);
            setShowSuccessCard(true);
            setIsProcessing(false);
        } catch (error: any) {
            setIsProcessing(false);
            console.error('Erreur lors du paiement:', error);

            // Extraire le message d'erreur de la réponse API
            const errorMessage = error?.response?.data?.message || error?.message || 'Une erreur est survenue lors du paiement.';

            setErrorMessage(errorMessage);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessCard(false);
        setErrorMessage(null);
        navigation.navigate('MainTabs');
    };

    const handleRetry = () => {
        setErrorMessage(null);
        handlePayment();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Résumé de la partie</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Affichage de l'erreur en haut du scroll */}
                {errorMessage && (
                    <CompactErrorCard
                        message={errorMessage}
                        onRetry={handleRetry}
                    />
                )}

                {/* Titre du match */}
                <View style={{ alignItems: 'center', marginTop: 24, marginBottom: 8, marginHorizontal: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                        <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', color: COLORS.primary, letterSpacing: 0.5 }}>
                            Match à {`${match.joueurxMax}, ${match.terrainNom}`}
                        </Text>
                    </View>
                </View>

                {/* Carte infos principales - Même style que MatchDetailsScreen */}
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
                            <MaterialCommunityIcons name="currency-btc" size={22} color="#888" />
                            <Text style={{ marginTop: 4, fontWeight: '600', fontSize: 12, color: '#666', marginBottom: 2 }}>Prix</Text>
                            <Text style={{ fontWeight: '600', fontSize: 14, color: '#222' }}>{match.matchPrixParJoueur} F</Text>
                        </View>
                    </View>
                </View>

                {/* Conditions d'utilisation */}
                <View style={styles.termsCard}>
                    <Text style={styles.termsTitle}>Conditions d'utilisation</Text>

                    <View style={styles.termsContent}>
                        <ScrollView
                            style={styles.termsScrollView}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                        >
                            <Text style={styles.termsText}>
                                En rejoignant cette partie, vous acceptez les conditions suivantes :{'\n\n'}

                                <Text style={styles.termsBold}>1. Engagement de participation :</Text>{'\n'}
                                • Vous vous engagez à participer au match à la date et heure indiquées{'\n'}
                                • En cas d'absence, vous ne serez pas remboursé{'\n\n'}

                                <Text style={styles.termsBold}>2. Règles de jeu :</Text>{'\n'}
                                • Respectez les règles établies par le capo{'\n'}
                                • Comportement sportif obligatoire{'\n'}
                                • Équipement approprié requis{'\n\n'}

                                <Text style={styles.termsBold}>3. Remboursement :</Text>{'\n'}
                                • Remboursement possible jusqu'à 24h avant le match{'\n'}
                                • Aucun remboursement en cas d'annulation tardive{'\n'}
                                • Remboursement en crédit application uniquement{'\n\n'}

                                <Text style={styles.termsBold}>4. Responsabilité :</Text>{'\n'}
                                • Vous participez à vos propres risques{'\n'}
                                • L'application n'est pas responsable des blessures{'\n'}
                                • Respectez les consignes de sécurité{'\n\n'}

                                <Text style={styles.termsBold}>5. Paiement :</Text>{'\n'}
                                • Paiement sécurisé via Wave{'\n'}
                                • Aucun frais supplémentaire{'\n'}
                                • Confirmation immédiate après paiement
                            </Text>
                        </ScrollView>
                    </View>
                </View>

                {/* Checkbox pour accepter les conditions */}
                <View style={styles.checkboxContainer}>
                    <TouchableOpacity
                        style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
                        onPress={() => setAcceptedTerms(!acceptedTerms)}
                        activeOpacity={0.7}
                    >
                        {acceptedTerms && (
                            <Ionicons name="checkmark" size={18} color={COLORS.white} />
                        )}
                    </TouchableOpacity>
                    <View style={styles.checkboxTextContainer}>
                        <Text style={styles.checkboxText}>
                            J'ai lu et j'accepte les{' '}
                            <Text style={styles.checkboxTextBold}>termes et conditions</Text>
                        </Text>
                    </View>
                </View>

                {/* Espace en bas pour le bouton */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bouton de paiement */}
            <View style={styles.paymentButtonContainer}>
                <LinearGradient
                    colors={acceptedTerms ? [COLORS.primary, '#FF6B35'] : ['#ccc', '#bbb']}
                    style={styles.paymentButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <TouchableOpacity
                        style={styles.paymentButton}
                        onPress={handlePayment}
                        activeOpacity={0.85}
                        disabled={!acceptedTerms || isProcessing}
                    >
                        {isProcessing ? (
                            <ActivityIndicator color={COLORS.white} size="small" />
                        ) : (
                            <>
                                <MaterialCommunityIcons
                                    name="wave"
                                    size={24}
                                    color={COLORS.white}
                                />
                                <Text style={styles.paymentButtonText}>
                                    Payer avec Wave
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </LinearGradient>
            </View>

            {/* Cartes de résultat */}
            {showSuccessCard && successData && (
                <SuccessModal
                    visible={showSuccessCard}
                    onClose={handleSuccessClose}
                    matchCode={successData?.matchCode}
                    title='Succès!'
                    subtitle='Vous avez rejoint la partie avec succès'
                    matchDetails={{
                        terrainName: match.terrainNom,
                        date: formatDate(match.matchDateDebut),
                        time: formatTime(match.matchDateDebut),
                        duration: match.matchDuree,
                        participants: successData.participantsCount,
                        matchPrixParJoueur: successData.prixPaye,
                    }}
                />
            )}


        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    placeholder: {
        width: 34,
    },
    scrollView: {
        flex: 1,
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
    paymentCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginTop: 18,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    paymentTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 16,
    },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    paymentLabel: {
        fontSize: 16,
        color: '#666',
    },
    paymentValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '600',
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    totalLabel: {
        fontSize: 18,
        color: COLORS.black,
        fontWeight: 'bold',
    },
    totalValue: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    termsCard: {
        backgroundColor: COLORS.white,
        marginHorizontal: 16,
        marginBottom: 16,
        marginTop: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    termsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
        marginBottom: 16,
    },
    termsContent: {
        maxHeight: 200,
    },
    termsText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    termsBold: {
        fontWeight: 'bold',
        color: COLORS.black,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#ddd',
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    checkboxTextContainer: {
        flex: 1,
    },
    checkboxText: {
        fontSize: 15,
        color: COLORS.black,
        fontWeight: '500',
        lineHeight: 20,
        marginBottom: 4,
    },
    checkboxTextBold: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    checkboxSubtext: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        fontStyle: 'italic',
    },
    paymentButtonContainer: {
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
    paymentButtonGradient: {
        borderRadius: 16,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    paymentButton: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentButtonText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    termsScrollView: {
        maxHeight: 200,
    },
});

export default MatchSummaryScreen; 