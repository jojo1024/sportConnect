import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import AddTerrainScreen from '../screens/manager/AddTerrainScreen';
import TerrainsScreen from '../screens/manager/TerrainsScreen';
import { RootStackParamList } from '../types/navigation';
import { BottomTabs } from './BottomTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MainTabs">
                {() => <BottomTabs userRole="manager" />}
            </Stack.Screen>
            <Stack.Screen name="Terrains" component={TerrainsScreen} />
            <Stack.Screen name="AddTerrain" component={AddTerrainScreen} />
        </Stack.Navigator>

    );
};

export default AppNavigator; 