import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../theme/colors';
import { getUserAvatar } from '../../utils/functions';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectUser } from '../../store/slices/userSlice';
import CustomOutlineButton from '../CustomOutlineButton';

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
            <CustomOutlineButton
                onPress={onEdit}
                title="Modifier le profil"
                iconName="edit"
                iconType="material"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: { alignItems: 'center', padding: 24, backgroundColor: '#F3F7FA' },
    avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 10, backgroundColor: '#EEE' },
    name: { fontSize: 20, fontWeight: 'bold', color: '#222' },
    city: { fontSize: 16, color: '#888', marginBottom: 10 },
    editButton: { marginTop: 8 },
});

export default ProfileHeader; 