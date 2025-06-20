import { useState, useEffect, useCallback } from 'react';
import { Match, matchService } from '../services/matchService';

interface UseMatchReturn {
    matches: Match[];
    isLoading: boolean;
    error: string | null;
    hasMoreData: boolean;
    currentPage: number;
    loadMoreData: () => void;
    refreshData: () => void;
}

export const useMatch = (): UseMatchReturn => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);

    const ITEMS_PER_PAGE = 10;

    const loadMatches = useCallback(async (page: number = 1, append: boolean = false) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const newMatches = await matchService.getMatchesWithPagination(page, ITEMS_PER_PAGE);
            console.log("🚀 ~ loadMatches ~ newMatches:", newMatches.length)
            
            if (newMatches.length === 0) {
                setHasMoreData(false);
            } else if (newMatches.length < ITEMS_PER_PAGE) {
                setHasMoreData(false);
            }
            
            if (append) {
                setMatches(prev => [...prev, ...newMatches]);
            } else {
                setMatches(newMatches);
            }
            
            setCurrentPage(page);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            console.error('Erreur lors du chargement des matchs:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const loadMoreData = useCallback(() => {
        if (!isLoading && hasMoreData) {
            loadMatches(currentPage + 1, true);
        }
    }, [isLoading, hasMoreData, currentPage, loadMatches]);

    const refreshData = useCallback(() => {
        setHasMoreData(true);
        setCurrentPage(1);
        loadMatches(1, false);
    }, [loadMatches]);

    // Charger les données initiales
    useEffect(() => {
        loadMatches(1, false);
    }, [loadMatches]);

    return {
        matches,
        isLoading,
        error,
        hasMoreData,
        currentPage,
        loadMoreData,
        refreshData,
    };
};
