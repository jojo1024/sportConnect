import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Match } from '../../services/matchService';
import { calculateMatchDuration, formatDateLong, formatTime } from '../../utils/functions';
import { SuccessModal } from '../../components/SuccessModal';
import CompactErrorCard from '../../components/CompactErrorCard';
import InfoSectionCard, { InfoItemRow } from '../../components/DetailCard';
import { useMatchSummary } from '../../hooks/useMatchSummary';
import { Header, TermsSection, PaymentButton } from '../../components/matchSummary';

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

    const {
        acceptedTerms,
        isProcessing,
        showSuccessCard,
        errorMessage,
        successData,
        handlePayment,
        handleSuccessClose,
        handleRetry,
        toggleTermsAcceptance,
    } = useMatchSummary({ match, navigation });

    return (
        <SafeAreaView style={styles.container}>
            <Header onBackPress={() => navigation.goBack()} />

                {/* Affichage de l'erreur en haut du scroll */}
                {errorMessage && (
                    <CompactErrorCard
                        message={errorMessage}
                        onRetry={handleRetry}
                    />
                )}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>

                <View style={{ marginBottom: 15 }}></View>

                {/* Informations du match */}
                <InfoSectionCard title="Informations du match">
                    <InfoItemRow
                        icon="calendar-outline"
                        label="Date et heure"
                        value={`${formatDateLong(match.matchDateDebut)}, ${formatTime(match.matchDateDebut)}`}
                    />
                    <InfoItemRow
                        icon="time-outline"
                        label="Durée du match"
                        value={calculateMatchDuration(match.matchDateDebut, match.matchDateFin)}
                    />
                    <InfoItemRow
                        icon={match.sportIcone || "football-outline"}
                        label="Sport"
                        value={match.sportNom || "Football"}
                    />
                    <InfoItemRow
                        icon="cash-outline"
                        label="Prix par joueur"
                        value={`${match.matchPrixParJoueur} F CFA`}
                        iconColor={COLORS.primary}
                    />
                </InfoSectionCard>

                {/* Section des termes et conditions */}
                <TermsSection
                    acceptedTerms={acceptedTerms}
                    onToggleTerms={toggleTermsAcceptance}
                />

                {/* Espace en bas pour le bouton */}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bouton de paiement */}
            <PaymentButton
                acceptedTerms={acceptedTerms}
                isProcessing={isProcessing}
                onPress={handlePayment}
            />

            {/* Modal de succès */}
            {showSuccessCard && successData && (
                <SuccessModal
                    visible={showSuccessCard}
                    onClose={handleSuccessClose}
                    matchCode={successData?.matchCode}
                    title='Succès!'
                    subtitle='Vous avez rejoint la partie avec succès'
                    matchDetails={{
                        terrainName: match.terrainNom,
                        date: formatDateLong(match.matchDateDebut),
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
        backgroundColor: COLORS.backgroundLight,
    },
    scrollView: {
        flex: 1,
    },
});

export default MatchSummaryScreen; 