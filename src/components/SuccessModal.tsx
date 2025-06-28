import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView,
    Animated,
} from 'react-native';
import { COLORS } from '../theme/colors';

interface SuccessModalProps {
    visible: boolean;
    onClose: () => void;
    matchCode: string;
    title?: string;
    subtitle?: string;
    isCapo?: boolean;
    matchDetails: {
        terrainName: string;
        date: string;
        time: string;
        duration: number;
        participants: number;
        matchPrixParJoueur?: number;
    };
}

const { width, height } = Dimensions.get('window');

export const SuccessModal: React.FC<SuccessModalProps> = ({
    visible,
    onClose,
    matchCode,
    matchDetails,
    title = "Partie créée !",
    subtitle = "Votre partie a été créée avec succès",      
    isCapo = false,
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopyCode = async () => {
        try {
            await Clipboard.setStringAsync(matchCode);
            setCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.error('Erreur lors de la copie:', error);
        }
    };

    // Fonction pour convertir en string de manière sûre
    const safeString = (value: any): string => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'string') return value;
        if (typeof value === 'number') return value.toString();
        if (typeof value === 'object') return JSON.stringify(value);
        return String(value);
    };

    // Fonction pour convertir en number de manière sûre
    const safeNumber = (value: any): number => {
        if (value === null || value === undefined) return 0;
        if (typeof value === 'number') return value;
        if (typeof value === 'string') {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? 0 : parsed;
        }
        return 0;
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Header avec icône de succès */}
                        <View style={styles.header}>
                            <View style={styles.successIconContainer}>
                                <Ionicons name="checkmark-circle" size={height < 700 ? 50 : 60} color="#4CAF50" />
                            </View>
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.subtitle}>
                                {subtitle}
                            </Text>
                        </View>

                        {/* Code du match */}
                        <View style={styles.codeContainer}>
                            <Text style={styles.codeLabel}>Code de votre partie</Text>
                            <View style={styles.codeBox}>
                                <Text style={styles.codeText}>{safeString(matchCode)}</Text>
                                <TouchableOpacity
                                    style={[styles.copyButton, copied && styles.copyButtonActive]}
                                    onPress={handleCopyCode}
                                >
                                    <Ionicons
                                        name={copied ? "checkmark" : "copy-outline"}
                                        size={20}
                                        color={copied ? "#4CAF50" : COLORS.primary}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.codeHint}>
                                {copied
                                    ? "Code copié ! Partagez-le avec vos amis"
                                    : "Appuyez pour copier le code et le partager"
                                }
                            </Text>
                        </View>

                        {/* Détails de la partie */}
                        <View style={styles.detailsContainer}>
                            <Text style={styles.detailsTitle}>Détails de la partie</Text>
                            <View style={styles.detailsList}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="location" size={16} color="#666" />
                                    <Text style={styles.detailLabel}>Terrain:</Text>
                                    <Text style={styles.detailValue}>{safeString(matchDetails.terrainName)}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="calendar" size={16} color="#666" />
                                    <Text style={styles.detailLabel}>Date:</Text>
                                    <Text style={styles.detailValue}>{safeString(matchDetails.date)}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="time" size={16} color="#666" />
                                    <Text style={styles.detailLabel}>Heure:</Text>
                                    <Text style={styles.detailValue}>{safeString(matchDetails.time)}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="hourglass" size={16} color="#666" />
                                    <Text style={styles.detailLabel}>Durée:</Text>
                                    <Text style={styles.detailValue}>{safeNumber(matchDetails.duration)}h</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="people" size={16} color="#666" />
                                    <Text style={styles.detailLabel}>Participants:</Text>
                                    <Text style={styles.detailValue}>{safeNumber(matchDetails.participants)} joueurs</Text>
                                </View>
                                {matchDetails.matchPrixParJoueur && (
                                    <View style={styles.detailRow}>
                                        <Ionicons name="cash" size={16} color="#666" />
                                        <Text style={styles.detailLabel}>Prix par joueur:</Text>
                                        <Text style={styles.detailValue}>{safeNumber(matchDetails.matchPrixParJoueur)} XOF</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Note pour le capo */}
                        {isCapo && (
                            <View style={styles.capoNoteContainer}>
                                <Ionicons name="information-circle" size={16} color={COLORS.primary} />
                            <Text style={styles.capoNoteText}>
                                En tant que Capo, vous participez gratuitement à cette partie
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.primaryButton} onPress={onClose}>
                            <Ionicons name="checkmark" size={20} color="#fff" />
                            <Text style={styles.primaryButtonText}>Parfait !</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: width - 32,
        maxWidth: 400,
        maxHeight: height * 0.85, // Limite la hauteur à 85% de l'écran
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 0,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    successIconContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: height < 700 ? 20 : 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: height < 700 ? 14 : 16,
        color: '#666',
        textAlign: 'center',
    },
    codeContainer: {
        width: '100%',
        marginBottom: 20,
        alignItems: 'center',
    },
    codeLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    codeBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: COLORS.primary,
        marginBottom: 8,
        width: '100%',
    },
    codeText: {
        fontSize: height < 700 ? 18 : 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 2,
        marginRight: 12,
        flex: 1,
    },
    copyButton: {
        padding: 4,
        borderRadius: 6,
    },
    copyButtonActive: {
        backgroundColor: '#e8f5e8',
    },
    codeHint: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    detailsContainer: {
        width: '100%',
        marginBottom: 16,
    },
    detailsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    detailsList: {
        gap: 6,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 3,
    },
    detailLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
        marginRight: 8,
        minWidth: 80,
    },
    detailValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
        flex: 1,
    },
    capoNoteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#FFF8F0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        gap: 8,
    },
    capoNoteText: {
        fontSize: 13,
        color: COLORS.primary,
        flex: 1,
        lineHeight: 18,
    },
    actionsContainer: {
        padding: 20,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
}); 