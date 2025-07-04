import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MatchParticipant } from '../../services/matchService';
import { COLORS } from '../../theme/colors';

interface ParticipantItemProps {
    participant: MatchParticipant | null;
    index: number;
    isCapo: boolean;
}

const ParticipantItem: React.FC<ParticipantItemProps> = ({ participant, index, isCapo }) => {
    if (!participant) {
        return (
            <View style={styles.emptySlot}>
                <Ionicons name="add-circle-outline" size={38} color={COLORS.mediumGray} />
            </View>
        );
    }

    return (
        <View style={[styles.participantItem, isCapo && styles.capoItem]}>
            {isCapo && (
                <View style={styles.capoBadge}>
                    <MaterialCommunityIcons name="crown" size={13} color={COLORS.white} style={{ marginRight: 3 }} />
                    <Text style={styles.capoText}>Capo</Text>
                </View>
            )}
            <View style={[styles.avatarContainer, isCapo && styles.capoAvatar]}>
                {participant.utilisateurPhoto ? (
                    <Image source={{ uri: participant.utilisateurPhoto }} style={styles.avatar} />
                ) : (
                    <Ionicons name="person-circle-outline" size={54} color={COLORS.lightGray} />
                )}
            </View>
            <Text style={[styles.participantName, isCapo && styles.capoName]} numberOfLines={1}>
                {participant.utilisateurNom}
            </Text>
            {participant.utilisateurTelephone && (
                <Text style={styles.participantPhone} numberOfLines={1}>
                    {participant.utilisateurTelephone}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    participantItem: {
        width: '28%',
        alignItems: 'center',
        margin: '2%',
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.gray[300],
    },
    participantName: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.veryDarkGray,
        textAlign: 'center',
        marginBottom: 2,
    },
    participantPhone: {
        fontSize: 11,
        color: COLORS.gray[500],
        textAlign: 'center',
    },
    capoItem: {
        backgroundColor: COLORS.backgroundLightYellow,
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
        color: COLORS.white,
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
        backgroundColor: COLORS.backgroundVeryLightGray,
        borderRadius: 18,
        paddingVertical: 16,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
        justifyContent: 'center',
        minWidth: 90,
    },
});

export default ParticipantItem; 