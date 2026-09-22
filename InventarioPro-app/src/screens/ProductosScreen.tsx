import React, { useEffect, useState } from 'react';
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
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useProductos } from '../context/ProductoContext';
import { Producto } from '../types/Producto';
import { colors, fonts } from '../theme/theme';
import { ProductosStackParamList } from '../types/navigation';
import ConfirmModal from '../components/ConfirmModal';

type ListaNavProp = NativeStackNavigationProp<ProductosStackParamList, 'ListaProductos'>;

export default function ProductosScreen() {
  const navigation = useNavigation<ListaNavProp>();
  const { productos, cargando, obtenerProductos, eliminarProducto } = useProductos();
  const [productoAEliminar, setProductoAEliminar] = useState<Producto | null>(null);

  useEffect(() => {
    obtenerProductos();
  }, [obtenerProductos]);

  const confirmarEliminar = async () => {
    if (!productoAEliminar) return;
    await eliminarProducto(productoAEliminar.id);
    setProductoAEliminar(null);
  };

  const renderItem = ({ item }: { item: Producto }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('EditarProducto', { producto: item })}
    >
      {item.fotoBase64 ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${item.fotoBase64}` }}
          style={styles.imagen}
        />
      ) : (
        <View style={styles.sinImagen}>
          <Feather name="image" size={32} color={colors.textMuted} />
          <Text style={styles.sinImagenTexto}>SIN_IMAGEN</Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.botonEliminar}
        onPress={() => setProductoAEliminar(item)}
      >
        <Feather name="trash-2" size={16} color={colors.danger} />
      </TouchableOpacity>

      <View style={styles.info}>
        <View style={styles.infoHeader}>
          <Text style={styles.nombre}>{item.nombre.toUpperCase()}</Text>
          <Feather name="edit-2" size={16} color={colors.textDim} />
        </View>

        <Text style={styles.precio}>$ {item.precio.toFixed(2)}</Text>

        <View style={styles.filaDetalle}>
          <Feather name="tag" size={12} color={colors.textDim} />
          <Text style={styles.detalle}>{item.categoria}</Text>
        </View>

        {item.codigoBarras && (
          <View style={styles.filaDetalle}>
            <Feather name="hash" size={12} color={colors.textDim} />
            <Text style={styles.detalle}>{item.codigoBarras}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.titulo}>{'>'} INVENTARIO.SYS</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        refreshControl={
          <RefreshControl
            refreshing={cargando}
            onRefresh={obtenerProductos}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <Text style={styles.vacio}>// NO HAY REGISTROS</Text>
        }
      />

      <ConfirmModal
        visible={productoAEliminar !== null}
        titulo="ELIMINAR REGISTRO"
        mensaje={`¿Seguro que quieres eliminar "${productoAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setProductoAEliminar(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: fonts.mono,
    color: colors.primary,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    letterSpacing: 1,
  },
  lista: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagen: {
    width: '100%',
    height: 200,
  },
  sinImagen: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sinImagenTexto: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.mono,
    letterSpacing: 1,
  },
  botonEliminar: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(13,13,13,0.8)',
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 4,
    padding: 8,
  },
  info: {
    padding: 14,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  nombre: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: fonts.mono,
    color: colors.text,
    flex: 1,
  },
  precio: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: fonts.mono,
    color: colors.primary,
    marginBottom: 8,
  },
  filaDetalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  detalle: {
    fontSize: 12,
    color: colors.textDim,
    fontFamily: fonts.mono,
  },
  vacio: {
    textAlign: 'center',
    marginTop: 40,
    color: colors.textMuted,
    fontFamily: fonts.mono,
  },
});