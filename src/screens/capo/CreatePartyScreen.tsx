import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { PRIMARY_COLOR, WINDOW_HEIGHT } from '../../utils/constant';

// Données de test pour les terrains
const MOCK_FIELDS = [
    {
        id: '1',
        name: 'Stade Municipal',
        location: '123 Rue du Sport, Paris',
        schedule: '8h-22h',
        pricePerHour: 20000,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    },
    {
        id: '2',
        name: 'Complexe Sportif Central',
        location: '45 Avenue des Sports, Lyon',
        schedule: '7h-23h',
        pricePerHour: 15000,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    },
    {
        id: '3',
        name: 'Terrain de Quartier',
        location: '78 Boulevard des Athlètes, Marseille',
        schedule: '9h-21h',
        pricePerHour: 18000,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    },
];

const CreatePartyScreen: React.FC = () => {
    const bottomSheetRef = useRef<RBSheet>(null);
    const [selectedField, setSelectedField] = useState<string>('');
    const [selectedFieldId, setSelectedFieldId] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [date, setDate] = useState<Date>(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [duration, setDuration] = useState<number>(1);
    const [gameFormat, setGameFormat] = useState<string>('5v5');
    const [description, setDescription] = useState<string>('');
    const [showTimePicker, setShowTimePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredFields = MOCK_FIELDS.filter(field =>
        field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFieldSelection = (field: typeof MOCK_FIELDS[0]) => {
        setSelectedField(field.name);
        setSelectedFieldId(field.id);
        bottomSheetRef.current?.close();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
           <View style={styles.header}>
                <Text style={styles.title}>Créer une partie</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    // onPress={() => navigation.navigate('AddTerrain')}
                >
                    <Ionicons name="save" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.addButtonText}>Créer</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container}>
                <View style={styles.formContainer}>
                    {/* Sélection du terrain */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="location" size={24} color="#ff6600" />
                            <Text style={styles.cardTitle}>Terrain</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.fieldSelector}
                            onPress={() => bottomSheetRef.current?.open()}
                        >
                            <Text style={styles.fieldSelectorText}>
                                {selectedField || 'Sélectionner un terrain'}
                            </Text>
                            <Ionicons name="chevron-down" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Date et heure */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="calendar" size={24} color="#ff6600" />
                            <Text style={styles.cardTitle}>Date et heure</Text>
                        </View>
                        <View style={styles.dateTimeContainer}>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Ionicons name="calendar-outline" size={20} color="#ff6600" />
                                <Text style={styles.dateTimeText}>
                                    {formatDate(date)}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.dateTimeButton}
                                onPress={() => setShowTimePicker(true)}
                            >
                                <Ionicons name="time-outline" size={20} color="#ff6600" />
                                <Text style={styles.dateTimeText}>
                                    {formatTime(date)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Durée */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="hourglass" size={24} color="#ff6600" />
                            <Text style={styles.cardTitle}>Durée</Text>
                        </View>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.durationScrollView}
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 24, 72].map((hours) => (
                                <TouchableOpacity
                                    key={hours}
                                    style={[
                                        styles.durationButton,
                                        duration === hours && styles.durationButtonSelected,
                                    ]}
                                    onPress={() => setDuration(hours)}
                                >
                                    <Text
                                        style={[
                                            styles.durationButtonText,
                                            duration === hours && styles.durationButtonTextSelected,
                                        ]}
                                    >
                                        {hours}h
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Format de jeu */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="people" size={24} color="#ff6600" />
                            <Text style={styles.cardTitle}>Format de jeu</Text>
                        </View>
                        <View style={styles.formatContainer}>
                            {['2v2', '3v3', '4v4', '5v5', '7v7'].map((format) => (
                                <TouchableOpacity
                                    key={format}
                                    style={[
                                        styles.formatButton,
                                        gameFormat === format && styles.formatButtonSelected,
                                    ]}
                                    onPress={() => setGameFormat(format)}
                                >
                                    <Text
                                        style={[
                                            styles.formatButtonText,
                                            gameFormat === format && styles.formatButtonTextSelected,
                                        ]}
                                    >
                                        {format}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Description */}
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Ionicons name="chatbubble" size={24} color="#ff6600" />
                            <Text style={styles.cardTitle}>Message aux participants</Text>
                        </View>
                        <TextInput
                            style={styles.descriptionInput}
                            multiline
                            numberOfLines={4}
                            placeholder="Ajoutez un message pour les participants..."
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                </View>
                <View style={{height: 60}}></View>
            </ScrollView>

            {/* Bottom Sheet pour la sélection du terrain */}
            <RBSheet
                ref={bottomSheetRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={WINDOW_HEIGHT - 200}
                customStyles={{
                    wrapper: {
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                    draggableIcon: {
                        backgroundColor: '#000',
                    },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    },
                }}
            >
                <View style={styles.bottomSheetContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher un terrain..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    <ScrollView style={styles.fieldsList}>
                        {filteredFields.map((field) => (
                            <TouchableOpacity
                                key={field.id}
                                style={[
                                    styles.fieldCard,
                                    selectedFieldId === field.id && styles.fieldCardSelected,
                                ]}
                                onPress={() => handleFieldSelection(field)}
                            >
                                <Image
                                    source={{ uri: field.image }}
                                    style={styles.fieldImage}
                                />
                                <View style={styles.fieldInfo}>
                                    <View style={styles.fieldHeader}>
                                        <Text style={styles.fieldName}>{field.name}</Text>
                                        {selectedFieldId === field.id && (
                                            <View style={styles.selectedIndicator}>
                                                <Text style={styles.selectedIndicatorText}>✓</Text>
                                            </View>
                                        )}
                                    </View>
                                    <Text style={styles.fieldLocation}>{field.location}</Text>
                                    <View style={styles.fieldDetails}>
                                        <Text style={styles.fieldSchedule}>
                                            Horaires: {field.schedule}
                                        </Text>
                                        <Text style={styles.fieldPrice}>
                                            {field.pricePerHour} XOF/heure
                                        </Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </RBSheet>

            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    value={date}
                    mode="time"
                    display="default"
                    onChange={handleDateChange}
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    container: {
        flex: 1,
    },
    formContainer: {
        padding: 16,
        gap: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 8,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    fieldSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    fieldSelectorText: {
        fontSize: 16,
        color: '#495057',
    },
    dateTimeContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    dateTimeButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    dateTimeText: {
        fontSize: 16,
        color: '#495057',
    },
    durationScrollView: {
        flexDirection: 'row',
        paddingVertical: 8,
    },
    durationButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        marginRight: 8,
    },
    durationButtonSelected: {
        backgroundColor: '#ff6600',
        borderColor: '#ff6600',
    },
    durationButtonText: {
        fontSize: 14,
        color: '#495057',
    },
    durationButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    formatContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    formatButton: {
        flex: 1,
        minWidth: '30%',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
        borderWidth: 1,
        borderColor: '#e9ecef',
        alignItems: 'center',
    },
    formatButtonSelected: {
        backgroundColor: '#ff6600',
        borderColor: '#ff6600',
    },
    formatButtonText: {
        fontSize: 16,
        color: '#495057',
        fontWeight: '500',
    },
    formatButtonTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    descriptionInput: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        height: 120,
        textAlignVertical: 'top',
        fontSize: 16,
        color: '#495057',
    },
    createButton: {
        marginTop: 16,
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        padding: 16,
        alignItems: 'center',
    },
    createButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomSheetContainer: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    },
    fieldsList: {
        flex: 1,
    },
    fieldCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    fieldCardSelected: {
        borderColor: '#ff6600',
    },
    fieldImage: {
        width: 100,
        height: 100,
    },
    fieldInfo: {
        flex: 1,
        padding: 12,
    },
    fieldName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    fieldLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    fieldDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fieldSchedule: {
        fontSize: 12,
        color: '#666',
    },
    fieldPrice: {
        fontSize: 12,
        color: PRIMARY_COLOR,
        fontWeight: '600',
    },
    fieldHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    selectedIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ff6600',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIndicatorText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 40,
        // elevation: 2,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
    },
    addButtonText: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 12,
    },
});

export default CreatePartyScreen; 