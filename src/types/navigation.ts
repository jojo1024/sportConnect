import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Profile: undefined;
    Settings: undefined;
};

export type ScreenNavigationProps = NativeStackNavigationProp<RootStackParamList>;

declare global {
    namespace ReactNavigation {
        interface RootParamList extends RootStackParamList {}
    }
} 