import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, TextInput, ActivityIndicator } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../../utils/constant';

const initialLayout = { width: Dimensions.get('window').width };

const reservationsData = [
    {
        id: '1',
        terrain: 'Urban Foot',
        date: '2024-05-16',
        time: '16:00-17:30',
        joueurs: '7 vs 7',
        joueursCount: '1/15 joueurs',
        capo: 'Cyriac Guédé',
        status: 'En attente',
    },
    {
        id: '2',
        terrain: 'Le Temple du Foot Vallons',
        date: '2024-05-16',
        time: '20:00-21:30',
        joueurs: '5 vs 5',
        joueursCount: '1/12 joueurs',
        capo: 'Cheick Touré',
        status: 'En attente',
    },
    {
        id: '3',
        terrain: 'Terrain de Basket',
        date: '2024-03-21',
        time: '16:00-17:30',
        joueurs: '3 vs 3',
        joueursCount: '2/6 joueurs',
        capo: 'Jean Dupont',
        status: 'Confirmée',
    },
    {
        id: '4',
        terrain: 'Stade Annexe',
        date: '2024-03-22',
        time: '18:00-19:00',
        joueurs: '6 vs 6',
        joueursCount: '4/12 joueurs',
        capo: 'Marie Dubois',
        status: 'Annulée',
    },
    // Données supplémentaires
    {
        id: '5',
        terrain: 'Urban Foot',
        date: '2024-05-18',
        time: '10:00-11:30',
        joueurs: '8 vs 8',
        joueursCount: '10/16 joueurs',
        capo: 'Ali Benali',
        status: 'En attente',
    },
    {
        id: '6',
        terrain: 'Le Temple du Foot Vallons',
        date: '2024-05-19',
        time: '19:00-20:30',
        joueurs: '5 vs 5',
        joueursCount: '8/12 joueurs',
        capo: 'Sophie Martin',
        status: 'Confirmée',
    },
    {
        id: '7',
        terrain: 'Stade Annexe',
        date: '2024-05-20',
        time: '21:00-22:00',
        joueurs: '6 vs 6',
        joueursCount: '12/12 joueurs',
        capo: 'Lucas Bernard',
        status: 'Annulée',
    },
    {
        id: '8',
        terrain: 'Urban Foot',
        date: '2024-05-21',
        time: '15:00-16:30',
        joueurs: '7 vs 7',
        joueursCount: '14/15 joueurs',
        capo: 'Fatou Ndiaye',
        status: 'Confirmée',
    },
    {
        id: '9',
        terrain: 'Le Temple du Foot Vallons',
        date: '2024-05-22',
        time: '18:00-19:30',
        joueurs: '5 vs 5',
        joueursCount: '5/12 joueurs',
        capo: 'Omar Sy',
        status: 'En attente',
    },
    {
        id: '10',
        terrain: 'Terrain de Basket',
        date: '2024-05-23',
        time: '17:00-18:30',
        joueurs: '3 vs 3',
        joueursCount: '6/6 joueurs',
        capo: 'Julie Petit',
        status: 'Confirmée',
    },
    {
        id: '11',
        terrain: 'Stade Annexe',
        date: '2024-05-24',
        time: '20:00-21:00',
        joueurs: '6 vs 6',
        joueursCount: '2/12 joueurs',
        capo: 'Karim Benzema',
        status: 'En attente',
    },
    {
        id: '12',
        terrain: 'Urban Foot',
        date: '2024-05-25',
        time: '13:00-14:30',
        joueurs: '7 vs 7',
        joueursCount: '7/15 joueurs',
        capo: 'Moussa Sow',
        status: 'Annulée',
    },
    {
        id: '13',
        terrain: 'Le Temple du Foot Vallons',
        date: '2024-05-26',
        time: '16:00-17:30',
        joueurs: '5 vs 5',
        joueursCount: '12/12 joueurs',
        capo: 'Nina Ricci',
        status: 'Confirmée',
    },
    {
        id: '14',
        terrain: 'Terrain de Basket',
        date: '2024-05-27',
        time: '18:00-19:30',
        joueurs: '3 vs 3',
        joueursCount: '3/6 joueurs',
        capo: 'Paul Pogba',
        status: 'En attente',
    },
    {
        id: '15',
        terrain: 'Stade Annexe',
        date: '2024-05-28',
        time: '19:00-20:00',
        joueurs: '6 vs 6',
        joueursCount: '11/12 joueurs',
        capo: 'Zinedine Zidane',
        status: 'Confirmée',
    },
    {
        id: '16',
        terrain: 'Urban Foot',
        date: '2024-05-29',
        time: '17:00-18:30',
        joueurs: '7 vs 7',
        joueursCount: '15/15 joueurs',
        capo: 'Kylian Mbappé',
        status: 'Annulée',
    },
    {
        id: '17',
        terrain: 'Le Temple du Foot Vallons',
        date: '2024-05-30',
        time: '20:00-21:30',
        joueurs: '5 vs 5',
        joueursCount: '10/12 joueurs',
        capo: 'Antoine Griezmann',
        status: 'En attente',
    },
    {
        id: '18',
        terrain: 'Terrain de Basket',
        date: '2024-05-31',
        time: '16:00-17:30',
        joueurs: '3 vs 3',
        joueursCount: '4/6 joueurs',
        capo: 'Eden Hazard',
        status: 'Confirmée',
    },
    {
        id: '19',
        terrain: 'Stade Annexe',
        date: '2024-06-01',
        time: '18:00-19:00',
        joueurs: '6 vs 6',
        joueursCount: '6/12 joueurs',
        capo: 'Cristiano Ronaldo',
        status: 'Annulée',
    },
    {
        id: '20',
        terrain: 'Urban Foot',
        date: '2024-06-02',
        time: '14:00-15:30',
        joueurs: '7 vs 7',
        joueursCount: '13/15 joueurs',
        capo: 'Lionel Messi',
        status: 'Confirmée',
    },
];

