import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const LoadingFooter = ({ loading }: { loading: boolean }) => {
    if (!loading) return null;

    return (
        <View style={styles.loadingFooter}>
            <ActivityIndicator size="small" color="#FF5A1F" />
            <Text style={styles.loadingFooterText}>Chargement...</Text>
        </View>
    );
};

export default LoadingFooter;

const styles = StyleSheet.create({
    loadingFooter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
    },
    loadingFooterText: {
        marginLeft: 8,
        color: '#666',
        fontSize: 14,
    },
});