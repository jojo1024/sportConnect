import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RBSheet from 'react-native-raw-bottom-sheet';
import { COLORS } from '../../theme/colors';
import { SIZES } from '../../theme/typography';

interface TermsSectionProps {
    acceptedTerms: boolean;
    onToggleTerms: () => void;
}

export const TermsSection: React.FC<TermsSectionProps> = ({
    acceptedTerms,
    onToggleTerms
}) => {
    const bottomSheetRef = useRef<RBSheet>(null);

    const openBottomSheet = () => {
        bottomSheetRef.current?.open();
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    return (
        <>
            {/* Conditions d'utilisation */}
            <View style={styles.termsSection}>
                <Text style={styles.termsTitle}>Conditions d'utilisation</Text>
                <View style={styles.termsCard}>
                    <View style={styles.termsContent}>
                        <ScrollView
                            style={styles.termsScrollView}
                            showsVerticalScrollIndicator={true}
                            nestedScrollEnabled={true}
                            scrollEnabled={true}
                            contentContainerStyle={styles.termsScrollContent}
                        >
                            <Text style={styles.termsText}>
                                En rejoignant cette partie, vous acceptez les conditions suivantes :{'\n\n'}

                                <Text style={styles.termsBold}>1. Engagement de participation :</Text>{'\n'}
                                • Vous vous engagez à participer au match à la date et heure indiquées{'\n'}
                                • En cas d'absence, vous ne serez pas remboursé{'\n\n'}

                                <Text style={styles.termsBold}>2. Règles de jeu :</Text>{'\n'}
                                • Respectez les règles établies par le capo{'\n'}
                                • Comportement sportif obligatoire{'\n'}
                                • Équipement approprié requis{'\n\n'}

                                <Text style={styles.termsBold}>3. Remboursement :</Text>{'\n'}
                                • Remboursement possible jusqu'à 24h avant le match{'\n'}
                                • Aucun remboursement en cas d'annulation tardive{'\n'}
                                • Remboursement en crédit application uniquement{'\n\n'}

                                <Text style={styles.termsBold}>4. Responsabilité :</Text>{'\n'}
                                • Vous participez à vos propres risques{'\n'}
                                • L'application n'est pas responsable des blessures{'\n'}
                                • Respectez les consignes de sécurité{'\n\n'}

                                <Text style={styles.termsBold}>5. Paiement :</Text>{'\n'}
                                • Paiement sécurisé via Wave{'\n'}
                                • Aucun frais supplémentaire{'\n'}
                                • Confirmation immédiate après paiement
                            </Text>
                        </ScrollView>

                        {/* Bouton Voir plus */}
                        <TouchableOpacity
                            style={styles.voirPlusButton}
                            onPress={openBottomSheet}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.voirPlusText}>Voir plus</Text>
                            <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Checkbox pour accepter les conditions */}
            <View style={styles.checkboxContainer}>
                <TouchableOpacity
                    style={[styles.checkbox, acceptedTerms && styles.checkboxChecked]}
                    onPress={onToggleTerms}
                    activeOpacity={0.7}
                >
                    {acceptedTerms && (
                        <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    )}
                </TouchableOpacity>
                <View style={styles.checkboxTextContainer}>
                    <Text style={styles.checkboxText}>
                        J'ai lu et j'accepte les{' '}
                        <Text style={styles.checkboxTextBold}>termes et conditions</Text>
                    </Text>
                </View>
            </View>

            <RBSheet
                ref={bottomSheetRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: styles.bottomSheetWrapper,
                    container: styles.bottomSheetContainer,
                    draggableIcon: styles.bottomSheetDraggableIcon,
                }}
                height={SIZES.height * 0.8}
                dragFromTopOnly={false}
            >
                <View style={styles.bottomSheetContent}>
                    {/* Header */}
                    <View style={styles.bottomSheetHeader}>
                        <Text style={styles.bottomSheetTitle}>Conditions d'utilisation</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={closeBottomSheet}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={24} color={COLORS.darkGray} />
                        </TouchableOpacity>
                    </View>

                    {/* Contenu scrollable */}
                    <ScrollView
                        style={styles.bottomSheetScrollView}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.bottomSheetTermsText}>
                            En rejoignant cette partie, vous acceptez les conditions suivantes :{'\n\n'}

                            <Text style={styles.termsBold}>1. Engagement de participation :</Text>{'\n'}
                            • Vous vous engagez à participer au match à la date et heure indiquées{'\n'}
                            • En cas d'absence, vous ne serez pas remboursé{'\n'}
                            • La ponctualité est obligatoire{'\n'}
                            • Prévenez le capo en cas de retard{'\n\n'}

                            <Text style={styles.termsBold}>2. Règles de jeu :</Text>{'\n'}
                            • Respectez les règles établies par le capo{'\n'}
                            • Comportement sportif obligatoire{'\n'}
                            • Équipement approprié requis{'\n'}
                            • Interdiction de violence verbale ou physique{'\n'}
                            • Respect des décisions arbitrales{'\n\n'}

                            <Text style={styles.termsBold}>3. Remboursement :</Text>{'\n'}
                            • Remboursement possible jusqu'à 24h avant le match{'\n'}
                            • Aucun remboursement en cas d'annulation tardive{'\n'}
                            • Remboursement en crédit application uniquement{'\n'}
                            • Pas de remboursement en cas de force majeure{'\n\n'}

                            <Text style={styles.termsBold}>4. Responsabilité :</Text>{'\n'}
                            • Vous participez à vos propres risques{'\n'}
                            • L'application n'est pas responsable des blessures{'\n'}
                            • Respectez les consignes de sécurité{'\n'}
                            • Assurez-vous d'être en bonne condition physique{'\n'}
                            • Déclarez tout problème de santé préalable{'\n\n'}

                            <Text style={styles.termsBold}>5. Paiement :</Text>{'\n'}
                            • Paiement sécurisé via Wave{'\n'}
                            • Aucun frais supplémentaire{'\n'}
                            • Confirmation immédiate après paiement{'\n'}
                            • Conservation des reçus de paiement{'\n\n'}

                            <Text style={styles.termsBold}>6. Confidentialité :</Text>{'\n'}
                            • Vos données personnelles sont protégées{'\n'}
                            • Pas de partage avec des tiers{'\n'}
                            • Conformité RGPD{'\n\n'}

                            <Text style={styles.termsBold}>7. Modifications :</Text>{'\n'}
                            • Les conditions peuvent être modifiées{'\n'}
                            • Notification préalable obligatoire{'\n'}
                            • Acceptation tacite en cas de continuation d'utilisation
                        </Text>
                    </ScrollView>
                    <View style={{height: 20}}></View>
                </View>
            </RBSheet>
        </>
    );
};

