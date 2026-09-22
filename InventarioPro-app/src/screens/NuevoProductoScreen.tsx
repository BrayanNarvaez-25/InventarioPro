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
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useProductos } from '../context/ProductoContext';
import EscanerScreen from './EscanerScreen';

export default function NuevoProductoScreen() {
  const navigation = useNavigation();
  const { agregarProducto } = useProductos();

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [categoria, setCategoria] = useState('');
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [codigoBarras, setCodigoBarras] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [mostrarEscaner, setMostrarEscaner] = useState(false);

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

  const limpiarFormulario = () => {
    setNombre('');
    setPrecio('');
    setCategoria('');
    setFotoBase64(null);
    setCodigoBarras(null);
  };

  const guardarProducto = async () => {
    if (!nombre.trim() || !precio.trim()) {
      Alert.alert('Campos requeridos', 'El nombre y el precio son obligatorios.');
      return;
    }

    try {
      setGuardando(true);
      await agregarProducto({
        nombre,
        precio: parseFloat(precio),
        categoria,
        fotoBase64,
        codigoBarras,
      });
      limpiarFormulario();
      navigation.navigate('Productos' as never);
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto.');
    } finally {
      setGuardando(false);
    }
  };

  // Si el escáner está activo, mostramos esa pantalla a pantalla completa
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
        <Text style={styles.titulo}>Nuevo Producto</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Laptop HP"
        />

        <Text style={styles.label}>Precio</Text>
        <TextInput
          style={styles.input}
          value={precio}
          onChangeText={setPrecio}
          placeholder="Ej: 750.50"
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Categoría</Text>
        <TextInput
          style={styles.input}
          value={categoria}
          onChangeText={setCategoria}
          placeholder="Ej: Electrónica"
        />

        <TouchableOpacity style={styles.botonCamara} onPress={tomarFoto}>
          <Text style={styles.botonCamaraTexto}>📷 Tomar Foto</Text>
        </TouchableOpacity>

        {fotoBase64 && (
          <Image
            source={{ uri: `data:image/jpeg;base64,${fotoBase64}` }}
            style={styles.preview}
          />
        )}

        <TouchableOpacity
          style={styles.botonEscaner}
          onPress={() => setMostrarEscaner(true)}
        >
          <Text style={styles.botonEscanerTexto}>🔍 Escanear Código</Text>
        </TouchableOpacity>

        {codigoBarras && (
          <View style={styles.codigoContainer}>
            <Text style={styles.codigoTexto}>Código: {codigoBarras}</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.botonGuardar, guardando && styles.botonDeshabilitado]}
          onPress={guardarProducto}
          disabled={guardando}
        >
          <Text style={styles.botonGuardarTexto}>
            {guardando ? 'Guardando...' : 'Guardar Producto'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    padding: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  botonCamara: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  botonCamaraTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    width: 150,
    height: 150,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 16,
  },
  botonEscaner: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  botonEscanerTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  codigoContainer: {
    backgroundColor: '#eef6fc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  codigoTexto: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
  },
  botonGuardar: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  botonGuardarTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});