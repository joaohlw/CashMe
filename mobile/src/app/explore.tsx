import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera'
import * as Haptics from 'expo-haptics'
import * as Clipboard from 'expo-clipboard'
import { router } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { isValidSefazUrl } from '@/utils/nfce-parser'

const { width } = Dimensions.get('window')
const SCAN_FRAME_SIZE = Math.min(width * 0.68, 260)

interface ScanHistoryItem {
  data: string
  isSefaz: boolean
  uf?: string
  timestamp: Date
}

export default function QrScannerTabScreen() {
  const [permission, requestPermission] = useCameraPermissions()
  const [scannedData, setScannedData] = useState<string | null>(null)
  const [isSefazValid, setIsSefazValid] = useState<boolean>(false)
  const [sefazWarning, setSefazWarning] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [torch, setTorch] = useState(false)
  const [facing, setFacing] = useState<'back' | 'front'>('back')
  const [history, setHistory] = useState<ScanHistoryItem[]>([])

  const handleBarcodeScanned = async ({ data }: BarcodeScanningResult) => {
    if (scannedData || !data) return

    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch {
      // ignore
    }

    const validation = isValidSefazUrl(data)
    setScannedData(data)
    setIsSefazValid(validation.isValid && validation.isAllowed)
    setSefazWarning(validation.reason ?? null)

    setHistory((prev) => [
      {
        data,
        isSefaz: validation.isValid && validation.isAllowed,
        uf: validation.uf ?? undefined,
        timestamp: new Date(),
      },
      ...prev.slice(0, 9),
    ])
  }

  const handleCopy = async () => {
    if (!scannedData) return
    try {
      await Clipboard.setStringAsync(scannedData)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      Alert.alert('Copiado', scannedData)
    }
  }

  const handleSendToScraper = () => {
    if (!scannedData) return
    router.push({
      pathname: '/',
      params: { url: scannedData },
    })
    setScannedData(null)
  }

  const handleResetScan = () => {
    setScannedData(null)
    setIsSefazValid(false)
    setSefazWarning(null)
    setCopied(false)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leitor de QR Code</Text>
          <Text style={styles.headerSubtitle}>
            Aponte para o QR Code impresso no cupom fiscal da NFC-e
          </Text>
        </View>

        {/* Câmera / Viewfinder */}
        <View style={styles.cameraContainer}>
          {!permission ? (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionText}>Carregando câmera...</Text>
            </View>
          ) : !permission.granted ? (
            <View style={styles.permissionBox}>
              <Ionicons name="camera-outline" size={48} color="#008D4C" />
              <Text style={styles.permissionTitle}>Permissão da Câmera</Text>
              <Text style={styles.permissionDescription}>
                Permita o acesso à câmera para ler os QR Codes das notas fiscais.
              </Text>
              <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                <Text style={styles.permissionBtnText}>Conceder Acesso</Text>
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
                onBarcodeScanned={scannedData ? undefined : handleBarcodeScanned}
              />

              {/* Moldura de Foco */}
              <View style={styles.focusFrameContainer}>
                <View style={styles.focusFrame}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                </View>
              </View>

              {/* Botões Flutuantes sobre a Câmera */}
              <View style={styles.cameraControls}>
                <TouchableOpacity
                  style={[styles.floatingBtn, torch && styles.floatingBtnActive]}
                  onPress={() => setTorch((t) => !t)}
                >
                  <Ionicons
                    name={torch ? 'flash' : 'flash-off'}
                    size={20}
                    color={torch ? '#F5B800' : '#FFFFFF'}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.floatingBtn}
                  onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
                >
                  <Ionicons name="camera-reverse-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Card do Resultado da Leitura Atual */}
        {scannedData ? (
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons
                name={isSefazValid ? 'checkmark-circle' : 'warning'}
                size={22}
                color={isSefazValid ? '#008D4C' : '#D97706'}
              />
              <Text style={styles.resultTitle}>
                {isSefazValid ? 'NFC-e SEFAZ Homologada' : 'URL Detectada'}
              </Text>
            </View>

            {sefazWarning && <Text style={styles.warningText}>{sefazWarning}</Text>}

            <Text style={styles.scannedUrlText} numberOfLines={3}>
              {scannedData}
            </Text>

            <View style={styles.resultActions}>
              <TouchableOpacity
                style={[styles.actionPrimaryBtn, !isSefazValid && styles.actionSecondaryBtn]}
                onPress={handleSendToScraper}
              >
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                <Text style={styles.actionPrimaryBtnText}>Processar no Cash Me</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionCopyBtn} onPress={handleCopy}>
                <Ionicons
                  name={copied ? 'checkmark' : 'copy-outline'}
                  size={16}
                  color={copied ? '#008D4C' : '#4B5563'}
                />
                <Text style={[styles.actionCopyText, copied && styles.actionCopyTextSuccess]}>
                  {copied ? 'Copiado!' : 'Copiar'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionResetBtn} onPress={handleResetScan}>
                <Ionicons name="refresh" size={16} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.hintCard}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#008D4C" />
            <Text style={styles.hintText}>
              Aponte para o QR Code de notas do Paraná (PR) ou Santa Catarina (SC) para validação
              instantânea.
            </Text>
          </View>
        )}

        {/* Histórico Recente de Leituras */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.historyTitle}>Leituras Recentes ({history.length})</Text>
            {history.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.historyItem}
                onPress={() => {
                  router.push({ pathname: '/', params: { url: item.data } })
                }}
              >
                <Ionicons
                  name={item.isSefaz ? 'receipt' : 'link'}
                  size={18}
                  color={item.isSefaz ? '#008D4C' : '#9CA3AF'}
                />
                <View style={styles.historyInfo}>
                  <Text style={styles.historyUrl} numberOfLines={1}>
                    {item.data}
                  </Text>
                  <Text style={styles.historyMeta}>
                    {item.uf ? `SEFAZ ${item.uf} • ` : ''}
                    {item.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  cameraContainer: {
    height: 320,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000000',
    marginBottom: 16,
  },
  cameraWrapper: {
    flex: 1,
  },
  permissionBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginTop: 12,
  },
  permissionDescription: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  permissionBtn: {
    backgroundColor: '#008D4C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  permissionText: {
    color: '#6B7280',
    fontSize: 14,
  },
  focusFrameContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  focusFrame: {
    width: SCAN_FRAME_SIZE,
    height: SCAN_FRAME_SIZE,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#008D4C',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 10,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 10,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 10,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 10,
  },
  cameraControls: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    gap: 10,
  },
  floatingBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingBtnActive: {
    backgroundColor: 'rgba(245,184,0,0.4)',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  warningText: {
    fontSize: 12,
    color: '#B45309',
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  scannedUrlText: {
    fontSize: 12,
    color: '#374151',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  resultActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionPrimaryBtn: {
    flex: 1,
    backgroundColor: '#008D4C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionSecondaryBtn: {
    backgroundColor: '#4B5563',
  },
  actionPrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  actionCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  actionCopyText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  actionCopyTextSuccess: {
    color: '#008D4C',
  },
  actionResetBtn: {
    padding: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  hintCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 18,
  },
  historySection: {
    marginTop: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 6,
  },
  historyInfo: {
    flex: 1,
  },
  historyUrl: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },
  historyMeta: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
})
