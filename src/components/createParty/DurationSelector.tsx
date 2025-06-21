import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
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
    <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.durationScrollView}
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
);

const styles = StyleSheet.create({
    durationScrollView: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    durationButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginRight: 8,
    },
    durationButtonSelected: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    durationButtonText: {
        fontSize: 14,
        color: '#495057',
    },
    durationButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
}); 