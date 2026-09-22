import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {
  onCodigoEscaneado: (codigo: string) => void;
  onCerrar: () => void;
}

export default function EscanerScreen({ onCodigoEscaneado, onCerrar }: Props) {
  const [permiso, solicitarPermiso] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);

  if (!permiso) {
    return <View style={styles.container} />;
  }

  if (!permiso.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.mensaje}>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity style={styles.boton} onPress={solicitarPermiso}>
          <Text style={styles.botonTexto}>Dar permiso</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonCerrar} onPress={onCerrar}>
          <Text style={styles.botonCerrarTexto}>Cancelar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const manejarEscaneo = (resultado: BarcodeScanningResult) => {
    if (escaneado) return;
    setEscaneado(true);
    onCodigoEscaneado(resultado.data);
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'ean13', 'ean8', 'code128', 'code39', 'upc_a'],
        }}
        onBarcodeScanned={escaneado ? undefined : manejarEscaneo}
      />
      <SafeAreaView style={styles.overlay}>
        <Text style={styles.instrucciones}>Apunta al código de barras o QR</Text>
        <TouchableOpacity style={styles.botonCerrar} onPress={onCerrar}>
          <Text style={styles.botonCerrarTexto}>Cancelar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  instrucciones: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  mensaje: {
    textAlign: 'center',
    fontSize: 16,
    margin: 20,
  },
  boton: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 40,
  },
  botonTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  botonCerrar: {
    backgroundColor: '#e74c3c',
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  botonCerrarTexto: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});