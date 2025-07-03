import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppSelector, useAuthLogout } from '../../store/hooks/hooks';
import { ScreenNavigationProps } from '../../navigation/types';
import { selectUser } from '../../store/slices/userSlice';

const SettingsScreen: React.FC = () => {
    const { logout } = useAuthLogout();
    const utilisateur = useAppSelector(selectUser);

    const navigation = useNavigation<ScreenNavigationProps>();
    const [notifications, setNotifications] = React.useState(true);
    const [emailNotifications, setEmailNotifications] = React.useState(true);
    const [darkMode, setDarkMode] = React.useState(false);

    const handleLogout = async () => {
        await logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Welcome' }],
        });
    };

    return (
        <View style={styles.container}>
            {/* Header avec avatar, nom et numéro Wave */}
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                        style={styles.avatar}
                    />
                </View>
                <Text style={styles.name}>{utilisateur?.utilisateurNom}</Text>
                <Text style={styles.waveNumber}>Numéro Wave : {utilisateur?.utilisateurTelephone}</Text>
            </View>

            {/* Menu principal */}
            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconLabel}>
                        <Ionicons name="notifications-outline" size={22} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Notifications : Push, SMS</Text>
                    </View>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconLabel}>
                        <MaterialIcons name="alternate-email" size={22} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Ajouter une adresse mail</Text>
                    </View>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconLabel}>
                        <Feather name="user-plus" size={22} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Ajouter un autre gérant</Text>
                    </View>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuIconLabel}>
                        <Feather name="help-circle" size={22} style={styles.menuIcon} />
                        <Text style={styles.menuText}>Contacter le support</Text>
                    </View>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            {/* Bouton Déconnexion */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
            {/* Bouton Supprimer le compte */}
            <TouchableOpacity style={styles.deleteAccountButton}>
                <Text style={styles.deleteAccountText}>Supprimer le compte</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        alignItems: 'center',
        paddingTop: 0,
    },
    header: {
        alignItems: 'center',
        marginTop: 32,
        marginBottom: 16,
    },
    avatarContainer: {
        // backgroundColor: '#00d2ff',
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
        color: '#222',
    },
    waveNumber: {
        fontSize: 14,
        color: '#888',
    },
    menuSection: {
        width: '92%',
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 0,
        marginBottom: 32,
        elevation: 2,
        shadowColor: '#000',
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
        borderBottomColor: '#f0f0f0',
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
        color: '#222',
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
        color: '#222',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteAccountButton: {
        marginTop: 8,
        width: '92%',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    deleteAccountText: {
        color: '#FF3B30',
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default SettingsScreen; 