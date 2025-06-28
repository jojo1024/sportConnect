import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "../screens/LoginScreen";
import AddTerrainScreen from "../screens/manager/AddTerrainScreen";
import TerrainsScreen from "../screens/manager/TerrainsScreen";
import TerrainDetailsScreen from "../screens/manager/TerrainDetailsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import MatchDetailsScreen from "../screens/user/MatchDetailsScreen";
import MatchSummaryScreen from "../screens/user/MatchSummaryScreen";
import { useAppSelector, useAuthInitialization } from "../store/hooks/hooks";
import { selectIsAuthenticated, selectUser } from "../store/slices/userSlice";
import { BottomTabs } from "./BottomTabs";
import { RootStackParamList } from "./types";

const RootNavigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const user = useAppSelector(selectUser);

    // Initialiser l'authentification
    useAuthInitialization();

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <StatusBar backgroundColor={"#fff"} barStyle={"dark-content"} />
                <Stack.Navigator
                    initialRouteName={isAuthenticated ? "MainTabs" : "Welcome"}
                    screenOptions={{ headerShown: false }}
                >
                    {!isAuthenticated ? (
                        // Écrans d'authentification
                        <>
                            <Stack.Screen name="Welcome" component={WelcomeScreen} />
                            <Stack.Screen name="Login" component={LoginScreen} />
                            <Stack.Screen name="Register" component={RegisterScreen} />
                        </>
                    ) : (
                        // Écrans principaux
                        <>
                            <Stack.Screen name="MainTabs">
                                {() => <BottomTabs userRole={user?.utilisateurRole || "lambda"} />}
                            </Stack.Screen>
                            <Stack.Screen name="Terrains" component={TerrainsScreen} />
                            <Stack.Screen name="AddTerrain" component={AddTerrainScreen} />
                            <Stack.Screen name="TerrainDetails" component={TerrainDetailsScreen} />
                            <Stack.Screen name="MatchDetails" component={MatchDetailsScreen} />
                            <Stack.Screen name="MatchSummary" component={MatchSummaryScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default RootNavigator;