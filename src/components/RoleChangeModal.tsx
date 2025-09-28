import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { useRoleCheck } from '../hooks/useRoleCheck';
import { COLORS } from '../theme/colors';

export const RoleChangeModal: React.FC = () => {
    const { showRoleChangeModal, newRole, handleReconnect, closeRoleChangeModal } = useRoleCheck();

    return (
        <Modal
            visible={showRoleChangeModal}
            transparent={true}
            animationType="fade"
            onRequestClose={closeRoleChangeModal}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0,0,0,0.5)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20
            }}>
                <View style={{
                    backgroundColor: 'white',
                    padding: 20,
                    borderRadius: 10,
                    alignItems: 'center',
                    minWidth: 300,
                    maxWidth: '90%'
                }}>
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginBottom: 10,
                        textAlign: 'center'
                    }}>
                        🎉 Félicitations !
                    </Text>
                    <Text style={{
                        fontSize: 16,
                        textAlign: 'center',
                        marginBottom: 20,
                        lineHeight: 22
                    }}>
                        Votre demande de rôle a été approuvée ! Vous êtes maintenant {newRole}.
                        Cliquez sur le bouton ci-dessous pour accéder aux nouvelles fonctionnalités.
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: COLORS.primary,
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: 5,
                            minWidth: 150
                        }}
                        onPress={handleReconnect}
                    >
                        <Text style={{
                            color: 'white',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            Accéder aux nouvelles fonctionnalités
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};
