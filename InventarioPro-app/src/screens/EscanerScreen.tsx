import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme/theme';

interface Props {
  onCodigoEscaneado: (codigo: string) => void;
  onCerrar: () => void;
}

const MARCO_SIZE = Dimensions.get('window').width * 0.7;

export default function EscanerScreen({ onCodigoEscaneado, onCerrar }: Props) {
  const [permiso, solicitarPermiso] = useCameraPermissions();
  const [escaneado, setEscaneado] = useState(false);
  const posicionLinea = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(posicionLinea, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(posicionLinea, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animacion.start();
    return () => animacion.stop();
  }, [posicionLinea]);

  if (!permiso) {
    return <View style={styles.container} />;
  }

  if (!permiso.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <Feather name="lock" size={32} color={colors.primary} style={{ marginBottom: 12 }} />
        <Text style={styles.mensaje}>ACCESO A CAMARA REQUERIDO</Text>
        <TouchableOpacity style={styles.boton} onPress={solicitarPermiso}>
          <Text style={styles.botonTexto}>AUTORIZAR</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonCerrar} onPress={onCerrar}>
          <Text style={styles.botonCerrarTexto}>CANCELAR</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const manejarEscaneo = (resultado: BarcodeScanningResult) => {
    if (escaneado) return;
    setEscaneado(true);
    onCodigoEscaneado(resultado.data);
  };

  const translateY = posicionLinea.interpolate({
    inputRange: [0, 1],
    outputRange: [0, MARCO_SIZE - 2],
  });

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

      {/* Capa oscura con "ventana" central */}
      <View style={styles.overlayOscuro} pointerEvents="none">
        <View style={styles.filaOverlay} />
        <View style={styles.filaCentral}>
          <View style={styles.overlayLateral} />
          <View style={styles.marco}>
            {/* Esquinas estilo HUD */}
            <View style={[styles.esquina, styles.esquinaSupIzq]} />
            <View style={[styles.esquina, styles.esquinaSupDer]} />
            <View style={[styles.esquina, styles.esquinaInfIzq]} />
            <View style={[styles.esquina, styles.esquinaInfDer]} />

            {/* Línea de escaneo animada */}
            <Animated.View
              style={[styles.lineaEscaneo, { transform: [{ translateY }] }]}
            />
          </View>
          <View style={styles.overlayLateral} />
        </View>
        <View style={styles.filaOverlay} />
      </View>

      <SafeAreaView style={styles.controles}>
        <View style={styles.header}>
          <Feather name="crosshair" size={16} color={colors.primary} />
          <Text style={styles.instrucciones}>APUNTA AL CODIGO</Text>
        </View>
        <TouchableOpacity style={styles.botonCerrar} onPress={onCerrar}>
          <Feather name="x" size={16} color={colors.background} />
          <Text style={styles.botonCerrarTexto}>CANCELAR</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayOscuro: {
    ...StyleSheet.absoluteFill,
  },
  filaOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: '100%',
  },
  filaCentral: {
    flexDirection: 'row',
    height: MARCO_SIZE,
  },
  overlayLateral: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  marco: {
    width: MARCO_SIZE,
    height: MARCO_SIZE,
    overflow: 'hidden',
  },
  esquina: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primary,
  },
  esquinaSupIzq: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  esquinaSupDer: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  esquinaInfIzq: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  esquinaInfDer: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  lineaEscaneo: {
    width: '100%',
    height: 2,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  controles: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
  },
  instrucciones: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fonts.mono,
    letterSpacing: 1,
  },
  mensaje: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.mono,
    color: colors.text,
    marginHorizontal: 20,
    marginBottom: 20,
    letterSpacing: 1,
  },
  boton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 4,
    marginHorizontal: 40,
    marginBottom: 12,
    justifyContent: 'center',
  },
  botonTexto: {
    color: colors.background,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: fonts.mono,
    letterSpacing: 1,
  },
  botonCerrar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.danger,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 4,
    marginHorizontal: 40,
    marginBottom: 10,
  },
  botonCerrarTexto: {
    color: colors.background,
    fontWeight: '700',
    fontFamily: fonts.mono,
    letterSpacing: 1,
  },
});