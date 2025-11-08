import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS } from '../theme/colors';
import AuthBottomSheet from './AuthBottomSheet';

interface AuthRequiredScreenProps {
    title?: string;
    message?: string;
    iconName?: keyof typeof Ionicons.glyphMap;
}

const AuthRequiredScreen: React.FC<AuthRequiredScreenProps> = ({
    title = "Connexion requise",
    message = "Vous devez vous connecter pour accéder à cette fonctionnalité.",
    iconName = "lock-closed-outline"
}) => {
    const authBottomSheetRef = useRef<RBSheet>(null);

    const handleConnectPress = () => {
        authBottomSheetRef.current?.open();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name={iconName} size={80} color={COLORS.primary} />
                </View>
                
                <Text style={styles.title}>{title}</Text>
                
                <Text style={styles.message}>{message}</Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleConnectPress}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Vous n'avez pas encore de compte ?
                    </Text>
                    <TouchableOpacity onPress={handleConnectPress}>
                        <Text style={styles.footerLink}>Créer un compte</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom Sheet d'authentification */}
            <AuthBottomSheet
                bottomSheetRef={authBottomSheetRef}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        marginBottom: 32,
        backgroundColor: COLORS.primayLight,
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.title,
        marginBottom: 16,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 48,
        borderRadius: 25,
        minWidth: 200,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 8,
    },
    footerLink: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
});

export default AuthRequiredScreen;

