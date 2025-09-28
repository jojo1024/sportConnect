import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { Match } from '../services/matchService';
import { Terrain } from '../services/terrainService';

export type RootStackParamList = {
    Welcome: undefined;
    Login: undefined;
    Register: undefined;
    MainTabs: undefined;
    Terrains: undefined;
    AddTerrain: undefined;
    TerrainForm: {
        mode: 'create' | 'edit';
        terrainData?: Terrain;
        onTerrainUpdated?: (updatedTerrain: Terrain) => void;
    };
    TerrainDetails: {
        terrain: Terrain;
    };
    MatchDetails: {
        match: Match;
    };
    MatchSummary: {
        match: Match;
    };
    EditProfile: undefined;
    ProfileOptions: undefined;
    EditPassword: undefined;
    Reservations: {
        terrainId?: number;
    };
    Statistics: {
        terrainId?: number;
    };
}

export interface INavigationProps {
    navigation: any;
    props: any;
    route: any;
}

export type ScreenNavigationProps = NativeStackNavigationProp<RootStackParamList>;

export type ScreenRouteProps<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>;