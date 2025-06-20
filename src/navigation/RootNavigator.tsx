import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import LoginScreen from "../screens/LoginScreen";
import AddTerrainScreen from "../screens/manager/AddTerrainScreen";
import TerrainsScreen from "../screens/manager/TerrainsScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { BottomTabs } from "./BottomTabs";
import { RootStackParamList } from "./types";
import { StatusBar } from "react-native";
import { PRIMARY_COLOR } from "../utils/constant";
import { RootState } from "../store";
import { useAuthInitialization } from "../store/hooks/hooks";

const RootNavigator = () => {
    const Stack = createNativeStackNavigator<RootStackParamList>();
    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
    const user = useSelector((state: RootState) => state.user.user);

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
                        </>
                    )}
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default RootNavigator;