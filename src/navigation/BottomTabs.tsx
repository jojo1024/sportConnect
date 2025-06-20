import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Import des écrans
import { TchinTchinsScreen, NotificationsScreen, ProfileScreen } from '../screens/user';
import { CreatePartyScreen, TchinTchinsCapoScreen, NotificationsCapoScreen, ProfileCapoScreen } from '../screens/capo';
import { TerrainsScreen, ReservationsScreen, StatisticsScreen, SettingsScreen } from '../screens/manager';
import { useTheme } from '@react-navigation/native';
import { PRIMARY_COLOR } from '../utils/constant';
import { useSelector } from 'react-redux';
import NotificationBadge from '../components/NotificationBadge';

const Tab = createBottomTabNavigator();

type UserRole = 'standard' | 'capo' | 'manager';

interface BottomTabsProps {
    userRole: UserRole;
}

export const BottomTabs: React.FC<BottomTabsProps> = () => {

    const theme = useTheme();
    const userRole: string = 'standard';
    console.log("🚀 ~ userRole:", userRole)
    // const userRole = 'standard';
    const getTabScreens = () => {
        switch (userRole) {
            case 'standard':
                return (
                    <>
                        <Tab.Screen
                            name="TchinTchins"
                            component={TchinTchinsScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="football-outline" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Notifications"
                            component={NotificationsScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <View>
                                        <Ionicons name="notifications-outline" size={size} color={color} />
                                        <NotificationBadge size={16} fontSize={8} />
                                    </View>
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profil"
                            component={ProfileScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="person-outline" size={size} color={color} />
                                ),
                            }}
                        />
                    </>
                );

            case 'capo':
                return (
                    <>
                        <Tab.Screen
                            name="TchinTchins"
                            component={TchinTchinsCapoScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="football-outline" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Créer"
                            component={CreatePartyScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="add-circle-outline" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Notifications"
                            component={NotificationsCapoScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <View>
                                        <Ionicons name="notifications-outline" size={size} color={color} />
                                        <NotificationBadge size={16} fontSize={8} />
                                    </View>
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Profil"
                            component={ProfileCapoScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="person-outline" size={size} color={color} />
                                ),
                            }}
                        />
                    </>
                );

            case 'manager':
                return (
                    <>
                        <Tab.Screen
                            name="Terrains"
                            component={TerrainsScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="location-outline" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Réservations"
                            component={ReservationsScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="calendar-outline" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Statistiques"
                            component={StatisticsScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="stats-chart-outline" size={size} color={color} />
                                ),
                            }}
                        />
                        <Tab.Screen
                            name="Réglages"
                            component={SettingsScreen}
                            options={{
                                tabBarIcon: ({ color, size }) => (
                                    <Ionicons name="settings-outline" size={size} color={color} />
                                ),
                            }}
                        />
                    </>
                );
        }
    };

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: PRIMARY_COLOR,
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    height: 55,
                    position: 'absolute',
                    bottom: 0,
                    borderTopWidth: 0,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4.65,
                    elevation: 8,
                },
                headerShown: false,
            }}
        >
            {getTabScreens()}
        </Tab.Navigator>
    );
}; 