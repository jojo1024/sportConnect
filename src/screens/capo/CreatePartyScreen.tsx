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
    DescriptionInput
} from '../../components/createParty';
import { COLORS } from '../../theme/colors';
import { useApiError } from '../../hooks/useApiError';
import { useCustomAlert } from '../../hooks/useCustomAlert';
import CustomAlert from '../../components/CustomAlert';
import CompactErrorCard from '../../components/CompactErrorCard';
import { SuccessModal } from '../../components/SuccessModal';

// Main component
const CreatePartyScreen: React.FC = () => {
    const bottomSheetRef = useRef<any>(null);
    const { allowsRetry } = useApiError();
    const { alertConfig } = useCustomAlert();

    const {
        // State
        formData,
        searchQuery,
        showDatePicker,
        showTimePicker,
        isSubmitting,
        isLoadingTerrains,
        error,
        showSuccessModal,
        createdMatch,

        // Computed values
        filteredFields,
        validation,
        selectedField,
        isMinParticipantsReached,
        isMaxParticipantsReached,

        // Form handlers
        setSelectedField,
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

        // Submit handlers
        handleSubmit,

        // Modal handlers
        closeSuccessModal,

        // Data loading
        retryLoadTerrains,
    } = useCreateParty();

    const openFieldSelector = () => {
        bottomSheetRef.current?.open();
    };

    const handleFieldSelection = (field: Field) => {
        setSelectedField(field);
        bottomSheetRef.current?.close();
    };

    // Vérifier si le formulaire est prêt à être soumis
    const isFormReady = validation.isValid && !isSubmitting && !isLoadingTerrains;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header onCreate={handleSubmit} isSubmitting={isSubmitting} isFormReady={isFormReady} />

            {/* Affichage de l'erreur compacte */}
            {error && (
                <CompactErrorCard
                    message={error}
                    onRetry={retryLoadTerrains}
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
                        {isLoadingTerrains ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="small" color={COLORS.primary} />
                                <Text style={styles.loadingText}>Chargement des terrains...</Text>
                            </View>
                        ) : (
                            <FieldSelector
                                selectedField={formData.selectedFieldName}
                                onPress={openFieldSelector}
                            />
                        )}
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
                    {selectedField && (
                        <View style={styles.summarySection}>
                            <Text style={styles.summaryTitle}>Résumé de votre partie</Text>
                            <View style={styles.summaryCard}>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Terrain:</Text>
                                    <Text style={styles.summaryValue}>{selectedField.terrainNom}</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Date:</Text>
                                    <Text style={styles.summaryValue}>
                                        {formatDate(formData.date)} à {formatTime(formData.date)}
                                    </Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Durée:</Text>
                                    <Text style={styles.summaryValue}>{formData.duration}h</Text>
                                </View>
                                <View style={styles.summaryRow}>
                                    <Text style={styles.summaryLabel}>Participants:</Text>
                                    <Text style={styles.summaryValue}>
                                        {formData.numberOfParticipants} joueurs
                                    </Text>
                                </View>
                                {selectedField && (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Prix du terrain:</Text>
                                        <Text style={styles.summaryValue}>
                                            {selectedField.terrainPrixParHeure} XOF/heure
                                        </Text>
                                    </View>
                                )}
                                {formData.description && (
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Message:</Text>
                                        <Text style={styles.summaryValue} numberOfLines={2}>
                                            {formData.description}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    )}

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
                    }}
                />
            )}

            {/* Alerte personnalisée */}
            <CustomAlert
                visible={!!alertConfig}
                title={alertConfig?.title || ''}
                message={alertConfig?.message || ''}
                type={alertConfig?.type}
                confirmText={alertConfig?.confirmText}
                cancelText={alertConfig?.cancelText}
                showCancel={alertConfig?.showCancel}
                autoClose={alertConfig?.autoClose}
                autoCloseDelay={alertConfig?.autoCloseDelay}
                onConfirm={alertConfig?.onConfirm}
                onCancel={alertConfig?.onCancel || (() => { })}
            />
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
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    loadingText: {
        marginLeft: 8,
        fontSize: 14,
        color: '#666',
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
    validationSection: {
        backgroundColor: '#fff3cd',
        borderColor: '#ffeaa7',
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
    },
    validationTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#856404',
        marginBottom: 8,
    },
    validationError: {
        fontSize: 13,
        color: '#856404',
        marginBottom: 4,
        lineHeight: 18,
    },
});

export default CreatePartyScreen; 