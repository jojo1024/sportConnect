import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { name as projectName } from '../../package.json';
import { useWelcome } from '../hooks/useWelcome';
import { COLORS } from '../theme/colors';

const WelcomeScreen = () => {

    const { handleRegister, handleLogin } = useWelcome();

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.logo}>{projectName}</Text>
            <Image
                source={{ uri: "https://activeforlife.com/img/large-webp/2018/07/soccer-ball-2121x1414.jpg" }}
                style={styles.image}
                resizeMode="cover"
            />
            <Text style={styles.subtitle}>
                Le moyen le plus rapide de trouver des matchs autour de toi.
            </Text>
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
            >
                <Text style={styles.buttonText}>Créer un compte</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={handleLogin}
            >
                <Text style={styles.link}>Connexion</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 10,
        fontFamily: 'sans-serif',
    },
    image: {
        width: '100%',
        height: 300,
        marginBottom: 24,
        marginTop: 8,
    },
    subtitle: {
        marginHorizontal: 20,
        fontSize: 17,
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 32,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 12,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: COLORS.text,
        fontSize: 15,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 0,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen; 