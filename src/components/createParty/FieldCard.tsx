import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../theme/colors';
import { Field } from '../../hooks/useCreateParty';

interface FieldCardProps {
    field: Field;
    isSelected: boolean;
    onSelect: (field: Field) => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({ field, isSelected, onSelect }) => (
    <TouchableOpacity
        style={[styles.fieldCard, isSelected && styles.fieldCardSelected]}
        onPress={() => onSelect(field)}
    >
        <Image source={{ uri: field.image }} style={styles.fieldImage} />
        <View style={styles.fieldInfo}>
            <View style={styles.fieldHeader}>
                <Text style={styles.fieldName}>{field.name}</Text>
                {isSelected && (
                    <View style={styles.selectedIndicator}>
                        <Text style={styles.selectedIndicatorText}>✓</Text>
                    </View>
                )}
            </View>
            <Text style={styles.fieldLocation}>{field.location}</Text>
            <View style={styles.fieldDetails}>
                <Text style={styles.fieldSchedule}>Horaires: 11:00 - 12:00</Text>
                {/* <Text style={styles.fieldPrice}>{field.pricePerHour} XOF/heure</Text> */}
            </View>
            <View style={styles.fieldDetails}>
                <Text style={styles.fieldSchedule}>.</Text>
                <Text style={styles.fieldPrice}>{field.pricePerHour} XOF/heure</Text>
            </View>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    fieldCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    fieldCardSelected: {
        borderColor: COLORS.primary,
    },
    fieldImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    fieldInfo: {
        flex: 1,
        padding: 12,
    },
    fieldName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    fieldLocation: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    fieldDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    fieldSchedule: {
        fontSize: 12,
        color: '#666',
    },
    fieldPrice: {
        fontSize: 12,
        color: COLORS.primary,
        fontWeight: '600',
    },
    fieldHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    selectedIndicator: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedIndicatorText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 