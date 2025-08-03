import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS } from '../../theme/colors';
import { Terrain } from '../../services/terrainService';
import { useTerrainCache } from '../../hooks/useTerrainCache';
import { SIZES } from '../../theme/typography';
import { TerrainsBottomSheet } from '../createParty/TerrainsBottomSheet';

interface TerrainFilterRBSheetProps {
    visible: boolean;
    onClose: () => void;
    onTerrainSelect: (terrainId: number | null) => void;
    selectedTerrainId: number | null;
}

const TerrainFilterRBSheet: React.FC<TerrainFilterRBSheetProps> = ({
    visible,
    onClose,
    onTerrainSelect,
    selectedTerrainId
}) => {
    const { terrains, loading, error, refreshTerrains } = useTerrainCache();
    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const bottomSheetRef = useRef<RBSheet>(null);

    // Filtrer les terrains basé sur la recherche
    const filteredTerrains = useMemo(() => {
        if (!searchQuery.trim()) {
            return terrains;
        }
        return terrains.filter(terrain =>
            terrain.terrainNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
            terrain.terrainLocalisation.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [terrains, searchQuery]);

    const handleTerrainSelect = (terrain: Terrain) => {
        onTerrainSelect(terrain.terrainId);
        onClose();
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await refreshTerrains();
        } finally {
            setIsRefreshing(false);
        }
    };

    // Gérer l'ouverture/fermeture du BottomSheet
    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.open();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    const handleClose = () => {
        bottomSheetRef.current?.close();
        onClose();
    };

    const handleBottomSheetClose = () => {
        onClose();
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
    };

    // Gérer les erreurs de chargement
    if (error && terrains.length === 0) {
        return (
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
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle" size={48} color={COLORS.red} />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
                        <Text style={styles.retryButtonText}>Réessayer</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        );
    }

    // Gérer le chargement initial
    if (loading && terrains.length === 0) {
        return (
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
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                    <Text style={styles.loadingText}>Chargement des terrains...</Text>
                </View>
            </RBSheet>
        );
    }

    return (
        <TerrainsBottomSheet
            bottomSheetRef={bottomSheetRef}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            filteredFields={filteredTerrains}
            selectedFieldId={selectedTerrainId?.toString() || ''}
            onFieldSelect={handleTerrainSelect}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.gray[600],
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: COLORS.red,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default TerrainFilterRBSheet; 