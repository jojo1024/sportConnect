import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../../utils/constant';


const fakeMatches = [
    // Aujourd'hui (06/06/2025)
    {
        id: '1',
        date: '2025-06-06',
        hour: '18h00',
        title: 'Urban Foot',
        location: 'Cocody II Plateaux',
        fieldType: 'Terrain couvert',
        format: '5 vs 5',
        capo: 'Gaucher',
        players: 10,
        maxPlayers: 15,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    },
    {
        id: '2',
        date: '2025-06-09',
        hour: '20h00',
        title: 'Le Temple du Foot',
        location: 'Cocody II Plateaux Vallons',
        fieldType: 'Terrain couvert',
        format: '7 vs 7',
        capo: 'Charly',
        players: 8,
        maxPlayers: 14,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    },
    {
        id: '3',
        date: '2025-06-09',
        hour: '21h00',
        title: 'Foot Night',
        location: 'Marcory Zone 4',
        fieldType: 'Terrain extérieur',
        format: '6 vs 6',
        capo: 'Yao',
        players: 12,
        maxPlayers: 12,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    },
    // Demain (07/06/2025)
    {
        id: '4',
        date: '2025-06-08',
        hour: '17h00',
        title: 'Sport Park',
        location: 'Riviera Palmeraie',
        fieldType: 'Terrain extérieur',
        format: '5 vs 5',
        capo: 'Moussa',
        players: 6,
        maxPlayers: 10,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    },
    {
        id: '5',
        date: '2025-06-08',
        hour: '19h00',
        title: 'Foot Passion',
        location: 'Yopougon',
        fieldType: 'Terrain synthétique',
        format: '8 vs 8',
        capo: 'Amadou',
        players: 14,
        maxPlayers: 16,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    },
    // Futur (10/06/2025)
    {
        id: '6',
        date: '2025-06-10',
        hour: '18h30',
        title: 'Stade du Plateau',
        location: 'Plateau',
        fieldType: 'Terrain couvert',
        format: '7 vs 7',
        capo: 'Serge',
        players: 9,
        maxPlayers: 14,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    },
    {
        id: '7',
        date: '2025-06-10',
        hour: '20h00',
        title: 'Foot Family',
        location: 'Cocody Angré',
        fieldType: 'Terrain extérieur',
        format: '5 vs 5',
        capo: 'Jean',
        players: 7,
        maxPlayers: 10,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    },
    {
        id: '8',
        date: '2025-06-10',
        hour: '21h00',
        title: 'Night Football',
        location: 'Treichville',
        fieldType: 'Terrain synthétique',
        format: '6 vs 6',
        capo: 'Koffi',
        players: 10,
        maxPlayers: 12,
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500',
    },
    {
        id: '9',
        date: '2025-06-10',
        hour: '22h00',
        title: 'Afterwork Foot',
        location: 'Zone 4',
        fieldType: 'Terrain couvert',
        format: '5 vs 5',
        capo: 'Boris',
        players: 8,
        maxPlayers: 10,
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=500',
    },
];

const today = '2025-06-06';
const tomorrow = '2025-06-07';

function getSectionLabel(date: string) {
    if (date === today) return "Aujourd'hui";
    if (date === tomorrow) return 'Demain';
    // Affiche la date au format français
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
}

const TchinTchinsScreen: React.FC = () => {

    // Regrouper par date
    const grouped = fakeMatches.reduce((acc, match) => {
        if (!acc[match.date]) acc[match.date] = [];
        acc[match.date].push(match);
        return acc;
    }, {} as Record<string, typeof fakeMatches>);

    // S'assurer que "Aujourd'hui" et "Demain" sont toujours présents
    if (!grouped[today]) grouped[today] = [];
    if (!grouped[tomorrow]) grouped[tomorrow] = [];

    const dates = Object.keys(grouped).sort();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tchin-Tchins</Text>
            </View>
            <FlatList
                data={dates}
                keyExtractor={(date) => date}
                renderItem={({ item: date }) => (
                    <View style={styles.dateSection}>
                        <Text style={styles.dateTitle}>{getSectionLabel(date)}</Text>
                        <Text style={styles.dateShort}>{date.slice(5, 10).replace('-', '/')}</Text>
                        {grouped[date].length > 0 ? (
                            grouped[date].map((match) => (
                                <View key={match.id} style={styles.cardWrapper}>
                                    <View style={styles.card}>
                                        <Image source={{ uri: match.image }} style={styles.image} />
                                        <View style={styles.cardContent}>
                                            <View style={styles.cardHeader}>
                                                <Text style={styles.cardTitle}>{match.title}</Text>
                                                <View style={styles.hourBadge}>
                                                    <Text style={styles.cardHour}>{match.hour}</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.cardLocation}>{match.location}</Text>
                                            <View style={styles.cardFieldRow}>
                                                <Text style={styles.cardField}>{match.fieldType}</Text>
                                                <Text style={styles.cardFormat}>{match.format}</Text>
                                            </View>
                                            <View style={styles.cardFooter}>
                                                <Text style={styles.capo}>Capo: {match.capo}</Text>
                                                <View style={styles.playersRow}>
                                                    <Text style={styles.players}>{match.players}/{match.maxPlayers}</Text>
                                                    <MaterialCommunityIcons name="account" size={16} color="#bbb" style={{ marginLeft: 3 }} />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>Aucune partie programmée</Text>
                            </View>
                        )}
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
            <View style={{ height: 30 }}></View>
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
    dateSection: {
        marginBottom: 32,
        marginHorizontal: 10,
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3a3a3a',
    },
    dateShort: {
        fontSize: 14,
        color: '#b0b8c1',
        marginBottom: 14,
        marginLeft: 2,
    },
    cardWrapper: {
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 22,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        minHeight: 110,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 18,
        margin: 10,
    },
    cardContent: {
        flex: 1,
        paddingVertical: 10,
        paddingRight: 14,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 2,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#222',
        flex: 1,
        flexWrap: 'wrap',
    },
    hourBadge: {
        backgroundColor: '#f2f3f7',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginLeft: 8,
    },
    cardHour: {
        fontSize: 14,
        color: PRIMARY_COLOR,
        fontWeight: 'bold',
    },
    cardLocation: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
        marginTop: 2,
    },
    cardFieldRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardField: {
        fontSize: 13,
        color: '#555',
        marginRight: 16,
    },
    cardFormat: {
        fontSize: 13,
        color: '#555',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    capo: {
        fontSize: 12,
        color: PRIMARY_COLOR,
    },
    playersRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    players: {
        fontSize: 12,
        color: '#888',
    },
    emptyState: {
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginHorizontal: 5,
        marginTop: 10,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        fontStyle: 'italic',
    },
});

export default TchinTchinsScreen; 