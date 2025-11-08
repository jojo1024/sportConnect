import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CustomOutlineButton from '../CustomOutlineButton';
import { COLORS } from '../../theme/colors';

interface HeaderProps {
    onCreate: () => void;
    isSubmitting: boolean;
    isFormReady?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onCreate, isSubmitting, isFormReady = false }) => {
    const isDisabled = isSubmitting || !isFormReady;
    const buttonText = isSubmitting ? 'Création...' : 'Créer';

    return (
        <View style={styles.header}>
            <Text style={styles.title}>Créer une partie</Text>
            <CustomOutlineButton
                onPress={onCreate}
                title={buttonText}
                iconName="save"
                iconType="ionicons"
                iconColor={isDisabled ? '#ccc' : COLORS.primary}
                textColor={isDisabled ? '#ccc' : COLORS.primary}
                borderColor={isDisabled ? '#ccc' : COLORS.primary}
                backgroundColor={isDisabled ? '#f5f5f5' : '#fff'}
                disabled={isDisabled}
                textStyle={{
                    color: isDisabled ? '#ccc' : COLORS.primary,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom:10,
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