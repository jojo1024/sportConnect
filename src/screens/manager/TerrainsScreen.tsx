import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LoadingFooter from '../../components/LoadingFooter';
import { RetryComponent } from '../../components/UtilsComponent';
import { TerrainCard } from '../../components/terrain';
import { useTerrain } from '../../hooks/useTerrain';
import { Terrain } from '../../services/terrainService';
import { PRIMARY_COLOR } from '../../utils/constant';
import { COLORS } from '../../theme/colors';

const TerrainsScreen: React.FC = () => {

    const {
        terrains,
        isLoading,
        error,
        refreshData,
        handleEndReached,
        handleRefresh,
        handleTerrainPress,
        handleAddTerrain,
    } = useTerrain();

    // Afficher l'erreur si elle existe
    if (error) {
        return (
            <RetryComponent onRetry={refreshData} />
        );
    }

    const renderTerrainCard = ({ item }: { item: Terrain }) => (
        <TerrainCard terrain={item} onPress={handleTerrainPress} />
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Mes terrains</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={handleAddTerrain}
                >
                    <Ionicons name="add-circle" size={16} color={PRIMARY_COLOR} />
                    <Text style={styles.addButtonText}>Ajouter</Text>
                </TouchableOpacity>
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
                        colors={[PRIMARY_COLOR]}
                    />
                }
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={<LoadingFooter loading={isLoading} />}
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
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    addButton: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: PRIMARY_COLOR,
    },
    addButtonText: {
        color: PRIMARY_COLOR,
        fontWeight: '600',
        marginLeft: 8,
        fontSize: 12,
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
        color: '#666',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 25,
    },
    emptyButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default TerrainsScreen; 