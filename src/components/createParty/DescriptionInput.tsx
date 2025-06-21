import React from 'react';
import { StyleSheet, TextInput } from 'react-native';
import { COLORS } from '../../theme/colors';

interface DescriptionInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export const DescriptionInput: React.FC<DescriptionInputProps> = ({
    value,
    onChangeText
}) => (
    <TextInput
        style={styles.descriptionInput}
        multiline
        selectionColor={COLORS.primary}
        maxLength={170}
        numberOfLines={4}
        placeholder="Ajoutez un message pour les participants..."
        value={value}
        onChangeText={onChangeText}
    />
);

const styles = StyleSheet.create({
    descriptionInput: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        height: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#495057',
    },
}); 