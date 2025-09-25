import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Text } from 'react-native';

// Types et interfaces
import { Match } from '../../services/matchService';
import { COLORS } from '../../theme/colors';

// Utilitaires
import { calculateMatchDuration, formatDateLong, formatTime } from '../../utils/functions';

// Hook personnalisé
import { useMatchDetails } from '../../hooks/useMatchDetails';

// Composants
import ImageGallery from '../../components/ImageGallery';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import InfoSectionCard, { InfoItemRow } from '../../components/DetailCard';
import MainInfoCard from '../../components/MainInfoCard';

// Composants MatchDetail
import {
    CodeSection,
    DescriptionSection,
    ParticipantsSection,
    LocationSection,
    ImportantInfoSection,
    JoinButton
} from '../../components/matchDetail';

// Types
interface MatchDetailsScreenProps {
    route: {
        params: {
            match: Match;
        };
    };
    navigation: any;
}

// Composant principal
const MatchDetailsScreen: React.FC<MatchDetailsScreenProps> = ({ route, navigation }) => {
    const { match } = route.params;

    // Utilisation du hook personnalisé
    const {
        isJoining,
        participants,
        loadingParticipants,
        errorParticipants,
        isMatchFull,
        participantsCount,
        handleJoinMatch,
        handleRetryParticipants,
    } = useMatchDetails({ match, navigation });
        console.log("🚀 ~ participantsppppppppppppp:", participants)

    // Création du badge de comptage des participants
    const participantsCountBadge = useMemo(() => (
        <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
                {participantsCount.current}/{participantsCount.max} joueurs
            </Text>
        </View>
    ), [participantsCount.current, participantsCount.max]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <HeaderWithBackButton
                    onBack={() => navigation.goBack()}
                    rightComponent={participantsCountBadge}
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

                    <CodeSection match={match} />
                    <DescriptionSection match={match} />

                    <ParticipantsSection
                        participants={participants}
                        maxPlayers={match.joueurxMax}
                        loading={loadingParticipants}
                        error={errorParticipants}
                        onRetry={handleRetryParticipants}
                    />

                    <LocationSection match={match} />
                    <ImportantInfoSection />

                    <View style={styles.bottomSpacer} />
                </ScrollView>

                <JoinButton
                    isMatchFull={isMatchFull}
                    isJoining={isJoining}
                    onPress={handleJoinMatch}
                />
            </View>
        </SafeAreaView>
    );
};

// Styles
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.gray[100],
    },
    scrollView: {
        flex: 1,
    },
    bottomSpacer: {
        height: 120,
    },
    headerBadge: {
        backgroundColor: COLORS.overlay,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    headerBadgeText: {
        fontSize: 15,
        textAlign: 'center',
        color: COLORS.white,
    },
});

export default MatchDetailsScreen; 