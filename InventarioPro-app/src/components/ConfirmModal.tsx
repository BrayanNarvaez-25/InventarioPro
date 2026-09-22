import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, fonts } from '../theme/theme';

interface Props {
  visible: boolean;
  titulo: string;
  mensaje: string;
  onConfirmar: () => void;
  onCancelar: () => void;
}

export default function ConfirmModal({ visible, titulo, mensaje, onConfirmar, onCancelar }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <View style={styles.fondo}>
        <View style={styles.caja}>
          <View style={styles.header}>
            <Feather name="alert-triangle" size={20} color={colors.danger} />
            <Text style={styles.titulo}>{titulo}</Text>
          </View>

          <Text style={styles.mensaje}>{mensaje}</Text>

          <View style={styles.botones}>
            <TouchableOpacity style={styles.botonCancelar} onPress={onCancelar}>
              <Text style={styles.botonCancelarTexto}>CANCELAR</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botonConfirmar} onPress={onConfirmar}>
              <Feather name="trash-2" size={16} color={colors.background} />
              <Text style={styles.botonConfirmarTexto}>ELIMINAR</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  caja: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.danger,
    borderRadius: 6,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  titulo: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: fonts.mono,
    color: colors.danger,
    letterSpacing: 1,
  },
  mensaje: {
    fontSize: 13,
    fontFamily: fonts.mono,
    color: colors.textDim,
    marginBottom: 20,
    lineHeight: 20,
  },
  botones: {
    flexDirection: 'row',
    gap: 10,
  },
  botonCancelar: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  botonCancelarTexto: {
    color: colors.textDim,
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1,
  },
  botonConfirmar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.danger,
    borderRadius: 4,
    padding: 12,
  },
  botonConfirmarTexto: {
    color: colors.background,
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
  },
});