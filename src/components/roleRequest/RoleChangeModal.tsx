import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { COLORS } from '../../theme/colors';
import { CustomButton } from '../CustomButton';

interface RoleChangeModalProps {
    visible: boolean;
    newRole: string;
    onReconnect: () => void;
    onClose?: () => void;
}

export const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
    visible,
    newRole,
    onReconnect,
    onClose
}) => {
    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'capo': return 'Capo';
            case 'gerant': return 'Gérant';
            case 'lambda': return 'Lambda';
            default: return role;
        }
    };

    const getRoleDescription = (role: string) => {
        switch (role) {
            case 'capo': return 'Vous pouvez maintenant gérer les terrains et organiser des matchs.';
            case 'gerant': return 'Vous avez maintenant accès à toutes les fonctionnalités de gestion.';
            case 'lambda': return 'Vous êtes maintenant un utilisateur standard.';
            default: return 'Votre rôle a été mis à jour.';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'capo': return '🎯';
            case 'gerant': return '👑';
            case 'lambda': return '👤';
            default: return '🎉';
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Icône et titre */}
                        <View style={styles.header}>
                            <Text style={styles.icon}>{getRoleIcon(newRole)}</Text>
                            <Text style={styles.title}>Félicitations !</Text>
                            <Text style={styles.subtitle}>
                                Vous êtes maintenant {getRoleDisplayName(newRole)}
                            </Text>
                        </View>

                        {/* Description */}
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.description}>
                                {getRoleDescription(newRole)}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actions}>
                            <CustomButton
                                title="Se reconnecter"
                                onPress={onReconnect}
                                style={styles.reconnectButton}
                            />

                            {onClose && (
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={styles.closeButton}
                                >
                                    <Text style={styles.closeButtonText}>Fermer</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContainer: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        width: '100%',
        maxWidth: 400,
        shadowColor: COLORS.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    modalContent: {
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    icon: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: COLORS.primary,
        fontWeight: '600',
        textAlign: 'center',
    },
    descriptionContainer: {
        marginBottom: 24,
    },
    description: {
        fontSize: 16,
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    actions: {
        gap: 12,
    },
    reconnectButton: {
        backgroundColor: COLORS.primary,
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 16,
        color: COLORS.textSecondary,
        fontWeight: '500',
    },
});

