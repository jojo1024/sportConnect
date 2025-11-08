import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS } from '../theme/colors';
import { SIZES } from '../theme/typography';
import CustomTextInput from './CustomTextInput';
import CustomButton from './CustomButton';
import PhoneInput from './PhoneInput';
import { useLoginForm } from '../hooks/useLoginForm';
import { useAppSelector } from '../store/hooks/hooks';
import { selectIsAuthenticated } from '../store/slices/userSlice';
import { ScreenNavigationProps } from '../navigation/types';

interface AuthBottomSheetProps {
    bottomSheetRef: React.RefObject<RBSheet | null>;
    onAuthSuccess?: () => void;
}

const AuthBottomSheet: React.FC<AuthBottomSheetProps> = ({ bottomSheetRef, onAuthSuccess }) => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const passwordInputRef = useRef<any>(null);
    const navigation = useNavigation<ScreenNavigationProps>();

    // Login form - skipNavigation=true car on gère la navigation via onAuthSuccess
    const [loginFormState, loginFormHandlers] = useLoginForm(true);

    // Fermer le bottom sheet si l'utilisateur s'est authentifié
    useEffect(() => {
        if (isAuthenticated && bottomSheetRef.current) {
            bottomSheetRef.current.close();
            onAuthSuccess?.();
        }
    }, [isAuthenticated, bottomSheetRef, onAuthSuccess]);

    const handleClose = () => {
        bottomSheetRef.current?.close();
    };

    const handleNavigateToRegister = () => {
        bottomSheetRef.current?.close();
        navigation.navigate('Register');
    };

    const renderLoginContent = () => (
        <ScrollView
            style={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
            contentContainerStyle={styles.scrollContentContainer}
        >
            <View style={styles.content}>
                <Text style={styles.title}>Se connecter</Text>
                <Text style={styles.subtitle}>
                    Connectez-vous pour accéder à toutes les fonctionnalités
                </Text>

                <View style={styles.formContainer}>
                    <PhoneInput
                        label="Numéro de téléphone"
                        value={loginFormState.phone}
                        onChangeText={loginFormHandlers.handlePhoneChange}
                        placeholder="06 12 34 56 78"
                        returnKeyType="next"
                        onSubmitEditing={() => passwordInputRef.current?.focus()}
                    />

                    <CustomTextInput
                        label="Mot de passe"
                        value={loginFormState.password}
                        onChangeText={loginFormHandlers.handlePasswordChange}
                        placeholder="••••••••"
                        isPassword
                        refInput={passwordInputRef}
                        returnKeyType="done"
                        onSubmitEditing={loginFormHandlers.handleLogin}
                    />

                    {loginFormHandlers.error && (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{loginFormHandlers.error}</Text>
                        </View>
                    )}

                    <CustomButton
                        title="Se connecter"
                        onPress={loginFormHandlers.handleLogin}
                        loading={loginFormHandlers.isLoading}
                        style={styles.button}
                    />

                    <View style={styles.switchContainer}>
                        <Text style={styles.switchText}>Vous n'avez pas de compte ? </Text>
                        <TouchableOpacity onPress={handleNavigateToRegister}>
                            <Text style={styles.switchLink}>S'inscrire</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );

    return (
        <RBSheet
            ref={bottomSheetRef}
            closeOnDragDown={true}
            closeOnPressMask={false}
            customStyles={{
                wrapper: styles.wrapper,
                container: styles.container,
                draggableIcon: styles.draggableIcon,
            }}
            height={SIZES.height * 0.85}
            keyboardAvoidingViewEnabled={Platform.OS === 'ios'}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Connexion</Text>
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={24} color={COLORS.darkGray} />
                </TouchableOpacity>
            </View>

            {renderLoginContent()}
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.overlay,
    },
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: COLORS.white,
    },
    draggableIcon: {
        backgroundColor: COLORS.gray[400],
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.title,
    },
    closeButton: {
        padding: 4,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        flexGrow: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.title,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
        marginBottom: 24,
    },
    formContainer: {
        gap: 16,
    },
    errorContainer: {
        backgroundColor: COLORS.notificationRed,
        borderColor: COLORS.danger,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 14,
        textAlign: 'center',
    },
    button: {
        marginTop: 8,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        flexWrap: 'wrap',
    },
    switchText: {
        color: COLORS.textLight,
        fontSize: 14,
    },
    switchLink: {
        color: COLORS.primary,
        fontSize: 14,
        textDecorationLine: 'underline',
        fontWeight: '600',
    },
});

export default AuthBottomSheet;

