import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { PRIMARY_COLOR } from '../../utils/constant';

const { width } = Dimensions.get('window');

interface Terrain {
    id: string;
    name: string;
    location: string;
    image: string;
    timeSlot: string;
    reservations: number;
    pricePerHour: number;
    status: string;
}

const TerrainsScreen: React.FC = () => {
    const navigation = useNavigation();
    const terrains: Terrain[] = [
        {
            id: '1',
            name: 'Terrain de Foot Central',
            location: '123 Rue du Sport, Paris',
            image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0',
            timeSlot: '09:00 - 22:00',
            reservations: 12,
            pricePerHour: 15000,
            status: 'Disponible',
        },
        {
            id: '2',
            name: 'Terrain de Basket Premium',
            location: '456 Avenue des Sports, Paris',
            image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
            timeSlot: '08:00 - 23:00',
            reservations: 8,
            pricePerHour: 25000,
            status: 'Occupé',
        },
        {
            id: '3',
            name: 'Complexe Sportif Étoile',
            location: '789 Boulevard des Champions, Paris',
            image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55',
            timeSlot: '07:00 - 00:00',
            reservations: 15,
            pricePerHour: 18000,
            status: 'Disponible',
        },
        {
            id: '4',
            name: 'Terrain de Tennis Royal',
            location: '321 Rue des Athlètes, Paris',
            image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0',
            timeSlot: '10:00 - 21:00',
            reservations: 5,
            pricePerHour: 26000,
            status: 'Disponible',
        },
    ];

    const renderTerrainCard = ({ item }: { item: Terrain }) => (
        <TouchableOpacity style={styles.terrainCard}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.image }}
                    style={styles.terrainImage}
                />
                <View style={styles.statusBadge}>
                    <Text style={[
                        styles.statusText,
                        { color: item.status === 'Disponible' ? '#fff' : '#fff' }
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </View>
            <View style={styles.terrainInfo}>
                <Text style={styles.terrainName}>{item.name}</Text>
                <View style={styles.locationContainer}>
                    <Ionicons name="location" size={16} color="#666" />
                    <Text style={styles.terrainLocation}>{item.location}</Text>
                </View>
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <Ionicons name="time-outline" size={16} color="#666" />
                            <Text style={styles.detailValue}>{item.timeSlot}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <Ionicons name="people-outline" size={16} color="#666" />
                            <Text style={styles.detailValue}>{item.reservations} réservations</Text>
                        </View>
                    </View>
                    <View style={styles.priceContainer}>
                        <Ionicons name="cash-outline" size={16} color="#666" />
                        <Text style={styles.priceText}>{item.pricePerHour} XOF/heure</Text>
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
                    // onPress={() => navigation.navigate('AddTerrain')}
                >
                    <Ionicons name="add-circle" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={terrains}
                keyExtractor={(item) => item.id}
                renderItem={renderTerrainCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
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
});

export default TerrainsScreen; 