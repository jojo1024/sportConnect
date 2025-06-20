import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { PRIMARY_COLOR } from '../../utils/constant';

interface RegisterStepIndicatorProps {
    currentStep: number;
    validateStep: (step: number) => boolean;
}

export default function RegisterStepIndicator({ currentStep, validateStep }: RegisterStepIndicatorProps) {
    return (
        <>
            <Text style={styles.stepInfo}>
                Étape {currentStep} sur 3 - {
                    currentStep === 1 ? 'Informations personnelles' : 
                    currentStep === 2 ? 'Informations complémentaires' : 
                    'Sécurité du compte'
                }
            </Text>

            <View style={styles.stepsContainer}>
                <View style={[
                    styles.stepCircle,
                    currentStep === 1 && styles.stepCircleActive,
                    validateStep(1) && styles.stepCircleComplete
                ]}>
                    <Text style={[
                        styles.stepNumber,
                        currentStep === 1 && styles.stepNumberActive,
                        validateStep(1) && styles.stepNumberComplete
                    ]}>
                        {validateStep(1) ? '✓' : '1'}
                    </Text>
                </View>
                <View style={[
                    styles.stepLine,
                    (currentStep >= 2 || validateStep(1)) && styles.stepLineActive
                ]} />
                <View style={[
                    styles.stepCircle,
                    currentStep === 2 && styles.stepCircleActive,
                    validateStep(2) && styles.stepCircleComplete
                ]}>
                    <Text style={[
                        styles.stepNumber,
                        currentStep === 2 && styles.stepNumberActive,
                        validateStep(2) && styles.stepNumberComplete
                    ]}>
                        {validateStep(2) ? '✓' : '2'}
                    </Text>
                </View>
                <View style={[
                    styles.stepLine,
                    (currentStep === 3 || validateStep(2)) && styles.stepLineActive
                ]} />
                <View style={[
                    styles.stepCircle,
                    currentStep === 3 && styles.stepCircleActive,
                    validateStep(3) && styles.stepCircleComplete
                ]}>
                    <Text style={[
                        styles.stepNumber,
                        currentStep === 3 && styles.stepNumberActive,
                        validateStep(3) && styles.stepNumberComplete
                    ]}>
                        {validateStep(3) ? '✓' : '3'}
                    </Text>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    stepInfo: {
        color: colors.text.secondary,
        fontSize: 14,
        marginBottom: 20,
    },
    stepsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    stepCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#ccc',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    stepCircleActive: {
        borderColor: PRIMARY_COLOR,
        backgroundColor: PRIMARY_COLOR,
    },
    stepCircleComplete: {
        borderColor: PRIMARY_COLOR,
        backgroundColor: PRIMARY_COLOR,
    },
    stepNumber: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ccc',
    },
    stepNumberActive: {
        color: '#fff',
    },
    stepNumberComplete: {
        color: colors.white,
    },
    stepLine: {
        width: 60,
        height: 2,
        backgroundColor: '#ccc',
    },
    stepLineActive: {
        backgroundColor: PRIMARY_COLOR,
    },
}); 