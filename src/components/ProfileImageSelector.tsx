import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../theme/colors';
import { getUserAvatar } from '../utils/functions';

interface ProfileImageSelectorProps {
    onImageSelect: () => Promise<void>;
    selectedImage?: string;
    error?: string;
}

const ProfileImageSelector: React.FC<ProfileImageSelectorProps> = ({
    onImageSelect,
    selectedImage,
    error
}) => (
    <View style={styles.container}>
        <TouchableOpacity
            style={[styles.imageSelector, error && styles.imageSelectorError]}
            onPress={onImageSelect}
            activeOpacity={0.8}
        >
            {selectedImage ? (
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: selectedImage?.startsWith("data:image")
                                ? selectedImage
                                : getUserAvatar(selectedImage)
                        }}
                        style={styles.profileImage}
                    />
                    <View style={styles.overlay}>
                        <Ionicons name="camera" size={24} color={COLORS.white} />
                        <Text style={styles.overlayText}>Modifier</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.placeholderContainer}>
                    <View style={styles.placeholderIcon}>
                        <Ionicons name="camera" size={32} color={COLORS.white} />
                    </View>
                    <Text style={styles.placeholderText}>Ajouter une photo</Text>
                </View>
            )}
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
);

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 16,
    },
    imageSelector: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.gray[100],
        borderWidth: 2,
        borderColor: COLORS.gray[200],
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    imageSelectorError: {
        borderColor: COLORS.danger,
    },
    imageContainer: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        borderRadius: 60,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 60,
    },
    overlayText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: '500',
        marginTop: 4,
    },
    placeholderContainer: {
        alignItems: 'center',
    },
    placeholderIcon: {
        backgroundColor: COLORS.primary,
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    placeholderText: {
        color: COLORS.darkGray,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    errorText: {
        color: COLORS.danger,
        fontSize: 12,
        marginTop: 8,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default ProfileImageSelector; 