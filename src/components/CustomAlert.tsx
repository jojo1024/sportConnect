import React, { useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    type = 'info',
    confirmText = 'OK',
    cancelText = 'Annuler',
    showCancel = false,
    autoClose = false,
    autoCloseDelay = 3000,
    onConfirm,
    onCancel,
}) => {

    // Gestion de l'auto-fermeture
    useEffect(() => {
        let timer: ReturnType<typeof setTimeout>;

        if (visible && autoClose && onConfirm) {
            timer = setTimeout(() => {
                onConfirm();
            }, autoCloseDelay);
        }

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [visible, autoClose, autoCloseDelay, onConfirm]);

    const getIconName = () => {
        switch (type) {
            case 'success':
                return 'checkmark-circle';
            case 'error':
                return 'alert-circle';
            case 'warning':
                return 'warning';
            default:
                return 'information-circle';
        }
    };

    const getIconColor = () => {
        switch (type) {
            case 'success':
                return '#10B981';
            case 'error':
                return '#EF4444';
            case 'warning':
                return '#F59E0B';
            default:
                return COLORS.primary;
        }
    };

    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return '#F0FDF4';
            case 'error':
                return '#FEF2F2';
            case 'warning':
                return '#FFFBEB';
            default:
                return '#F0F9FF';
        }
    };

    const getBorderColor = () => {
        switch (type) {
            case 'success':
                return '#BBF7D0';
            case 'error':
                return '#FECACA';
            case 'warning':
                return '#FED7AA';
            default:
                return '#BFDBFE';
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={styles.overlay}>
                <View style={[
                    styles.alertContainer,
                    {
                        backgroundColor: getBackgroundColor(),
                        borderColor: getBorderColor(),
                    }
                ]}>
                    {/* Icône */}
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={getIconName()}
                            size={48}
                            color={getIconColor()}
                        />
                    </View>

                    {/* Titre */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message avec scroll si nécessaire */}
                    <ScrollView
                        style={styles.messageContainer}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.messageContent}
                    >
                        <Text style={styles.message}>{message}</Text>
                    </ScrollView>

                    {/* Boutons */}
                    <View style={styles.buttonContainer}>
                        {showCancel && (
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={onCancel}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.cancelButtonText}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.button,
                                styles.confirmButton,
                                { backgroundColor: getIconColor() },
                                showCancel && styles.confirmButtonWithCancel
                            ]}
                            onPress={onConfirm}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    alertContainer: {
        width: width - 40,
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
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
    messageContainer: {
        maxHeight: 200,
        marginBottom: 20,
    },
    messageContent: {
        flexGrow: 1,
    },
    message: {
        fontSize: 16,
        lineHeight: 22,
        textAlign: 'center',
        color: '#4B5563',
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
        backgroundColor: COLORS.primary,
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
    confirmButtonWithCancel: {
        flex: 1,
    },
});

export default CustomAlert; 