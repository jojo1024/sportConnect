import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS } from '../theme/colors';
import { SIZES } from '../theme/typography';
import { Match } from '../services/matchService';
import { useSearchMatches } from '../hooks/useSearchMatches';
import { SearchHeader, SearchInput, SearchResults } from './SearchMatchBottomSheet/index';

interface SearchMatchBottomSheetProps {
    bottomSheetRef: React.RefObject<RBSheet | null>;
    onMatchPress: (match: Match) => void;
}

const SearchMatchBottomSheet: React.FC<SearchMatchBottomSheetProps> = ({
    bottomSheetRef,
    onMatchPress,
}) => {
    const [searchCode, setSearchCode] = useState('');

    const {
        searchResults,
        isSearching,
        error,
        hasSearched,
        isLoadingMore,
        pagination,
        searchMatchesByCode,
        handleLoadMore,
    } = useSearchMatches();

    const handleSearch = useCallback(() => {
        searchMatchesByCode(searchCode);
    }, [searchCode, searchMatchesByCode]);

    const handleMatchPress = useCallback((match: Match) => {
        onMatchPress(match);
        bottomSheetRef.current?.close();
        setSearchCode('');
    }, [onMatchPress, bottomSheetRef]);

    const handleClose = useCallback(() => {
        bottomSheetRef.current?.close();
    }, [bottomSheetRef]);

    const handleClearSearch = useCallback(() => {
        setSearchCode('');
    }, []);

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
            <SearchHeader
                title="Rechercher un match"
                onClose={handleClose}
            />

            <View style={styles.searchContainer}>
                <SearchInput
                    value={searchCode}
                    onChangeText={setSearchCode}
                    onSearch={handleSearch}
                    onClear={handleClearSearch}
                    isSearching={isSearching}
                    placeholder="Entrez le code du match..."
                />
            </View>

            <SearchResults
                searchResults={searchResults}
                isSearching={isSearching}
                error={error}
                hasSearched={hasSearched}
                isLoadingMore={isLoadingMore}
                pagination={pagination}
                searchCode={searchCode}
                onMatchPress={handleMatchPress}
                onLoadMore={handleLoadMore}
            />
        </RBSheet>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: COLORS.overlay,
    },
    draggableIcon: {
        backgroundColor: COLORS.textLight,
    },
    container: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: COLORS.white,
    },
    searchContainer: {
        padding: 20,
    },
});

export default SearchMatchBottomSheet; 