import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { getUserAvatar } from '../../utils/functions';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectUser } from '../../store/slices/userSlice';

interface ProfileHeaderProps {
    name: string;
    city: string;
    onEdit: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, city, onEdit }) => {
    const user = useAppSelector(selectUser);

    return (
        <View style={styles.header}>
            <Image style={styles.avatar}
                source={{ uri: getUserAvatar(user?.utilisateurAvatar) }}
            />
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.city}>{city}</Text>
            <TouchableOpacity style={styles.editButton} onPress={onEdit}>
                <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                <Text style={styles.editText}>Modifier le profil</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: { alignItems: 'center', padding: 24, backgroundColor: '#F3F7FA' },
    avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10, backgroundColor: '#EEE' },
    name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
    city: { fontSize: 16, color: '#888', marginBottom: 10 },
    editButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: COLORS.primary, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, marginTop: 8, backgroundColor: '#fff' },
    editText: { color: COLORS.primary, fontWeight: 'bold', marginLeft: 6 },
});

export default ProfileHeader; 