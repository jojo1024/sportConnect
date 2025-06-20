import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../../utils/constant';
import { useMatch } from '../../hooks/useMatch';
import { Match } from '../../services/matchService';
import { calculateMatchDuration, extractDate, extractHour, getSectionLabel, getTerrainImages, sortDatesWithPriority, today, tomorrow } from '../../utils/functions';



const TchinTchinsScreen: React.FC = () => {
    const {
        matches,
        isLoading,
        error,
        hasMoreData,
        loadMoreData,
        refreshData
    } = useMatch();

    // Regrouper par date
    const grouped = matches.reduce((acc, match) => {
        const date = extractDate(match.matchDateDebut);
        if (!acc[date]) acc[date] = [];
        acc[date].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

    // S'assurer que "Aujourd'hui" et "Demain" sont toujours présents
    if (!grouped[today]) grouped[today] = [];
    if (!grouped[tomorrow]) grouped[tomorrow] = [];

    // Trier les dates avec priorité pour aujourd'hui et demain
    const dates = sortDatesWithPriority(Object.keys(grouped));

    const renderFooter = () => {
        if (!isLoading) return null;

        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    };

    const handleEndReached = () => {
        if (hasMoreData && !isLoading) {
            loadMoreData();
        }
    };

    const handleRefresh = useCallback(() => {
        refreshData();
    }, [refreshData]);

    // Afficher l'erreur si elle existe
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur: {error}</Text>
                <Text style={styles.retryText} onPress={refreshData}>
                    Réessayer
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Tchin-Tchins</Text>
                <Text style={styles.subtitle}>{matches.length} matches affichés</Text>
            </View>
            <FlatList
                data={dates}
                keyExtractor={(date) => date}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && matches.length === 0}
                        onRefresh={handleRefresh}
                        colors={[PRIMARY_COLOR]}
                    />
                }
                renderItem={({ item: date }) => (
                    <View style={styles.dateSection}>
                        <Text style={styles.dateTitle}>{getSectionLabel(date)}</Text>
                        <Text style={styles.dateShort}>{new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                        {grouped[date].length > 0 ? (
                            grouped[date].map((match) => {
                                const terrainImages = getTerrainImages(match.terrainImages);
                                return (
                                    <View key={match.matchId} style={styles.cardWrapper}>
                                        <View style={styles.card}>
                                            <Image
                                                source={{ uri: terrainImages[0] }}
                                                style={styles.image}
                                                defaultSource={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500' }}
                                            />
                                            <View style={styles.cardContent}>
                                                <View style={styles.cardHeader}>
                                                    <Text style={styles.cardTitle}>{match.terrainNom}</Text>
                                                    <View style={styles.hourBadge}>
                                                        <Text style={styles.cardHour}>{extractHour(match.matchDateDebut)}</Text>
                                                    </View>
                                                </View>
                                                <Text style={styles.cardLocation}>{match.terrainLocalisation}</Text>
                                                <View style={styles.cardFieldRow}>
                                                    {/* <Text style={styles.cardField}>{match.matchFormat || 'Match standard'}</Text> */}
                                                    <Text style={styles.cardFormat}>Temps de jeu: {calculateMatchDuration(match.matchDateDebut, match.matchDateFin)}</Text>
                                                </View>
                                                <View style={styles.cardFooter}>
                                                    <Text style={styles.capo}>Capo: {match.capoNomUtilisateur}</Text>
                                                    <View style={styles.playersRow}>
                                                        <Text style={styles.players}>{match.nbreJoueursInscrits}/{match.joueurxMax}</Text>
                                                        <MaterialCommunityIcons name="account" size={16} color="#bbb" style={{ marginLeft: 3 }} />
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyText}>Aucune partie programmée</Text>
                            </View>
                        )}
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
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
    subtitle: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
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
    loadingFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryText: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        textDecorationLine: 'underline',
    },
});

export default TchinTchinsScreen; 