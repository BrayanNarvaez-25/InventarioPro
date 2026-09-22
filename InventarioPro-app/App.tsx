import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ProductoProvider } from './src/context/ProductoContext';
import ProductosScreen from './src/screens/ProductosScreen';
import NuevoProductoScreen from './src/screens/NuevoProductoScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <ProductoProvider>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              name="Productos"
              component={ProductosScreen}
              options={{ headerShown: false, title: 'Inventario' }}
            />
            <Tab.Screen
              name="Nuevo"
              component={NuevoProductoScreen}
              options={{ headerShown: false, title: 'Agregar' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </ProductoProvider>
    </SafeAreaProvider>
  );
}