import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';

type IconType = 'material' | 'ionicons' | 'fontawesome';

interface CustomOutlineButtonProps {
    onPress: () => void;
    title: string;
    iconName: string;
    iconType?: IconType;
    iconSize?: number;
    iconColor?: string;
    textColor?: string;
    borderColor?: string;
    backgroundColor?: string;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    paddingHorizontal?: number;
    paddingVertical?: number;
    borderRadius?: number;
}

const CustomOutlineButton: React.FC<CustomOutlineButtonProps> = ({
    onPress,
    title,
    iconName,
    iconType = 'material',
    iconSize = 18,
    iconColor = COLORS.primary,
    textColor = COLORS.primary,
    borderColor = COLORS.primary,
    backgroundColor = '#fff',
    disabled = false,
    style,
    textStyle,
    paddingHorizontal = 16,
    paddingVertical = 8,
    borderRadius = 20,
}) => {
    const renderIcon = () => {
        const iconProps = {
            name: iconName as any,
            size: iconSize,
            color: iconColor,
        };

        switch (iconType) {
            case 'ionicons':
                return <Ionicons {...iconProps} />;
            case 'fontawesome':
                return <FontAwesome5 {...iconProps} />;
            default:
                return <MaterialIcons {...iconProps} />;
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                {
                    borderColor: disabled ? COLORS.gray[400] : borderColor,
                    backgroundColor: disabled ? COLORS.gray[100] : backgroundColor,
                    paddingHorizontal,
                    paddingVertical,
                    borderRadius,
                },
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
        >
            {renderIcon()}
            <Text
                style={[
                    styles.buttonText,
                    {
                        color: disabled ? COLORS.gray[400] : textColor,
                        marginLeft: 6,
                    },
                    textStyle,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonText: {
        fontWeight: 'bold',
    },
});

export default CustomOutlineButton; 