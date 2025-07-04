import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Share } from 'react-native';
import { Match } from '../../services/matchService';
import { COLORS } from '../../theme/colors';
import { formatDateLong, formatTime } from '../../utils/functions';
import { name as projectName } from '../../../package.json';

// Constantes
const COPY_FEEDBACK_DURATION = 2000;

interface CodeSectionProps {
    match: Match;
}

const CodeSection: React.FC<CodeSectionProps> = ({ match }) => {
    const [codeCopied, setCodeCopied] = useState(false);

    const handleCopyCode = useCallback(async () => {
        try {
            await Clipboard.setStringAsync(match.codeMatch);
            setCodeCopied(true);
            setTimeout(() => setCodeCopied(false), COPY_FEEDBACK_DURATION);
        } catch (error) {
            console.error('Erreur lors de la copie:', error);
            Alert.alert('Erreur', 'Impossible de copier le code pour le moment.');
        }
    }, [match.codeMatch]);

    const handleShareCode = useCallback(async () => {
        try {
            const shareMessage = `Rejoins ma partie de ${match.sportNom} ! 🏃‍♂️⚽\n\n📍 Terrain: ${match.terrainNom}\n📅 Date: ${formatDateLong(match.matchDateDebut)}\n🕗 Heure: ${formatTime(match.matchDateDebut)}\n💰 Prix: ${match.matchPrixParJoueur} F CFA\n\n🔑 Code de la partie: ${match.codeMatch}\n\nUtilise ce code dans l'app ${projectName} pour rejoindre la partie !`;

            await Share.share({
                message: shareMessage,
                title: 'Rejoins ma partie de foot !',
            });
        } catch (error) {
            console.error('Erreur lors du partage:', error);
            Alert.alert('Erreur', 'Impossible de partager le code pour le moment.');
        }
    }, [match]);

    return (
        <View style={styles.detailsSection}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Code de la partie</Text>
            </View>
            <View style={styles.codeCard}>
                <View style={styles.codeContainer}>
                    <View style={styles.codeDisplay}>
                        <Text style={styles.codeLabel}>Code</Text>
                        <Text style={styles.codeText}>{match.codeMatch}</Text>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={handleCopyCode}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name={codeCopied ? "checkmark" : "copy-outline"}
                                size={16}
                                color={codeCopied ? COLORS.successGreen : COLORS.primary}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={handleShareCode}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="share-social-outline" size={20} color={COLORS.white} />
                        <Text style={styles.shareButtonText}>Partager</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.codeDescription}>
                    {codeCopied
                        ? "Code copié ! Partagez-le avec vos amis"
                        : "Appuyez sur l'icône de copie ou partagez directement avec vos amis"
                    }
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    detailsSection: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.almostBlack,
        marginBottom: 12,
    },
    codeCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    codeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    codeDisplay: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
        position: 'relative',
    },
    codeLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    codeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 2,
    },
    copyButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
        borderRadius: 4,
    },
    shareButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
    },
    shareButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    codeDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default CodeSection; 