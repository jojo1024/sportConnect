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
    <View style={styles.container}>
        <Text style={styles.label}>Nombre de participants</Text>
        <View style={styles.participantsContainer}>
            <TouchableOpacity
                style={[styles.participantButton, isMinReached && styles.participantButtonDisabled]}
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
                <Text style={styles.participantLabel}>joueurs</Text>
            </View>
            <TouchableOpacity
                style={[styles.participantButton, isMaxReached && styles.participantButtonDisabled]}
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
        <Text style={styles.hint}>
            <Ionicons name="information-circle-outline" size={14} color="#666" />
            <Text style={styles.hintText}> Le capo est automatiquement inclus</Text>
        </Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        gap: 8,
    },
    label: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    participantsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        minHeight: 56,
    },
    participantButton: {
        padding: 12,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    participantButtonDisabled: {
        backgroundColor: '#f5f5f5',
        borderColor: '#e0e0e0',
        shadowOpacity: 0,
        elevation: 0,
    },
    participantCounter: {
        alignItems: 'center',
        flex: 1,
    },
    participantNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 2,
    },
    participantLabel: {
        fontSize: 12,
        color: '#666',
    },
    hint: {
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    hintText: {
        marginLeft: 4,
    },
}); 