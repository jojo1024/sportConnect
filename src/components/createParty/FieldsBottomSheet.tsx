import React from 'react';
import {
    FlatList,
    StyleSheet,
    TextInput,
    View
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { SIZES } from '../../theme/typography';
import { Field } from '../../hooks/useCreateParty';
import { FieldCard } from './FieldCard';
import { COLORS } from '../../theme/colors';

interface FieldsBottomSheetProps {
    bottomSheetRef: React.RefObject<RBSheet | null>;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    filteredFields: Field[];
    selectedFieldId: string;
    onFieldSelect: (field: Field) => void;
}

export const FieldsBottomSheet: React.FC<FieldsBottomSheetProps> = ({
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
            wrapper: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <FieldCard
                        field={item}
                        isSelected={selectedFieldId === item.id}
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
