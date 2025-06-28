import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Alert,
    Linking
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { PRIMARY_COLOR } from '../../utils/constant';
import { Terrain } from '../../services/terrainService';
import { ScreenNavigationProps, ScreenRouteProps } from '../../navigation/types';

const { width, height } = Dimensions.get('window');

const TerrainDetailsScreen: React.FC = () => {
    const navigation = useNavigation<ScreenNavigationProps>();
    const route = useRoute<ScreenRouteProps<'TerrainDetails'>>();
    const { terrain } = route.params;

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const getStatusText = (status: "confirme" | "en_attente") => {
        switch (status) {
            case "en_attente":
                return 'En attente de validation';
            case "confirme":
                return 'Validé';
            default:
                return 'Inconnu';
        }
    };

    const getStatusColor = (status: "confirme" | "en_attente") => {
        switch (status) {
            case "en_attente":
                return '#FFA500';
            case "confirme":
                return '#4CAF50';
            default:
                return '#999';
        }
    };

    const getTerrainImage = (images: string[] | null, index: number = 0) => {
        if (images && images.length > index) {
            return images[index];
        }
        return 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0';
    };

    const formatHoraires = (horaires: any) => {
        if (!horaires) return 'Horaires non définis';

        try {
            const parsed = typeof horaires === 'string' ? JSON.parse(horaires) : horaires;
            if (parsed.ouverture && parsed.fermeture) {
                return `${parsed.ouverture} - ${parsed.fermeture}`;
            }
        } catch (e) {
            console.error('Erreur parsing horaires:', e);
        }

        return 'Horaires non définis';
    };

    const handleCall = () => {
        if (terrain.terrainContact) {
            Linking.openURL(`tel:${terrain.terrainContact}`);
        } else {
            Alert.alert('Erreur', 'Numéro de contact non disponible');
        }
    };

    const handleEdit = () => {
        // TODO: Naviguer vers l'écran d'édition
        Alert.alert('Fonctionnalité', 'Édition du terrain à implémenter');
    };

    const handleDelete = () => {
        Alert.alert(
            'Supprimer le terrain',
            'Êtes-vous sûr de vouloir supprimer ce terrain ? Cette action est irréversible.',
            [
                { text: 'Annuler', style: 'cancel' },
                {
                    text: 'Supprimer',
                    style: 'destructive',
                    onPress: () => {
                        // TODO: Implémenter la suppression
                        Alert.alert('Suppression', 'Fonctionnalité de suppression à implémenter');
                    }
                }
            ]
        );
    };

    const handleReservations = () => {
        // TODO: Naviguer vers l'écran des réservations
        Alert.alert('Fonctionnalité', 'Gestion des réservations à implémenter');
    };

    const handleStatistics = () => {
        // TODO: Naviguer vers l'écran des statistiques
        Alert.alert('Fonctionnalité', 'Statistiques du terrain à implémenter');
    };

    const handlePreviousImage = () => {
        if (terrain.terrainImages && terrain.terrainImages.length > 1) {
            const newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : terrain.terrainImages.length - 1;
            setCurrentImageIndex(newIndex);
        }
    };

    const handleNextImage = () => {
        if (terrain.terrainImages && terrain.terrainImages.length > 1) {
            const newIndex = currentImageIndex < terrain.terrainImages.length - 1 ? currentImageIndex + 1 : 0;
            setCurrentImageIndex(newIndex);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Image du terrain avec navigation */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: getTerrainImage(terrain.terrainImages, currentImageIndex) }}
                        style={styles.terrainImage}
                    />

                    {/* Boutons de navigation des images */}
                    {terrain.terrainImages && terrain.terrainImages.length > 1 && (
                        <>
                            <TouchableOpacity
                                style={styles.prevButton}
                                onPress={handlePreviousImage}
                            >
                                <Ionicons name="chevron-back" size={20} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.nextButton}
                                onPress={handleNextImage}
                            >
                                <Ionicons name="chevron-forward" size={20} color="#fff" />
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Overlay avec bouton retour et statut */}
                    <View style={styles.imageOverlay}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(terrain.terrainDisponibilite) }]}>
                            <Text style={styles.statusText}>
                                {getStatusText(terrain.terrainDisponibilite)}
                            </Text>
                        </View>
                    </View>

                    {/* Indicateurs d'images si plusieurs images */}
                    {terrain.terrainImages && terrain.terrainImages.length > 1 && (
                        <View style={styles.imageIndicators}>
                            {terrain.terrainImages.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.indicator,
                                        { backgroundColor: index === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.5)' }
                                    ]}
                                />
                            ))}
                        </View>
                    )}
                </View>

                {/* Informations principales */}
                <View style={styles.mainInfo}>
                    <Text style={styles.terrainName}>{terrain.terrainNom}</Text>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location" size={20} color={PRIMARY_COLOR} />
                        <Text style={styles.locationText}>{terrain.terrainLocalisation}</Text>
                    </View>
                </View>

                {/* Actions rapides */}
                <View style={styles.actionButtons}>
                    {/* <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                        <Ionicons name="call" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Appeler</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity style={styles.actionButton} onPress={handleReservations}>
                        <FontAwesome5 name="calendar-alt" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>Réservations</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleStatistics}>
                        <Ionicons name="stats-chart" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Statistiques</Text>
                    </TouchableOpacity>
                </View>

                {/* Détails du terrain */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Informations du terrain</Text>

                    <View style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="cash-outline" size={20} color={PRIMARY_COLOR} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Prix par heure</Text>
                                <Text style={styles.detailValue}>{terrain.terrainPrixParHeure} XOF</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="time-outline" size={20} color={PRIMARY_COLOR} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Horaires d'ouverture</Text>
                                <Text style={styles.detailValue}>{formatHoraires(terrain.terrainHoraires)}</Text>
                            </View>
                        </View>

                        {terrain.terrainContact && (
                            <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="call-outline" size={20} color={PRIMARY_COLOR} />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Contact</Text>
                                    <Text style={styles.detailValue}>{terrain.terrainContact}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>

                {/* Description */}
                {terrain.terrainDescription && (
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.descriptionText}>{terrain.terrainDescription}</Text>
                        </View>
                    </View>
                )}


                {/* Actions de gestion */}
                <View style={styles.managementSection}>
                    <Text style={styles.sectionTitle}>Gestion du terrain</Text>
                    <View style={styles.managementButtons}>
                        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                            <Ionicons name="create-outline" size={20} color="#fff" />
                            <Text style={styles.editButtonText}>Modifier</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                            <Ionicons name="trash-outline" size={20} color="#fff" />
                            <Text style={styles.deleteButtonText}>Supprimer</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    imageContainer: {
        height: height * 0.4,
        position: 'relative',
    },
    terrainImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 8,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    imageIndicators: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    mainInfo: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 16,
    },
    terrainName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 100,
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 12,
    },
    detailsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    detailCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    descriptionSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    descriptionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    gallerySection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    galleryContainer: {
        flexDirection: 'row',
    },
    galleryImageContainer: {
        marginRight: 12,
    },
    galleryImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
    },
    managementSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    managementButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    editButton: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    editButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
    deleteButton: {
        flex: 1,
        backgroundColor: '#dc3545',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
    },
    prevButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        left: 10,
    },
    nextButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -20 }],
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        right: 10,
    },
});

export default TerrainDetailsScreen; 