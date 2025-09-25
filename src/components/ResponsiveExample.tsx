import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getResponsiveDimensions, getResponsiveFontSize, getFormContainerStyles } from '../utils/responsive';
import { COLORS } from '../theme/colors';

interface ResponsiveExampleProps {
    title: string;
    onPress?: () => void;
}

const ResponsiveExample: React.FC<ResponsiveExampleProps> = ({ title, onPress }) => {
    const { isSmallScreen, isTablet, isLandscape } = getResponsiveDimensions();

    return (
        <View style={[styles.container, getFormContainerStyles()]}>
            <Text style={[
                styles.title,
                { fontSize: getResponsiveFontSize(isTablet ? 24 : 20) }
            ]}>
                {title}
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.infoText}>
                    Écran: {isSmallScreen ? 'Petit' : isTablet ? 'Tablette' : 'Normal'}
                </Text>
                <Text style={styles.infoText}>
                    Orientation: {isLandscape ? 'Paysage' : 'Portrait'}
                </Text>
            </View>

            {onPress && (
                <TouchableOpacity style={styles.button} onPress={onPress}>
                    <Text style={styles.buttonText}>Action</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 20,
        marginVertical: 10,
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.title,
        marginBottom: 12,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 16,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.textLight,
        marginBottom: 4,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: '600',
        fontSize: 16,
    },
});

export default ResponsiveExample;

