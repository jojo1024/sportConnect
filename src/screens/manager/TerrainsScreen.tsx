import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR } from '../../utils/constant';
import { useTerrain } from '../../hooks/useTerrain';
import { RenderFooter, RetryComponent } from '../../components/UtilsComponent';
import { Terrain } from '../../services/terrainService';
import { name as projectName, version } from '../../../package.json';
import { ScreenNavigationProps } from '../../navigation/types';
import { BASE_URL_IMAGES } from '../../services/api';

const { width } = Dimensions.get('window');

interface TerrainCard {
    id: string;
    name: string;
    location: string;
    image: string;
    timeSlot: string;
    reservations: number;
    pricePerHour: number;
    status: string;
    terrainDisponibilite: "confirme" | "en_attente";
}

const TerrainsScreen: React.FC = () => {
    const navigation = useNavigation<ScreenNavigationProps>();

    const {
        terrains,
        isLoading,
        error,
        refreshData,
        handleEndReached,
        handleRefresh,
    } = useTerrain();

    const getStatusText = (status: "confirme" | "en_attente") => {
        switch (status) {
            case "en_attente":
                return 'En attente';
            case "confirme":
                return 'Validé';
            default:
                return 'Inconnu';
        }
    };

    const getStatusColor = (status: "confirme" | "en_attente") => {
        switch (status) {
            case "en_attente":
                return '#FFA500'; // Orange pour en attente
            case "confirme":
                return '#4CAF50'; // Vert pour validé
            default:
                return '#999';
        }
    };

    const getTerrainImage = (images: string[] | null) => {
        if (images && images.length > 0) {
            return images[0];
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

    const handleTerrainPress = (terrain: Terrain) => {
        navigation.navigate('TerrainDetails', { terrain });
    };

    const handleAddTerrain = () => {
        navigation.navigate('TerrainForm', {
            mode: 'create'
        });
    };

    // Afficher l'erreur si elle existe
    if (error) {
        return (
            <RetryComponent onRetry={refreshData} />
        );
    }

    const renderTerrainCard = ({ item }: { item: Terrain }) => (
        <TouchableOpacity
            style={styles.terrainCard}
            onPress={() => handleTerrainPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: `${BASE_URL_IMAGES}/${getTerrainImage(item.terrainImages)}` }}
                    style={styles.terrainImage}
                />
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.terrainDisponibilite) }]}>
                    <Text style={[
                        styles.statusText,
                        { color: '#fff' }
                    ]}>
                        {getStatusText(item.terrainDisponibilite)}
                    </Text>
                </View>
            </View>
            <View style={styles.terrainInfo}>
                <Text style={styles.terrainName}>{item.terrainNom}</Text>
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color="#666" />
                    <Text style={styles.terrainLocation}>{item.terrainLocalisation}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="time-outline" size={16} color="#666" />
                            <Text style={styles.detailValue}>{formatHoraires(item.terrainHoraires)}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="people-outline" size={16} color="#666" />
                            <Text style={styles.detailValue}>0 réservations</Text>
                        </View>
                    </View>
                    <View style={styles.priceContainer}>
                        <Ionicons name="cash-outline" size={16} color="#666" />
                        <Text style={styles.priceText}>{item.terrainPrixParHeure} XOF/heure</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mes terrains</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddTerrain}
                >
                    <Ionicons name="add-circle" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={terrains}
                keyExtractor={(item) => `terrain-${item.terrainId}`}
                renderItem={renderTerrainCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && terrains.length === 0}
                        onRefresh={handleRefresh}
                        colors={[PRIMARY_COLOR]}
                    />
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={RenderFooter(isLoading)}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="football" size={64} color="#ccc" />
                            <Text style={styles.emptyTitle}>Aucun terrain</Text>
                            <Text style={styles.emptyText}>Vous n'avez pas encore ajouté de terrains</Text>
                            <TouchableOpacity style={styles.emptyButton} onPress={handleAddTerrain}>
                                <Text style={styles.emptyButtonText}>Ajouter un terrain</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            />
            <View style={{ height: 50 }}></View>
        </View>
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
    addButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
    },
    addButtonText: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 12,
    },
    listContainer: {
        padding: 16,
    },
    terrainCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        position: 'relative',
    },
    terrainImage: {
        width: '100%',
        height: 200,
    },
    statusBadge: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    terrainInfo: {
        padding: 16,
    },
    terrainName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    terrainLocation: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
    },
    detailsContainer: {
        backgroundColor: '#f8f9fa',
        padding: 12,
        borderRadius: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    detailValue: {
        fontSize: 14,
        color: '#1a1a1a',
        marginLeft: 6,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e9ecef',
        padding: 8,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    priceText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginLeft: 6,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default TerrainsScreen; 