import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList, ScreenNavigationProps } from "./types";
import RegisterScreen from "../screens/RegisterScreen";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useAppSelector } from "../store/hooks/hooks";
import { selectDisplayWelcomeScreen } from "../store/slices/appSlice";


const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthNavigator = () => {
    const navigation = useNavigation<ScreenNavigationProps>();
    const displayWelcomeScreen = useAppSelector(selectDisplayWelcomeScreen);

    useEffect(() => {
        if (!displayWelcomeScreen) {
            navigation.navigate('Login');
        }
    }, [displayWelcomeScreen])
    
    return (
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    )
}

export default AuthNavigator;