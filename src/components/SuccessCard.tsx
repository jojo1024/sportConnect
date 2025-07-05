import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
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
    style
}) => {
    const [isVisible, setIsVisible] = useState(true);



    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <View style={[styles.container, style]}>
            <View style={styles.card}>
                {/* Icône de succès */}
                <View style={styles.iconContainer}>
                    <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={COLORS.success}
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
                        size={16}
                        color={COLORS.darkGray}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.successGreen,
        borderWidth: 1,
        borderColor: COLORS.successGreen,
        borderRadius: 12,
        padding: 16,
        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 12,
    },
    messageContainer: {
        flex: 1,
    },
    successText: {
        fontSize: 14,
        color: COLORS.white,
        fontWeight: '500',
        lineHeight: 20,
    },
    closeButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.gray[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
});

export default SuccessCard; 