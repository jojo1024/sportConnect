import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { DURATION_OPTIONS } from '../../hooks/useCreateParty';

interface DurationSelectorProps {
    duration: number;
    onDurationChange: (duration: number) => void;
}

export const DurationSelector: React.FC<DurationSelectorProps> = ({
    duration,
    onDurationChange
}) => (
    <View style={styles.container}>
        <Text style={styles.label}>Durée de la partie</Text>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.durationScrollView}
            contentContainerStyle={styles.durationContent}
        >
            {DURATION_OPTIONS.map((hours) => (
                <TouchableOpacity
                    key={hours}
                    style={[
                        styles.durationButton,
                        duration === hours && styles.durationButtonSelected,
                    ]}
                    onPress={() => onDurationChange(hours)}
                >
                    <Text
                        style={[
                            styles.durationButtonText,
                            duration === hours && styles.durationButtonTextSelected,
                        ]}
                    >
                        {hours}h
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
        <Text style={styles.hint}>
            Durée sélectionnée : <Text style={styles.hintValue}>{duration} heure{duration > 1 ? 's' : ''}</Text>
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
    durationScrollView: {
        flexDirection: 'row',
    },
    durationContent: {
        paddingVertical: 4,
    },
    durationButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginRight: 8,
        minWidth: 50,
        alignItems: 'center',
    },
    durationButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    durationButtonText: {
        fontSize: 14,
        color: '#495057',
        fontWeight: '500',
    },
    durationButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    hint: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    hintValue: {
        color: COLORS.primary,
        fontWeight: '600',
    },
}); 