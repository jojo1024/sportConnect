import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COMMUNES_ABIDJAN } from '../../utils/constant';
import { COLORS } from '../../theme/colors';
import { SIZES } from '../../theme/typography';

interface CommuneSelectorProps {
    bottomSheetRef: React.RefObject<RBSheet | null>;
    searchCommune: string;
    setSearchCommune: (search: string) => void;
    formState: any;
    handlers: any;
    setGlobalError: (error: string) => void;
}

export default function CommuneSelector({
    bottomSheetRef,
    searchCommune,
    setSearchCommune,
    formState,
    handlers,
    setGlobalError
}: CommuneSelectorProps) {
    const filteredCommunes = COMMUNES_ABIDJAN.filter(commune =>
        commune.toLowerCase().includes(searchCommune.toLowerCase())
    );

    return (
        <RBSheet
            ref={bottomSheetRef}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={SIZES.height - 200}
            customStyles={{
                wrapper: {
                    backgroundColor: COLORS.overlay
                },
                container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    padding: 16
                }
            }}
        >
            <View style={styles.bottomSheetContent}>
                <Text style={styles.bottomSheetTitle}>Sélectionner une commune</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                    <TextInput
                        selectionColor={COLORS.primary}
                        style={styles.searchInput}
                        placeholder="Rechercher une commune..."
                        value={searchCommune}
                        onChangeText={setSearchCommune}
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: SIZES.height - 400 }}>
                    {filteredCommunes.map((communeName) => (
                        <TouchableOpacity
                            key={communeName}
                            style={styles.communeItem}
                            onPress={() => {
                                handlers.handleCommuneChange(communeName);
                                setGlobalError('');
                                bottomSheetRef.current?.close();
                            }}
                        >
                            <Text style={styles.communeItemText}>{communeName}</Text>
                            {formState.commune === communeName && (
                                <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        </RBSheet>
    );
}

const styles = StyleSheet.create({
    bottomSheetContent: {
        padding: 16,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#222',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 16,
        color: '#222',
    },
    communeItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    communeItemText: {
        fontSize: 16,
        color: '#222',
    },
}); 