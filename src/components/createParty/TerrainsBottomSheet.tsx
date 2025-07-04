import React from 'react';
import {
    FlatList,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SIZES } from '../../theme/typography';
import { FieldCard } from './FieldCard';
import { COLORS } from '../../theme/colors';
import { Terrain } from '../../services/terrainService';

interface TerrainsBottomSheetProps {
    bottomSheetRef: React.RefObject<RBSheet | null>;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredFields: Terrain[];
    selectedFieldId: string;
    onFieldSelect: (field: Terrain) => void;
}

export const TerrainsBottomSheet: React.FC<TerrainsBottomSheetProps> = ({
    bottomSheetRef,
    searchQuery,
    onSearchChange,
    filteredFields,
    selectedFieldId,
    onFieldSelect
}) => (
    <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={SIZES.height - 200}
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
                placeholder="Rechercher un terrain..."
                value={searchQuery}
                selectionColor={COLORS.primary}
                onChangeText={onSearchChange}
            />
            <FlatList
                data={filteredFields}
                keyExtractor={(item) => item?.terrainId?.toString()}
                renderItem={({ item }) => (
                    <FieldCard
                        terrain={item}
                        isSelected={selectedFieldId === item?.terrainId?.toString()}
                        onSelect={onFieldSelect}
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
