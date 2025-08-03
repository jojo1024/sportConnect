import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { UserActivity } from '../../services/matchService';
import { formatNotificationDate } from '../../utils/functions';
import SportIcon from '../SportIcon';

interface ProfileActivitiesProps {
    activities: UserActivity[];
    loading?: boolean;
}

const ProfileActivities: React.FC<ProfileActivitiesProps> = ({ activities, loading = false }) => {



    const renderActivity = ({ item }: { item: UserActivity }) => (
        <View style={styles.activityItemContainer}>
            <View style={styles.sportIconContainer}>
                <SportIcon
                    sportIcone={item.sportIcone}
                    size={20}
                    color={COLORS.primary}
                />
            </View>
            <View style={styles.info}>
                <Text style={styles.label}>
                    Match de {item.sportNom} à {item.terrainNom}
                </Text>
                <View style={styles.row}>
                    <MaterialCommunityIcons name="star-circle" size={16} color={COLORS.primary} />
                    <Text style={styles.points}>{item.matchPrixParJoueur} FCFA</Text>
                    <Text style={styles.date}>{formatNotificationDate(item.dateParticipation)}</Text>
                </View>
                {/* <Text style={styles.description}>
                    {item.matchDescription || `Match ${item.codeMatch}`}
                </Text> */}
            </View>
        </View>
    );


    if (activities.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="calendar-blank" size={48} color={COLORS.gray[400]} />
                <Text style={styles.emptyText}>Aucune activité récente</Text>
                <Text style={styles.emptySubtext}>Participez à des matchs pour voir vos activités ici</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Activités récentes</Text>
            <FlatList
                data={activities}
                keyExtractor={(item) => item.matchId.toString()}
                renderItem={renderActivity}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.veryDarkGray,
        marginBottom: 12,
    },
    activityItemContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 12,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        // elevation: 1,
    },
    sportIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    label: {
        fontSize: 15,
        color: COLORS.veryDarkGray,
        marginBottom: 4,
        fontWeight: '500',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    points: {
        color: COLORS.primary,
        fontWeight: 'bold',
        marginLeft: 4,
        marginRight: 10,
        fontSize: 13,
    },
    date: {
        color: COLORS.gray[500],
        fontSize: 12,
    },
    description: {
        fontSize: 13,
        color: COLORS.gray[600],
        fontStyle: 'italic',
    },
    loadingContainer: {
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        color: COLORS.gray[500],
        fontSize: 14,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 12,
        marginHorizontal: 16,
        marginTop: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.gray[600],
        marginTop: 12,
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.gray[500],
        textAlign: 'center',
    },
});

export default ProfileActivities; 