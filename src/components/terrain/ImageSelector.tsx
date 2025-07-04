import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BASE_URL_IMAGES } from '../../services/api';
import { COLORS } from '../../theme/colors';

interface ImageSelectorProps {
    onImageSelect: () => Promise<void>;
    onImageRemove: (index: number) => void;
    selectedImages: string[];
    error?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({
    onImageSelect,
    onImageRemove,
    selectedImages,
    error
}) => (
    <View style={styles.imageSelectorContainer}>
        <FlatList
            data={selectedImages}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={
                selectedImages.length < 5 ? (
                    <TouchableOpacity
                        style={[styles.addImageButton, error && styles.addImageButtonError]}
                        onPress={onImageSelect}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="add" size={32} color={COLORS.primary} />
                        <Text style={styles.addImageText}>Ajouter</Text>
                    </TouchableOpacity>
                ) : null
            }
            renderItem={({ item, index }) => (
                <View style={styles.imageItem}>
                    <Image
                        source={{
                            uri: item?.startsWith("data:image") ? item : `${BASE_URL_IMAGES}/${item}`
                        }}
                        style={styles.selectedImage}
                    />
                    <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => onImageRemove(index)}
                    >
                        <Ionicons name="close-circle" size={24} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            )}
        />
        {selectedImages.length === 0 && (
            <TouchableOpacity
                style={[styles.imageSelector, error && styles.imageSelectorError]}
                onPress={onImageSelect}
                activeOpacity={0.8}
            >
                <View style={styles.imageSelectorContent}>
                    <View style={styles.imageSelectorIcon}>
                        <Ionicons name="camera" size={32} color={COLORS.white} />
                    </View>
                    <Text style={styles.imageSelectorText}>Sélectionner des photos (max 5)</Text>
                </View>
            </TouchableOpacity>
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    imageSelectorContainer: {
        marginBottom: 8,
    },
    imageSelector: {
        backgroundColor: COLORS.gray[100],
        borderRadius: 12,
        marginTop: 10,
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        borderStyle: 'dashed',
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageSelectorError: {
        borderColor: COLORS.danger,
    },
    imageSelectorContent: {
        alignItems: 'center',
    },
    imageSelectorIcon: {
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageSelectorText: {
        color: COLORS.darkGray,
        fontSize: 14,
        fontWeight: '500',
    },
    imageItem: {
        marginRight: 12,
        position: 'relative',
    },
    selectedImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 12,
    },
    addImageButton: {
        width: 80,
        height: 80,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.gray[100],
        marginRight: 12,
    },
    addImageButtonError: {
        borderColor: COLORS.danger,
    },
    addImageText: {
        fontSize: 12,
        color: COLORS.primary,
        marginTop: 4,
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 12,
        marginTop: 4,
        fontWeight: '500',
    },
});

export default ImageSelector; 