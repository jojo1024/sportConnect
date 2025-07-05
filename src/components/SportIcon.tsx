import React from 'react';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getSportIcon } from '../utils/constant';

interface SportIconProps {
    sportIcone: string;
    size?: number;
    color?: string;
    style?: any;
}

const SportIcon: React.FC<SportIconProps> = ({
    sportIcone,
    size = 24,
    color = '#666',
    style
}) => {
    const iconConfig = getSportIcon(sportIcone);

    if (iconConfig.library === 'Ionicons') {
        return (
            <Ionicons
                name={iconConfig.name as any}
                size={size}
                color={color}
                style={style}
            />
        );
    } else {
        return (
            <MaterialCommunityIcons
                name={iconConfig.name as any}
                size={size}
                color={color}
                style={style}
            />
        );
    }
};

export default SportIcon; 