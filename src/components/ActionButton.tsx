import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

interface ActionButtonProps {
    // Propriétés communes
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;

    // Propriétés de contenu
    title: string;
    iconName?: string;
    iconType?: 'ionicons' | 'materialCommunity';
    iconSize?: number;

    // Propriétés de style
    variant?: 'primary' | 'secondary' | 'disabled';
    borderRadius?: number;
    fontSize?: number;
    paddingHorizontal?: number;
    paddingVertical?: number;

    // Propriétés de position
    position?: 'absolute' | 'relative';
    backgroundColor?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
    onPress,
    isLoading = false,
    disabled = false,
    title,
    iconName,
    iconType = 'ionicons',
    iconSize = 20,
    variant = 'primary',
    borderRadius = 10,
    fontSize = 16,
    paddingHorizontal = 30,
    paddingVertical = 20,
    position = 'absolute',
    backgroundColor = COLORS.white,
}) => {
    // Déterminer les couleurs du gradient selon le variant
    const getGradientColors = () => {
        switch (variant) {
            case 'primary':
                return [COLORS.primary, COLORS.primary];
            case 'secondary':
                return [COLORS.mediumGray, COLORS.lightGray];
            case 'disabled':
                return [COLORS.mediumGray, COLORS.lightGray];
            default:
                return [COLORS.primary, COLORS.primary];
        }
    };

    // Déterminer si le bouton est désactivé
    const isButtonDisabled = disabled || isLoading;

    // Rendu de l'icône
    const renderIcon = () => {
        if (!iconName) return null;

        const iconProps = {
            name: iconName,
            size: iconSize,
            color: COLORS.white,
        };

        if (iconType === 'materialCommunity') {
            return <MaterialCommunityIcons {...iconProps} />;
        }

        return <Ionicons {...iconProps} />;
    };

    return (
        <View style={[
            styles.container,
            position === 'absolute' && styles.absoluteContainer,
            {
                backgroundColor,
                paddingHorizontal,
                paddingVertical,
            }
        ]}>
            <LinearGradient
                colors={getGradientColors()}
                style={[
                    styles.gradient,
                    { borderRadius }
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
            >
                <TouchableOpacity
                    style={styles.button}
                    onPress={onPress}
                    disabled={isButtonDisabled}
                    activeOpacity={0.85}
                >
                    {isLoading ? (
                        <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                        <>
                            {renderIcon()}
                            <Text style={[
                                styles.buttonText,
                                {
                                    fontSize,
                                    marginLeft: iconName ? 10 : 0,
                                }
                            ]}>
                                {title}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderTopWidth: 1,
        borderTopColor: COLORS.gray[200],
        shadowColor: COLORS.shadow,
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 8,
    },
    absoluteContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    gradient: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    button: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
}); 