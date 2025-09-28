import React, { useState, useRef, useEffect } from 'react';
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
import { useBeginGerant } from '../../hooks/useBeginGerant';
import { useCancelRoleRequest } from '../../hooks/useCancelRoleRequest';
import { useRoleRequests } from '../../hooks/useRoleRequests';
import DeleteAccountModal from '../../components/DeleteAccountModal';
import CustomAlert from '../../components/CustomAlert';
import { RoleChangeModal } from '../../components/RoleChangeModal';
import { ScreenNavigationProps } from '../../navigation/types';
import { selectUser } from '../../store/slices/userSlice';

const ProfileOptionsScreen: React.FC = () => {
    const isMountedRef = useRef(true);

    const user = useAppSelector(selectUser);
    const navigation = useNavigation<ScreenNavigationProps>();
    const { logout } = useAuthLogout();
    const { showDeleteConfirmation, hideModal, showModal, deleteAccount, isLoading, error } = useDeleteAccount();
    const { beginCapo, isLoading: isBeginCapoLoading, error: beginCapoError, success: beginCapoSuccess, reset: resetBeginCapo } = useBeginCapo();
    const { beginGerant, isLoading: isBeginGerantLoading, error: beginGerantError, success: beginGerantSuccess, reset: resetBeginGerant } = useBeginGerant();
    const { cancelRoleRequest, isLoading: isCancelLoading, error: cancelError, success: cancelSuccess, reset: resetCancel } = useCancelRoleRequest();
    const { hasPendingCapoRequest, hasPendingGerantRequest } = useRoleRequests();

    // Vérification de sécurité pour éviter les erreurs
    const capoRequestPending = hasPendingCapoRequest || false;
    const gerantRequestPending = hasPendingGerantRequest || false;
    const [showLogoutAlert, setShowLogoutAlert] = useState(false);
    const [showBeginCapoAlert, setShowBeginCapoAlert] = useState(false);
    const [showBeginGerantAlert, setShowBeginGerantAlert] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // Nettoyage au démontage du composant
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    const handleEditInfo = () => {
        try {
            navigation.navigate('EditProfile');
        } catch (error) {
            console.error('❌ Erreur navigation EditProfile:', error);
        }
    };

    const handleEditPassword = () => {
        try {
            navigation.navigate('EditPassword');
        } catch (error) {
            console.error('❌ Erreur navigation EditPassword:', error);
        }
    };

    const handleGoBack = () => {
        try {
            navigation.goBack();
        } catch (error) {
            console.error('❌ Erreur navigation goBack:', error);
        }
    };

    const handleLogout = () => {
        setShowLogoutAlert(true);
    };

    const handleConfirmLogout = async () => {
        try {
            await logout();
            if (isMountedRef.current) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Welcome' }],
                });
            }
        } catch (error) {
            console.error('❌ Erreur lors de la déconnexion:', error);
        }
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
        if (isProcessing) return; // Éviter les appels multiples

        try {
            if (!user?.utilisateurId) {
                console.error('❌ Utilisateur ID manquant');
                return;
            }

            setIsProcessing(true);
            const result = await beginCapo(user.utilisateurId);
            console.log("🚀 ~ handleConfirmBeginCapo ~ result:", result)

            // Vérifier que le composant est toujours monté avant de mettre à jour l'état
            if (isMountedRef.current && result.success) {
                setShowBeginCapoAlert(false);
                console.log('✅ Demande Capo envoyée avec succès !');
                // Reset automatique pour éviter les problèmes iOS
                setTimeout(() => {
                    if (isMountedRef.current) {
                        resetBeginCapo();
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('❌ Erreur lors de la demande Capo:', error);
        } finally {
            if (isMountedRef.current) {
                setIsProcessing(false);
            }
        }
    };

    const handleCancelCapoRequest = async () => {
        try {
            if (!user?.utilisateurId) {
                console.error('❌ Utilisateur ID manquant');
                return;
            }

            const result = await cancelRoleRequest(user.utilisateurId);
            // L'état est maintenant géré par Redux
        } catch (error) {
            console.error('❌ Erreur lors de l\'annulation de la demande Capo:', error);
        }
    };

    const handleCancelGerantRequest = async () => {
        try {
            if (!user?.utilisateurId) {
                console.error('❌ Utilisateur ID manquant');
                return;
            }

            const result = await cancelRoleRequest(user.utilisateurId);
            // L'état est maintenant géré par Redux
        } catch (error) {
            console.error('❌ Erreur lors de l\'annulation de la demande Gérant:', error);
        }
    };

    const handleBeginGerant = () => {
        setShowBeginGerantAlert(true);
    };

    const handleConfirmBeginGerant = async () => {
        if (isProcessing) return; // Éviter les appels multiples

        try {
            if (!user?.utilisateurId) {
                console.error('❌ Utilisateur ID manquant');
                return;
            }

            setIsProcessing(true);
            const result = await beginGerant(user.utilisateurId);
            console.log("🚀 ~ handleConfirmBeginGerant ~ result:", result)

            // Vérifier que le composant est toujours monté avant de mettre à jour l'état
            if (isMountedRef.current && result.success) {
                setShowBeginGerantAlert(false);
                console.log('✅ Demande Gérant envoyée avec succès !');
                // Reset automatique pour éviter les problèmes iOS
                setTimeout(() => {
                    if (isMountedRef.current) {
                        resetBeginGerant();
                    }
                }, 1000);
            }
        } catch (error) {
            console.error('❌ Erreur lors de la demande Gérant:', error);
        } finally {
            if (isMountedRef.current) {
                setIsProcessing(false);
            }
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
                        <View style={styles.roleButtonsContainer}>
                            {capoRequestPending ? (
                                <View style={styles.pendingRequestContainer}>
                                    <View style={styles.pendingRequestTextContainer}>
                                        <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                                        <Text style={styles.pendingRequestText}>Demande de capo en attente</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.cancelButton, isCancelLoading && styles.cancelButtonDisabled]}
                                        onPress={handleCancelCapoRequest}
                                        disabled={isCancelLoading}
                                    >
                                        <Text style={styles.cancelButtonText}>
                                            {isCancelLoading ? "Annulation..." : "Annuler"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : !gerantRequestPending ? (
                                <CustomOutlineButton
                                    onPress={handleBeginCapo}
                                    title={isBeginCapoLoading ? "Demande en cours..." : "Devenir capo"}
                                    iconName="person-add-outline"
                                    iconType="ionicons"
                                    style={styles.roleButton}
                                    disabled={isBeginCapoLoading}
                                />
                            ) : null}
                            {gerantRequestPending ? (
                                <View style={styles.pendingRequestContainer}>
                                    <View style={styles.pendingRequestTextContainer}>
                                        <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                                        <Text style={styles.pendingRequestText}>Demande de gérant en attente</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.cancelButton, isCancelLoading && styles.cancelButtonDisabled]}
                                        onPress={handleCancelGerantRequest}
                                        disabled={isCancelLoading}
                                    >
                                        <Text style={styles.cancelButtonText}>
                                            {isCancelLoading ? "Annulation..." : "Annuler"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : !capoRequestPending ? (
                                <CustomOutlineButton
                                    onPress={handleBeginGerant}
                                    title={isBeginGerantLoading ? "Demande en cours..." : "Devenir gérant"}
                                    iconName="business-outline"
                                    iconType="ionicons"
                                    style={styles.roleButton}
                                    disabled={isBeginGerantLoading}
                                />
                            ) : null}
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

            {/* Alert pour devenir gérant */}
            <CustomAlert
                visible={showBeginGerantAlert}
                title="Devenir Gérant"
                message="Êtes-vous sûr de vouloir demander à devenir Gérant ? Cette demande sera envoyée aux administrateurs pour validation."
                type="info"
                confirmText="Confirmer"
                cancelText="Annuler"
                showCancel={true}
                onConfirm={handleConfirmBeginGerant}
                onCancel={() => setShowBeginGerantAlert(false)}
            />

            {/* Alert d'erreur pour devenir gérant */}
            {beginGerantError && (
                <CustomAlert
                    visible={!!beginGerantError}
                    title="Erreur"
                    message={beginGerantError}
                    type="error"
                    confirmText="OK"
                    onConfirm={() => resetBeginGerant()}
                />
            )}

            {/* Alert de succès pour devenir capo - DÉSACTIVÉ TEMPORAIREMENT POUR iOS */}
            {false && beginCapoSuccess && (
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

            {/* Alert de succès pour devenir gérant - DÉSACTIVÉ TEMPORAIREMENT POUR iOS */}
            {false && beginGerantSuccess && (
                <CustomAlert
                    visible={beginGerantSuccess}
                    title="Succès"
                    message="Votre demande de devenir Gérant a été envoyée avec succès ! Vous recevrez une notification une fois votre demande traitée."
                    type="success"
                    confirmText="OK"
                    onConfirm={() => {
                        resetBeginGerant();
                        // Optionnel : rafraîchir les données utilisateur
                    }}
                />
            )}

            {/* Alert de succès pour l'annulation */}
            {cancelSuccess && (
                <CustomAlert
                    visible={cancelSuccess}
                    title="Succès"
                    message="Votre demande de rôle a été annulée avec succès !"
                    type="success"
                    confirmText="OK"
                    onConfirm={() => {
                        resetCancel();
                    }}
                />
            )}

            {/* Modal de changement de rôle */}
            <RoleChangeModal />
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
    roleButton: {
        marginTop: 8,
        marginBottom: 8,
    },
    pendingRequestContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.primary + '15',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: COLORS.primary + '30',
    },
    pendingRequestTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    pendingRequestText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.primary,
        marginLeft: 8,
    },
    cancelButton: {
        backgroundColor: COLORS.danger,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    cancelButtonText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '600',
    },
    cancelButtonDisabled: {
        backgroundColor: COLORS.gray[400],
        opacity: 0.6,
    },
    roleButtonsContainer: {
        alignItems: 'center',
        marginTop: 12,
        marginBottom: 16,
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