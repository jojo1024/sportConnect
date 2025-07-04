import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

interface TermsSectionProps {
    acceptedTerms: boolean;
    onToggleTerms: () => void;
}

export const TermsSection: React.FC<TermsSectionProps> = ({
    acceptedTerms,
    onToggleTerms
}) => {
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
        maxHeight: 200,
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
        maxHeight: 200,
    },
}); 