import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { name as projectName, version } from '../../../package.json';
import LoadingFooter from '../../components/LoadingFooter';
import NewMatchesNotification from '../../components/NewMatchesNotification';
import SearchMatchBottomSheet from '../../components/SearchMatchBottomSheet';
import { MatchCard } from '../../components/MatchCard';
import SportFilter from '../../components/SportFilter';
import { ErrorDemoComponent, RetryComponent } from '../../components/UtilsComponent';
import { useMatch } from '../../hooks/useMatch';
import { useSport } from '../../hooks/useSport';
import { COLORS } from '../../theme/colors';
import { getDateSectionLabel } from '../../utils/functions';


const TchinTchinsScreen = () => {

    // Hook pour les sports
    const { activeSports, selectedSportId, handleSportSelect } = useSport();

    // Hook pour les matchs avec filtrage par sport
    const {
        matches,
        isLoading,
        error,
        errorType,
        refreshData,
        allMatchFiltredByDate,
        groupedMatchsByDate,
        handleEndReached,
        handleRefresh,
        newMatchesCount,
        showNewMatchesNotification,
        hideNewMatchesNotification,
        newMatchesIds,
        handleMatchPress,
        handleSearchPress,
        handleSearchMatchPress,
        searchBottomSheetRef
    } = useMatch(selectedSportId);

    // État pour afficher la démonstration des erreurs (à supprimer en production)
    const [showErrorDemo, setShowErrorDemo] = useState(false);

    // Afficher l'erreur si elle existe
    if (error) {
        return (
            <RetryComponent
                onRetry={refreshData}
                errorType={errorType || undefined}
                customMessage={error}
            />
        );
    }

    // Afficher la démonstration des erreurs si activée (à supprimer en production)
    if (showErrorDemo) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => setShowErrorDemo(false)}
                    >
                        <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
                    </TouchableOpacity>
                    <Text style={styles.demoHeaderTitle}>Test des Messages d'Erreur</Text>
                </View>
                <ErrorDemoComponent />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Notification des nouveaux matchs */}
            <NewMatchesNotification
                isVisible={showNewMatchesNotification}
                newMatchesCount={newMatchesCount}
                onHide={hideNewMatchesNotification}
            />

            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <Text style={styles.title}>{projectName}</Text>
                    <Text style={styles.subtitle}>{version}</Text>
                </View>
                <View style={styles.headerActions}>
                    {/* Bouton de démonstration des erreurs (à supprimer en production) */}
                    <TouchableOpacity
                        style={styles.demoButton}
                        onPress={() => setShowErrorDemo(true)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name="bug-outline" size={18} color={COLORS.warning} />
                    </TouchableOpacity>

                    {/* Bouton de recherche */}
                    <TouchableOpacity
                        style={styles.searchButton}
                        activeOpacity={0.7}
                        onPress={handleSearchPress}
                    >
                        <Ionicons name="search" size={18} color={COLORS.black} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Filtre par sport */}
            <SportFilter
                sports={activeSports}
                selectedSportId={selectedSportId}
                onSportSelect={handleSportSelect}
                isLoading={false}
            />

            <FlatList
                data={allMatchFiltredByDate}
                keyExtractor={(date) => date}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && matches.length === 0}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                    />
                }
                renderItem={({ item: date }) => (
                    <View style={styles.dateSection}>
                        <Text style={styles.dateTitle}>{getDateSectionLabel(date)}</Text>
                        <Text style={styles.dateShort}>{new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
                        {groupedMatchsByDate[date].length > 0 ? (
                            groupedMatchsByDate[date].map((match, index) => {
                                const isNewMatch = newMatchesIds.has(match.matchId);
                                // const terrainImages = getTerrainImages(match?.terrainImages || [] as string[]);
                                return (
                                    <MatchCard key={index} match={match} onPress={handleMatchPress} compact={false} isNewMatch={isNewMatch} />
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
                ListFooterComponent={<LoadingFooter loading={isLoading} />}
            />
            <View style={{ height: 30 }}></View>

            {/* Bottom Sheet de recherche */}
            <SearchMatchBottomSheet
                bottomSheetRef={searchBottomSheetRef}
                onMatchPress={handleSearchMatchPress}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 15,
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    subtitle: {
        fontSize: 8,
        color: COLORS.darkGray,
        fontStyle: 'italic',
        paddingTop: 10,
    },
    dateSection: {
        marginBottom: 32,
        marginHorizontal: 10,
    },
    dateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkestGray,
    },
    dateShort: {
        fontSize: 14,
        color: COLORS.gray[400],
        marginBottom: 14,
        marginLeft: 2,
    },
    cardWrapper: {
        marginBottom: 20,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 22,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        minHeight: 110,
        position: 'relative',
    },
    newMatchIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 10,
    },
    newMatchDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
        borderWidth: 2,
        borderColor: COLORS.white,
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
        color: COLORS.veryDarkGray,
        flex: 1,
        flexWrap: 'wrap',
    },
    hourBadge: {
        backgroundColor: COLORS.backgroundLightGray,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginLeft: 8,
    },
    cardHour: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: 'bold',
    },
    cardLocation: {
        fontSize: 13,
        color: COLORS.darkGray,
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
        color: COLORS.darkerGray,
        marginRight: 16,
    },
    cardFormat: {
        fontSize: 13,
        color: COLORS.darkerGray,
    },
    cardCodeRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 8,
    },
    cardCode: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    capo: {
        fontSize: 12,
        color: COLORS.textLight,
    },
    playersRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    players: {
        fontSize: 12,
        color: COLORS.gray[500],
    },
    clickIndicator: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -10 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        borderRadius: 12,
        marginHorizontal: 5,
        marginTop: 10,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.gray[600],
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
        color: COLORS.darkGray,
    },
    searchButton: {
        width: 36,
        height: 36,
        backgroundColor: '#f8f9fa',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    creditCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#e9ecef',
        gap: 6,
    },
    creditAmount: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.primary,
    },
    demoButton: {
        width: 36,
        height: 36,
        backgroundColor: '#f8f9fa',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    backButton: {
        width: 36,
        height: 36,
        backgroundColor: '#f8f9fa',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    demoHeaderTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default TchinTchinsScreen; 