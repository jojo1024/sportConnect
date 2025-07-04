import React, { useRef, useState } from 'react';
import {
    View,
    Image,
    FlatList,
    Dimensions,
    StyleSheet,
} from 'react-native';
import { BASE_URL_IMAGES } from '../services/api';
import { COLORS } from '../theme/colors';

const { width: screenWidth } = Dimensions.get('window');

interface ImageGalleryProps {
    images: string[];
    height?: number;
    showPagination?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    height = 280,
    showPagination = true
}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const imagesFlatListRef = useRef<FlatList>(null);

    const handleImageScroll = (event: any) => {
        const contentOffset = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffset / screenWidth);
        setCurrentImageIndex(index);
    };

    const renderImage = ({ item, index }: { item: string; index: number }) => (
        <Image
            source={{ uri: `${BASE_URL_IMAGES}/${item}` }}
            style={[styles.terrainImage, { height }]}
            resizeMode="cover"
        />
    );

    const displayImages = images && images.length > 0
        ? images
        : ['https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=500'];

    return (
        <View style={[styles.imagesContainer, { height }]}>
            <FlatList
                ref={imagesFlatListRef}
                data={displayImages}
                renderItem={renderImage}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                onMomentumScrollEnd={handleImageScroll}
                style={[styles.imagesScroll, { height }]}
            />

            {showPagination && displayImages.length > 1 && (
                <View style={styles.paginationContainer}>
                    {displayImages.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === currentImageIndex && styles.paginationDotActive
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    imagesContainer: {
        position: 'relative',
    },
    imagesScroll: {
        height: 280,
    },
    terrainImage: {
        width: screenWidth,
        height: 280,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.whiteOverlayLight,
        marginHorizontal: 4,
    },
    paginationDotActive: {
        backgroundColor: '#fff',
        width: 24,
    },
});

export default ImageGallery; 