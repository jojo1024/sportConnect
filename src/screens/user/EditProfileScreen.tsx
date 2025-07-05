import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import CustomTextInput from '../../components/CustomTextInput';
import CustomButton from '../../components/CustomButton';
import PhoneInput from '../../components/PhoneInput';
import DateOfBirthInput from '../../components/DateOfBirthInput';
import { CommuneSelector } from '../../components/register';
import CompactErrorCard from '../../components/CompactErrorCard';
import SuccessCard from '../../components/SuccessCard';
import { useEditProfile } from '../../hooks';
import ProfileImageSelector from '../../components/ProfileImageSelector';

const EditProfileScreen: React.FC = () => {
    const bottomSheetRef = useRef<any>(null);
    const [searchCommune, setSearchCommune] = useState('');

    const {
        formData,
        loading,
        error,
        successMessage,
        handleInputChange,
        pickProfileImage,
        handleSave,
        resetForm,
        clearSuccessMessage,
        handleRetry,
        goBack
    } = useEditProfile();

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* Header simple */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={goBack}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Modifier le profil</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Affichage des messages de succès et d'erreur */}
                {successMessage && (
                    <SuccessCard
                        message={successMessage}
                        onClose={clearSuccessMessage}
                    />
                )}

                {error && (
                    <CompactErrorCard
                        message={error}
                        onRetry={handleRetry}
                    />
                )}
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Section photo de profil */}
                    <ProfileImageSelector
                        onImageSelect={pickProfileImage}
                        selectedImage={formData.utilisateurAvatar || undefined}
                        error={error || undefined}
                    />

                    <CustomTextInput
                        label="Nom utilisateur"
                        value={formData.utilisateurNom}
                        onChangeText={(value) => {
                            handleInputChange('utilisateurNom', value);
                        }}
                        placeholder="Entrez votre nom complet"
                    />

                    <PhoneInput
                        label="Numéro de téléphone"
                        value={formData.utilisateurTelephone}
                        onChangeText={(value) => {
                            handleInputChange('utilisateurTelephone', value);
                        }}
                        placeholder="01 23 45 67 89"
                        isEditable={false}
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Commune</Text>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => bottomSheetRef.current?.open()}
                        >
                            <Text style={styles.inputText}>
                                {formData.utilisateurCommune || 'Sélectionner une commune'}
                            </Text>
                            <Ionicons name="chevron-down" size={24} color={COLORS.textLight} />
                        </TouchableOpacity>
                    </View>

                    <DateOfBirthInput
                        label="Date de naissance"
                        value={formData.utilisateurDateNaiss}
                        onChangeText={(value) => {
                            handleInputChange('utilisateurDateNaiss', value);
                        }}
                        placeholder="Sélectionner votre date de naissance"
                    />

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Sexe</Text>
                        <View style={styles.sexeButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.sexeButton,
                                    formData.utilisateurSexe === 'Homme' && styles.sexeButtonActive
                                ]}
                                onPress={() => {
                                    handleInputChange('utilisateurSexe', 'Homme');
                                }}
                            >
                                <Text style={[
                                    styles.sexeButtonText,
                                    formData.utilisateurSexe === 'Homme' && styles.sexeButtonTextActive
                                ]}>Homme</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.sexeButton,
                                    formData.utilisateurSexe === 'Femme' && styles.sexeButtonActive
                                ]}
                                onPress={() => {
                                    handleInputChange('utilisateurSexe', 'Femme');
                                }}
                            >
                                <Text style={[
                                    styles.sexeButtonText,
                                    formData.utilisateurSexe === 'Femme' && styles.sexeButtonTextActive
                                ]}>Femme</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>

                        <CustomButton
                            title="Enregistrer"
                            onPress={handleSave}
                            loading={loading}
                            style={{ flex: 1 }}
                        />
                    </View>



                    <View style={{ height: 70 }}></View>
                </ScrollView>

                {/* Sélecteur de commune */}
                <CommuneSelector
                    bottomSheetRef={bottomSheetRef}
                    searchCommune={searchCommune}
                    setSearchCommune={setSearchCommune}
                    formState={formData}
                    handlers={{
                        handleCommuneChange: (commune: string) => {
                            handleInputChange('utilisateurCommune', commune);
                        }
                    }}
                    setGlobalError={() => { }}
                />


            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    keyboardContainer: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.text,
        flex: 1,
        textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 32,
        color: COLORS.text,
    },
    inputContainer: {
        marginBottom: 8,
    },
    label: {
        color: COLORS.primary,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        padding: 8,
        fontSize: 16,
        backgroundColor: COLORS.white,
    },
    inputText: {
        color: COLORS.textLight,
        fontSize: 16,
    },
    validIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    validText: {
        fontSize: 13,
        marginLeft: 4,
    },
    sexeButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    sexeButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.primary,
        backgroundColor: COLORS.white,
        alignItems: 'center',
    },
    sexeButtonActive: {
        backgroundColor: COLORS.primary,
    },
    sexeButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
    sexeButtonTextActive: {
        color: COLORS.white,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 15,
        marginTop: 20,
    },
    resetButton: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.gray[300],
        flex: 0.4,
    },

});

export default EditProfileScreen; 