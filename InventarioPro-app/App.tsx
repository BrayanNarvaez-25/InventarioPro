import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { ProductoProvider } from './src/context/ProductoContext';
import ProductosStackNavigator from './src/navigation/ProductosStack';
import NuevoProductoScreen from './src/screens/NuevoProductoScreen';
import { colors, fonts } from './src/theme/theme';

const Tab = createBottomTabNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.surface,
    border: colors.border,
    primary: colors.primary,
    text: colors.text,
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ProductoProvider>
        <NavigationContainer theme={navTheme}>
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
                borderTopWidth: 1,
              },
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.textMuted,
              tabBarLabelStyle: {
                fontFamily: fonts.mono,
                fontSize: 11,
                letterSpacing: 1,
              },
            }}
          >
            <Tab.Screen
              name="Productos"
              component={ProductosStackNavigator}
              options={{
                title: 'INVENTARIO',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="database" size={size} color={color} />
                ),
              }}
            />
            <Tab.Screen
              name="Nuevo"
              component={NuevoProductoScreen}
              options={{
                title: 'AGREGAR',
                tabBarIcon: ({ color, size }) => (
                  <Feather name="plus-square" size={size} color={color} />
                ),
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ProductoProvider>
    </SafeAreaProvider>
  );
}