const styles = StyleSheet.create({
    termsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    termsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.darkGray,
        marginBottom: 12,
    },
    termsCard: {
        backgroundColor: COLORS.backgroundWhite,
        borderRadius: 12,
        padding: 16,
    },
    termsContent: {
        maxHeight: 100,
    },
    termsText: {
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 20,
    },
    termsBold: {
        fontWeight: 'bold',
        color: COLORS.darkGray,
    },
    voirPlusButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        marginTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    voirPlusText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
        marginRight: 4,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: COLORS.borderMedium,
        backgroundColor: COLORS.backgroundWhite,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    checkboxChecked: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    checkboxTextContainer: {
        flex: 1,
    },
    checkboxText: {
        fontSize: 15,
        color: COLORS.darkGray,
        fontWeight: '500',
        lineHeight: 20,
        marginBottom: 4,
    },
    checkboxTextBold: {
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    termsScrollView: {
        maxHeight: 100,
    },
    termsScrollContent: {
        paddingBottom: 8,
    },
    bottomSheetWrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    bottomSheetContainer: {
        backgroundColor: COLORS.backgroundWhite,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 8,
    },
    bottomSheetDraggableIcon: {
        backgroundColor: COLORS.borderMedium,
        width: 40,
        height: 4,
        borderRadius: 2,
    },
    bottomSheetContent: {
        flex: 1,
        height: '100%',
    },
    bottomSheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    bottomSheetTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.darkGray,
    },
    closeButton: {
        padding: 4,
    },
    bottomSheetScrollView: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop:20
    },
    bottomSheetScrollContent: {
        paddingTop: 20,
        paddingBottom: 40,

    },
    bottomSheetTermsText: {
        fontSize: 15,
        color: COLORS.darkGray,
        lineHeight: 22,
    },
}); 