import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';
import CustomTextInput from './CustomTextInput';

// Fonction pour formater le numéro de téléphone
const formatPhoneNumber = (text: string): string => {
    // Supprimer tous les caractères non numériques
    const cleaned = text.replace(/\D/g, '');

    // Limiter à 10 chiffres
    const trimmed = cleaned.slice(0, 10);

    // Appliquer le format xx xx xx xx xx
    if (trimmed.length <= 2) return trimmed;
    if (trimmed.length <= 4) return `${trimmed.slice(0, 2)} ${trimmed.slice(2)}`;
    if (trimmed.length <= 6) return `${trimmed.slice(0, 2)} ${trimmed.slice(2, 4)} ${trimmed.slice(4)}`;
    if (trimmed.length <= 8) return `${trimmed.slice(0, 2)} ${trimmed.slice(2, 4)} ${trimmed.slice(4, 6)} ${trimmed.slice(6)}`;
    return `${trimmed.slice(0, 2)} ${trimmed.slice(2, 4)} ${trimmed.slice(4, 6)} ${trimmed.slice(6, 8)} ${trimmed.slice(8)}`;
};

// Fonction pour valider le numéro de téléphone
export const validatePhoneNumber = (phoneNumber: string): string | undefined => {
    if (!phoneNumber.trim()) {
        return 'Le numéro de téléphone est requis';
    }

    const cleanedContact = phoneNumber.replace(/\D/g, '');
    if (cleanedContact.length !== 10) {
        return 'Le numéro doit contenir 10 chiffres';
    }

    return undefined;
};

// Fonction pour nettoyer le numéro (supprimer le formatage)
export const cleanPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/\D/g, '');
};

interface PhoneInputProps {
    value: string;
    onChangeText: (text: string) => void;
    label?: string;
    placeholder?: string;
    error?: string;
    returnKeyType?: 'next' | 'done' | 'go' | 'search' | 'send';
    onSubmitEditing?: () => void;
    refInput?: React.RefObject<TextInput | null>;
    isEditable?: boolean;
    containerStyle?: object;
}

const PhoneInput = forwardRef<TextInput, PhoneInputProps>(({
    value,
    onChangeText,
    label = "Numéro de téléphone",
    placeholder = "Ex: 07 07 07 07 07",
    error,
    returnKeyType = "next",
    onSubmitEditing,
    refInput,
    isEditable = true,
    containerStyle,
}, ref) => {

    const handleChangeText = (text: string) => {
        const formattedText = formatPhoneNumber(text);
        onChangeText(formattedText);
    };

    return (
        <CustomTextInput
            label={label}
            value={value}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            keyboardType="phone-pad"
            error={error}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            refInput={refInput}
            isEditable={isEditable}
            containerStyle={containerStyle}
        />
    );
});

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput; 