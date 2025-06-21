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

        // Computed values
        filteredFields,
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

        // Data loading
        retryLoadTerrains,
    } = useCreateParty();
    console.log("🚀 ~ filteredFieldsllllllllllllll:", filteredFields)

    const openFieldSelector = () => {
        bottomSheetRef.current?.open();
    };

    const handleFieldSelection = (field: Field) => {
        setSelectedField(field);
        bottomSheetRef.current?.close();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header onCreate={handleSubmit} isSubmitting={isSubmitting} />

            {/* Affichage de l'erreur compacte */}
            {error && (
                <CompactErrorCard
                    message={error}
                    onRetry={retryLoadTerrains}
                />
            )}

            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
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
                onCancel={alertConfig?.onCancel}
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
});

export default CreatePartyScreen; 