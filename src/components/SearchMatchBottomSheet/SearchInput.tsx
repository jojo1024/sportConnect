import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

interface SearchInputProps {
    value: string;
    onChangeText: (text: string) => void;
    onSearch: () => void;
    onClear: () => void;
    isSearching: boolean;
    placeholder: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
    value,
    onChangeText,
    onSearch,
    onClear,
    isSearching,
    placeholder,
}) => {
    const isSearchDisabled = !value.trim() || isSearching;

    return (
        <View style={styles.searchRow}>
            <View style={styles.inputContainer}>
                <Ionicons
                    name="search"
                    size={22}
                    color={COLORS.textLight}
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchInput}
                    placeholder={placeholder}
                    placeholderTextColor={COLORS.textLight}
                    value={value}
                    onChangeText={onChangeText}
                    autoCapitalize="characters"
                    autoCorrect={false}
                    selectionColor={COLORS.primary}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={onClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={20} color={COLORS.textLight} />
                    </TouchableOpacity>
                )}
            </View>
            <TouchableOpacity
                style={[
                    styles.searchButton,
                    isSearchDisabled && styles.searchButtonDisabled
                ]}
                onPress={onSearch}
                disabled={isSearchDisabled}
                activeOpacity={0.7}
            >
                <Ionicons
                    name="search"
                    size={22}
                    color={!isSearchDisabled ? COLORS.white : COLORS.textLight}
                />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
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
}); 