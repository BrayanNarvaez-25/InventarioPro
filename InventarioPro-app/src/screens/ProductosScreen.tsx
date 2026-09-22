import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useProductos } from '../context/ProductoContext';
import { Producto } from '../types/Producto';

export default function ProductosScreen() {
  const { productos, cargando, obtenerProductos, eliminarProducto } = useProductos();

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  const renderItem = ({ item }: { item: Producto }) => (
    <View style={styles.card}>
      {item.fotoBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
          style={styles.imagen}
        />
      ) : (
        <View style={styles.sinImagen}>
          <Text style={styles.sinImagenTexto}>Sin Imagen</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.nombre}>{item.nombre}</Text>
        <Text style={styles.detalle}>${item.precio.toFixed(2)}</Text>
        <Text style={styles.detalle}>{item.categoria}</Text>
        {item.codigoBarras && (
          <Text style={styles.codigoBarras}>Código: {item.codigoBarras}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.botonEliminar}
        onPress={() => eliminarProducto(item.id)}
      >
        <Text style={styles.iconoEliminar}>🗑</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.titulo}>Inventario</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl refreshing={cargando} onRefresh={obtenerProductos} />
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay productos todavía.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  imagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  sinImagen: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sinImagenTexto: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: '600',
  },
  detalle: {
    fontSize: 13,
    color: '#666',
  },
  codigoBarras: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  botonEliminar: {
    padding: 8,
  },
  iconoEliminar: {
    fontSize: 20,
  },
  vacio: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
  },
});