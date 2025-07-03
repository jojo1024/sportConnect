import React from 'react';
import CompactErrorCard from '../CompactErrorCard';
import SuccessCard from '../SuccessCard';

interface ReservationsMessagesProps {
    successMessage: string | null;
    errorMessage: string | null;
    onClearSuccess: () => void;
    onRetry: () => void;
}

export const ReservationsMessages: React.FC<ReservationsMessagesProps> = ({
    successMessage,
    errorMessage,
    onClearSuccess,
    onRetry
}) => {
    return (
        <>
            {successMessage && (
                <SuccessCard
                    message={successMessage}
                    onClose={onClearSuccess}
                />
            )}

            {errorMessage && (
                <CompactErrorCard
                    message={errorMessage}
                    onRetry={onRetry}
                />
            )}
        </>
    );
}; 