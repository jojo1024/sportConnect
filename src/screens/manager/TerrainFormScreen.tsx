import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useRef } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Card, Header } from '../../components/addTerrain';
import CompactErrorCard from '../../components/CompactErrorCard';
import CustomTextInput from '../../components/CustomTextInput';
import PhoneInput from '../../components/PhoneInput';
import SuccessCard from '../../components/SuccessCard';
import { ImageSelector, TerrainSummary, TimeSelector } from '../../components/terrain';
import { SportsBottomSheet } from '../../components/createParty/SportsBottomSheet';
import { useTerrainForm } from '../../hooks/useTerrainForm';
import { COLORS } from '../../theme/colors';
import { Ionicons } from '@expo/vector-icons';


const TerrainFormScreen: React.FC = () => {

    // États pour SportsBottomSheet
    const sportsBottomSheetRef = useRef<RBSheet>(null);

    // Ouvrir le bottom sheet
    const openSportsBottomSheet = () => {
        sportsBottomSheetRef.current?.open();
    };

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

        // États pour les sports
        selectedSports,
        filteredSports,
        sportsLoading,
        sportsError,
        searchQuery,

        // Sports handlers
        handleSportSelect,
        handleSearchChange,
        isSportSelected,
        refreshSports,
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

            {/* Affichage de l'erreur pour les sports */}
            {sportsError && (
                <CompactErrorCard
                    message={sportsError}
                    onRetry={refreshSports}
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

                            {/* Sélecteur de sport */}
                            <View style={styles.inputGroup}>
                                <View style={styles.sportHeader}>
                                    <Text style={styles.inputLabel}>Sports disponibles</Text>
                                    <TouchableOpacity
                                        style={styles.refreshButton}
                                        onPress={refreshSports}
                                        disabled={sportsLoading}
                                    >
                                        <Ionicons
                                            name="refresh"
                                            size={16}
                                            color={sportsLoading ? "#ccc" : COLORS.primary}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.selectedSports && (
                                    <Text style={styles.errorText}>{errors.selectedSports}</Text>
                                )}
                                <TouchableOpacity
                                    style={[styles.sportSelector, sportsLoading && styles.sportSelectorDisabled]}
                                    onPress={openSportsBottomSheet}
                                    disabled={sportsLoading}
                                >
                                    <View style={styles.sportSelectorContent}>
                                        <Ionicons
                                            name="football"
                                            size={20}
                                            color={selectedSports.length > 0 ? COLORS.primary : "#999"}
                                        />
                                        <Text style={selectedSports.length > 0 ? styles.selectedSportText : styles.placeholderText}>
                                            {sportsLoading
                                                ? "Chargement des sports..."
                                                : selectedSports.length === 0
                                                    ? "Sélectionner des sports"
                                                    : selectedSports.length === 1
                                                        ? selectedSports[0].sportNom
                                                        : `${selectedSports.length} sports sélectionnés`
                                            }
                                        </Text>
                                    </View>
                                    {!sportsLoading && (
                                        <Ionicons
                                            name="chevron-down"
                                            size={20}
                                            color="#999"
                                        />
                                    )}
                                </TouchableOpacity>

                                {/* Affichage des sports sélectionnés */}
                                {selectedSports.length > 0 && (
                                    <View style={styles.selectedSportsContainer}>
                                        {selectedSports.map((sport) => (
                                            <View key={sport.sportId} style={styles.selectedSportTag}>
                                                <Ionicons
                                                    name="football"
                                                    size={16}
                                                    color={COLORS.primary}
                                                />
                                                <Text style={styles.selectedSportTagText}>
                                                    {sport.sportNom}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() => handleSportSelect(sport)}
                                                    style={styles.removeSportButton}
                                                >
                                                    <Ionicons
                                                        name="close-circle"
                                                        size={16}
                                                        color="#999"
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>

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

            {/* SportsBottomSheet */}
            <SportsBottomSheet
                bottomSheetRef={sportsBottomSheetRef}
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                filteredSports={filteredSports}
                isSportSelected={isSportSelected}
                onSportSelect={handleSportSelect}
            />
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
        color: COLORS.primary,
        marginBottom: 8,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    timeContainer: {
        gap: 12,
    },
    sportSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e9ecef',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
    },
    sportSelectorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    selectedSportText: {
        fontSize: 16,
        marginLeft: 12,
        // fontWeight: '600',
    },
    placeholderText: {
        fontSize: 16,
        color: '#999',
        marginLeft: 12,
    },
    selectedSportsContainer: {
        marginTop: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    selectedSportTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    selectedSportTagText: {
        fontSize: 14,
        color: COLORS.primary,
        marginLeft: 6,
        marginRight: 4,
    },
    removeSportButton: {
        marginLeft: 4,
    },
    sportSelectorDisabled: {
        opacity: 0.6,
    },
    sportHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    refreshButton: {
        padding: 4,
        borderRadius: 4,
    },
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 4,
        marginBottom: 8,
    },
});

export default TerrainFormScreen; 