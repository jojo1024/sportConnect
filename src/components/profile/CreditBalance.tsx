import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';
import { creditService } from '../../services/creditService';

interface CreditBalanceProps {
    onPress?: () => void;
}

const CreditBalance: React.FC<CreditBalanceProps> = ({ onPress }) => {
    const [solde, setSolde] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadSolde();
    }, []);

    const loadSolde = async () => {
        try {
            setLoading(true);
            setError(null);
            const userSolde = await creditService.getUserSolde();
            setSolde(userSolde);
        } catch (err) {
            console.error('Erreur lors du chargement du solde:', err);
            setError('Erreur de chargement');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <TouchableOpacity style={styles.container} onPress={loadSolde}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="#ff6b6b" />
                <Text style={styles.errorText}>Erreur de chargement</Text>
                <Text style={styles.retryText}>Appuyez pour réessayer</Text>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="wallet" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.content}>
                <Text style={styles.label}>Solde crédits</Text>
                <Text style={styles.amount}>{solde.toFixed(0)} F</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color="#888" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    content: {
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    amount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    errorText: {
        fontSize: 14,
        color: '#ff6b6b',
        marginLeft: 8,
    },
    retryText: {
        fontSize: 12,
        color: '#888',
        marginLeft: 8,
    },
});

export default CreditBalance; 