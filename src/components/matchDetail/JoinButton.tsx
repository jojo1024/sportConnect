import React from 'react';
import { ActionButton } from '../ActionButton';

interface JoinButtonProps {
    isMatchFull: boolean;
    isJoining: boolean;
    onPress: () => void;
}

const JoinButton: React.FC<JoinButtonProps> = ({ isMatchFull, isJoining, onPress }) => (
    <ActionButton
        onPress={onPress}
        isLoading={isJoining}
        disabled={isMatchFull}
        title={isMatchFull ? 'Partie complète' : 'Rejoindre la partie'}
        iconName={isMatchFull ? "close-circle" : "add-circle"}
        iconType="ionicons"
        iconSize={20}
        variant={isMatchFull ? 'disabled' : 'primary'}
        borderRadius={10}
        fontSize={16}
        paddingHorizontal={30}
        paddingVertical={20}
        position="absolute"
        backgroundColor="white"
    />
);

export default JoinButton; 