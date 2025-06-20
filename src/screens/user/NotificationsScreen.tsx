import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator, RefreshControl } from 'react-native';
import { MaterialIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { PRIMARY_COLOR } from '../../utils/constant';
import { useNotification } from '../../hooks/useNotification';
import { Notification } from '../../services/notificationService';

function getIcon(type: string) {
    switch (type) {
        case 'match':
            return <FontAwesome5 name="futbol" size={24} color="#007b83" />;
        case 'reminder':
            return <Ionicons name="alarm-outline" size={24} color="#f5a623" />;
        case 'payment':
            return <MaterialIcons name="payment" size={24} color="#4caf50" />;
        case 'validation':
            return <MaterialIcons name="check-circle" size={24} color="#007b83" />;
        case 'cancel':
            return <MaterialIcons name="cancel" size={24} color="#e74c3c" />;
        case 'credit':
            return <FontAwesome5 name="coins" size={22} color="#f5a623" />;
        case 'info':
            return <Ionicons name="information-circle-outline" size={24} color="#007b83" />;
        case 'email':
            return <MaterialIcons name="email" size={24} color="#4285F4" />;
        case 'sms':
            return <MaterialIcons name="sms" size={24} color="#34A853" />;
        case 'push':
        default:
            return <Ionicons name="notifications-outline" size={24} color="#888" />;
    }
}

const getNotificationType = (title: string, content: string): string => {
    const lowerTitle = title.toLowerCase();
    const lowerContent = content.toLowerCase();

    if (lowerTitle.includes('partie') || lowerTitle.includes('match') || lowerContent.includes('partie') || lowerContent.includes('match')) {
        return 'match';
    } else if (lowerTitle.includes('rappel') || lowerContent.includes('commence dans')) {
        return 'reminder';
    } else if (lowerTitle.includes('paiement') || lowerContent.includes('paiement') || lowerContent.includes('payé')) {
        return 'payment';
    } else if (lowerTitle.includes('validé') || lowerTitle.includes('confirmé') || lowerContent.includes('validé') || lowerContent.includes('confirmé')) {
        return 'validation';
    } else if (lowerTitle.includes('annulé') || lowerContent.includes('annulé')) {
        return 'cancel';
    } else if (lowerTitle.includes('remboursé') || lowerTitle.includes('crédit') || lowerContent.includes('remboursé') || lowerContent.includes('crédit')) {
        return 'credit';
    } else if (lowerTitle.includes('terrain') || lowerContent.includes('terrain')) {
        return 'info';
    } else {
        return 'push';
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) {
        return 'À l\'instant';
    } else if (diffInHours < 24) {
        return `Il y a ${diffInHours}h`;
    } else if (diffInHours < 48) {
        return 'Hier';
    } else {
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
};

type NotificationType = 'match' | 'reminder' | 'payment' | 'validation' | 'cancel' | 'credit' | 'info' | 'email' | 'sms' | 'push';

interface Styles {
    container: ViewStyle;
    header: ViewStyle;
    title: TextStyle;
    filterButton: ViewStyle;
    listContent: ViewStyle;
    notificationItem: ViewStyle;
    unreadNotificationItem: ViewStyle;
    iconContainer: ViewStyle;
    notificationContent: ViewStyle;
    notificationHeader: ViewStyle;
    notificationTitle: TextStyle;
    unreadNotificationTitle: TextStyle;
    notificationMessage: TextStyle;
    notificationDate: TextStyle;
    separator: ViewStyle;
    matchIcon: ViewStyle;
    reminderIcon: ViewStyle;
    paymentIcon: ViewStyle;
    validationIcon: ViewStyle;
    cancelIcon: ViewStyle;
    creditIcon: ViewStyle;
    infoIcon: ViewStyle;
    emailIcon: ViewStyle;
    smsIcon: ViewStyle;
    pushIcon: ViewStyle;
    loadingFooter: ViewStyle;
    loadingText: TextStyle;
    errorContainer: ViewStyle;
    errorText: TextStyle;
    retryText: TextStyle;
    unreadIndicator: ViewStyle;
}

const NotificationsScreen: React.FC = () => {
    const {
        notifications,
        isLoading,
        error,
        hasMoreData,
        loadMoreData,
        refreshData,
        markAsRead
    } = useNotification();

    const renderFooter = () => {
        if (!isLoading) return null;

        return (
            <View style={styles.loadingFooter}>
                <ActivityIndicator size="small" color={PRIMARY_COLOR} />
                <Text style={styles.loadingText}>Chargement...</Text>
            </View>
        );
    };

    const handleEndReached = () => {
        if (hasMoreData && !isLoading) {
            loadMoreData();
        }
    };

    const handleRefresh = useCallback(() => {
        refreshData();
    }, [refreshData]);

    const handleNotificationPress = useCallback(async (notification: Notification) => {
        if (!notification.notificationLue) {
            try {
                await markAsRead(notification.notificationId);
            } catch (error) {
                console.error('Erreur lors du marquage comme lu:', error);
            }
        }
    }, [markAsRead]);

    // Afficher l'erreur si elle existe
    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Erreur: {error}</Text>
                <Text style={styles.retryText} onPress={refreshData}>
                    Réessayer
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Notifications</Text>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="filter" size={24} color={PRIMARY_COLOR} />
                </TouchableOpacity>
            </View>
            <FlatList
                data={notifications}
                keyExtractor={(item) => item.notificationId.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoading && notifications.length === 0}
                        onRefresh={handleRefresh}
                        colors={[PRIMARY_COLOR]}
                    />
                }
                renderItem={({ item }) => {
                    const notificationType = getNotificationType(item.notificationTitre, item.notificationContenu);
                    const isUnread = !item.notificationLue;

                    return (
                        <TouchableOpacity
                            style={[
                                styles.notificationItem,
                                isUnread && styles.unreadNotificationItem
                            ]}
                            onPress={() => handleNotificationPress(item)}
                        >
                            <View style={[styles.iconContainer, styles[`${notificationType}Icon` as keyof typeof styles]]}>
                                {getIcon(notificationType)}
                            </View>
                            <View style={styles.notificationContent}>
                                <View style={styles.notificationHeader}>
                                    <Text style={[
                                        styles.notificationTitle,
                                        isUnread && styles.unreadNotificationTitle
                                    ]}>
                                        {item.notificationTitre}
                                    </Text>
                                    <Text style={styles.notificationDate}>{formatDate(item.notificationDate)}</Text>
                                </View>
                                <Text style={styles.notificationMessage}>{item.notificationContenu}</Text>
                            </View>
                            {isUnread && <View style={styles.unreadIndicator} />}
                        </TouchableOpacity>
                    );
                }}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.1}
                ListFooterComponent={renderFooter}
            />
            <View style={{ height: 50 }}></View>
        </View>
    );
};

