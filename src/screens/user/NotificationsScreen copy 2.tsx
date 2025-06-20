import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../../utils/constant';
import { selectUser } from '../../store/slices/userSlice';
import { useAppSelector } from '../../store/hooks/hooks';

const notifications = [
    {
        id: '1',
        type: 'match',
        title: 'Nouvelle partie disponible',
        message: 'Une partie Urban Foot est organisée ce soir à 19h00 à Cocody II Plateaux.',
        date: "Aujourd'hui, 10:15",
    },
    {
        id: '2',
        type: 'reminder',
        title: 'Rappel de match',
        message: 'Votre partie "Foot Passion" commence dans 1 heure.',
        date: "Aujourd'hui, 15:00",
    },
    {
        id: '3',
        type: 'payment',
        title: 'Paiement reçu',
        message: 'Votre paiement pour "Le Temple du Foot" a été validé.',
        date: 'Hier, 18:30',
    },
    {
        id: '4',
        type: 'validation',
        title: 'Réservation validée',
        message: 'Votre réservation du terrain "Sport Park" a été acceptée par le gérant.',
        date: 'Hier, 09:20',
    },
    {
        id: '5',
        type: 'cancel',
        title: 'Annulation automatique',
        message: 'La partie "Night Football" a été annulée (nombre de joueurs insuffisant).',
        date: '05/06/2025, 22:00',
    },
    {
        id: '6',
        type: 'credit',
        title: 'Crédit remboursé',
        message: 'Vous avez été remboursé en crédits suite à l\'annulation de la partie.',
        date: '05/06/2025, 22:05',
    },
    {
        id: '7',
        type: 'info',
        title: 'Nouveau terrain disponible',
        message: 'Le terrain "Stade du Plateau" est maintenant disponible à la réservation.',
        date: '04/06/2025, 17:00',
    },
];

function getIcon(type: string) {
    switch (type) {
        case 'match':
            return <FontAwesome5 name="futbol" size={24} color="#007b83" />;
        case 'reminder':
            return <Ionicons name="alarm-outline" size={24} color="#f5a623" />;
        case 'payment':
            return <MaterialIcons name="payment" size={24} color="#4caf50" />;
        case 'validation':
            return <MaterialIcons name="check-circle" size={24} color="#007b83" />;
        case 'cancel':
            return <MaterialIcons name="cancel" size={24} color="#e74c3c" />;
        case 'credit':
            return <FontAwesome5 name="coins" size={22} color="#f5a623" />;
        case 'info':
            return <Ionicons name="information-circle-outline" size={24} color="#007b83" />;
        default:
            return <Ionicons name="notifications-outline" size={24} color="#888" />;
    }
}

type NotificationType = 'match' | 'reminder' | 'payment' | 'validation' | 'cancel' | 'credit' | 'info';

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    title: TextStyle;
    filterButton: ViewStyle;
    listContent: ViewStyle;
    notificationItem: ViewStyle;
    iconContainer: ViewStyle;
    notificationContent: ViewStyle;
    notificationHeader: ViewStyle;
    notificationTitle: TextStyle;
    notificationMessage: TextStyle;
    notificationDate: TextStyle;
    separator: ViewStyle;
    matchIcon: ViewStyle;
    reminderIcon: ViewStyle;
    paymentIcon: ViewStyle;
    validationIcon: ViewStyle;
    cancelIcon: ViewStyle;
    creditIcon: ViewStyle;
    infoIcon: ViewStyle;
}

const NotificationsScreen: React.FC = () => {

    const utilisateur = useAppSelector(selectUser);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={24} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.notificationItem}>
                        <View style={[styles.iconContainer, styles[`${item.type}Icon` as keyof typeof styles]]}>
                            {getIcon(item.type)}
                        </View>
                        <View style={styles.notificationContent}>
                            <View style={styles.notificationHeader}>
                                <Text style={styles.notificationTitle}>{item.title}</Text>
                                <Text style={styles.notificationDate}>{item.date}</Text>
                            </View>
                            <Text style={styles.notificationMessage}>{item.message}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
            <View style={{ height: 50 }}></View>
        </View>
    );
};

const styles = StyleSheet.create<Styles>({
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
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    filterButton: {
        padding: 8,
    },
    listContent: {
        padding: 16,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    matchIcon: {
        backgroundColor: 'rgba(0, 123, 131, 0.1)',
    },
    reminderIcon: {
        backgroundColor: 'rgba(245, 166, 35, 0.1)',
    },
    paymentIcon: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    validationIcon: {
        backgroundColor: 'rgba(0, 123, 131, 0.1)',
    },
    cancelIcon: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
    },
    creditIcon: {
        backgroundColor: 'rgba(245, 166, 35, 0.1)',
    },
    infoIcon: {
        backgroundColor: 'rgba(0, 123, 131, 0.1)',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    notificationDate: {
        fontSize: 12,
        color: '#888',
        marginLeft: 8,
    },
    separator: {
        height: 8,
    },
});

export default NotificationsScreen; 