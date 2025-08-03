import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Match } from '../../services/matchService';
import { COLORS } from '../../theme/colors';
import { useAppSelector } from '../../store/hooks/hooks';
import { selectUser } from '../../store/slices/userSlice';
import CustomAlert from '../CustomAlert';
import { formatDate, formatTime, getModalConfig, getStatusColor, getStatusText } from '../../utils/functions';

interface ReservationCardProps {
    item: Match;
    onConfirm: (matchId: number, gerantId: number) => void;
    onCancel: (matchId: number, raison?: string, gerantId?: number) => void;
    confirmingMatchId?: number | null;
    cancellingMatchId?: number | null;
}

type ModalType = 'confirm' | 'cancel' | null;

const ReservationCard: React.FC<ReservationCardProps> = ({
    item,
    onConfirm,
    onCancel,
    confirmingMatchId,
    cancellingMatchId
}) => {
    const user = useAppSelector(selectUser);
    const [modalType, setModalType] = useState<ModalType>(null);

    const isConfirming = confirmingMatchId === item.matchId;
    const isCancelling = cancellingMatchId === item.matchId;

    const handleConfirmPress = () => {
        setModalType('confirm');
    };

    const handleCancelPress = () => {
        setModalType('cancel');
    };

    const handleModalConfirm = () => {
        if (modalType === 'confirm') {
            onConfirm(item.matchId, user?.utilisateurId || 0);
        } else if (modalType === 'cancel') {
            onCancel(item.matchId, "", user?.utilisateurId || 0);
        }
        setModalType(null);
    };

    const handleModalCancel = () => {
        setModalType(null);
    };



    const modalConfig = getModalConfig(modalType, item);


    return (
        <>
            <View style={styles.reservationCard}>
                {/* En-tête avec terrain et statut */}
                <View style={styles.header}>
                    <View style={styles.terrainSection}>
                        {/* <Ionicons name="location" size={18} color={COLORS.primary} style={styles.terrainIcon} /> */}
                        <Text style={styles.terrainName}>{item.terrainNom}</Text>
                    </View>
                    {/* <View style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(item.matchStatus as "confirme" | "en_attente" | "annule") + '20' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: getStatusColor(item.matchStatus as "confirme" | "en_attente" | "annule") }
                        ]}>
                            {getStatusText(item.matchStatus as "confirme" | "en_attente" | "annule")}
                        </Text>
                    </View> */}
                </View>

                {/* Informations principales avec icônes */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="calendar" size={16} color={COLORS.darkGray} style={styles.infoIcon} />
                            <Text style={styles.dateText}>{formatDate(item.matchDateDebut)}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="time" size={16} color={COLORS.darkGray} style={styles.infoIcon} />
                            <Text style={styles.timeText}>
                                {formatTime(item.matchDateDebut)} - {formatTime(item.matchDateFin)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="people" size={16} color={COLORS.darkGray} style={styles.infoIcon} />
                            <Text style={styles.joueursText}>
                                {item.nbreJoueursInscrits}/{item.joueurxMax} joueurs
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="football" size={16} color={COLORS.darkGray} style={styles.infoIcon} />
                            <Text style={styles.durationText}>
                                {item?.sportNom}
                            </Text>
                        </View>

                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="time-outline" size={16} color={COLORS.darkGray} style={styles.infoIcon} />
                            <Text style={styles.durationText}>
                                {item.matchDuree}h
                            </Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Ionicons name="cash-outline" size={16} color={COLORS.darkGray} style={styles.infoIcon} />
                            <Text style={styles.priceText}>
                                {item.terrainPrixParHeure} FCFA/h
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="person" size={16} color={COLORS.darkGray} style={styles.infoIcon} />
                            <Text style={styles.capoText}>{item.capoNomUtilisateur}</Text>
                        </View>
                    </View>
                </View>

                {/* Description avec icône */}
                {item.matchDescription && (
                    <View style={styles.descriptionSection}>
                        <Ionicons name="chatbubble-ellipses" size={14} color={COLORS.gray[500]} style={styles.descriptionIcon} />
                        <Text style={styles.descriptionText} numberOfLines={2}>
                            {item.matchDescription}
                        </Text>
                    </View>
                )}

                {/* Actions avec icônes claires */}
                {item.matchStatus === 'en_attente' && (
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.acceptButton,
                                (isConfirming || isCancelling) && styles.disabledButton
                            ]}
                            onPress={handleConfirmPress}
                            disabled={isConfirming || isCancelling}
                        >
                            {isConfirming ? (
                                <ActivityIndicator size="small" color={COLORS.success} />
                            ) : (
                                <>
                                    <Ionicons name="checkmark" size={16} color={COLORS.success} style={styles.buttonIcon} />
                                    <Text style={{ ...styles.actionButtonText, color: COLORS.success }}>Confirmer</Text>
                                </>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.actionButton,
                                styles.rejectButton,
                                (isConfirming || isCancelling) && styles.disabledButton
                            ]}
                            onPress={handleCancelPress}
                            disabled={isConfirming || isCancelling}
                        >
                            {isCancelling ? (
                                <ActivityIndicator size="small" color={COLORS.red} />
                            ) : (
                                <>
                                    <Ionicons name="close" size={16} color={COLORS.red} style={styles.buttonIcon} />
                                    <Text style={styles.actionButtonText}>Annuler</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* Modal de confirmation unique */}
            <CustomAlert
                visible={modalType !== null}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type as "success" | "error" | "warning" | "info"}
                confirmText={modalConfig.confirmText}
                cancelText={modalConfig.cancelText}
                showCancel={true}
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </>
    );
};

const styles = StyleSheet.create({
    reservationCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        // elevation: 4,
        // borderWidth: 1,
        // borderColor: COLORS.borderLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    terrainSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    terrainIcon: {
        marginRight: 6,
    },
    terrainName: {
        fontSize: 17,
        fontWeight: '600',
        color: COLORS.almostBlack,
        flex: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    infoSection: {
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    infoIcon: {
        marginRight: 6,
    },
    dateText: {
        fontSize: 14,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    timeText: {
        fontSize: 14,
        color: COLORS.darkGray,
        fontWeight: '600',
    },
    joueursText: {
        fontSize: 13,
        color: COLORS.darkGray,
    },
    capoText: {
        fontSize: 13,
        color: COLORS.darkGray,
    },
    durationText: {
        fontSize: 13,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    priceText: {
        fontSize: 13,
        color: COLORS.darkGray,
        fontWeight: '500',
    },
    descriptionSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    descriptionIcon: {
        marginRight: 6,
        marginTop: 1,
    },
    descriptionText: {
        fontSize: 13,
        color: COLORS.darkGray,
        fontStyle: 'italic',
        flex: 1,
        lineHeight: 18,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 6,
        shadowColor: COLORS.shadow,
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 1,
        borderWidth: 1,
    },
    acceptButton: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.borderLight,
    },
    rejectButton: {
        backgroundColor: COLORS.white,
        borderColor: COLORS.borderLight,
    },
    disabledButton: {
        opacity: 0.6,
    },
    buttonIcon: {
        marginRight: 6,
    },
    actionButtonText: {
        color: COLORS.red,
        fontSize: 13,
        fontWeight: '600',
    },
});

export default ReservationCard; 