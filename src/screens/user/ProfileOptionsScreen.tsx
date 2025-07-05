import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme/colors';
import { useAuthLogout } from '../../store/hooks/hooks';

const ProfileOptionsScreen: React.FC = () => {
    const navigation = useNavigation();
    const { logout } = useAuthLogout();


    const handleEditInfo = () => {
        navigation.navigate('EditProfile' as never);
    };

    const handleEditPassword = () => {
        navigation.navigate('EditPassword' as never);
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleLogout = async () => {
         logout();
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

                {/* Bouton Déconnexion */}
                <TouchableOpacity style={styles.logoutButton} onPress={()=> logout()}>
                    <Text style={styles.logoutText}>Déconnexion</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
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
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
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
        width: '92%',
    },
    logoutText: {
        color: '#222',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileOptionsScreen; 