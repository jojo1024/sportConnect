import React from 'react';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PRIMARY_COLOR, PROJECT_NAME } from '../utils/constant';
import { useWelcome } from '../hooks/useWelcome';
import { name as projectName } from '../../package.json';

const WelcomeScreen = () => {

    const { handleGetStarted, handleLogin } = useWelcome();

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
                onPress={handleGetStarted}
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
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    logo: {
        fontSize: 32,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
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
        color: '#222',
        textAlign: 'center',
        marginBottom: 32,
    },
    button: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 14,
        paddingHorizontal: 40,
        borderRadius: 25,
        marginBottom: 12,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        color: '#222',
        fontSize: 15,
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: 0,
        fontWeight: 'bold',
    },
});

export default WelcomeScreen; 