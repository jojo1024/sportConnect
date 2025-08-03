import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView
} from 'react-native';
import { useTerrain } from '../../hooks/useTerrain';
import { formatHoraires } from '../../utils/functions';
import { useNavigation } from '@react-navigation/native';
import ImageGallery from '../../components/ImageGallery';
import HeaderWithBackButton from '../../components/HeaderWithBackButton';
import InfoSectionCard, { InfoItemRow } from '../../components/DetailCard';
import MainInfoCard from '../../components/MainInfoCard';
import { COLORS } from '../../theme/colors';

const TerrainDetailsScreen: React.FC = () => {

    const {
        terrain,
        copied,
        handleCopyContact,
        handleReservations,
        handleStatistics,
        handleEdit,
        handleBack,
    } = useTerrain();

    const navigation = useNavigation();


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

    return (
        <SafeAreaView style={styles.container}>
            <HeaderWithBackButton onBack={() => navigation.goBack()} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <ImageGallery
                    images={terrain.terrainImages || []}
                    height={280}
                />

                <MainInfoCard
                    title={terrain.terrainNom}
                    location={terrain.terrainLocalisation}
                    onEdit={handleEdit}
                    showEditButton={true}
                />

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
                <InfoSectionCard title="Informations du terrain">
                    <InfoItemRow
                        icon="cash-outline"
                        label="Prix par heure"
                        value={`${terrain.terrainPrixParHeure} XOF`}
                    />
                    <InfoItemRow
                        icon="time-outline"
                        label="Horaires d'ouverture"
                        value={formatHoraires(terrain.terrainHoraires)}
                    />
                    {terrain.terrainContact && (
                        <InfoItemRow
                            icon="call-outline"
                            label="Contact"
                            value={terrain.terrainContact}
                            onCopy={handleCopyContact}
                            copied={copied}
                        />
                    )}
                </InfoSectionCard>

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
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 25,
        minWidth: 100,
        justifyContent: 'center',
    },
    actionButtonText: {
        color: COLORS.white,
        fontWeight: '600',
        marginLeft: 6,
        fontSize: 12,
    },
    descriptionSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.title,
        marginBottom: 12,
    },
    descriptionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
    },
    descriptionText: {
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 20,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: COLORS.title,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    errorBackButton: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 20,
    },
    errorBackButtonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default TerrainDetailsScreen; 