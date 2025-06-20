import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../utils/constant';

interface CustomTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: object;
    isPassword?: boolean;
    isEditable?: boolean;
    refInput?: any;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    label,
    error,
    containerStyle,
    style,
    isPassword,
    isEditable = true,
    secureTextEntry,
    refInput,
    onSubmitEditing,
    keyboardType = "default",
    returnKeyType = "next",
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const isPasswordField = isPassword || secureTextEntry;
    const shouldHideText = isPasswordField && !showPassword;

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#ccc"
                    secureTextEntry={shouldHideText}
                    selectionColor={PRIMARY_COLOR}
                    editable={isEditable}
                    ref={refInput}
                    keyboardType={keyboardType}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    {...props}
                />
                {isPasswordField && (
                    <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={togglePasswordVisibility}
                    >
                        <Feather
                            name={showPassword ? 'eye-off' : 'eye'}
                            size={20}
                            color="#999"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 8,
    },
    label: {
        color: '#FF6600',
        fontWeight: '500',
        marginBottom: 6,
    },
    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    input: {
        flex: 1,
        padding: 8,
        fontSize: 16,
    },
    inputError: {
        borderColor: 'red',
    },
    eyeIcon: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    error: {
        color: 'red',
        fontSize: 13,
        marginTop: 4,
    },
});

export default CustomTextInput; 