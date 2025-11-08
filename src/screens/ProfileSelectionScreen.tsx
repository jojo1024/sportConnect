import React, { useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProps } from '../navigation/types';
import { COLORS } from '../theme/colors';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { setSelectedProfileMode, selectSelectedProfileMode } from '../store/slices/appSlice';

const ProfileSelectionScreen = () => {
    const navigation = useNavigation<ScreenNavigationProps>();
    const dispatch = useAppDispatch();
    const selectedProfileMode = useAppSelector(selectSelectedProfileMode);

    // Naviguer vers MainTabs une fois que le profil est sélectionné
    useEffect(() => {
        if (selectedProfileMode) {
            // Vérifier si on est toujours sur ProfileSelection avant de naviguer
            const currentRoute = navigation.getState()?.routes[navigation.getState()?.index || 0];
            if (currentRoute?.name === 'ProfileSelection') {
                // Utiliser setTimeout pour s'assurer que le Stack est mis à jour
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainTabs' }],
                    });
                }, 100);
            }
        }
    }, [selectedProfileMode, navigation]);

    const handleProfileSelect = (profileMode: 'lambda' | 'capo') => {
        // Sauvegarder le choix dans le store
        dispatch(setSelectedProfileMode(profileMode));
        // La navigation sera gérée par useEffect
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Choisissez votre profil</Text>
                        <Text style={styles.subtitle}>
                            Sélectionnez le mode qui correspond à votre utilisation
                        </Text>
                    </View>

                    <View style={styles.profilesContainer}>
                        {/* Profil Lambda */}
                        <TouchableOpacity
                            style={styles.profileCard}
                            onPress={() => handleProfileSelect('lambda')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.profileIconContainer}>
                                <Ionicons name="people-outline" size={48} color={COLORS.primary} />
                            </View>
                            <Text style={styles.profileTitle}>Joueur</Text>
                            <Text style={styles.profileDescription}>
                                Rejoignez des parties et participez aux matchs
                            </Text>
                            <View style={styles.featuresList}>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    <Text style={styles.featureText}>Voir les matchs disponibles</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    <Text style={styles.featureText}>Rejoindre des parties</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    <Text style={styles.featureText}>Gérer votre profil</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Profil Capo */}
                        <TouchableOpacity
                            style={styles.profileCard}
                            onPress={() => handleProfileSelect('capo')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.profileIconContainer}>
                                <Ionicons name="trophy-outline" size={48} color={COLORS.primary} />
                            </View>
                            <Text style={styles.profileTitle}>Organisateur</Text>
                            <Text style={styles.profileDescription}>
                                Créez et organisez des parties pour d'autres joueurs
                            </Text>
                            <View style={styles.featuresList}>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    <Text style={styles.featureText}>Créer des parties</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    <Text style={styles.featureText}>Gérer vos événements</Text>
                                </View>
                                <View style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                                    <Text style={styles.featureText}>Toutes les fonctionnalités joueur</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Vous pourrez changer de profil plus tard dans les paramètres
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
        marginTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.title,
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textLight,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    profilesContainer: {
        flex: 1,
        gap: 20,
    },
    profileCard: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 24,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    profileIconContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    profileTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.title,
        textAlign: 'center',
        marginBottom: 8,
    },
    profileDescription: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 20,
    },
    featuresList: {
        gap: 12,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    featureText: {
        fontSize: 14,
        color: COLORS.text,
        flex: 1,
    },
    footer: {
        paddingTop: 20,
        paddingBottom: 10,
    },
    footerText: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default ProfileSelectionScreen;