const styles = StyleSheet.create<Styles>({
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
        fontSize: 24,
        fontWeight: '700',
        color: '#1a1a1a',
    },
    filterButton: {
        padding: 8,
    },
    listContent: {
        padding: 16,
    },
    notificationItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 6,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        position: 'relative',
    },
    unreadNotificationItem: {
        backgroundColor: '#f8fbff',
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_COLOR,
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
        backgroundColor: 'rgba(0, 123, 131, 0.1)',
    },
    reminderIcon: {
        backgroundColor: 'rgba(245, 166, 35, 0.1)',
    },
    paymentIcon: {
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
    },
    validationIcon: {
        backgroundColor: 'rgba(0, 123, 131, 0.1)',
    },
    cancelIcon: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
    },
    creditIcon: {
        backgroundColor: 'rgba(245, 166, 35, 0.1)',
    },
    infoIcon: {
        backgroundColor: 'rgba(0, 123, 131, 0.1)',
    },
    emailIcon: {
        backgroundColor: 'rgba(66, 133, 244, 0.1)',
    },
    smsIcon: {
        backgroundColor: 'rgba(52, 168, 83, 0.1)',
    },
    pushIcon: {
        backgroundColor: 'rgba(136, 136, 136, 0.1)',
    },
    notificationContent: {
        flex: 1,
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    notificationTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        flex: 1,
    },
    unreadNotificationTitle: {
        fontWeight: '700',
        color: '#000',
    },
    notificationMessage: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    notificationDate: {
        fontSize: 12,
        color: '#888',
        marginLeft: 8,
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
        backgroundColor: PRIMARY_COLOR,
    },
    loadingFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        marginBottom: 20,
    },
    retryText: {
        fontSize: 16,
        color: PRIMARY_COLOR,
        textDecorationLine: 'underline',
    },
});

export default NotificationsScreen; 