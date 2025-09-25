import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { COLORS } from "../theme/colors";
import LoginScreen from "../screens/LoginScreen";
import TerrainFormScreen from "../screens/manager/TerrainFormScreen";
import TerrainsScreen from "../screens/manager/TerrainsScreen";
import TerrainDetailsScreen from "../screens/manager/TerrainDetailsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import MatchDetailsScreen from "../screens/user/MatchDetailsScreen";
import MatchSummaryScreen from "../screens/user/MatchSummaryScreen";
import EditProfileScreen from "../screens/user/EditProfileScreen";
import ProfileOptionsScreen from "../screens/user/ProfileOptionsScreen";
import EditPasswordScreen from "../screens/user/EditPasswordScreen";
import { useAppSelector, useAuthInitialization } from "../store/hooks/hooks";
import { selectIsAuthenticated, selectUser, selectEffectiveRole } from "../store/slices/userSlice";
import { BottomTabs } from "./BottomTabs";
import { RootStackParamList } from "./types";
import { ReservationsScreen, StatisticsScreen } from "../screens/manager";

const RootNavigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);
    const effectiveRole = useAppSelector(selectEffectiveRole);

    // Initialiser l'authentification
    useAuthInitialization();

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar
                    backgroundColor={Platform.OS === 'android' ? COLORS.primary : undefined}
                    barStyle="light-content"
                />
                <Stack.Navigator
                    initialRouteName={isAuthenticated ? "MainTabs" : "Welcome"}
                    screenOptions={{ headerShown: false }}
                >
                    {!isAuthenticated ? (
                        // Écrans d'authentification
                        <>
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
                        </>
                    ) : (
                        // Écrans principaux
                        <>
                            <Stack.Screen name="MainTabs">
                                {() => <BottomTabs userRole={effectiveRole} />}
                            </Stack.Screen>
                            <Stack.Screen name="Terrains" component={TerrainsScreen} />
                            <Stack.Screen name="TerrainForm" component={TerrainFormScreen} />
                            <Stack.Screen name="TerrainDetails" component={TerrainDetailsScreen} />
                            <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
                            <Stack.Screen name="MatchSummary" component={MatchSummaryScreen} />
                            <Stack.Screen name="ProfileOptions" component={ProfileOptionsScreen} />
                            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                            <Stack.Screen name="EditPassword" component={EditPasswordScreen} />
                            <Stack.Screen name="Reservations" component={ReservationsScreen} />
                            <Stack.Screen name="Statistics" component={StatisticsScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default RootNavigator;