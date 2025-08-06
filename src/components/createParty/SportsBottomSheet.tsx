import React from 'react';
import {
    FlatList,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SIZES } from '../../theme/typography';
import { Sport } from './SportCard';
import { SportCard } from './SportCard';
import { COLORS } from '../../theme/colors';

interface SportsBottomSheetProps {
    bottomSheetRef: React.RefObject<RBSheet | null>;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredSports: Sport[];
    isSportSelected: (sportId: number) => boolean;
    onSportSelect: (sport: Sport) => void;
}

export const SportsBottomSheet: React.FC<SportsBottomSheetProps> = ({
    bottomSheetRef,
    searchQuery,
    onSearchChange,
    filteredSports,
    isSportSelected,
    onSportSelect
}) => (
    <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={SIZES.height * 0.8}
        customStyles={{
            wrapper: { backgroundColor: COLORS.overlay },
            draggableIcon: { backgroundColor: '#000' },
            container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
            },
        }}
    >
        <View style={styles.bottomSheetContainer}>
            <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un sport..."
                value={searchQuery}
                selectionColor={COLORS.primary}
                onChangeText={onSearchChange}
            />
            <FlatList
                data={filteredSports}
                keyExtractor={(item) => item.sportId.toString()}
                renderItem={({ item }) => (
                    <SportCard
                        sport={item}
                        isSelected={isSportSelected(item.sportId)}
                        onSelect={onSportSelect}
                    />
                )}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={21}
                removeClippedSubviews={true}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    </RBSheet>
);

const styles = StyleSheet.create({
    bottomSheetContainer: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        fontSize: 16,
    }
}); 