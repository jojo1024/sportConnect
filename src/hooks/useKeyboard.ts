import { useState, useEffect } from 'react';
import { Keyboard, Platform } from 'react-native';

interface KeyboardState {
    keyboardHeight: number;
    isKeyboardVisible: boolean;
    keyboardAnimationDuration: number;
}

export const useKeyboard = (): KeyboardState => {
    const [keyboardState, setKeyboardState] = useState<KeyboardState>({
        keyboardHeight: 0,
        isKeyboardVisible: false,
        keyboardAnimationDuration: 250,
    });

    useEffect(() => {
        const showSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e) => {
                setKeyboardState({
                    keyboardHeight: e.endCoordinates.height,
                    isKeyboardVisible: true,
                    keyboardAnimationDuration: e.duration || 250,
                });
            }
        );

        const hideSubscription = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            (e) => {
                setKeyboardState({
                    keyboardHeight: 0,
                    isKeyboardVisible: false,
                    keyboardAnimationDuration: e.duration || 250,
                });
            }
        );

        return () => {
            showSubscription?.remove();
            hideSubscription?.remove();
        };
    }, []);

    return keyboardState;
};

export default useKeyboard;

