import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface ParticipantsSelectorProps {
    numberOfParticipants: number;
    onIncrease: () => void;
    onDecrease: () => void;
    isMinReached: boolean;
    isMaxReached: boolean;
}

export const ParticipantsSelector: React.FC<ParticipantsSelectorProps> = ({
    numberOfParticipants,
    onIncrease,
    onDecrease,
    isMinReached,
    isMaxReached
}) => (
    <View style={styles.participantsContainer}>
        <TouchableOpacity
            style={styles.participantButton}
            onPress={onDecrease}
            disabled={isMinReached}
        >
            <Ionicons
                name="remove"
                size={24}
                color={isMinReached ? '#ccc' : COLORS.primary}
            />
        </TouchableOpacity>
        <View style={styles.participantCounter}>
            <Text style={styles.participantNumber}>{numberOfParticipants}</Text>
            <Text style={styles.participantLabel}>(capo inclus)</Text>
        </View>
        <TouchableOpacity
            style={styles.participantButton}
            onPress={onIncrease}
            disabled={isMaxReached}
        >
            <Ionicons
                name="add"
                size={24}
                color={isMaxReached ? '#ccc' : COLORS.primary}
            />
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    participantButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    participantCounter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    participantNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 8,
    },
    participantLabel: {
        fontSize: 12,
        color: COLORS.textLight,
    },
}); 