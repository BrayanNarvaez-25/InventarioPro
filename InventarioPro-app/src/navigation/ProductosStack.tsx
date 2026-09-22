import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductosScreen from '../screens/ProductosScreen';
import EditarProductoScreen from '../screens/EditarProductoScreen';
import { ProductosStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ProductosStackParamList>();

export default function ProductosStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaProductos" component={ProductosScreen} />
      <Stack.Screen name="EditarProducto" component={EditarProductoScreen} />
    </Stack.Navigator>
  );
}