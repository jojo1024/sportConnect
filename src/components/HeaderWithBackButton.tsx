import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../theme/colors';

interface HeaderWithBackButtonProps {
    onBack: () => void;
    title?: string;
    rightComponent?: React.ReactNode;
    showGradient?: boolean;
}

const HeaderWithBackButton: React.FC<HeaderWithBackButtonProps> = ({
    onBack,
    title,
    rightComponent,
    showGradient = true
}) => {
    const HeaderContent = () => (
        <View style={styles.header}>
            <TouchableOpacity
                style={styles.backButton}
                onPress={onBack}
            >
                <View style={styles.backButtonInner}>
                    <Ionicons name="arrow-back" size={20} color={COLORS.white} />
                </View>
            </TouchableOpacity>

            {title && (
                <Text style={styles.headerTitle}>{title}</Text>
            )}

            {rightComponent ? (
                rightComponent
            ) : (
                <View style={styles.placeholder} />
            )}
        </View>
    );

    if (showGradient) {
        return (
            <LinearGradient
                colors={['rgba(0,0,0,0.7)', 'transparent']}
                style={styles.headerGradient}
            >
                <HeaderContent />
            </LinearGradient>
        );
    }

    return <HeaderContent />;
};

const styles = StyleSheet.create({
    headerGradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        paddingTop: 30,
        paddingBottom: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        padding: 5,
    },
    backButtonInner: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 20,
        padding: 8,
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.white,
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    placeholder: {
        width: 36,
    },
});

export default HeaderWithBackButton; 