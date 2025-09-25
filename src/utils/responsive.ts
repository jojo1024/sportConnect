import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone X)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Responsive dimensions
export const getResponsiveDimensions = () => {
    const { width, height } = Dimensions.get('window');
    
    return {
        width,
        height,
        isSmallScreen: height < 700,
        isMediumScreen: height >= 700 && height < 900,
        isLargeScreen: height >= 900,
        isTablet: width > 768,
        isLandscape: width > height,
    };
};

// Responsive font size
export const getResponsiveFontSize = (size: number): number => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;
    
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive width percentage
export const wp = (percentage: number): number => {
    return (SCREEN_WIDTH * percentage) / 100;
};

// Responsive height percentage
export const hp = (percentage: number): number => {
    return (SCREEN_HEIGHT * percentage) / 100;
};

// Responsive padding/margin
export const getResponsiveSpacing = (baseSpacing: number): number => {
    const { isSmallScreen, isTablet } = getResponsiveDimensions();
    
    if (isSmallScreen) {
        return baseSpacing * 0.8;
    }
    
    if (isTablet) {
        return baseSpacing * 1.2;
    }
    
    return baseSpacing;
};

// Safe area padding
export const getSafeAreaPadding = (): {
    paddingTop: number;
    paddingBottom: number;
    paddingHorizontal: number;
} => {
    const { isSmallScreen, isTablet } = getResponsiveDimensions();
    
    return {
        paddingTop: isSmallScreen ? 16 : 20,
        paddingBottom: isSmallScreen ? 16 : 20,
        paddingHorizontal: isTablet ? 32 : 24,
    };
};

// Form container styles
export const getFormContainerStyles = () => {
    const { isSmallScreen, isTablet } = getResponsiveDimensions();
    
    return {
        maxWidth: isTablet ? 500 : 400,
        width: '100%',
        alignSelf: 'center' as const,
        paddingHorizontal: isTablet ? 32 : 24,
        paddingVertical: isSmallScreen ? 16 : 20,
    };
};

// Button styles
export const getButtonStyles = () => {
    const { isSmallScreen } = getResponsiveDimensions();
    
    return {
        minHeight: isSmallScreen ? 44 : 50,
        paddingVertical: isSmallScreen ? 12 : 14,
        paddingHorizontal: isSmallScreen ? 16 : 20,
    };
};

// Input styles
export const getInputStyles = () => {
    const { isSmallScreen } = getResponsiveDimensions();
    
    return {
        minHeight: isSmallScreen ? 44 : 50,
        fontSize: isSmallScreen ? 14 : 16,
        paddingVertical: isSmallScreen ? 10 : 12,
        paddingHorizontal: isSmallScreen ? 12 : 16,
    };
};

export default {
    getResponsiveDimensions,
    getResponsiveFontSize,
    wp,
    hp,
    getResponsiveSpacing,
    getSafeAreaPadding,
    getFormContainerStyles,
    getButtonStyles,
    getInputStyles,
};

