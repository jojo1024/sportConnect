import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MatchParticipant } from '../../services/matchService';
import { COLORS } from '../../theme/colors';
import ParticipantItem from './ParticipantItem';

interface ParticipantsSectionProps {
    participants: MatchParticipant[];
    maxPlayers: number;
    loading: boolean;
    error: string | null;
    onRetry: () => void;
}

const ParticipantsSection: React.FC<ParticipantsSectionProps> = ({
    participants,
    maxPlayers,
    loading,
    error,
    onRetry
}) => {
    const participantsData = useMemo(() => {
        const emptySlots = Array(Math.max(0, maxPlayers - participants.length)).fill(null);
        return [...participants, ...emptySlots];
    }, [participants, maxPlayers]);
    console.log("🚀 ~ participantsData ~ participantsData:", participantsData)

    if (loading) {
        return (
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Participants</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Chargement des participants...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.detailsSection}>
                <Text style={styles.sectionTitle}>Participants</Text>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color={COLORS.alertOrange} />
                    <Text style={styles.errorTitle}>Erreur de chargement</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                        <Text style={styles.retryButtonText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <Text style={styles.participantsCount}>{participants.length}/{maxPlayers} joueurs</Text>
            <FlatList
                data={participantsData}
                keyExtractor={(item, idx) => item ? String(item.participantId) : `empty-${idx}`}
                numColumns={3}
                columnWrapperStyle={styles.participantsRow}
                renderItem={({ item: participant, index }) => (
                    <ParticipantItem
                        participant={participant}
                        index={index}
                        isCapo={index === 0}
                    />
                )}
            />
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
    participantsCount: {
        marginBottom: 12,
        fontSize: 15,
        textAlign: 'center',
    },
    participantsRow: {
        justifyContent: 'space-between',
        marginBottom: 18,
        paddingHorizontal: 2,
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 12,
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 12,
        marginBottom: 20,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.alertOrange,
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

export default ParticipantsSection; 