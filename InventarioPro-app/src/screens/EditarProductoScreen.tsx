import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { useProductos } from '../context/ProductoContext';
import EscanerScreen from './EscanerScreen';
import ConfirmModal from '../components/ConfirmModal';
import { colors, fonts } from '../theme/theme';
import { ProductosStackParamList } from '../types/navigation';

type EditarRouteProp = RouteProp<ProductosStackParamList, 'EditarProducto'>;
type EditarNavProp = NativeStackNavigationProp<ProductosStackParamList, 'EditarProducto'>;

export default function EditarProductoScreen() {
  const navigation = useNavigation<EditarNavProp>();
  const route = useRoute<EditarRouteProp>();
  const { producto } = route.params;
  const { actualizarProducto, eliminarProducto } = useProductos();

  const [nombre, setNombre] = useState(producto.nombre);
  const [precio, setPrecio] = useState(producto.precio.toString());
  const [categoria, setCategoria] = useState(producto.categoria);
  const [fotoBase64, setFotoBase64] = useState<string | null>(producto.fotoBase64);
  const [codigoBarras, setCodigoBarras] = useState<string | null>(producto.codigoBarras);
  const [guardando, setGuardando] = useState(false);
  const [mostrarEscaner, setMostrarEscaner] = useState(false);
  const [mostrarConfirmEliminar, setMostrarConfirmEliminar] = useState(false);

  const tomarFoto = async () => {
    const permiso = await ImagePicker.requestCameraPermissionsAsync();
    if (!permiso.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para tomar la foto.');
      return;
    }

    const resultado = await ImagePicker.launchCameraAsync({
      base64: true,
      quality: 0.5,
    });

    if (!resultado.canceled && resultado.assets[0].base64) {
      setFotoBase64(resultado.assets[0].base64);
    }
  };

  const manejarCodigoEscaneado = (codigo: string) => {
    setCodigoBarras(codigo);
    setMostrarEscaner(false);
  };

  const guardarCambios = async () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert('Campos requeridos', 'El nombre y el precio son obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      await actualizarProducto(producto.id, {
        nombre,
        precio: parseFloat(precio),
        categoria,
        fotoBase64,
        codigoBarras,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminar = async () => {
    await eliminarProducto(producto.id);
    setMostrarConfirmEliminar(false);
    navigation.goBack();
  };

  if (mostrarEscaner) {
    return (
      <EscanerScreen
        onCodigoEscaneado={manejarCodigoEscaneado}
        onCerrar={() => setMostrarEscaner(false)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={22} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.titulo}>{'>'} EDITAR_REGISTRO</Text>
        </View>

        <Text style={styles.label}>NOMBRE</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholderTextColor={colors.placeholder}
        />

        <Text style={styles.label}>PRECIO</Text>
        <TextInput
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.placeholder}
        />

        <Text style={styles.label}>CATEGORIA</Text>
        <TextInput
          style={styles.input}
          value={categoria}
          onChangeText={setCategoria}
          placeholderTextColor={colors.placeholder}
        />

        <TouchableOpacity style={styles.botonSecundario} onPress={tomarFoto}>
          <Feather name="camera" size={18} color={colors.primary} />
          <Text style={styles.botonSecundarioTexto}>CAMBIAR_FOTO</Text>
        </TouchableOpacity>

        {fotoBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
            style={styles.preview}
          />
        )}

        <TouchableOpacity
          style={styles.botonSecundario}
          onPress={() => setMostrarEscaner(true)}
        >
          <Feather name="crosshair" size={18} color={colors.primary} />
          <Text style={styles.botonSecundarioTexto}>ESCANEAR_CODIGO</Text>
        </TouchableOpacity>

        {codigoBarras && (
          <View style={styles.codigoContainer}>
            <Feather name="hash" size={14} color={colors.textDim} />
            <Text style={styles.codigoTexto}>{codigoBarras}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
          onPress={guardarCambios}
          disabled={guardando}
        >
          <Feather name="save" size={18} color={colors.background} />
          <Text style={styles.botonGuardarTexto}>
            {guardando ? 'GUARDANDO...' : 'GUARDAR_CAMBIOS'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => setMostrarConfirmEliminar(true)}
        >
          <Feather name="trash-2" size={18} color={colors.danger} />
          <Text style={styles.botonEliminarTexto}>ELIMINAR_REGISTRO</Text>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmModal
        visible={mostrarConfirmEliminar}
        titulo="ELIMINAR REGISTRO"
        mensaje={`¿Seguro que quieres eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setMostrarConfirmEliminar(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: fonts.mono,
    color: colors.primary,
    letterSpacing: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: fonts.mono,
    marginBottom: 6,
    color: colors.textDim,
    letterSpacing: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
    fontFamily: fonts.mono,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  botonSecundario: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  botonSecundarioTexto: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.mono,
    letterSpacing: 1,
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 4,
    alignSelf: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  codigoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
  },
  codigoTexto: {
    fontSize: 13,
    color: colors.textDim,
    fontFamily: fonts.mono,
  },
  botonGuardar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    borderRadius: 4,
    padding: 16,
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.5,
  },
  botonGuardarTexto: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: fonts.mono,
    letterSpacing: 1,
  },
  botonEliminar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 4,
    padding: 14,
    marginTop: 12,
  },
  botonEliminarTexto: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: fonts.mono,
    letterSpacing: 1,
  },
});