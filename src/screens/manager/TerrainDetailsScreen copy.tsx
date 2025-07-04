import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    FlatList
} from 'react-native';
import { useTerrain } from '../../hooks/useTerrain';
import { BASE_URL_IMAGES } from '../../services/api';
import { PRIMARY_COLOR } from '../../utils/constant';
import { formatHoraires, getStatusColor, getStatusText, getTerrainImage } from '../../utils/functions';
import { SIZES } from '../../theme/typography';
import { COLORS } from '../../theme/colors';

const { width: screenWidth } = Dimensions.get('window');

const TerrainDetailsScreen: React.FC = () => {

    const {
        terrain,
        currentImageIndex,
        setCurrentImageIndex,
        copied,
        handlePreviousImage,
        handleNextImage,
        handleCopyContact,
        handleReservations,
        handleStatistics,
        handleEdit,
        handleBack,
    } = useTerrain();

    const imagesFlatListRef = useRef<FlatList>(null);


    // Vérifier si terrain existe
    if (!terrain) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Terrain non trouvé</Text>
                    <TouchableOpacity style={styles.errorBackButton} onPress={handleBack}>
                        <Text style={styles.errorBackButtonText}>Retour</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    const handleImageScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentImageIndex(index);
    };

    const renderImage = ({ item, index }: { item: string; index: number }) => (
        <Image
            source={{ uri: `${BASE_URL_IMAGES}/${item}` }}
            style={styles.terrainImage}
            resizeMode="cover"
        />
    );

    const images = terrain.terrainImages && terrain.terrainImages.length > 0
        ? terrain.terrainImages
        : ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500'];

    return (
        <View style={styles.container}>

            {/* Contenu scrollable */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Images du terrain en scroll horizontal - EN DEHORS du ScrollView */}
                <View style={styles.imagesContainer}>
                    <FlatList
                        ref={imagesFlatListRef}
                        data={images}
                        renderItem={renderImage}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        pagingEnabled
                        onMomentumScrollEnd={handleImageScroll}
                        style={styles.imagesScroll}
                    />

                    {/* Indicateurs d'images si plusieurs images */}
                    {images.length > 1 && (
                        <View style={styles.paginationContainer}>
                            {images.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.paginationDot,
                                        index === currentImageIndex && styles.paginationDotActive
                                    ]}
                                />
                            ))}
                        </View>
                    )}

                    {/* Overlay avec bouton retour et statut */}
                    <View style={styles.imageOverlay}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                        >
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(terrain.terrainDisponibilite) }]}>
                            <Text style={styles.statusText}>
                                {getStatusText(terrain.terrainDisponibilite)}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* Informations principales */}
                <View style={styles.mainInfo}>
                    <View style={styles.titleRow}>
                        <Text style={styles.terrainName}>{terrain.terrainNom}</Text>
                        <TouchableOpacity style={styles.editIconButton} onPress={handleEdit}>
                            <Ionicons name="create-outline" size={24} color={PRIMARY_COLOR} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.locationContainer}>
                        <Ionicons name="location" size={20} color={PRIMARY_COLOR} />
                        <Text style={styles.locationText}>{terrain.terrainLocalisation}</Text>
                    </View>
                </View>

                {/* Actions rapides */}
                <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionButton} onPress={handleReservations}>
                        <FontAwesome5 name="calendar-alt" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>Réservations</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton} onPress={handleStatistics}>
                        <Ionicons name="stats-chart" size={20} color="#fff" />
                        <Text style={styles.actionButtonText}>Statistiques</Text>
                    </TouchableOpacity>
                </View>

                {/* Détails du terrain */}
                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Informations du terrain</Text>

                    <View style={styles.detailCard}>
                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="cash-outline" size={20} color={PRIMARY_COLOR} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Prix par heure</Text>
                                <Text style={styles.detailValue}>{terrain.terrainPrixParHeure} XOF</Text>
                            </View>
                        </View>

                        <View style={styles.detailRow}>
                            <View style={styles.detailIcon}>
                                <Ionicons name="time-outline" size={20} color={PRIMARY_COLOR} />
                            </View>
                            <View style={styles.detailContent}>
                                <Text style={styles.detailLabel}>Horaires d'ouverture</Text>
                                <Text style={styles.detailValue}>{formatHoraires(terrain.terrainHoraires)}</Text>
                            </View>
                        </View>

                        {terrain.terrainContact && (
                            <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="call-outline" size={20} color={PRIMARY_COLOR} />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Contact</Text>
                                    <Text style={styles.detailValue}>{terrain.terrainContact}</Text>
                                </View>
                                <TouchableOpacity style={[styles.copyButton, copied && styles.copyButtonActive]} onPress={handleCopyContact}>
                                    <Ionicons
                                        name={copied ? "checkmark" : "copy-outline"}
                                        size={20}
                                        color={copied ? "#4CAF50" : PRIMARY_COLOR}
                                    />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {/* Description */}
                {terrain.terrainDescription && (
                    <View style={styles.descriptionSection}>
                        <Text style={styles.sectionTitle}>Description</Text>
                        <View style={styles.descriptionCard}>
                            <Text style={styles.descriptionText}>{terrain.terrainDescription}</Text>
                        </View>
                    </View>
                )}
                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    imagesContainer: {
        height: SIZES.height * 0.4,
        position: 'relative',
    },
    terrainImage: {
        width: screenWidth,
        height: SIZES.height * 0.4,
    },
    imagesScroll: {
        height: SIZES.height * 0.4,
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: COLORS.overlayLight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    backButton: {
        backgroundColor: COLORS.overlay,
        borderRadius: 20,
        padding: 8,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.whiteOverlayLight,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 24,
    },
    mainInfo: {
        backgroundColor: '#fff',
        padding: 20,
        marginBottom: 16,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    terrainName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a1a1a',
        flex: 1,
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: PRIMARY_COLOR,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 100,
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 12,
    },
    detailsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    detailCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f8ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 2,
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    descriptionSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    descriptionCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    gallerySection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    galleryContainer: {
        flexDirection: 'row',
    },
    galleryImageContainer: {
        marginRight: 12,
    },
    galleryImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
    },
    managementSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    managementButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    copyButton: {
        padding: 4,
        borderRadius: 6,
    },
    editIconButton: {
        padding: 8,
    },
    copyButtonActive: {
        backgroundColor: '#e8f5e8',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: '#1a1a1a',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    errorBackButton: {
        backgroundColor: PRIMARY_COLOR,
        padding: 12,
        borderRadius: 20,
    },
    errorBackButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TerrainDetailsScreen; 