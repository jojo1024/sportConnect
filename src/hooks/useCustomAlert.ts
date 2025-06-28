import { useState, useCallback } from 'react';

export interface AlertConfig {
    title: string;
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    confirmText?: string;
    cancelText?: string;
    showCancel?: boolean;
    autoClose?: boolean;
    autoCloseDelay?: number;
    onConfirm?: () => void;
    onCancel?: () => void;
}

export const useCustomAlert = () => {
    const [alertConfig, setAlertConfig] = useState<AlertConfig | null>(null);

    const showAlert = useCallback((config: AlertConfig) => {
        setAlertConfig(config);
    }, []);

    const hideAlert = useCallback(() => {
        setAlertConfig(null);
    }, []);

    const showSuccess = useCallback((title: string, message: string, onConfirm?: () => void) => {
        showAlert({
            title,
            message,
            type: 'success',
            confirmText: 'OK',
            onConfirm: () => {
                hideAlert();
                onConfirm?.();
            },
        });
    }, [showAlert, hideAlert]);

    const showError = useCallback((title: string, message: string, onConfirm?: () => void) => {
        showAlert({
            title,
            message,
            type: 'error',
            confirmText: 'OK',
            onConfirm: () => {
                hideAlert();
                onConfirm?.();
            },
        });
    }, [showAlert, hideAlert]);

    const showWarning = useCallback((title: string, message: string, onConfirm?: () => void) => {
        showAlert({
            title,
            message,
            type: 'warning',
            confirmText: 'OK',
            onConfirm: () => {
                hideAlert();
                onConfirm?.();
            },
        });
    }, [showAlert, hideAlert]);

    const showInfo = useCallback((title: string, message: string, onConfirm?: () => void) => {
        showAlert({
            title,
            message,
            type: 'info',
            confirmText: 'OK',
            onConfirm: () => {
                hideAlert();
                onConfirm?.();
            },
        });
    }, [showAlert, hideAlert]);

    const showConfirmation = useCallback((
        title: string, 
        message: string, 
        onConfirm?: () => void, 
        onCancel?: () => void,
        confirmText = 'Confirmer',
        cancelText = 'Annuler'
    ) => {
        showAlert({
            title,
            message,
            type: 'warning',
            confirmText,
            cancelText,
            showCancel: true,
            onConfirm: () => {
                hideAlert();
                onConfirm?.();
            },
            onCancel: () => {
                hideAlert();
                onCancel?.();
            },
        });
    }, [showAlert, hideAlert]);

    const showAutoClose = useCallback((
        title: string, 
        message: string, 
        type: 'success' | 'error' | 'warning' | 'info' = 'info',
        delay = 3000
    ) => {
        showAlert({
            title,
            message,
            type,
            confirmText: 'OK',
            autoClose: true,
            autoCloseDelay: delay,
            onConfirm: () => {
                hideAlert();
            },
        });
    }, [showAlert, hideAlert]);

    return {
        alertConfig,
        showAlert,
        hideAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showConfirmation,
        showAutoClose,
    };
}; 