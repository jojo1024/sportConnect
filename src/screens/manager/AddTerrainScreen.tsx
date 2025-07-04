import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
    FlatList,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Header, Card } from '../../components/addTerrain';
import { useAddTerrain } from '../../hooks/useAddTerrain';
import { COLORS } from '../../theme/colors';
import CustomTextInput from '../../components/CustomTextInput';
import PhoneInput from '../../components/PhoneInput';
import CompactErrorCard from '../../components/CompactErrorCard';
import SuccessCard from '../../components/SuccessCard';

// Composant pour la saisie de localisation
interface LocationInputProps {
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    refInput: React.RefObject<TextInput | null>;
    onSubmitEditing: () => void;
}

const LocationInput: React.FC<LocationInputProps> = ({ value, onChangeText, error, refInput, onSubmitEditing }) => (
    <CustomTextInput
        label="Localisation"
        value={value}
        onChangeText={onChangeText}
        placeholder="Ex: Cocody cité mermoz"
        error={error}
        returnKeyType="next"
        refInput={refInput}
        onSubmitEditing={onSubmitEditing}
    />
);

// Composant pour la sélection d'images multiples
interface ImageSelectorProps {
    onImageSelect: () => Promise<void>;
    onImageRemove: (index: number) => void;
    selectedImages: string[];
    error?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ onImageSelect, onImageRemove, selectedImages, error }) => (
    <View style={styles.imageSelectorContainer}>
        <FlatList
            data={selectedImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
                <View style={styles.imageItem}>
                    <Image source={{ uri: item }} style={styles.selectedImage} />
                    <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => onImageRemove(index)}
                    >
                        <Ionicons name="close-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            )}
            ListFooterComponent={
                selectedImages.length < 5 ? (
                    <TouchableOpacity
                        style={[styles.addImageButton, error && styles.addImageButtonError]}
                        onPress={onImageSelect}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={32} color={COLORS.primary} />
                        <Text style={styles.addImageText}>Ajouter</Text>
                    </TouchableOpacity>
                ) : null
            }
        />
        {selectedImages.length === 0 && (
            <TouchableOpacity
                style={[styles.imageSelector, error && styles.imageSelectorError]}
                onPress={onImageSelect}
                activeOpacity={0.8}
            >
                <View style={styles.imageSelectorContent}>
                    <View style={styles.imageSelectorIcon}>
                        <Ionicons name="camera" size={32} color="#fff" />
                    </View>
                    <Text style={styles.imageSelectorText}>Sélectionner des photos (max 5)</Text>
                </View>
            </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

// Composant pour la sélection d'heure
interface TimeSelectorProps {
    label: string;
    time: string;
    onPress: () => void;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ label, time, onPress }) => (
    <TouchableOpacity style={styles.timeSelector} onPress={onPress}>
        <Text style={styles.timeSelectorLabel}>{label}</Text>
        <Text style={styles.timeSelectorValue}>{time}</Text>
        <Ionicons name="time" size={20} color={COLORS.primary} />
    </TouchableOpacity>
);

// Composant principal
const AddTerrainScreen: React.FC = () => {
    const navigation = useNavigation();

    // Refs pour la navigation entre les champs
    const nomRef = useRef<TextInput>(null);
    const localisationRef = useRef<TextInput>(null);
    const descriptionRef = useRef<TextInput>(null);
    const contactRef = useRef<TextInput>(null);
    const prixRef = useRef<TextInput>(null);

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
        clearErrorMessage,
    } = useAddTerrain();

    const handleBack = () => {
        navigation.goBack();
    };

    const handleRetry = () => {
        clearErrorMessage();
        // Optionnel : relancer la soumission
        if (isFormReady) {
            handleSubmit();
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                mode="create"
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
                            <Text style={styles.infoTitle}>Informations du terrain</Text>
                            <Text style={styles.infoText}>
                                Ajoutez un nouveau terrain sportif pour permettre aux utilisateurs de réserver des créneaux.
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
                                onSubmitEditing={() => localisationRef.current?.focus()}
                            />

                            <LocationInput
                                value={formData.terrainLocalisation}
                                onChangeText={setTerrainLocalisation}
                                error={errors.terrainLocalisation}
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
                                // returnKeyType="done"
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
                            <View style={styles.summarySection}>
                                <Text style={styles.summaryTitle}>Résumé de votre terrain</Text>
                                <View style={styles.summaryCard}>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Nom:</Text>
                                        <Text style={styles.summaryValue}>{formData.terrainNom}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Localisation:</Text>
                                        <Text style={styles.summaryValue} numberOfLines={2}>
                                            {formData.terrainLocalisation}
                                        </Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Contact:</Text>
                                        <Text style={styles.summaryValue}>{formData.terrainContact}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Prix:</Text>
                                        <Text style={styles.summaryValue}>{formData.terrainPrixParHeure} FCFA/heure</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Horaires:</Text>
                                        <Text style={styles.summaryValue}>
                                            {formData.terrainHoraires.ouverture} - {formData.terrainHoraires.fermeture}
                                        </Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Photos:</Text>
                                        <Text style={styles.summaryValue}>
                                            {formData.terrainImages.length} photo(s)
                                        </Text>
                                    </View>
                                    {formData.terrainDescription && (
                                        <View style={styles.summaryRow}>
                                            <Text style={styles.summaryLabel}>Description:</Text>
                                            <Text style={styles.summaryValue} numberOfLines={2}>
                                                {formData.terrainDescription}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            </View>
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
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
    timeContainer: {
        gap: 12,
    },
    timeSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    timeSelectorLabel: {
        fontSize: 14,
        color: '#666',
    },
    timeSelectorValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    imageSelectorContainer: {
        marginBottom: 8,
    },
    imageSelector: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageSelectorError: {
        borderColor: '#dc3545',
    },
    imageSelectorContent: {
        alignItems: 'center',
    },
    imageSelectorIcon: {
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageSelectorText: {
        color: '#666',
        fontSize: 14,
        fontWeight: '500',
    },
    imageItem: {
        marginRight: 12,
        position: 'relative',
    },
    selectedImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: COLORS.overlayDark,
        borderRadius: 12,
    },
    addImageButton: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    addImageButtonError: {
        borderColor: '#dc3545',
    },
    addImageText: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: 4,
    },
    summarySection: {
        marginTop: 8,
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    summaryCard: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
        flex: 1,
    },
    summaryValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        flex: 2,
        textAlign: 'right',
    },
});

export default AddTerrainScreen; 