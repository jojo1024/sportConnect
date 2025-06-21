import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface FieldSelectorProps {
    selectedField: string;
    onPress: () => void;
}

export const FieldSelector: React.FC<FieldSelectorProps> = ({ selectedField, onPress }) => (
    <TouchableOpacity style={styles.fieldSelector} onPress={onPress}>
        <Text style={styles.fieldSelectorText}>
            {selectedField || 'Sélectionner un terrain'}
        </Text>
        <Ionicons name="chevron-down" size={24} color="#666" />
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
    },
    fieldSelectorText: {
        fontSize: 16,
        color: '#495057',
    },
}); 