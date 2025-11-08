import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CompactErrorCard from '../../components/CompactErrorCard';
import {
    Card,
    DateTimeSelector,
    DescriptionInput,
    DurationSelector,
    Header,
    ParticipantsSelector,
    SportsBottomSheet,
    Summary
} from '../../components/createParty';
import { TerrainsBottomSheet } from '../../components/createParty/TerrainsBottomSheet';
import { SuccessModal } from '../../components/SuccessModal';
import { useCreateParty } from '../../hooks/useCreateParty';
import { COLORS } from '../../theme/colors';
import { formatDate, formatTime } from '../../utils/functions';
import { TerrainSelector } from '../../components/createParty/TerrainSelector';
import { SportSelector } from '../../components/createParty/SportSelector';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectIsAuthenticated, selectUser } from '../../store/slices/userSlice';
import AuthRequiredScreen from '../../components/AuthRequiredScreen';

// Main component
const CreatePartyScreen: React.FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);

    // Si non authentifié, afficher l'écran de connexion requise
    if (!isAuthenticated) {
        return (
            <AuthRequiredScreen
                title="Connexion requise"
                message="Vous devez vous connecter pour créer une partie."
                iconName="add-circle-outline"
            />
        );
    }

    // Si authentifié mais pas capo, afficher un message spécifique
    if (user?.utilisateurRole !== 'capo') {
        return (
            <AuthRequiredScreen
                title="Rôle requis"
                message="Vous devez être organisateur (Capo) pour créer une partie. Contactez le support pour demander ce rôle."
                iconName="trophy-outline"
            />
        );
    }
    const {
        // Refs
        terrainBottomSheetRef,
        sportBottomSheetRef,

        // État du formulaire
        formData,
        terrainSearchTerm,
        sportSearchTerm,
        isDatePickerVisible,
        isTimePickerVisible,
        isSubmittingForm,
        isLoadingTerrains,
        formError,
        terrainLoadingError,
        isSuccessModalVisible,
        createdMatchData,

        // État des sports
        isLoadingSports,
        sportsError,
        selectedSport,

        // Valeurs calculées
        filteredTerrains,
        filteredSports,
        availableSportsForTerrain,
        formValidation,
        selectedTerrain,
        isMinParticipantCountReached,
        isMaxParticipantCountReached,

        // Gestionnaires du formulaire
        updateDurationHours,
        updateDescription,

        // Gestionnaires des participants
        incrementParticipantCount,
        decrementParticipantCount,

        // Gestionnaires de date/heure
        handleDateTimeChange,
        showDatePicker,
        showTimePicker,

        // Gestionnaires de recherche
        updateTerrainSearchTerm,
        updateSportSearchTerm,

        // Gestionnaires des bottom sheets
        openTerrainSelector,
        openSportSelector,

        // Gestionnaires de sélection
        handleTerrainSelection,
        handleSportSelection,

        // Gestionnaires de soumission
        submitCreatePartyForm,

        // Gestionnaires du modal
        hideSuccessModal,

        // Chargement des données
        retryLoadTerrains,
        retryLoadSports,
        refreshSports,
        refreshTerrains,
    } = useCreateParty();
    console.log("🚀 ~ filteredSportsbbbbbbbbbbbbbb:", filteredSports.slice(0, 2))
    // console.log("🚀 ~ filteredTerrainsbbbbbbbbbbbbbbb:", filteredTerrains)

    // Vérifier si le formulaire est prêt à être soumis
    const isFormReady = formValidation.isValid && !isSubmittingForm && !isLoadingTerrains && !isLoadingSports;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header onCreate={submitCreatePartyForm} isSubmitting={isSubmittingForm} isFormReady={isFormReady} />

            {/* Affichage de l'erreur compacte pour les terrains */}
            {formError && (
                <CompactErrorCard
                    message={formError}
                    onRetry={retryLoadTerrains}
                />
            )}

            {/* Affichage de l'erreur compacte pour les sports */}
            {sportsError && (
                <CompactErrorCard
                    message={sportsError}
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

                    <Card
                        icon="location"
                        title="Terrain"
                        headerAction={
                            <TouchableOpacity
                                style={styles.refreshButton}
                                onPress={refreshTerrains}
                                disabled={isLoadingTerrains}
                            >
                                <Ionicons
                                    name="refresh"
                                    size={16}
                                    color={isLoadingTerrains ? "#ccc" : COLORS.primary}
                                />
                            </TouchableOpacity>
                        }
                    >
                        <TerrainSelector
                            selectedField={formData.selectedTerrainName}
                            loading={isLoadingTerrains}
                            error={terrainLoadingError}
                            onPress={openTerrainSelector}
                            onRetry={retryLoadTerrains}
                        />
                    </Card>

                    <Card
                        icon="football"
                        title="Sport"
                        headerAction={
                            <TouchableOpacity
                                style={styles.refreshButton}
                                onPress={refreshSports}
                                disabled={isLoadingSports}
                            >
                                <Ionicons
                                    name="refresh"
                                    size={16}
                                    color={isLoadingSports ? "#ccc" : COLORS.primary}
                                />
                            </TouchableOpacity>
                        }
                    >
                        {/* Message informatif si aucun sport n'est disponible sur le terrain sélectionné */}
                        {formData.selectedTerrainId && availableSportsForTerrain.length === 0 && (
                            <View style={styles.infoMessage}>
                                <Text style={styles.infoMessageText}>
                                    Aucun sport n'est disponible sur ce terrain. Veuillez sélectionner un autre terrain.
                                </Text>
                            </View>
                        )}

                        <SportSelector
                            selectedSport={selectedSport}
                            loading={isLoadingSports}
                            error={sportsError}
                            onPress={openSportSelector}
                            onRetry={retryLoadSports}
                            disabled={!!(formData.selectedTerrainId && availableSportsForTerrain.length === 0)}
                        />
                    </Card>

                    <Card icon="calendar" title="Date et heure">
                        <DateTimeSelector
                            date={formData.selectedDate}
                            onDatePress={showDatePicker}
                            onTimePress={showTimePicker}
                            formatDate={formatDate}
                            formatTime={formatTime}
                        />
                    </Card>

                    <Card icon="hourglass" title="Durée">
                        <DurationSelector
                            duration={formData.durationHours}
                            onDurationChange={updateDurationHours}
                        />
                    </Card>

                    <Card icon="people" title="Nombre de participants">
                        <ParticipantsSelector
                            numberOfParticipants={formData.participantCount}
                            onIncrease={incrementParticipantCount}
                            onDecrease={decrementParticipantCount}
                            isMinReached={isMinParticipantCountReached}
                            isMaxReached={isMaxParticipantCountReached}
                        />
                    </Card>

                    <Card icon="chatbubble" title="Message aux participants">
                        <DescriptionInput
                            value={formData.description}
                            onChangeText={updateDescription}
                        />
                    </Card>

                    {/* Résumé de la partie */}
                    <Summary
                        selectedField={selectedTerrain}
                        date={formData.selectedDate}
                        duration={formData.durationHours}
                        numberOfParticipants={formData.participantCount}
                        description={formData.description}
                        formatDate={formatDate}
                        formatTime={formatTime}
                        selectedSport={selectedSport}
                    />

                    {/* Messages de validation */}
                    {!formValidation.isValid && formValidation.errorMessages.length > 0 && (
                        <View style={styles.validationSection}>
                            <Text style={styles.validationTitle}>Veuillez corriger les erreurs suivantes:</Text>
                            {formValidation.errorMessages.map((errorMessage: string, index: number) => (
                                <Text key={index} style={styles.validationError}>
                                    • {errorMessage}
                                </Text>
                            ))}
                        </View>
                    )}
                </View>
                <View style={{ height: 60 }} />
            </ScrollView>

            <TerrainsBottomSheet
                bottomSheetRef={terrainBottomSheetRef}
                searchQuery={terrainSearchTerm}
                onSearchChange={updateTerrainSearchTerm}
                filteredFields={filteredTerrains}
                selectedFieldId={formData.selectedTerrainId}
                onFieldSelect={handleTerrainSelection}
            />

            <SportsBottomSheet
                bottomSheetRef={sportBottomSheetRef}
                searchQuery={sportSearchTerm}
                onSearchChange={updateSportSearchTerm}
                filteredSports={filteredSports}
                isSportSelected={(sportId: number) => formData.selectedSportId === sportId}
                onSportSelect={handleSportSelection}
            />

            {isDatePickerVisible && (
                <DateTimePicker
                    value={formData.selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateTimeChange}
                    minimumDate={new Date()}
                />
            )}

            {isTimePickerVisible && (
                <DateTimePicker
                    value={formData.selectedDate}
                    mode="time"
                    display="spinner"
                    onChange={handleDateTimeChange}
                />
            )}

            {/* Modal de succès */}
            {createdMatchData && (
                <SuccessModal
                    visible={isSuccessModalVisible}
                    onClose={hideSuccessModal}
                    matchCode={createdMatchData.codeMatch}
                    matchDetails={{
                        terrainName: createdMatchData.terrainNom || formData.selectedTerrainName,
                        date: formatDate(new Date(createdMatchData.matchDateDebut)),
                        time: formatTime(new Date(createdMatchData.matchDateDebut)),
                        duration: createdMatchData.matchDuree,
                        participants: createdMatchData.matchNbreParticipant,
                        matchPrixParJoueur: createdMatchData.matchPrixParJoueur,
                        sportName: createdMatchData?.sportNom || 'Sport non spécifié',
                    }}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: COLORS.background,
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
    refreshButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0f9ff',
    },
    infoMessage: {
        backgroundColor: '#fff3cd',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    infoMessageText: {
        fontSize: 14,
        color: '#856404',
        textAlign: 'center',
    },
    successMessage: {
        backgroundColor: '#d4edda',
        padding: 12,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    successMessageText: {
        fontSize: 14,
        color: '#155724',
        textAlign: 'center',
    },
});

export default CreatePartyScreen; 