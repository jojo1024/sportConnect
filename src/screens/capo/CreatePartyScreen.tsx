import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useRef } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    ActivityIndicator,
    Text,
    TouchableOpacity
} from 'react-native';
import {
    useCreateParty,
    type Field
} from '../../hooks/useCreateParty';
import {
    Header,
    Card,
    FieldSelector,
    DateTimeSelector,
    DurationSelector,
    ParticipantsSelector,
    FieldsBottomSheet,
    DescriptionInput,
    Summary,
    SportSelector
} from '../../components/createParty';
import { SportsBottomSheet } from '../../components/createParty/SportsBottomSheet';
import { SportSelectorBottomSheet } from '../../components/createParty/SportSelectorBottomSheet';
import { Sport } from '../../components/createParty/SportCard';
import { COLORS } from '../../theme/colors';
import { useApiError } from '../../hooks/useApiError';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import CustomAlert from '../../components/CustomAlert';
import CompactErrorCard from '../../components/CompactErrorCard';
import { SuccessModal } from '../../components/SuccessModal';

// Main component
const CreatePartyScreen: React.FC = () => {
    const bottomSheetRef = useRef<any>(null);
    const sportBottomSheetRef = useRef<any>(null);
    const { allowsRetry } = useApiError();
    const { alertConfig } = useCustomAlert();

    const {
        // State
        formData,
        searchQuery,
        sportSearchQuery,
        showDatePicker,
        showTimePicker,
        isSubmitting,
        isLoadingTerrains,
        error,
        showSuccessModal,
        createdMatch,

        // Sports state
        activeSports,
        loadingSports,
        sportError,
        selectedSport,

        // Computed values
        filteredFields,
        filteredSports,
        validation,
        selectedField,
        isMinParticipantsReached,
        isMaxParticipantsReached,

        // Form handlers
        setSelectedField,
        setSport,
        setDuration,
        setDescription,

        // Participants handlers
        increaseParticipants,
        decreaseParticipants,

        // Date/Time handlers
        handleDateChange,
        openDatePicker,
        openTimePicker,
        formatDate,
        formatTime,

        // Search handlers
        updateSearchQuery,
        updateSportSearchQuery,

        // Submit handlers
        handleSubmit,

        // Modal handlers
        closeSuccessModal,

        // Data loading
        retryLoadTerrains,
        retryLoadSports,
    } = useCreateParty();

    const openFieldSelector = () => {
        bottomSheetRef.current?.open();
    };

    const handleFieldSelection = (field: Field) => {
        setSelectedField(field);
        bottomSheetRef.current?.close();
    };

    const openSportSelector = () => {
        sportBottomSheetRef.current?.open();
    };

    const handleSportSelection = (sport: Sport) => {
        setSport(sport);
        sportBottomSheetRef.current?.close();
    };

    // Vérifier si le formulaire est prêt à être soumis
    const isFormReady = validation.isValid && !isSubmitting && !isLoadingTerrains && !loadingSports;

    // Debug: Log de l'état du formulaire
    console.log('🔍 Debug isFormReady:', {
        validationIsValid: validation.isValid,
        validationErrors: validation.errors,
        isSubmitting,
        isLoadingTerrains,
        loadingSports,
        isFormReady,
        formData: {
            selectedFieldId: formData.selectedFieldId,
            selectedFieldName: formData.selectedFieldName,
            sportId: formData.sportId,
            date: formData.date,
            duration: formData.duration,
            numberOfParticipants: formData.numberOfParticipants,
            description: formData.description
        }
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header onCreate={handleSubmit} isSubmitting={isSubmitting} isFormReady={isFormReady} />

            {/* Affichage de l'erreur compacte pour les terrains */}
            {error && (
                <CompactErrorCard
                    message={error}
                    onRetry={retryLoadTerrains}
                />
            )}

            {/* Affichage de l'erreur compacte pour les sports */}
            {sportError && (
                <CompactErrorCard
                    message={sportError}
                    onRetry={retryLoadSports}
                />
            )}

            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                <View style={styles.formContainer}>
                    {/* Informations générales */}
                    <View style={styles.infoSection}>
                        <Text style={styles.infoTitle}>Informations de la partie</Text>
                        <Text style={styles.infoText}>
                            Créez une partie sportive et invitez des participants à vous rejoindre.
                        </Text>
                    </View>

                    <Card icon="location" title="Terrain">
                        <FieldSelector
                            selectedField={formData.selectedFieldName}
                            loading={isLoadingTerrains}
                            error={error}
                            onPress={openFieldSelector}
                            onRetry={retryLoadTerrains}
                        />
                    </Card>

                    <Card icon="football" title="Sport">
                        <SportSelectorBottomSheet
                            selectedSport={selectedSport}
                            loading={loadingSports}
                            error={sportError}
                            onPress={openSportSelector}
                            onRetry={retryLoadSports}
                        />
                    </Card>

                    <Card icon="calendar" title="Date et heure">
                        <DateTimeSelector
                            date={formData.date}
                            onDatePress={openDatePicker}
                            onTimePress={openTimePicker}
                            formatDate={formatDate}
                            formatTime={formatTime}
                        />
                    </Card>

                    <Card icon="hourglass" title="Durée">
                        <DurationSelector
                            duration={formData.duration}
                            onDurationChange={setDuration}
                        />
                    </Card>

                    <Card icon="people" title="Nombre de participants">
                        <ParticipantsSelector
                            numberOfParticipants={formData.numberOfParticipants}
                            onIncrease={increaseParticipants}
                            onDecrease={decreaseParticipants}
                            isMinReached={isMinParticipantsReached}
                            isMaxReached={isMaxParticipantsReached}
                        />
                    </Card>

                    <Card icon="chatbubble" title="Message aux participants">
                        <DescriptionInput
                            value={formData.description}
                            onChangeText={setDescription}
                        />
                    </Card>

                    {/* Résumé de la partie */}
                    <Summary
                        selectedField={selectedField}
                        date={formData.date}
                        duration={formData.duration}
                        numberOfParticipants={formData.numberOfParticipants}
                        description={formData.description}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        selectedSport={selectedSport}
                    />

                    {/* Messages de validation */}
                    {!validation.isValid && validation.errors.length > 0 && (
                        <View style={styles.validationSection}>
                            <Text style={styles.validationTitle}>Veuillez corriger les erreurs suivantes:</Text>
                            {validation.errors.map((error, index) => (
                                <Text key={index} style={styles.validationError}>
                                    • {error}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>

            <FieldsBottomSheet
                bottomSheetRef={bottomSheetRef}
                searchQuery={searchQuery}
                onSearchChange={updateSearchQuery}
                filteredFields={filteredFields}
                selectedFieldId={formData.selectedFieldId}
                onFieldSelect={handleFieldSelection}
            />

            <SportsBottomSheet
                bottomSheetRef={sportBottomSheetRef}
                searchQuery={sportSearchQuery}
                onSearchChange={updateSportSearchQuery}
                filteredSports={filteredSports}
                selectedSportId={formData.sportId}
                onSportSelect={handleSportSelection}
            />

            {showDatePicker && (
                <DateTimePicker
                    value={formData.date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={formData.date}
                    mode="time"
                    display="default"
                    onChange={handleDateChange}
                />
            )}

            {/* Modal de succès */}
            {createdMatch && (
                <SuccessModal
                    visible={showSuccessModal}
                    onClose={closeSuccessModal}
                    matchCode={createdMatch.codeMatch}
                    matchDetails={{
                        terrainName: createdMatch.terrainNom || formData.selectedFieldName,
                        date: formatDate(new Date(createdMatch.matchDateDebut)),
                        time: formatTime(new Date(createdMatch.matchDateDebut)),
                        duration: createdMatch.matchDuree,
                        participants: createdMatch.matchNbreParticipant,
                        matchPrixParJoueur: createdMatch.matchPrixParJoueur,
                        sportName: createdMatch?.sportNom || 'Sport non spécifié',
                    }}
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
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    formContainer: {
        paddingTop: 20,
        gap: 16,
    },
    infoSection: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.dark,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textLight,
        lineHeight: 20,
    },

    validationSection: {
        backgroundColor: COLORS.white,
        padding: 16,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.danger,
    },
    validationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.danger,
        marginBottom: 8,
    },
    validationError: {
        fontSize: 14,
        color: COLORS.danger,
        marginBottom: 4,
    },
});

export default CreatePartyScreen; 