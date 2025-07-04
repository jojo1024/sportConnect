import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const EditProfileScreen: React.FC = () => {
    const [name, setName] = useState('Junior N');
    const [email, setEmail] = useState('junior@capo.ci');
    const [city, setCity] = useState('Cocody');
    const [birthday, setBirthday] = useState('14 Novembre 199X');
    const [gender, setGender] = useState('Homme');

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.avatarContainer}>
                <View style={styles.avatar} />
                <Text style={styles.name}>{name}</Text>
            </View>
            <View style={styles.card}>
                <View style={styles.row}>
                    <MaterialIcons name="person" size={20} color={COLORS.gray[500]} />
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Nom"
                    />
                </View>
                <View style={styles.row}>
                    <MaterialIcons name="email" size={20} color={COLORS.gray[500]} />
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                    />
                </View>
                <View style={styles.row}>
                    <MaterialCommunityIcons name="city" size={20} color={COLORS.gray[500]} />
                    <TextInput
                        style={styles.input}
                        value={city}
                        onChangeText={setCity}
                        placeholder="Commune"
                    />
                </View>
                <View style={styles.row}>
                    <FontAwesome5 name="birthday-cake" size={18} color={COLORS.gray[500]} />
                    <TextInput
                        style={styles.input}
                        value={birthday}
                        onChangeText={setBirthday}
                        placeholder="Anniversaire"
                    />
                </View>
                <View style={styles.row}>
                    <MaterialIcons name="male" size={20} color={COLORS.gray[500]} />
                    <TextInput
                        style={styles.input}
                        value={gender}
                        onChangeText={setGender}
                        placeholder="Genre"
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.logoutButton}>
                <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: COLORS.backgroundWhite, alignItems: 'center', padding: 24 },
    avatarContainer: { alignItems: 'center', marginBottom: 16 },
    avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: COLORS.primary, marginBottom: 8 },
    name: { fontSize: 20, fontWeight: 'bold', color: COLORS.veryDarkGray },
    card: { width: '100%', backgroundColor: COLORS.backgroundWhite, borderRadius: 12, padding: 16, elevation: 2, marginBottom: 32 },
    row: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.gray[200], marginBottom: 12, paddingBottom: 6 },
    input: { flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.veryDarkGray },
    logoutButton: { marginTop: 24, alignSelf: 'center' },
    logoutText: { color:COLORS.primary, fontWeight: 'bold', fontSize: 16 },
});

export default EditProfileScreen; 