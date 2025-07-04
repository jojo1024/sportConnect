import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { Match } from '../../services/matchService';
import { MatchCard } from '../MatchCard';
// import { MatchCard } from './MatchCard';

interface Pagination {
    hasNextPage: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
}

interface SearchResultsProps {
    searchResults: Match[];
    isSearching: boolean;
    error: string;
    hasSearched: boolean;
    isLoadingMore: boolean;
    pagination: Pagination | null;
    searchCode: string;
    onMatchPress: (match: Match) => void;
    onLoadMore: () => void;
}

export const SearchResults: React.FC<SearchResultsProps> = ({
    searchResults,
    isSearching,
    error,
    hasSearched,
    isLoadingMore,
    pagination,
    searchCode,
    onMatchPress,
    onLoadMore,
}) => {
    const renderMatchItem = ({ item }: { item: Match }) => (
        <MatchCard match={item} onPress={onMatchPress} compact={false} />
    );

    const renderFooter = () => {
        if (isLoadingMore) {
            return (
                <View style={styles.loadingMoreContainer}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                    <Text style={styles.loadingMoreText}>Chargement...</Text>
                </View>
            );
        }

        if (pagination?.hasNextPage) {
            return (
                <View style={styles.loadMoreHintContainer}>
                    <Text style={styles.loadMoreHintText}>
                        Glissez vers le bas pour charger plus
                    </Text>
                </View>
            );
        }

        return null;
    };

    if (isSearching) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Recherche en cours...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={48} color={COLORS.danger} />
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (searchResults.length > 0) {
        return (
            <View style={styles.resultsWrapper}>
                <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.matchId.toString()}
                    renderItem={renderMatchItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.resultsList}
                    onEndReached={onLoadMore}
                    onEndReachedThreshold={0.2}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={10}
                    ListFooterComponent={renderFooter}
                />
            </View>
        );
    }

    if (hasSearched && searchCode.length > 0 && searchResults.length === 0 && !isSearching) {
        return (
            <View style={styles.emptyContainer}>
                <Ionicons name="search" size={48} color={COLORS.textLight} />
                <Text style={styles.emptyText}>Aucun match trouvé</Text>
                <Text style={styles.emptySubtext}>Vérifiez le code et réessayez</Text>
            </View>
        );
    }

    if (!hasSearched) {
        return (
            <View style={styles.initialContainer}>
                <Ionicons name="qr-code" size={48} color={COLORS.textLight} />
                <Text style={styles.initialText}>Entrez le code du match</Text>
                <Text style={styles.initialSubtext}>
                    Cliquez sur rechercher pour trouver des matchs
                </Text>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
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
    resultsList: {
        paddingVertical: 10,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
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
        paddingHorizontal: 20,
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
        paddingHorizontal: 20,
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
}); 