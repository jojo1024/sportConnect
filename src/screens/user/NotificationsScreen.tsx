import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { EmptyState, GetIcon, RetryComponent } from '../../components/UtilsComponent';
import { useNotification } from '../../hooks/useNotification';
import { COLORS } from '../../theme/colors';
import { formatNotificationDate } from '../../utils/functions';
import { Styles } from '../../utils/interface';
import LoadingFooter from '../../components/LoadingFooter';

const NotificationsScreen: React.FC = () => {
    const {
        notifications,
        isLoading,
        error,
        refreshData,
        handleEndReached,
        handleRefresh,
        handleNotificationPress,
        handleMarkAllAsRead
    } = useNotification();



    // Afficher l'erreur si elle existe
    if (error) {
        return (
            <RetryComponent onRetry={refreshData} />
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <TouchableOpacity style={styles.filterButton} onPress={handleMarkAllAsRead}>
                    <Ionicons name="filter" size={24} color={COLORS.primary} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.notificationId.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && notifications.length === 0}
                        onRefresh={handleRefresh}
                        colors={[COLORS.primary]}
                    />
                }
                renderItem={({ item }) => {
                    // const notificationType = getNotificationType(item.notificationTitre, item.notificationContenu);
                    const isUnread = !item.notificationLue;

                    return (
                        <TouchableOpacity
                            style={[
                                styles.notificationItem,
                                isUnread && styles.unreadNotificationItem
                            ]}
                            onPress={() => handleNotificationPress(item)}
                        >
                            <View style={[styles.iconContainer, styles[`${item.notificationType}Icon` as keyof typeof styles]]}>
                                {GetIcon(item.notificationType)}
                            </View>
                            <View style={styles.notificationContent}>
                                <View style={styles.notificationHeader}>
                                    <Text style={[
                                        styles.notificationTitle,
                                        isUnread && styles.unreadNotificationTitle
                                    ]}>
                                        {item.notificationTitre}
                                    </Text>
                                    <Text style={styles.notificationDate}>{formatNotificationDate(item.notificationDate)}</Text>
                                </View>
                                <Text style={styles.notificationMessage} numberOfLines={4}>{item.notificationContenu}</Text>
                            </View>
                            {isUnread && <View style={styles.unreadIndicator} />}
                        </TouchableOpacity>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.listContent,
                    notifications.length === 0 && { flex: 1, justifyContent: 'center' }
                ]}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={<LoadingFooter loading={isLoading} />}
                ListEmptyComponent={!isLoading ? <EmptyState /> : null}
            />
            <View style={{ height: 50 }}></View>
        </View>
    );
};

const styles = StyleSheet.create<Styles>({
    container: {
        flex: 1,
        backgroundColor: COLORS.backgroundLight,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom:10,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderColor,
        elevation: 2,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.title,
    },
    filterButton: {
        padding: 8,
    },
    listContent: {
        padding: 16,
    },
    emptyListContent: {
        flex: 1,
        justifyContent: 'center',
    },

    notificationItem: {
        flexDirection: 'row',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 6,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        position: 'relative',
    },
    unreadNotificationItem: {
        backgroundColor: COLORS.backgroundLightBlue,
        borderLeftWidth: 4,
        borderLeftColor: COLORS.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    matchIcon: {
        backgroundColor: COLORS.notificationBlue,
    },
    reminderIcon: {
        backgroundColor: COLORS.notificationOrange,
    },
    paymentIcon: {
        backgroundColor: COLORS.notificationGreen,
    },
    validationIcon: {
        backgroundColor: COLORS.notificationBlue,
    },
    cancelIcon: {
        backgroundColor: COLORS.notificationRed,
    },
    creditIcon: {
        backgroundColor: COLORS.notificationOrange,
    },
    infoIcon: {
        backgroundColor: COLORS.notificationBlue,
    },
    emailIcon: {
        backgroundColor: COLORS.notificationGoogleBlue,
    },
    smsIcon: {
        backgroundColor: COLORS.notificationGoogleGreen,
    },
    pushIcon: {
        backgroundColor: COLORS.notificationGray,
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'column',
        // alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.almostBlack,
        flex: 1,
    },
    unreadNotificationTitle: {
        fontWeight: '700',
        color: COLORS.black,
    },
    notificationMessage: {
        fontSize: 14,
        color: COLORS.darkGray,
        lineHeight: 20,
    },
    notificationDate: {
        fontSize: 12,
        color: COLORS.gray[600],
    },
    separator: {
        height: 8,
    },
    unreadIndicator: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },

});

export default NotificationsScreen; 