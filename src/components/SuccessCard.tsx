import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface SuccessCardProps {
    message: string;
    onClose?: () => void;
    autoClose?: boolean;
    autoCloseDelay?: number;
    style?: any;
}

const SuccessCard: React.FC<SuccessCardProps> = ({
    message,
    onClose,
    autoClose = true,
    autoCloseDelay = 3000,
    style
}) => {
    const [isVisible, setIsVisible] = useState(true);
    const fadeAnim = new Animated.Value(1);

    useEffect(() => {
        if (autoClose) {
            const timer = setTimeout(() => {
                handleClose();
            }, autoCloseDelay);

            return () => clearTimeout(timer);
        }
    }, [autoClose, autoCloseDelay]);

    const handleClose = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsVisible(false);
            onClose?.();
        });
    };

    if (!isVisible) {
        return null;
    }

    return (
        <Animated.View
            style={[
                styles.container,
                style,
                { opacity: fadeAnim }
            ]}
        >
            <View style={styles.card}>
                {/* Icône de succès */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="checkmark-circle"
                        size={28}
                        color={COLORS.white}
                    />
                </View>

                {/* Message de succès */}
                <View style={styles.messageContainer}>
                    <Text style={styles.successText}>
                        {message}
                    </Text>
                </View>

                {/* Bouton de fermeture */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={handleClose}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="close"
                        size={18}
                        color={COLORS.white}
                    />
                </TouchableOpacity>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.successGreen,
        borderRadius: 8,
        padding: 12,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        marginRight: 10,
    },
    messageContainer: {
        flex: 1,
    },
    successText: {
        fontSize: 14,
        color: COLORS.white,
        fontWeight: '500',
        lineHeight: 18,
    },
    closeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});

export default SuccessCard; 