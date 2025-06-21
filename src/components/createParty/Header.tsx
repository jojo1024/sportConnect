import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface HeaderProps {
    onCreate: () => void;
    isSubmitting: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onCreate, isSubmitting }) => (
    <View style={styles.header}>
        <Text style={styles.title}>Créer une partie</Text>
        <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.addButtonDisabled]}
            onPress={onCreate}
            disabled={isSubmitting}
        >
            <Ionicons
                name="save"
                size={16}
                color={isSubmitting ? '#ccc' : COLORS.primary}
            />
            <Text style={[styles.addButtonText, isSubmitting && styles.addButtonTextDisabled]}>
                {isSubmitting ? 'Création...' : 'Créer'}
            </Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    addButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    addButtonDisabled: {
        borderColor: '#ccc',
        backgroundColor: '#f5f5f5',
    },
    addButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 12,
    },
    addButtonTextDisabled: {
        color: '#ccc',
    },
}); 