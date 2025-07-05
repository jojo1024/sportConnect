import { useState, useCallback } from 'react';
import { Keyboard } from 'react-native';
import { matchService, Match } from '../services/matchService';

interface Pagination {
    hasNextPage: boolean;
    total: number;
    currentPage: number;
    totalPages: number;
}

interface SearchResult {
    matches: Match[];
    pagination: Pagination;
}

/**
 * Hook personnalisé pour gérer la recherche de matchs par code
 * Fournit une interface complète pour rechercher, paginer et gérer les résultats
 * 
 * Fonctionnalités principales :
 * - Recherche de matchs par code avec pagination
 * - Gestion des états de chargement et d'erreur
 * - Support de l'infinite scroll pour les résultats
 * - Réinitialisation de la recherche
 * 
 * @returns {Object} Objet contenant l'état et les méthodes de recherche
 */
export const useSearchMatches = () => {
    const [searchResults, setSearchResults] = useState<Match[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    /**
     * Recherche des matchs par code avec pagination
     * @param code - Code du match à rechercher
     * @param page - Numéro de la page à charger (défaut: 1)
     */
    const searchMatchesByCode = useCallback(async (code: string, page: number = 1) => {
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
            setSearchResults([]);
            setCurrentPage(1);
        } else {
            setIsLoadingMore(true);
        }

        setError('');
        setHasSearched(true);

        try {
            const result: SearchResult = await matchService.searchMatchesByCode(code, page, 10);
            
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
    }, []);

    /**
     * Charge la page suivante des résultats de recherche (infinite scroll)
     */
    const handleLoadMore = useCallback(() => {
        if (
            pagination?.hasNextPage &&
            !isLoadingMore &&
            !isSearching
        ) {
            searchMatchesByCode(searchResults[0]?.codeMatch || '', currentPage + 1);
        }
    }, [pagination, isLoadingMore, isSearching, searchResults, currentPage, searchMatchesByCode]);

    /**
     * Réinitialise complètement l'état de recherche
     */
    const resetSearch = useCallback(() => {
        setSearchResults([]);
        setError('');
        setHasSearched(false);
        setPagination(null);
        setCurrentPage(1);
        setIsSearching(false);
        setIsLoadingMore(false);
    }, []);

    return {
        searchResults,
        isSearching,
        error,
        hasSearched,
        isLoadingMore,
        pagination,
        searchMatchesByCode,
        handleLoadMore,
        resetSearch,
    };
}; 