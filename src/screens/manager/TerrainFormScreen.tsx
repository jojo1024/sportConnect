import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Card, Header } from '../../components/addTerrain';
import CompactErrorCard from '../../components/CompactErrorCard';
import CustomTextInput from '../../components/CustomTextInput';
import PhoneInput from '../../components/PhoneInput';
import SuccessCard from '../../components/SuccessCard';
import { ImageSelector, TerrainSummary, TimeSelector } from '../../components/terrain';
import { useTerrainForm } from '../../hooks/useTerrainForm';
import { COLORS } from '../../theme/colors';


const TerrainFormScreen: React.FC = () => {

    const {
        formData,
        errors,
        isSubmitting,
        showStartTimePicker,
        showEndTimePicker,
        successMessage,
        errorMessage,
        setTerrainNom,
        setTerrainLocalisation,
        setTerrainDescription,
        setTerrainContact,
        setTerrainPrixParHeure,
        setShowStartTimePicker,
        setShowEndTimePicker,
        handleStartTimeChange,
        handleEndTimeChange,
        pickImage,
        removeImage,
        handleSubmit,
        isFormReady,
        clearSuccessMessage,
        handleBack,
        handleRetry,
        mode,
        nomRef,
        localisationRef,
        descriptionRef,
        contactRef,
        prixRef,
    } = useTerrainForm();



    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                mode={mode}
                onSave={handleSubmit}
                onBack={handleBack}
                isSubmitting={isSubmitting}
                isFormReady={isFormReady}
            />

            {/* Affichage des messages de succès et d'erreur */}
            {successMessage && (
                <SuccessCard
                    message={successMessage}
                    onClose={clearSuccessMessage}
                />
            )}

            {errorMessage && (
                <CompactErrorCard
                    message={errorMessage}
                    onRetry={handleRetry}
                />
            )}

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    <View style={styles.formContainer}>
                        {/* Informations générales */}
                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>
                                {mode === 'create' ? 'Informations du terrain' : 'Modifier le terrain'}
                            </Text>
                            <Text style={styles.infoText}>
                                {mode === 'create'
                                    ? 'Ajoutez un nouveau terrain sportif pour permettre aux utilisateurs de réserver des créneaux.'
                                    : 'Modifiez les informations de votre terrain sportif.'
                                }
                            </Text>
                        </View>

                        <Card icon="business" title="Informations générales">
                            <CustomTextInput
                                label="Nom du terrain"
                                value={formData.terrainNom}
                                onChangeText={setTerrainNom}
                                placeholder="Ex: Terrain de Foot Central"
                                error={errors.terrainNom}
                                returnKeyType="next"
                                refInput={nomRef}
                                onSubmitEditing={() => localisationRef?.current?.focus()}
                            />

                            <CustomTextInput
                                label="Localisation"
                                value={formData.terrainLocalisation}
                                onChangeText={setTerrainLocalisation}
                                placeholder="Ex: Cocody cité mermoz"
                                error={errors.terrainLocalisation}
                                returnKeyType="next"
                                refInput={localisationRef}
                                onSubmitEditing={() => contactRef.current?.focus()}
                            />

                            <PhoneInput
                                label="Numero"
                                value={formData.terrainContact}
                                onChangeText={setTerrainContact}
                                error={errors.terrainContact}
                                returnKeyType="next"
                                refInput={contactRef}
                                onSubmitEditing={() => descriptionRef.current?.focus()}
                            />

                            <CustomTextInput
                                label="Description (optionnel)"
                                value={formData.terrainDescription}
                                onChangeText={setTerrainDescription}
                                placeholder="Décrivez votre terrain..."
                                multiline
                                numberOfLines={3}
                                style={styles.textArea}
                                returnKeyType="next"
                                refInput={descriptionRef}
                                onSubmitEditing={() => prixRef.current?.focus()}
                            />
                        </Card>

                        <Card icon="cash" title="Tarification">
                            <CustomTextInput
                                label="Prix par heure (FCFA)"
                                value={formData.terrainPrixParHeure}
                                onChangeText={setTerrainPrixParHeure}
                                placeholder="Ex: 15000"
                                keyboardType="numeric"
                                error={errors.terrainPrixParHeure}
                                refInput={prixRef}
                            />
                        </Card>

                        <Card icon="time" title="Horaires d'ouverture">
                            <View style={styles.timeContainer}>
                                <TimeSelector
                                    label="Heure d'ouverture"
                                    time={formData.terrainHoraires.ouverture}
                                    onPress={() => setShowStartTimePicker(true)}
                                />
                                <TimeSelector
                                    label="Heure de fermeture"
                                    time={formData.terrainHoraires.fermeture}
                                    onPress={() => setShowEndTimePicker(true)}
                                />
                            </View>
                        </Card>

                        <Card icon="image" title="Photos du terrain">
                            <ImageSelector
                                onImageSelect={pickImage}
                                onImageRemove={removeImage}
                                selectedImages={formData.terrainImages}
                                error={errors.terrainImages}
                            />
                        </Card>

                        {/* Résumé du terrain */}
                        {isFormReady && (
                            <TerrainSummary
                                mode={mode}
                                formData={formData}
                            />
                        )}
                    </View>
                    <View style={{ height: 60 }} />
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Date/Time Pickers */}
            {showStartTimePicker && (
                <DateTimePicker
                    value={new Date(`2000-01-01T${formData.terrainHoraires.ouverture}`)}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleStartTimeChange}
                />
            )}

            {showEndTimePicker && (
                <DateTimePicker
                    value={new Date(`2000-01-01T${formData.terrainHoraires.fermeture}`)}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleEndTimeChange}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f7fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f7fa',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    formContainer: {
        padding: 16,
        gap: 16,
    },
    infoSection: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    timeContainer: {
        gap: 12,
    },
});

export default TerrainFormScreen; 