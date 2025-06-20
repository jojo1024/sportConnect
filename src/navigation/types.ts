import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Terrains: undefined;
    AddTerrain: undefined;
}

export interface INavigationProps {
    navigation: any;
    props: any;
    route: any;
}

export type ScreenNavigationProps = NativeStackNavigationProp<RootStackParamList>;

export type ScreenRouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;