import { useState, useCallback } from 'react';

export interface ToastConfig {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    duration?: number;
}

export const useToast = () => {
    const [toastConfig, setToastConfig] = useState<ToastConfig | null>(null);
    const [visible, setVisible] = useState(false);

    const showToast = useCallback((config: ToastConfig) => {
        setToastConfig(config);
        setVisible(true);
    }, []);

    const hideToast = useCallback(() => {
        setVisible(false);
        setToastConfig(null);
    }, []);

    const showError = useCallback((message: string, duration: number = 3000) => {
        showToast({
            message,
            type: 'error',
            duration,
        });
    }, [showToast]);

    const showSuccess = useCallback((message: string, duration: number = 3000) => {
        showToast({
            message,
            type: 'success',
            duration,
        });
    }, [showToast]);

    const showWarning = useCallback((message: string, duration: number = 3000) => {
        showToast({
            message,
            type: 'warning',
            duration,
        });
    }, [showToast]);

    const showInfo = useCallback((message: string, duration: number = 3000) => {
        showToast({
            message,
            type: 'info',
            duration,
        });
    }, [showToast]);

    return {
        toastConfig,
        visible,
        showToast,
        hideToast,
        showError,
        showSuccess,
        showWarning,
        showInfo,
    };
}; 