import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Image,
    Keyboard,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS } from '../theme/colors';
import { calculateMatchDuration, extractHour, getTerrainImage } from '../utils/functions';
import { BASE_URL_IMAGES } from '../services/api';
import { matchService, Match } from '../services/matchService';
import { SIZES } from '../theme/typography';

// Utilisation de l'interface Match du service

interface SearchMatchBottomSheetProps {
    bottomSheetRef: React.RefObject<RBSheet | null>;
    onMatchPress: (match: Match) => void;
}

const SearchMatchBottomSheet: React.FC<SearchMatchBottomSheetProps> = ({
    bottomSheetRef,
    onMatchPress,
}) => {
    const [searchCode, setSearchCode] = useState('');
    const [searchResults, setSearchResults] = useState<Match[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<any>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Fonction pour rechercher les matchs par code
    const searchMatchesByCode = async (code: string, page: number = 1) => {
        console.log("🚀 ~ searchMatchesByCode ~ code:", code, "page:", page)
        if (!code.trim()) {
            setSearchResults([]);
            setError('');
            setHasSearched(false);
            setPagination(null);
            setCurrentPage(1);
            return;
        }

        if (page === 1) {
            setIsSearching(true);
            setSearchResults([]); // Vider les résultats précédents
            setCurrentPage(1);
        } else {
            setIsLoadingMore(true);
        }

        setError('');
        setHasSearched(true);

        try {
            const result = await matchService.searchMatchesByCode(code, page, 10);
            if (page === 1) {
                setSearchResults(result.matches);
            } else {
                setSearchResults(prev => [...prev, ...result.matches]);
            }
            setPagination(result.pagination);
            setCurrentPage(page);
        } catch (err) {
            setError('Erreur lors de la recherche');
            if (page === 1) {
                setSearchResults([]);
            }
        } finally {
            setIsSearching(false);
            setIsLoadingMore(false);
            Keyboard.dismiss();
        }
    };

    // Suppression de la recherche en temps réel

    const handleMatchPress = (match: Match) => {
        onMatchPress(match);
        bottomSheetRef.current?.close();
        setSearchCode('');
        setSearchResults([]);
        setHasSearched(false);
        setPagination(null);
        setCurrentPage(1);
    };

    const handleLoadMore = () => {
        console.log("🚀 ~ handleLoadMore ~ pagination:", pagination, "isLoadingMore:", isLoadingMore, "currentPage:", currentPage);

        // Vérifications multiples pour éviter les appels en double
        if (
            pagination?.hasNextPage &&
            !isLoadingMore &&
            !isSearching &&
            searchCode.trim().length > 0
        ) {
            console.log("🚀 ~ Chargement de la page:", currentPage + 1);
            searchMatchesByCode(searchCode, currentPage + 1);
        } else {
            console.log("🚀 ~ handleLoadMore ignoré:", {
                hasNextPage: pagination?.hasNextPage,
                isLoadingMore,
                isSearching,
                searchCodeLength: searchCode.trim().length
            });
        }
    };

    const renderMatchItem = ({ item }: { item: Match }) => (
        <TouchableOpacity
            key={item.matchId}
            style={styles.cardWrapper}
            onPress={() => handleMatchPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.card}>
                <Image
                    source={{ uri: `${BASE_URL_IMAGES}/${getTerrainImage(item.terrainImages)}` }}
                    style={styles.image}
                    defaultSource={{ uri: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500' }}
                />
                <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{item.terrainNom}</Text>
                        <View style={styles.hourBadge}>
                            <Text style={styles.cardHour}>{extractHour(item.matchDateDebut)}</Text>
                        </View>
                    </View>
                    <Text style={styles.cardLocation}>{item.terrainLocalisation}</Text>
                    <View style={styles.cardFieldRow}>
                        <Text style={styles.cardFormat}>Temps de jeu: {calculateMatchDuration(item.matchDateDebut, item.matchDateFin)}</Text>
                    </View>
                    <View style={styles.cardCodeRow}>
                        <Text style={styles.cardCode}>Code: {item.codeMatch}</Text>
                    </View>
                    <View style={styles.cardFooter}>
                        <Text style={styles.capo}>Capo: {item.capoNomUtilisateur}</Text>
                        <View style={styles.playersRow}>
                            <Text style={styles.players}>{item.nbreJoueursInscrits}/{item.joueurxMax}</Text>
                            <MaterialCommunityIcons name="account" size={16} color="#bbb" style={{ marginLeft: 3 }} />
                        </View>
                    </View>
                </View>
                {/* Indicateur de clic */}
                <View style={styles.clickIndicator}>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <RBSheet
            ref={bottomSheetRef}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
                wrapper: styles.wrapper,
                draggableIcon: styles.draggableIcon,
                container: styles.container,
            }}
            height={SIZES.height * 0.8}
        >
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Rechercher un match</Text>
                <TouchableOpacity
                    onPress={() => bottomSheetRef.current?.close()}
                    style={styles.closeButton}
                >
                    <Ionicons name="close" size={24} color={COLORS.black} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchRow}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="search" size={22} color={COLORS.textLight} style={styles.searchIcon} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Entrez le code du match..."
                            placeholderTextColor={COLORS.textLight}
                            value={searchCode}
                            onChangeText={setSearchCode}
                            autoCapitalize="characters"
                            autoCorrect={false}
                            selectionColor={COLORS.primary}
                        // onSubmitEditing={() => searchMatchesByCode(searchCode)}
                        />
                        {searchCode.length > 0 && (
                            <TouchableOpacity
                                onPress={() => setSearchCode('')}
                                style={styles.clearButton}
                            >
                                <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[
                            styles.searchButton,
                            (!searchCode.trim() || isSearching) && styles.searchButtonDisabled
                        ]}
                        onPress={() => searchMatchesByCode(searchCode)}
                        disabled={!searchCode.trim() || isSearching}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="search"
                            size={22}
                            color={searchCode.trim() && !isSearching ? COLORS.white : COLORS.textLight}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.resultsContainer}>
                {isSearching ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Recherche en cours...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={48} color={COLORS.danger} />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : searchResults.length > 0 ? (
                    <View style={styles.resultsWrapper}>
                        {/* {pagination && (
                            <View style={styles.paginationInfo}>
                                <Text style={styles.paginationText}>
                                    {searchResults.length} résultat{pagination.total > 1 ? 's' : ''} sur {pagination.total}
                                </Text>
                            </View>
                        )} */}
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.matchId.toString()}
                            renderItem={renderMatchItem}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.resultsList}
                            onEndReached={handleLoadMore}
                            onEndReachedThreshold={0.2}
                            removeClippedSubviews={true}
                            maxToRenderPerBatch={10}
                            windowSize={10}
                            initialNumToRender={10}
                            ListFooterComponent={
                                isLoadingMore ? (
                                    <View style={styles.loadingMoreContainer}>
                                        <ActivityIndicator size="small" color={COLORS.primary} />
                                        <Text style={styles.loadingMoreText}>Chargement...</Text>
                                    </View>
                                ) : pagination?.hasNextPage ? (
                                    <View style={styles.loadMoreHintContainer}>
                                        <Text style={styles.loadMoreHintText}>Glissez vers le bas pour charger plus</Text>
                                    </View>
                                ) : null
                            }
                        />
                    </View>
                ) : hasSearched && searchCode.length > 0 && searchResults.length === 0 && !isSearching ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="search" size={48} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>Aucun match trouvé</Text>
                        <Text style={styles.emptySubtext}>Vérifiez le code et réessayez</Text>
                    </View>
                ) : !hasSearched ? (
                    <View style={styles.initialContainer}>
                        <Ionicons name="qr-code" size={48} color={COLORS.textLight} />
                        <Text style={styles.initialText}>Entrez le code du match</Text>
                        <Text style={styles.initialSubtext}>Cliquez sur rechercher pour trouver des matchs</Text>
                    </View>
                ) : null}
            </View>
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    draggableIcon: {
        backgroundColor: COLORS.textLight,
    },
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        paddingHorizontal: 20,
        paddingBottom: 10,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.black,
    },
    closeButton: {
        padding: 5,
    },
    searchContainer: {
        padding: 20,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#e9ecef',
        height: 45,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: COLORS.black,
        paddingVertical: 0,
    },
    clearButton: {
        padding: 5,
    },
    searchButton: {
        width: 56,
        height: 45,
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3,
    },
    searchButtonDisabled: {
        backgroundColor: '#e9ecef',
        elevation: 0,
        shadowOpacity: 0,
        opacity: 0.6,
    },
    resultsContainer: {
        flex: 1,
        paddingHorizontal: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.textLight,
    },
    loadingMoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    loadingMoreText: {
        marginLeft: 10,
        fontSize: 14,
        color: COLORS.textLight,
    },
    loadMoreHintContainer: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    loadMoreHintText: {
        fontSize: 12,
        color: COLORS.textLight,
        fontStyle: 'italic',
    },
    resultsWrapper: {
        flex: 1,
    },
    paginationInfo: {
        paddingVertical: 2,
    },
    paginationText: {
        fontSize: 12,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    resultsList: {
        paddingVertical: 10,
        paddingBottom: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.danger,
        textAlign: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '600',
    },
    emptySubtext: {
        marginTop: 5,
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    initialContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.black,
        fontWeight: '600',
    },
    initialSubtext: {
        marginTop: 5,
        fontSize: 14,
        color: COLORS.textLight,
        textAlign: 'center',
    },
    // Styles identiques à TchinTchinsScreen
    cardWrapper: {
        marginBottom: 15,
        marginHorizontal: 2,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 22,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        minHeight: 110,
        position: 'relative',
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
        color: COLORS.primary,
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
        marginBottom: 4,
    },
    cardFormat: {
        fontSize: 13,
        color: '#555',
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
        color: COLORS.primary,
    },
    playersRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    players: {
        fontSize: 12,
        color: '#888',
    },
    clickIndicator: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -10 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default SearchMatchBottomSheet; 