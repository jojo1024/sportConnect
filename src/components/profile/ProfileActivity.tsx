import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Activity {
    id: number;
    label: string;
    date: string;
    points: number;
}

interface ProfileActivityProps {
    activities: Activity[];
}

const ProfileActivity: React.FC<ProfileActivityProps> = ({ activities }) => (
    <View style={styles.container}>
        <Text style={styles.title}>Activité</Text>
        <FlatList
            data={activities}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.item}>
                    <Image style={styles.image} source={{ uri: 'https://via.placeholder.com/40' }} />
                    <View style={styles.info}>
                        <Text style={styles.label}>{item.label}</Text>
                        <View style={styles.row}>
                            <MaterialCommunityIcons name="star-circle" size={16} color="#FF6600" />
                            <Text style={styles.points}>+{item.points}</Text>
                            <Text style={styles.date}>{item.date}</Text>
                        </View>
                    </View>
                </View>
            )}
        />
    </View>
);

const styles = StyleSheet.create({
    container: { marginTop: 24, paddingHorizontal: 16 },
    title: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#222' },
    item: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
    image: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#EEE' },
    info: { flex: 1 },
    label: { fontSize: 15, color: '#222', marginBottom: 4 },
    row: { flexDirection: 'row', alignItems: 'center' },
    points: { color: '#FF6600', fontWeight: 'bold', marginLeft: 4, marginRight: 10 },
    date: { color: '#888', fontSize: 13 },
});

export default ProfileActivity; 