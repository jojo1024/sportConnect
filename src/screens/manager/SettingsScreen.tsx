import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScreenNavigationProps } from '../../navigation/types';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectUser, selectIsAuthenticated } from '../../store/slices/userSlice';
import { COLORS } from '../../theme/colors';
import { getUserAvatar } from '../../utils/functions';
import AuthRequiredScreen from '../../components/AuthRequiredScreen';

const SettingsScreen: React.FC = () => {
    const utilisateur = useAppSelector(selectUser);
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const navigation = useNavigation<ScreenNavigationProps>();

    // Si non authentifié, afficher l'écran de connexion requise
    if (!isAuthenticated) {
        return (
            <AuthRequiredScreen
                title="Connexion requise"
                message="Vous devez vous connecter pour accéder aux paramètres."
                iconName="settings-outline"
            />
        );
    }

    return (
        <View style={styles.container}>
            {/* Header avec avatar, nom et numéro Wave */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: getUserAvatar(utilisateur?.utilisateurAvatar) }}
                        style={styles.avatar}
                    />
                </View>
                <Text style={styles.name}>{utilisateur?.utilisateurNom}</Text>
                <Text style={styles.waveNumber}>Numéro Wave : {utilisateur?.utilisateurTelephone}</Text>
            </View>

            {/* Menu principal */}
            <View style={styles.menuSection}>
                <TouchableOpacity style={[styles.menuItem, styles.disabledMenuItem]} disabled>
                    <View style={styles.menuIconLabel}>
                        <Ionicons name="notifications-outline" size={22} style={[styles.menuIcon, styles.disabledIcon]} />
                        <Text style={[styles.menuText, styles.disabledText]}>Notifications : Push, SMS</Text>
                    </View>
                    <Text style={[styles.arrow, styles.disabledText]}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('ProfileOptions' as never)}>
                    <View style={styles.menuIconLabel}>
                        <MaterialIcons name="alternate-email" size={22} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Modifier le profil</Text>
                    </View>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.disabledMenuItem]} disabled>
                    <View style={styles.menuIconLabel}>
                        <Feather name="user-plus" size={22} style={[styles.menuIcon, styles.disabledIcon]} />
                        <Text style={[styles.menuText, styles.disabledText]}>Ajouter un autre gérant</Text>
                    </View>
                    <Text style={[styles.arrow, styles.disabledText]}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.disabledMenuItem]} disabled>
                    <View style={styles.menuIconLabel}>
                        <Feather name="help-circle" size={22} style={[styles.menuIcon, styles.disabledIcon]} />
                        <Text style={[styles.menuText, styles.disabledText]}>Contacter le support</Text>
                    </View>
                    <Text style={[styles.arrow, styles.disabledText]}>{'>'}</Text>
                </TouchableOpacity>
            </View>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        paddingTop: 0,
    },
    header: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 16,
        paddingTop: 10,
    },
    avatarContainer: {
        borderRadius: 50,
        width: 90,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        backgroundColor: 'transparent',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
        color: COLORS.veryDarkGray,
    },
    waveNumber: {
        fontSize: 14,
        color: COLORS.gray[600],
    },
    menuSection: {
        width: '92%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        paddingVertical: 0,
        marginBottom: 32,
        // elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 18,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
    },
    menuIconLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        marginRight: 14,
    },
    menuText: {
        fontSize: 16,
        color: COLORS.veryDarkGray,
    },
    arrow: {
        fontSize: 18,
        // color: '#bbb',
        marginLeft: 8,
    },
    logoutButton: {
        marginTop: 0,
        marginBottom: 0,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        borderRadius: 8,
        alignItems: 'center',
        width: '92%',
    },
    logoutText: {
        color: COLORS.veryDarkGray,
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteAccountButton: {
        marginTop: 8,
        width: '92%',
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
        color: COLORS.gray[600],
    },
    disabledMenuItem: {
        opacity: 0.5,
    },
    disabledIcon: {
        opacity: 0.5,
    },
    disabledText: {
        color: COLORS.gray[600],
        opacity: 0.7,
    },
});

export default SettingsScreen; 