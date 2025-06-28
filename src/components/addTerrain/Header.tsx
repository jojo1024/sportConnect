import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface HeaderProps {
    onSave: () => void;
    onBack?: () => void;
    isSubmitting: boolean;
    isFormReady?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onSave, onBack, isSubmitting, isFormReady = false }) => (
    <View style={styles.header}>
        <View style={styles.leftSection}>
            {onBack && (
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={onBack}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={20} />
                </TouchableOpacity>
            )}
            <Text style={styles.title}>Ajouter un terrain</Text>
        </View>

        <TouchableOpacity
            style={[
                styles.saveButton,
                (isSubmitting || !isFormReady) && styles.saveButtonDisabled
            ]}
            onPress={onSave}
            disabled={isSubmitting || !isFormReady}
        >
            <Ionicons
                name="save"
                size={16}
                color={(isSubmitting || !isFormReady) ? '#ccc' : COLORS.primary}
            />
            <Text style={[
                styles.saveButtonText,
                (isSubmitting || !isFormReady) && styles.saveButtonTextDisabled
            ]}>
                {isSubmitting ? 'Création...' : 'Ajouter'}
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
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        marginRight: 12,
        borderRadius: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    saveButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    saveButtonDisabled: {
        borderColor: '#ccc',
        backgroundColor: '#f5f5f5',
    },
    saveButtonText: {
        color: COLORS.primary,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 12,
    },
    saveButtonTextDisabled: {
        color: '#ccc',
    },
}); 