import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface LocationResult {
    display_name: string;
    lat: string;
    lon: string;
}

interface LocationSearchProps {
    onLocationSelect: (location: LocationResult) => void;
    initialValue?: string;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ onLocationSelect, initialValue = '' }) => {
    const [searchQuery, setSearchQuery] = useState(initialValue);
    const [searchResults, setSearchResults] = useState<LocationResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchLocation = async (query: string) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsSearching(true);
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=fr&limit=5`
            );
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            Alert.alert('Erreur', 'Impossible de rechercher la localisation');
        } finally {
            setIsSearching(false);
        }
    };

    const handleLocationSelect = (location: LocationResult) => {
        setSearchQuery(location.display_name);
        setSearchResults([]);
        onLocationSelect(location);
    };

    return (
        <View style={styles.locationContainer}>
            <TextInput
                style={styles.input}
                value={searchQuery}
                onChangeText={(text) => {
                    setSearchQuery(text);
                    searchLocation(text);
                }}
                placeholder="Rechercher une adresse"
            />
            {isSearching && (
                <ActivityIndicator style={styles.searchIndicator} color="#007AFF" />
            )}
            {searchResults.length > 0 && (
                <View style={styles.searchResults}>
                    {searchResults.map((result, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.searchResultItem}
                            onPress={() => handleLocationSelect(result)}
                        >
                            <Ionicons name="location" size={16} color="#666" />
                            <Text style={styles.searchResultText}>
                                {result.display_name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const AddTerrainScreen: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        pricePerHour: '',
        startTime: new Date(),
        endTime: new Date(),
    });
    const [image, setImage] = useState<string | null>(null);
    const [showStartTimePicker, setShowStartTimePicker] = useState(false);
    const [showEndTimePicker, setShowEndTimePicker] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom du terrain est requis';
        }
        if (!formData.location.trim()) {
            newErrors.location = 'La localisation est requise';
        }
        if (!formData.pricePerHour.trim()) {
            newErrors.pricePerHour = 'Le prix par heure est requis';
        } else if (isNaN(Number(formData.pricePerHour))) {
            newErrors.pricePerHour = 'Le prix doit être un nombre valide';
        }
        if (!image) {
            newErrors.image = 'Une photo de couverture est requise';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLocationSelect = (location: LocationResult) => {
        setFormData({ ...formData, location: location.display_name });
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [16, 9],
                quality: 1,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setImage(result.assets[0].uri);
                setErrors(prev => ({ ...prev, image: '' }));
            }
        } catch (error) {
            console.error('Erreur lors de la sélection de l\'image:', error);
            Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
        }
    };

    const handleSubmit = () => {
        if (validateForm()) {
            // TODO: Implémenter la logique de soumission
            console.log('Form data:', formData);
        }
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.header}>
                <Text style={styles.title}>Ajouter un Terrain</Text>
                <TouchableOpacity
                    style={[styles.submitButton, Object.keys(errors).length > 0 && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={Object.keys(errors).length > 0}
                >
                    <Text style={styles.submitButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nom du terrain</Text>
                        <TextInput
                            style={[styles.input, errors.name && styles.inputError]}
                            value={formData.name}
                            onChangeText={(text) => {
                                setFormData({ ...formData, name: text });
                                setErrors(prev => ({ ...prev, name: '' }));
                            }}
                            placeholder="Ex: Terrain de Foot Central"
                        />
                        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Localisation</Text>
                        <LocationSearch onLocationSelect={handleLocationSelect} initialValue={formData.location} />
                        {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Prix par heure (€)</Text>
                        <TextInput
                            style={[styles.input, errors.pricePerHour && styles.inputError]}
                            value={formData.pricePerHour}
                            onChangeText={(text) => {
                                setFormData({ ...formData, pricePerHour: text });
                                setErrors(prev => ({ ...prev, pricePerHour: '' }));
                            }}
                            keyboardType="numeric"
                            placeholder="Ex: 80"
                        />
                        {errors.pricePerHour && <Text style={styles.errorText}>{errors.pricePerHour}</Text>}
                    </View>

                    <View style={styles.timeContainer}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.label}>Heure d'ouverture</Text>
                            <TouchableOpacity
                                style={styles.timeInput}
                                onPress={() => setShowStartTimePicker(true)}
                            >
                                <Text>{formatTime(formData.startTime)}</Text>
                            </TouchableOpacity>
                            {showStartTimePicker && (
                                <DateTimePicker
                                    value={formData.startTime}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowStartTimePicker(false);
                                        if (selectedDate) {
                                            setFormData({ ...formData, startTime: selectedDate });
                                        }
                                    }}
                                />
                            )}
                        </View>
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.label}>Heure de fermeture</Text>
                            <TouchableOpacity
                                style={styles.timeInput}
                                onPress={() => setShowEndTimePicker(true)}
                            >
                                <Text>{formatTime(formData.endTime)}</Text>
                            </TouchableOpacity>
                            {showEndTimePicker && (
                                <DateTimePicker
                                    value={formData.endTime}
                                    mode="time"
                                    is24Hour={true}
                                    display="default"
                                    onChange={(event, selectedDate) => {
                                        setShowEndTimePicker(false);
                                        if (selectedDate) {
                                            setFormData({ ...formData, endTime: selectedDate });
                                        }
                                    }}
                                />
                            )}
                        </View>
                    </View>

                    <View style={styles.imageSection}>
                        <Text style={styles.coverLabel}>Photo de couverture</Text>
                        <TouchableOpacity
                            style={[styles.coverUploadContainer, errors.image && styles.inputError]}
                            onPress={pickImage}
                            activeOpacity={0.8}
                        >
                            <View style={styles.coverUploadContent}>
                                <View style={styles.roundButton}>
                                    <Ionicons name="camera" size={32} color="#fff" />
                                </View>
                                <Text style={styles.coverUploadText}>Sélectionner une photo</Text>
                            </View>
                            {image && (
                                <Image source={{ uri: image }} style={styles.coverImagePreview} />
                            )}
                        </TouchableOpacity>
                        {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },
    scrollView: {
        flex: 1,
    },
    formContainer: {
        padding: 20,
    },
    inputGroup: {
        marginBottom: 24,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: '#2c3e50',
        marginBottom: 10,
        letterSpacing: 0.3,
    },
    input: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        fontSize: 16,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    inputError: {
        borderColor: '#dc3545',
        borderWidth: 2,
    },
    errorText: {
        color: '#dc3545',
        fontSize: 12,
        marginTop: 6,
        fontWeight: '500',
    },
    timeInput: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    timeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    imageSection: {
        marginTop: 10,
    },
    coverLabel: {
        color: '#2c3e50',
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 10,
        letterSpacing: 0.3,
    },
    coverUploadContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e9ecef',
        borderStyle: 'dashed',
        height: 180,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        overflow: 'hidden',
        position: 'relative',
    },
    coverUploadContent: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    roundButton: {
        backgroundColor: '#FF6600',
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#FF6600',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    coverUploadText: {
        color: '#6c757d',
        fontSize: 15,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    coverImagePreview: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        borderRadius: 16,
        zIndex: 1,
    },
    submitButton: {
        backgroundColor: '#FF6600',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
        shadowColor: '#FF6600',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },
    submitButtonDisabled: {
        backgroundColor: '#ccc',
        shadowOpacity: 0,
        elevation: 0,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    locationContainer: {
        position: 'relative',
    },
    searchIndicator: {
        position: 'absolute',
        right: 16,
        top: 16,
    },
    searchResults: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        zIndex: 1000,
        maxHeight: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    searchResultItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    searchResultText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#2c3e50',
        fontWeight: '500',
    },
});

export default AddTerrainScreen; 