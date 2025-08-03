import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

interface DeleteAccountModalProps {
    visible: boolean;
    onConfirm: (password: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
    error?: string | null;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
    visible,
    onConfirm,
    onCancel,
    isLoading = false,
    error = null,
}) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleConfirm = () => {
        if (password.trim()) {
            onConfirm(password.trim());
            setPassword('');
        }
    };

    const handleCancel = () => {
        setPassword('');
        onCancel();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.modalContainer}>
                    {/* Icône d'avertissement */}
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name="warning"
                            size={48}
                            color="#EF4444"
                        />
                    </View>

                    {/* Titre */}
                    <Text style={styles.title}>Supprimer le compte</Text>

                    {/* Message */}
                    <Text style={styles.message}>
                        Cette action est irréversible. Toutes vos données seront définitivement perdues.
                    </Text>

                    {/* Message d'erreur */}
                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle" size={16} color="#EF4444" />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    {/* Champ mot de passe */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.inputLabel}>Mot de passe</Text>
                        <View style={[
                            styles.passwordInputContainer,
                            error && styles.passwordInputError
                        ]}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Entrez votre mot de passe"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                            >
                                <Ionicons
                                    name={showPassword ? "eye-off" : "eye"}
                                    size={20}
                                    color="#6B7280"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Boutons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleCancel}
                            disabled={isLoading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.cancelButtonText}>Annuler</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                (!password.trim() || isLoading) && styles.confirmButtonDisabled
                            ]}
                            onPress={handleConfirm}
                            disabled={!password.trim() || isLoading}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.confirmButtonText}>
                                {isLoading ? 'Suppression...' : 'Supprimer'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: width - 40,
        maxWidth: 400,
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#FECACA',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 12,
        color: '#1F2937',
    },
    message: {
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        color: '#4B5563',
        marginBottom: 20,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 14,
        color: '#DC2626',
        marginLeft: 8,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    passwordInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        paddingHorizontal: 12,
    },
    passwordInputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    passwordInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    eyeButton: {
        padding: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
        minWidth: 100,
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    confirmButton: {
        backgroundColor: '#EF4444',
    },
    confirmButtonDisabled: {
        backgroundColor: '#FCA5A5',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    confirmButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default DeleteAccountModal; 