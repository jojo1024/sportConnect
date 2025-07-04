import React from 'react';
import { ActionButton } from '../ActionButton';

interface PaymentButtonProps {
    acceptedTerms: boolean;
    isProcessing: boolean;
    onPress: () => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
    acceptedTerms,
    isProcessing,
    onPress,
}) => {
    return (
        <ActionButton
            onPress={onPress}
            isLoading={isProcessing}
            disabled={!acceptedTerms}
            title="Payer avec Wave"
            iconName="wave"
            iconType="materialCommunity"
            iconSize={24}
            variant={acceptedTerms ? 'primary' : 'disabled'}
            borderRadius={16}
            fontSize={18}
            paddingHorizontal={20}
            paddingVertical={20}
            position="absolute"
            backgroundColor="white"
        />
    );
}; 