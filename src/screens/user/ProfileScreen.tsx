import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import CreditBalance from '../../components/profile/CreditBalance';
import { useAppSelector, useAuthLogout } from '../../store/hooks/hooks';
import { selectUser } from '../../store/slices/userSlice';
import { COLORS } from '../../theme/colors';

const activities = [
    { id: 1, label: 'a joué une partie à Sportcenter Academy', date: 'Il y a 2 jours', points: 9 },
    { id: 2, label: 'a joué une partie à Sportcenter Academy', date: 'Il y a 4 jours', points: 9 },
];

const ProfileScreen: React.FC = () => {
    const { logout } = useAuthLogout();

    const utilisateur = useAppSelector(selectUser);

    const handleLogout = () => {
        logout();
    };



    return (
        <FlatList
            style={styles.bg}
            contentContainerStyle={{ paddingBottom: 32 }}
            data={activities}
            keyExtractor={item => item.id.toString()}
            ListHeaderComponent={
                <>
                    <View style={styles.headerContainer}>
                        <ProfileHeader
                            name={utilisateur?.utilisateurNom || ''}
                            city={utilisateur?.utilisateurCommune || ''}
                            onEdit={() => { }}
                        />
                    </View>
                    <View >
                        <ProfileStats games={21} fields={3} hours={26.5} />
                    </View>
                    <Text style={styles.activityTitle}>Activité</Text>
                </>
            }
            renderItem={({ item }) => (
                <View style={styles.activityItemContainer}>
                    <Image style={styles.image} source={{ uri: 'https://via.placeholder.com/40' }} />
                    <View style={styles.info}>
                        <Text style={styles.label}>{item.label}</Text>
                        <View style={styles.row}>
                            <MaterialCommunityIcons name="star-circle" size={16} color={COLORS.primary} />
                            <Text style={styles.points}>+{item.points}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    </View>
                </View>
            )}
            ListFooterComponent={<TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>}
        />
    );
};

const styles = StyleSheet.create({
    bg: { flex: 1, backgroundColor: COLORS.background },
    headerContainer: { backgroundColor: COLORS.background, paddingTop: 32, paddingBottom: 8 },
    logoutButton: {
        marginTop: 0,
        marginBottom: 0,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    logoutText: {
        color: '#222',
        fontSize: 16,
        fontWeight: 'bold',
    },
    activityTitle: {
        marginTop: 24,
        marginBottom: 12,
        marginHorizontal: 16,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#222',
    },
    activityItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 18,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    image: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#EEE' },
    info: { flex: 1 },
    label: { fontSize: 15, color: '#222', marginBottom: 4 },
    row: { flexDirection: 'row', alignItems: 'center' },
    points: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 4, marginRight: 10 },
    date: { color: '#888', fontSize: 13 },
});

export default ProfileScreen; 