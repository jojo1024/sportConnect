import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/colors';
import { useAppSelector, useAuthLogout } from '../../store/hooks/hooks';
import CustomOutlineButton from '../../components/CustomOutlineButton';
import { useDeleteAccount } from '../../hooks/useDeleteAccount';
import { useBeginCapo } from '../../hooks/useBeginCapo';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import CustomAlert from '../../components/CustomAlert';
import { ScreenNavigationProps } from '../../navigation/types';
import { selectUser } from '../../store/slices/userSlice';

const ProfileOptionsScreen: React.FC = () => {

    const user = useAppSelector(selectUser);
    const navigation = useNavigation<ScreenNavigationProps>();
    const { logout } = useAuthLogout();
    const { showDeleteConfirmation, hideModal, showModal, deleteAccount, isLoading, error } = useDeleteAccount();
    const { beginCapo, isLoading: isBeginCapoLoading, error: beginCapoError, success: beginCapoSuccess, reset: resetBeginCapo } = useBeginCapo();
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [showBeginCapoAlert, setShowBeginCapoAlert] = useState(false);

    const handleEditInfo = () => {
        navigation.navigate('EditProfile' as never);
    };

    const handleEditPassword = () => {
        navigation.navigate('EditPassword' as never);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLogout = () => {
        setShowLogoutAlert(true);
    };

    const handleConfirmLogout = async () => {
        await logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };

    const handleDeleteAccount = () => {
        showDeleteConfirmation();
    };

    const handleConfirmDelete = (password: string) => {
        deleteAccount(password);
    };

    const handleBeginCapo = () => {
        setShowBeginCapoAlert(true);
    };

    const handleConfirmBeginCapo = async () => {
        const result = await beginCapo();
        console.log("🚀 ~ handleConfirmBeginCapo ~ result:", result)
        if (result.success) {
            setShowBeginCapoAlert(false);
            // Optionnel : rafraîchir les données utilisateur ou naviguer
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={handleGoBack}
                >
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Modifier le profil</Text>
                <View style={styles.headerSpacer} />
            </View>

            {/* Options */}
            <View style={styles.content}>
                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={handleEditInfo}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="person-outline" size={28} color={COLORS.primary} />
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Modifier informations</Text>
                        <Text style={styles.optionDescription}>
                            Modifier votre nom, commune, date de naissance et autres informations personnelles
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionCard}
                    onPress={handleEditPassword}
                >
                    <View style={styles.optionIcon}>
                        <Ionicons name="lock-closed-outline" size={28} color={COLORS.primary} />
                    </View>
                    <View style={styles.optionContent}>
                        <Text style={styles.optionTitle}>Modifier mot de passe</Text>
                        <Text style={styles.optionDescription}>
                            Changer votre mot de passe pour sécuriser votre compte
                        </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color={COLORS.textLight} />
                </TouchableOpacity>

                {
                    user?.utilisateurRole === 'lambda' && (
                        <View style={styles.capoButtonContainer}>
                            <CustomOutlineButton
                                onPress={handleBeginCapo}
                                title={isBeginCapoLoading ? "Demande en cours..." : "Devenir capo"}
                                iconName="person-add-outline"
                                iconType="ionicons"
                                style={styles.capoButton}
                                disabled={isBeginCapoLoading}
                            />
                        </View>
                    )
                }

                {/* Bouton Déconnexion */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.logoutText}>Déconnexion</Text>
                </TouchableOpacity>

                {/* Bouton Supprimer le compte */}
                <TouchableOpacity
                    style={[styles.deleteAccountButton, isLoading && styles.deleteAccountButtonDisabled]}
                    onPress={handleDeleteAccount}
                    disabled={isLoading}
                >
                    <Text style={[styles.deleteAccountText, isLoading && styles.deleteAccountTextDisabled]}>
                        {isLoading ? 'Suppression...' : 'Supprimer le compte'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Modal de suppression de compte */}
            <DeleteAccountModal
                visible={showModal}
                onConfirm={handleConfirmDelete}
                onCancel={hideModal}
                isLoading={isLoading}
                error={error}
            />

            {/* Alert de déconnexion */}
            <CustomAlert
                visible={showLogoutAlert}
                title="Déconnexion"
                message="Êtes-vous sûr de vouloir vous déconnecter ?"
                type="info"
                confirmText="Déconne..."
                cancelText="Annuler"
                showCancel={true}
                onConfirm={handleConfirmLogout}
                onCancel={() => setShowLogoutAlert(false)}
            />

            {/* Alert pour devenir capo */}
            <CustomAlert
                visible={showBeginCapoAlert}
                title="Devenir Capo"
                message="Êtes-vous sûr de vouloir demander à devenir Capo ? Cette demande sera envoyée aux administrateurs pour validation."
                type="info"
                confirmText="Confirmer"
                cancelText="Annuler"
                showCancel={true}
                onConfirm={handleConfirmBeginCapo}
                onCancel={() => setShowBeginCapoAlert(false)}
            />

            {/* Alert d'erreur pour devenir capo */}
            {beginCapoError && (
                <CustomAlert
                    visible={!!beginCapoError}
                    title="Erreur"
                    message={beginCapoError}
                    type="error"
                    confirmText="OK"
                    onConfirm={() => resetBeginCapo()}
                />
            )}

            {/* Alert de succès pour devenir capo */}
            {beginCapoSuccess && (
                <CustomAlert
                    visible={beginCapoSuccess}
                    title="Succès"
                    message="Votre demande de devenir Capo a été envoyée avec succès ! Vous recevrez une notification une fois votre demande traitée."
                    type="success"
                    confirmText="OK"
                    onConfirm={() => {
                        resetBeginCapo();
                        // Optionnel : rafraîchir les données utilisateur
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,

    },
    backButton: {
        padding: 8,
        marginRight: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    optionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    optionContent: {
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 4,
    },
    optionDescription: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 20,
    },
    logoutButton: {
        marginTop: 0,
        marginBottom: 0,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    logoutText: {
        color: '#222',
        fontSize: 16,
        fontWeight: 'bold',
    },
    capoButton: {
        marginTop: 12,
        marginBottom: 16,

    },
    capoButtonContainer: {
        alignItems: 'center',
    },
    deleteAccountButton: {
        marginTop: 8,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    deleteAccountButtonDisabled: {
        opacity: 0.7,
    },
    deleteAccountText: {
        color: COLORS.red,
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    deleteAccountTextDisabled: {
        color: '#888',
    },
});

export default ProfileOptionsScreen; 