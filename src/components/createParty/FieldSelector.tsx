import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface FieldSelectorProps {
    selectedField: string;
    onPress: () => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({ selectedField, onPress }) => (
    <TouchableOpacity style={styles.fieldSelector} onPress={onPress}>
        {selectedField ? (
            <View style={styles.selectedFieldContainer}>
                <Ionicons name="location" size={20} color={COLORS.primary} />
                <Text style={styles.selectedFieldText}>{selectedField}</Text>
            </View>
        ) : (
            <View style={styles.placeholderContainer}>
                <Ionicons name="location-outline" size={20} color="#999" />
                <Text style={styles.placeholderText}>Sélectionner un terrain</Text>
            </View>
        )}
        <Ionicons name="chevron-down" size={24} color={selectedField ? COLORS.primary : "#999"} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    fieldSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        minHeight: 56,
    },
    selectedFieldContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    selectedFieldText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    placeholderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 8,
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
        fontStyle: 'italic',
    },
}); 