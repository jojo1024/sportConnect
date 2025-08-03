import React from 'react';
import {
    FlatList,
    StyleSheet,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
    onRefresh?: () => void;
    isRefreshing?: boolean;
}

export const TerrainsBottomSheet: React.FC<TerrainsBottomSheetProps> = ({
    bottomSheetRef,
    searchQuery,
    onSearchChange,
    filteredFields,
    selectedFieldId,
    onFieldSelect,
    onRefresh,
    isRefreshing = false
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
            <View style={styles.headerContainer}>
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Rechercher un terrain..."
                        value={searchQuery}
                        selectionColor={COLORS.primary}
                        onChangeText={onSearchChange}
                    />
                </View>
                {onRefresh && (
                    <TouchableOpacity
                        style={styles.refreshButton}
                        onPress={onRefresh}
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? (
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        ) : (
                            <Ionicons
                                name="refresh"
                                size={20}
                                color={COLORS.primary}
                            />
                        )}
                    </TouchableOpacity>
                )}
            </View>
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
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    searchContainer: {
        flex: 1,
    },
    searchInput: {
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 8,
        fontSize: 16,
    },
    refreshButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.gray[200],
    }
});
