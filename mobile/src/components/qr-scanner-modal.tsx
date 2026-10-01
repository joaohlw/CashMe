import React, { useState } from 'react'
import {
  Modal,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import * as Clipboard from 'expo-clipboard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

interface QrScannerModalProps {
  visible: boolean
  onClose: () => void
  onScan: (url: string) => void
}

const { width } = Dimensions.get('window')
const SCAN_FRAME_SIZE = Math.min(width * 0.72, 280)

export function QrScannerModal({ visible, onClose, onScan }: QrScannerModalProps) {
  const [permission, requestPermission] = useCameraPermissions()
  const [scanned, setScanned] = useState(false)
  const [torch, setTorch] = useState(false)
  const [facing, setFacing] = useState<'back' | 'front'>('back')

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scanned || !data) return
    setScanned(true)

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // Falha silenciosa se haptics não for suportado
    }

    try {
      await Clipboard.setStringAsync(data)
    } catch {
      // Falha silenciosa no clipboard
    }

    onScan(data)
    setTimeout(() => {
      setScanned(false)
      onClose()
    }, 300)
  }

  const handleClose = () => {
    setScanned(false)
    onClose()
  }

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={handleClose}>
      <SafeAreaView style={styles.container}>
        {!permission ? (
          <View style={styles.permissionContainer}>
            <ActivityIndicator size="large" color="#008D4C" />
            <Text style={styles.permissionTitle}>Verificando permissões da câmera...</Text>
          </View>
        ) : !permission.granted ? (
          <View style={styles.permissionContainer}>
            <Ionicons name="camera-outline" size={64} color="#008D4C" />
            <Text style={styles.permissionTitle}>Permissão da Câmera Necessária</Text>
            <Text style={styles.permissionDescription}>
              Precisamos de acesso à câmera do celular para escanear os QR Codes das NFC-e e
              acumular seus pontos no Cash Me.
            </Text>
            <TouchableOpacity style={styles.primaryBtn} onPress={requestPermission}>
              <Text style={styles.primaryBtnText}>Conceder Permissão</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={handleClose}>
              <Text style={styles.secondaryBtnText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing={facing}
              enableTorch={torch}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Overlay com Máscara e Foco */}
            <View style={styles.overlay}>
              {/* Header com Controles */}
              <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={handleClose}>
                  <Ionicons name="close" size={26} color="#FFFFFF" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Escanear NFC-e</Text>

                <View style={styles.headerRightActions}>
                  <TouchableOpacity
                    style={[styles.iconBtn, torch && styles.iconBtnActive]}
                    onPress={() => setTorch((t) => !t)}
                  >
                    <Ionicons
                      name={torch ? 'flash' : 'flash-off'}
                      size={22}
                      color={torch ? '#F5B800' : '#FFFFFF'}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.iconBtn, { marginLeft: 10 }]}
                    onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                  >
                    <Ionicons name="camera-reverse-outline" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Moldura Central de Leitura */}
              <View style={styles.frameContainer}>
                <View style={styles.scanFrame}>
                  {/* Cantoneiras Estilizadas */}
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />

                  {scanned && (
                    <View style={styles.scannedIndicator}>
                      <Ionicons name="checkmark-circle" size={48} color="#008D4C" />
                      <Text style={styles.scannedText}>QR Code Lido!</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.instructionText}>
                  Aponte a câmera para o QR Code da nota fiscal da SEFAZ
                </Text>
              </View>

              {/* Rodapé com Dica */}
              <View style={styles.footer}>
                <View style={styles.badgeSefaz}>
                  <Ionicons name="shield-checkmark" size={16} color="#008D4C" />
                  <Text style={styles.badgeText}>Homologado SEFAZ SC & PR</Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#111827',
    textAlign: 'center',
  },
  permissionDescription: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  primaryBtn: {
    backgroundColor: '#008D4C',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryBtn: {
    marginTop: 12,
    paddingVertical: 8,
  },
  secondaryBtnText: {
    color: '#6B7280',
    fontSize: 14,
  },
  cameraWrapper: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnActive: {
    backgroundColor: 'rgba(245,184,0,0.3)',
  },
  frameContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#008D4C',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  scannedIndicator: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  scannedText: {
    color: '#008D4C',
    fontWeight: 'bold',
    marginTop: 6,
    fontSize: 14,
  },
  instructionText: {
    color: '#FFFFFF',
    fontSize: 13,
    marginTop: 18,
    textAlign: 'center',
    paddingHorizontal: 30,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  footer: {
    paddingBottom: 32,
    alignItems: 'center',
  },
  badgeSefaz: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#008D4C',
    fontSize: 12,
    fontWeight: '700',
  },
})
