import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

interface UsePhotoPickerProps {
    onPhotoSelected: (photoUri: string) => void;
}

export const usePhotoPicker = ({ onPhotoSelected }: UsePhotoPickerProps) => {
    const [showPhotoOptions, setShowPhotoOptions] = useState(false);

    const handlePhotoPress = () => {
        console.log('📸 Photo button pressed');
        setShowPhotoOptions(true);
    };

    const closePhotoOptions = () => {
        console.log('📸 Closing photo options');
        setShowPhotoOptions(false);
    };

    const requestPermissions = async () => {
        console.log('📸 Requesting media library permissions...');
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            console.log('📸 Media library permission status:', status);
            if (status !== 'granted') {
                Alert.alert(
                    'Permission refusée',
                    'Nous avons besoin de votre permission pour accéder à votre galerie photos.'
                );
                return false;
            }
        }
        return true;
    };

    const requestCameraPermissions = async () => {
        console.log('📸 Requesting camera permissions...');
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            console.log('📸 Camera permission status:', status);
            if (status !== 'granted') {
                Alert.alert(
                    'Permission refusée',
                    'Nous avons besoin de votre permission pour accéder à votre caméra.'
                );
                return false;
            }
        }
        return true;
    };

    const convertToBase64 = async (uri: string): Promise<string> => {
        try {
            console.log('📸 Converting image to base64...');
            console.log('📸 Image URI:', uri);
            
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            
            console.log('📸 Base64 conversion successful, length:', base64.length);
            const dataUrl = `data:image/jpeg;base64,${base64}`;
            console.log('📸 Data URL created, length:', dataUrl.length);
            
            return dataUrl;
        } catch (error) {
            console.error('📸 Error converting to base64:', error);
            throw new Error('Impossible de convertir l\'image');
        }
    };

    const pickImageFromGallery = async () => {
        console.log('📸 Picking image from gallery...');
        const hasPermission = await requestPermissions();
        if (!hasPermission) {
            console.log('📸 Permission denied for gallery');
            return;
        }

        try {
            console.log('📸 Launching image library...');
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: false,
            });

            console.log('📸 Image picker result:', result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                console.log('📸 Image selected:', result.assets[0]);
                
                const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
                console.log('📸 Image file info:', fileInfo);
                
                if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
                    Alert.alert('Image trop volumineuse', 'Veuillez sélectionner une image de moins de 5MB');
                    return;
                }
                
                const base64Image = await convertToBase64(result.assets[0].uri);
                console.log('📸 Calling onPhotoSelected with base64 image');
                onPhotoSelected(base64Image);
                setShowPhotoOptions(false);
            } else {
                console.log('📸 Image selection canceled or no assets');
            }
        } catch (error) {
            console.error('📸 Error picking image from gallery:', error);
            Alert.alert('Erreur', 'Impossible de sélectionner l\'image: ' + (error as Error).message);
        }
    };

    const takePhoto = async () => {
        console.log('📸 Taking photo with camera...');
        const hasPermission = await requestCameraPermissions();
        if (!hasPermission) {
            console.log('📸 Permission denied for camera');
            return;
        }

        try {
            console.log('📸 Launching camera...');
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
                base64: false,
            });

            console.log('📸 Camera result:', result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                console.log('📸 Photo taken:', result.assets[0]);
                
                const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
                console.log('📸 Photo file info:', fileInfo);
                
                if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
                    Alert.alert('Image trop volumineuse', 'Veuillez prendre une photo de moins de 5MB');
                    return;
                }
                
                const base64Image = await convertToBase64(result.assets[0].uri);
                console.log('📸 Calling onPhotoSelected with base64 image');
                onPhotoSelected(base64Image);
                setShowPhotoOptions(false);
            } else {
                console.log('📸 Photo taking canceled or no assets');
            }
        } catch (error) {
            console.error('📸 Error taking photo:', error);
            Alert.alert('Erreur', 'Impossible de prendre la photo: ' + (error as Error).message);
        }
    };

    return {
        showPhotoOptions,
        handlePhotoPress,
        closePhotoOptions,
        pickImageFromGallery,
        takePhoto,
    };
}; 