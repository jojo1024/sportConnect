import { NavigationContainer, useNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, Platform, View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useRef } from "react";
import { COLORS } from "../theme/colors";
import LoginScreen from "../screens/LoginScreen";
import TerrainFormScreen from "../screens/manager/TerrainFormScreen";
import TerrainsScreen from "../screens/manager/TerrainsScreen";
import TerrainDetailsScreen from "../screens/manager/TerrainDetailsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import ProfileSelectionScreen from "../screens/ProfileSelectionScreen";
import MatchDetailsScreen from "../screens/user/MatchDetailsScreen";
import MatchSummaryScreen from "../screens/user/MatchSummaryScreen";
import EditProfileScreen from "../screens/user/EditProfileScreen";
import ProfileOptionsScreen from "../screens/user/ProfileOptionsScreen";
import EditPasswordScreen from "../screens/user/EditPasswordScreen";
import { useAppSelector, useAuthInitialization } from "../store/hooks/hooks";
import { selectIsAuthenticated, selectUser } from "../store/slices/userSlice";
import { selectSelectedProfileMode } from "../store/slices/appSlice";
import { BottomTabs } from "./BottomTabs";
import { RootStackParamList } from "./types";
import { ReservationsScreen, StatisticsScreen } from "../screens/manager";

const RootNavigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const navigationRef = useNavigationContainerRef<RootStackParamList>();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const userRole = useAppSelector(selectUser)?.utilisateurRole || 'lambda';
    const selectedProfileMode = useAppSelector(selectSelectedProfileMode);
    const hasNavigatedRef = useRef(false);
    const isNavigationReadyRef = useRef(false);

    // Initialiser l'authentification
    useAuthInitialization();

    // Gérer la navigation initiale après la rehydratation
    useEffect(() => {
        if (!isNavigationReadyRef.current || hasNavigatedRef.current) return;

        if (isAuthenticated) {
            hasNavigatedRef.current = true;
            navigationRef.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        } else if (selectedProfileMode) {
            hasNavigatedRef.current = true;
            navigationRef.reset({
                index: 0,
                routes: [{ name: 'MainTabs' }],
            });
        }
    }, [isAuthenticated, selectedProfileMode]);

    // Déterminer l'écran initial
    const getInitialRoute = () => {
        if (isAuthenticated) {
            return "MainTabs";
        }
        // Si non authentifié et pas de profil sélectionné, afficher la sélection de profil
        if (!selectedProfileMode) {
            return "ProfileSelection";
        }
        // Si profil sélectionné mais non authentifié, aller aux tabs
        return "MainTabs";
    };

    return (
        <SafeAreaProvider  >
            <NavigationContainer 
                ref={navigationRef}
                onReady={() => {
                    isNavigationReadyRef.current = true;
                }}
            >
                <SafeAreaView style={styles.container}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'android' ? COLORS.primary : undefined}
                        barStyle="light-content"
                    />
                    {Platform.OS === 'ios' && <View style={styles.iosStatusBarBackground} />}
                    <Stack.Navigator
                        initialRouteName={getInitialRoute()}
                        screenOptions={{ headerShown: false }}
                    >
                        {/* Écran de sélection de profil - accessible uniquement si non authentifié et pas de profil sélectionné */}
                        {!isAuthenticated && !selectedProfileMode && (
                            <Stack.Screen
                                name="ProfileSelection"
                                component={ProfileSelectionScreen}
                                options={{
                                    gestureEnabled: false,
                                    headerLeft: () => null,
                                }}
                            />
                        )}

                        {/* Écrans d'authentification - toujours accessibles */}
                        <Stack.Screen name="Welcome" component={WelcomeScreen} />
                        <Stack.Screen
                            name="Login"
                            component={LoginScreen}
                            options={{
                                gestureEnabled: false,
                                headerLeft: () => null,
                            }}
                        />
                        <Stack.Screen
                            name="Register"
                            component={RegisterScreen}
                            options={{
                                gestureEnabled: false,
                                headerLeft: () => null,
                            }}
                        />

                        {/* Écrans principaux - toujours accessibles, la gestion de l'accès se fait dans les écrans individuels */}
                        <Stack.Screen name="MainTabs">
                            {() => <BottomTabs userRole={isAuthenticated ? userRole : (selectedProfileMode || 'lambda')} />}
                        </Stack.Screen>
                        {/* MatchDetails accessible sans auth pour consultation */}
                        <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />

                        {/* Écrans nécessitant authentification */}
                        {isAuthenticated && (
                            <>
                                <Stack.Screen name="Terrains" component={TerrainsScreen} />
                                <Stack.Screen name="TerrainForm" component={TerrainFormScreen} />
                                <Stack.Screen name="TerrainDetails" component={TerrainDetailsScreen} />
                                <Stack.Screen name="MatchSummary" component={MatchSummaryScreen} />
                                <Stack.Screen name="ProfileOptions" component={ProfileOptionsScreen} />
                                <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                                <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
                                <Stack.Screen name="Reservations" component={ReservationsScreen} />
                                <Stack.Screen name="Statistics" component={StatisticsScreen} />
                            </>
                        )}
                    </Stack.Navigator>
                </SafeAreaView>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default RootNavigator;

const styles = StyleSheet.create({
    iosStatusBarBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: Platform.OS === 'ios' ? 44 : 0, // Hauteur de la status bar iOS
        backgroundColor: COLORS.white,
        zIndex: 1000,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});