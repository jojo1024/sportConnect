import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoadingFooter from '../../components/LoadingFooter';
import { RetryComponent } from '../../components/UtilsComponent';
import { TerrainCard } from '../../components/terrain';
import CustomOutlineButton from '../../components/CustomOutlineButton';
import { useTerrain } from '../../hooks/useTerrain';
import { Terrain } from '../../services/terrainService';
import { COLORS } from '../../theme/colors';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectIsAuthenticated } from '../../store/slices/userSlice';
import AuthRequiredScreen from '../../components/AuthRequiredScreen';

const TerrainsScreen: React.FC = () => {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);

    // Si non authentifié, afficher l'écran de connexion requise
    if (!isAuthenticated) {
        return (
            <AuthRequiredScreen
                title="Connexion requise"
                message="Vous devez vous connecter pour accéder à la gestion des terrains."
                iconName="location-outline"
            />
        );
    }

    const {
        terrains,
        isLoading,
        isLoadingMore,
        error,
        errorType,
        refreshData,
        handleEndReached,
        handleRefresh,
        handleTerrainPress,
        handleAddTerrain,
    } = useTerrain();

    // Afficher l'erreur si elle existe
    if (error) {
        return (
            <RetryComponent
                onRetry={refreshData}
                errorType={errorType || undefined}
                customMessage={error}
            />
        );
    }

    const renderTerrainCard = ({ item }: { item: Terrain }) => (
        <TerrainCard terrain={item} onPress={handleTerrainPress} />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mes terrains</Text>
                <CustomOutlineButton
                    onPress={handleAddTerrain}
                    title="Ajouter"
                    iconName="add-circle"
                    iconType="ionicons"
                />
            </View>

            <FlatList
                data={terrains}
                keyExtractor={(item) => `terrain-${item.terrainId}`}
                renderItem={renderTerrainCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={true}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && terrains.length === 0}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                    />
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={<LoadingFooter loading={isLoadingMore} />}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="football" size={64} color={COLORS.mediumGray} />
                            <Text style={styles.emptyTitle}>Aucun terrain</Text>
                            <Text style={styles.emptyText}>Vous n'avez pas encore ajouté de terrains</Text>
                            <TouchableOpacity style={styles.emptyButton} onPress={handleAddTerrain}>
                                <Text style={styles.emptyButtonText}>Ajouter un terrain</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null
                }
            />
            <View style={{ height: 50 }}></View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        // padding: 20,
        paddingHorizontal: 20,
        paddingBottom: 10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.gray[200],
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: COLORS.almostBlack,
    },
    listContainer: {
        padding: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: COLORS.gray[500],
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default TerrainsScreen; 