import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

const ImportantInfoSection: React.FC = () => {
    const infoItems = [
        { icon: "checkmark-circle-outline", text: "Vous vous inscrivez pour réserver votre place" },
        { icon: "location-outline", text: "Vous vous rendez sur le lieu à l'heure" },
        { icon: "account-star-outline", text: "Le capo vous accueillera sur place", iconType: "MaterialCommunityIcons" },
        { icon: "tshirt-crew-outline", text: "Venez avec un t-shirt clair et sombre", iconType: "MaterialCommunityIcons" },
        { icon: "soccer", text: "Tout le monde joue le gardien une fois", iconType: "MaterialCommunityIcons" },
        {
            icon: "alert-circle-outline",
            text: "Important : Veuillez vous retirer au moins 24 heures avant le début du match pour être remboursé en crédit",
            iconType: "MaterialCommunityIcons",
            isImportant: true
        }
    ];

    return (
        <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>Informations importantes</Text>
            <View style={styles.infoCard}>
                {infoItems.map((item, index) => {
                    const IconComponent = item.iconType === "MaterialCommunityIcons" ? MaterialCommunityIcons : Ionicons;
                    return (
                        <View key={index} style={styles.infoRow}>
                            <IconComponent
                                name={item.icon as any}
                                size={18}
                                color={item.isImportant ? COLORS.alertOrange : COLORS.primary}
                                style={{ marginRight: 10 }}
                            />
                            <Text style={[
                                styles.infoText,
                                item.isImportant && styles.importantInfoText
                            ]}>
                                {item.text}
                            </Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    detailsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.almostBlack,
        marginBottom: 12,
    },
    infoCard: {
        backgroundColor: COLORS.backgroundLightYellow,
        borderRadius: 20,
        padding: 20,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 20,
        fontWeight: '400',
    },
    importantInfoText: {
        color: COLORS.alertOrange,
        fontWeight: 'bold',
    },
});

export default ImportantInfoSection; 