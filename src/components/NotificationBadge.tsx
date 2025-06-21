import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { notificationService } from '../services/notificationService';
import { useAppDispatch, useAppSelector } from '../store/hooks/hooks';
import { selectNotificationCount, selectUser, setNotificationCount } from '../store/slices/userSlice';
import { COLORS } from '../theme/colors';

interface NotificationBadgeProps {
    size?: number;
    fontSize?: number;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
    size = 18, 
    fontSize = 10 
}) => {
    const dispatch = useAppDispatch();
    const notificationCount = useAppSelector(selectNotificationCount);

    const user = useAppSelector(selectUser);
    const utilisateurId = user?.utilisateurId;
    
    // Référence pour éviter les appels multiples
    const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const loadingRef = useRef(false);

    const loadUnreadCount = async () => {
        if (!utilisateurId || loadingRef.current) return;
        
        try {
            loadingRef.current = true;
            const count = await notificationService.getUnreadNotificationsCount(utilisateurId);
            // setUnreadCount(count);
            dispatch(setNotificationCount(count));
        } catch (error) {
            console.error('Erreur lors du chargement du nombre de notifications non lues:', error);
        } finally {
            loadingRef.current = false;
        }
    };

    useEffect(() => {
        if (utilisateurId) {
            // Charger immédiatement
            loadUnreadCount();

            // Recharger toutes les 2 minutes au lieu de 30 secondes
            intervalRef.current = setInterval(loadUnreadCount, 120000);

            return () => {
                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }
            };
        }
    }, [utilisateurId]);

    // Nettoyer l'intervalle lors du démontage
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    if (notificationCount === 0) {
        return null;
    }

    return (
        <View style={[
            styles.badge,
            {
                width: size,
                height: size,
                borderRadius: size / 2,
            }
        ]}>
            <Text style={[
                styles.badgeText,
                { fontSize }
            ]}>
                {notificationCount > 99 ? '99+' : notificationCount.toString()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -5,
        right: -5,
        minWidth: 18,
        minHeight: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    badgeText: {
        color: COLORS.white,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default NotificationBadge; 