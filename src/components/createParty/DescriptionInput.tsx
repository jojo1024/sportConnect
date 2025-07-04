import React from 'react';
import { StyleSheet, TextInput, Text, View } from 'react-native';
import { COLORS } from '../../theme/colors';

interface DescriptionInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

export const DescriptionInput: React.FC<DescriptionInputProps> = ({
    value,
    onChangeText
}) => (
    <View style={styles.container}>
        <Text style={styles.label}>Message aux participants</Text>
        <View style={styles.inputContainer}>
            <TextInput
                style={styles.descriptionInput}
                multiline
                selectionColor={COLORS.primary}
                maxLength={170}
                numberOfLines={4}
                placeholder="Ex: Venez nombreux pour une partie endiablée ! 🏆"
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
            />
            <View style={styles.counterContainer}>
                <Text style={styles.counterText}>
                    {value.length}/170
                </Text>
            </View>
        </View>
        <Text style={styles.hint}>
            <Text style={styles.hintText}>Optionnel - Décrivez votre partie ou ajoutez des instructions</Text>
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
    inputContainer: {
        position: 'relative',
    },
    descriptionInput: {
        backgroundColor: COLORS.whiteOverlayMedium,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        height: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#333',
        paddingBottom: 40, // Espace pour le compteur
    },
    counterContainer: {
        position: 'absolute',
        bottom: 8,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    counterText: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    hint: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
        marginTop: 4,
    },
    hintText: {
        marginLeft: 4,
    },
}); 