const ReservationCard = ({ item, onConfirm, onCancel }: any) => (
    <View style={styles.reservationCard}>
        <Text style={styles.terrainName}>{item.terrain}</Text>
        <View style={styles.detailsRow}>
            <Text style={styles.dateText}>{item.date.split('-').reverse().join('/')}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
        </View>
        <View style={styles.detailsRow}>
            <Text style={styles.joueursText}>{item.joueurs} · {item.joueursCount}</Text>
        </View>
        <Text style={styles.capoText}>Capo : {item.capo}</Text>
        <View style={styles.actionsContainer}>
            <Text style={[styles.status,
            item.status === 'Confirmée' ? { color: '#4CAF50' } :
                item.status === 'Annulée' ? { color: '#F44336' } : { color: '#FFA000' }
            ]}>
                {item.status}
            </Text>
            {item.status === 'En attente' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={[styles.actionButton, styles.acceptButton]} onPress={() => onConfirm(item.id)}>
                        <Text style={styles.actionButtonText}>Confirmer</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.rejectButton]} onPress={() => onCancel(item.id)}>
                        <Text style={styles.actionButtonText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    </View>
);

const ReservationsScreen: React.FC = () => {
    const [index, setIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [isLoading, setIsLoading] = useState(false);
    const [routes] = useState([
        { key: 'pending', title: 'En attente' },
        { key: 'confirmed', title: 'Confirmé' },
        { key: 'cancelled', title: 'Annulé' },
    ]);
    const [reservations, setReservations] = useState(reservationsData);

    const handleConfirm = (id: string) => {
        // setIsLoading(true);
        setReservations(reservations.map(r => r.id === id ? { ...r, status: 'Confirmée' } : r));
        // setIsLoading(false);
        // setTimeout(() => {
        // }, 500);
    };

    const handleCancel = (id: string) => {
        // setIsLoading(true);
        setReservations(reservations.map(r => r.id === id ? { ...r, status: 'Annulée' } : r));
        // setIsLoading(false);
        // setTimeout(() => {
        // }, 500);
    };

    const filteredAndSortedReservations = useCallback((status: string) => {
        return reservations
            .filter(r => r.status === status)
            .filter(r =>
                r.terrain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.capo.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .sort((a, b) => {
                if (sortBy === 'date') {
                    return new Date(a.date).getTime() - new Date(b.date).getTime();
                }
                return 0;
            });
    }, [reservations, searchQuery, sortBy]);

    const renderScene = SceneMap({
        pending: () => (
            <View style={styles.tabContent}>
                {/* <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher par terrain ou capo..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                <View style={styles.sortContainer}>
                    <TouchableOpacity
                        style={[styles.sortButton, sortBy === 'date' && styles.sortButtonActive]}
                        onPress={() => setSortBy('date')}
                    >
                        <Text style={[styles.sortButtonText, sortBy === 'date' && styles.sortButtonTextActive]}>
                            Par date
                        </Text>
                    </TouchableOpacity>
                </View> */}
                {isLoading ? (
                    <ActivityIndicator size="large" color="#FF5A1F" style={styles.loader} />
                ) : (
                    <FlatList
                        data={filteredAndSortedReservations('En attente')}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                            <ReservationCard item={item} onConfirm={handleConfirm} onCancel={handleCancel} />
                        )}
                        ListEmptyComponent={<Text style={styles.emptyText}>Aucune réservation en attente.</Text>}
                    />
                )}
            </View>
        ),
        confirmed: () => (
            <View style={styles.tabContent}>
                {/* <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher par terrain ou capo..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View> */}
                <FlatList
                    data={filteredAndSortedReservations('Confirmée')}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ReservationCard item={item} />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Aucune réservation confirmée.</Text>}
                />
            </View>
        ),
        cancelled: () => (
            <View style={styles.tabContent}>
                {/* <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher par terrain ou capo..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View> */}
                <FlatList
                    data={filteredAndSortedReservations('Annulée')}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <ReservationCard item={item} />
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>Aucune réservation annulée.</Text>}
                />
            </View>
        ),
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Réservations</Text>
            </View>


            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={props => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: PRIMARY_COLOR }}
                        style={{ backgroundColor: '#E9ECEF', borderRadius: 8, marginHorizontal: 16, marginBottom: 8 }}
                        activeColor="#222"
                        inactiveColor="#888"
                    />
                )}
            />

            <View style={{ height: 70 }}></View>
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
        marginBottom: 15,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    tabContent: {
        flex: 1,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 14,
    },
    sortContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    sortButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
    },
    sortButtonActive: {
        backgroundColor: '#FF5A1F',
    },
    sortButtonText: {
        fontSize: 12,
        color: '#666',
    },
    sortButtonTextActive: {
        color: '#fff',
    },
    loader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reservationCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    terrainName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#222',
    },
    detailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    dateText: {
        fontSize: 14,
        color: '#888',
    },
    timeText: {
        fontSize: 14,
        color: '#FF5A1F',
        fontWeight: 'bold',
    },
    joueursText: {
        fontSize: 13,
        color: '#666',
    },
    capoText: {
        fontSize: 13,
        color: '#888',
        marginBottom: 8,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    status: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },
    acceptButton: {
        backgroundColor: '#4CAF50',
    },
    rejectButton: {
        backgroundColor: '#F44336',
    },
    actionButtonText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#888',
        marginTop: 32,
        fontSize: 16,
    },
});

export default ReservationsScreen; 