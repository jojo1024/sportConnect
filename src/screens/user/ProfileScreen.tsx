import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProfileHeader from '../../components/profile/ProfileHeader';
import ProfileStats from '../../components/profile/ProfileStats';
import ProfileActivities from '../../components/profile/ProfileActivities';
import { useAppSelector, useAuthLogout } from '../../store/hooks/hooks';
import { selectUser } from '../../store/slices/userSlice';
import { COLORS } from '../../theme/colors';
import { useProfileData } from '../../hooks/useProfileData';

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    const { logout } = useAuthLogout();
    const utilisateur = useAppSelector(selectUser);
    const { statistics, recentActivities, loading, error, refreshData, hasData } = useProfileData();
    console.log("🚀 ~ hasData:", hasData)

    const handleEditProfile = () => {
        navigation.navigate('ProfileOptions' as never);
    };

    const renderContent = () => {
        // Si on a des données (même en cache), on les affiche
            return (
                <>
                    <View style={styles.headerContainer}>
                        <ProfileHeader
                            name={utilisateur?.utilisateurNom || ''}
                            city={utilisateur?.utilisateurCommune || ''}
                            onEdit={handleEditProfile}
                        />
                    </View>

                    <View>
                        <ProfileStats
                            games={statistics?.totalMatchs || 0}
                            fields={statistics?.totalTerrains || 0}
                            hours={statistics?.totalHeures || 0}
                        />
                    </View>

                    <ProfileActivities
                        activities={recentActivities || []}
                        loading={loading}
                    />
                </>
            );
        

      
    };

      // Si on a une erreur et pas de données
      if (error) {
        return (
            <View style={styles.errorContainer}>
                <MaterialCommunityIcons name="alert-circle" size={48} color={COLORS.danger} />
                <Text style={styles.errorText}>Erreur de chargement</Text>
                <Text style={styles.errorSubtext}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
                    <Text style={styles.retryText}>Réessayer</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <View style={styles.container}>

            <FlatList
                style={styles.bg}
                contentContainerStyle={{ paddingBottom: 32 }}
                data={[]}
                renderItem={() => null}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refreshData}
                        colors={[COLORS.primary]}
                        tintColor={COLORS.primary}
                    />
                }
                ListHeaderComponent={renderContent()}
                showsVerticalScrollIndicator={false}
            />
            <View style={{ marginBottom: 20 }}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    bg: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    headerContainer: {
        backgroundColor: COLORS.background,
        paddingTop: 32,
        paddingBottom: 8
    },
    logoutButton: {
        marginTop: 20,
        marginBottom: 0,
        paddingVertical: 12,
        backgroundColor: 'transparent',
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
    },
    logoutText: {
        color: COLORS.veryDarkGray,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        color: COLORS.gray[500],
        fontSize: 16,
        marginTop: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    errorText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.danger,
        marginTop: 12,
        marginBottom: 4,
    },
    errorSubtext: {
        fontSize: 14,
        color: COLORS.gray[600],
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen; 