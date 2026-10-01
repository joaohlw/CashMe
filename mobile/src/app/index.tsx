import React, { useState, useRef, useCallback, useEffect } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView, WebViewMessageEvent } from 'react-native-webview'
import * as Haptics from 'expo-haptics'
import { useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { QrScannerModal } from '@/components/qr-scanner-modal'
import { NfceResultView } from '@/components/nfce-result-view'
import { isValidSefazUrl, parseNfceHtml, NfceData } from '@/utils/nfce-parser'
import { mobileApi } from '@/services/api'

type AppStep = 'INPUT' | 'CAPTCHA_WEBVIEW' | 'RESULT'

const DEFAULT_SEFAZ_SC_URL = 'https://sat.sef.sc.gov.br/nfce/consulta'

const DOM_EXTRACTION_SCRIPT = `
  (function() {
    try {
      var html = document.documentElement ? document.documentElement.outerHTML : '';
      var title = document.title || '';
      var url = window.location.href || '';
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'NFCE_DOM_EXTRACTED',
        payload: {
          html: html,
          title: title,
          url: url
        }
      }));
    } catch (err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({
        type: 'NFCE_EXTRACT_ERROR',
        error: String(err && err.message ? err.message : err)
      }));
    }
  })();
  true;
`

export default function NfceScraperScreen() {
  const params = useLocalSearchParams<{ url?: string }>()

  const [step, setStep] = useState<AppStep>('INPUT')
  const [inputUrl, setInputUrl] = useState(DEFAULT_SEFAZ_SC_URL)
  const [activeUrl, setActiveUrl] = useState<string | null>(null)
  const [webViewLoading, setWebViewLoading] = useState(false)
  const [extracting, setExtracting] = useState(false)
  const [parsedData, setParsedData] = useState<NfceData | null>(null)
  const [isScannerOpen, setIsScannerOpen] = useState(false)
  const [pageTitle, setPageTitle] = useState('')

  const webViewRef = useRef<any>(null)

  const normalizeUrl = useCallback((url: string) => {
    let trimmed = url.trim()
    if (!trimmed) return ''
    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed
    }
    return trimmed
  }, [])

  const handleStartFlow = useCallback(
    (targetUrl?: string) => {
      const raw = targetUrl ?? inputUrl
      const normalized = normalizeUrl(raw)

      if (!normalized) {
        Alert.alert('Entrada Vazia', 'Por favor, insira ou escaneie uma URL ou chave da NFC-e.')
        return
      }

      // Se for apenas uma chave de 44 dígitos
      const isOnlyDigitsKey = /^\d{44}$/.test(raw.replace(/[^\d]/g, ''))
      if (isOnlyDigitsKey) {
        // Envia direto para a API validar
        mobileApi
          .validateNfce({ accessKey: raw.replace(/[^\d]/g, '') })
          .then((res) => {
            if (res?.data?.isEligible) {
              const fakeData: NfceData = {
                emitente: {
                  razaoSocial: 'Estabelecimento Credenciado SC',
                  cnpj: '12.345.678/0001-90',
                },
                info: { chaveAcesso: raw.replace(/[^\d]/g, ''), uf: 'SC' },
                itens: [
                  {
                    codigo: '1',
                    descricao: 'Compra em Estabelecimento Parceiro',
                    quantidade: 1,
                    unidade: 'UN',
                    valorUnitario: 50,
                    valorTotal: 50,
                  },
                ],
                totais: { qtdItens: 1, valorTotal: 50, valorPagar: 50 },
                consumidor: {},
                pontosCalculados: 50,
                url: raw,
                scrapedAt: new Date(),
                rawHtmlLength: 0,
              }
              setParsedData(fakeData)
              setStep('RESULT')
            } else {
              Alert.alert(
                'Chave Inelegível',
                res?.message || 'Chave rejeitada pela regra de negócio.'
              )
            }
          })
          .catch(() => {
            Alert.alert('Erro', 'Não foi possível validar a chave na API.')
          })
        return
      }

      const validation = isValidSefazUrl(normalized)
      if (!validation.isValid) {
        Alert.alert('URL Incompatível', validation.reason ?? 'A URL informada não é aceita.')
        return
      }

      if (!validation.isAllowed) {
        Alert.alert(
          'Estado Não Suportado no MVP',
          validation.reason ?? 'Apenas notas de SC e PR são suportadas no piloto do Cash Me.'
        )
        return
      }

      setActiveUrl(normalized)
      setStep('CAPTCHA_WEBVIEW')
    },
    [inputUrl, normalizeUrl]
  )

  useEffect(() => {
    if (params.url) {
      setInputUrl(params.url)
      handleStartFlow(params.url)
    }
  }, [params.url, handleStartFlow])

  const handleScanSuccess = (scannedUrl: string) => {
    setInputUrl(scannedUrl)
    handleStartFlow(scannedUrl)
  }

  const handleTriggerExtraction = () => {
    if (!webViewRef.current) return
    setExtracting(true)
    webViewRef.current.injectJavaScript(DOM_EXTRACTION_SCRIPT)
  }

  const handleWebViewMessage = (event: WebViewMessageEvent) => {
    try {
      const msg = JSON.parse(event.nativeEvent.data)

      if (msg.type === 'NFCE_DOM_EXTRACTED') {
        const { html, url } = msg.payload

        try {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        } catch {
          // ignore
        }

        const data = parseNfceHtml(html, url || activeUrl || '', 1.0)
        setParsedData(data)
        setStep('RESULT')
        setExtracting(false)
      } else if (msg.type === 'NFCE_EXTRACT_ERROR') {
        setExtracting(false)
        Alert.alert('Erro de Extração', 'Não foi possível ler os dados da página da SEFAZ.')
      }
    } catch (e: any) {
      setExtracting(false)
      Alert.alert('Erro', 'Falha ao interpretar resposta da página.')
    }
  }

  const handleReset = () => {
    setParsedData(null)
    setActiveUrl(null)
    setStep('INPUT')
    setExtracting(false)
    setWebViewLoading(false)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* ===================== ETAPA 1: ENTRADA / SCAN ===================== */}
      {step === 'INPUT' && (
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Header da Marca Cash Me */}
            <View style={styles.brandHeader}>
              <View style={styles.brandBadge}>
                <Ionicons name="sparkles" size={14} color="#008D4C" />
                <Text style={styles.brandBadgeText}>Módulo Fiscal NFC-e</Text>
              </View>
              <Text style={styles.brandTitle}>Captura & Pontuação</Text>
              <Text style={styles.brandSubtitle}>
                Escaneie notas de Santa Catarina ou Paraná e acumule pontos no Cash Me.
              </Text>
            </View>

            {/* Botão Gigante de Câmera */}
            <TouchableOpacity
              style={styles.bigScanBtn}
              activeOpacity={0.85}
              onPress={() => setIsScannerOpen(true)}
            >
              <View style={styles.bigScanIconCircle}>
                <Ionicons name="qr-code-outline" size={36} color="#FFFFFF" />
              </View>
              <Text style={styles.bigScanBtnTitle}>Abrir Leitor de QR Code</Text>
              <Text style={styles.bigScanBtnSub}>Aponte a câmera para a nota fiscal</Text>
            </TouchableOpacity>

            {/* Divisor Visual */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU DIGITE MANUALMENTE</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Input Manual de URL ou Chave */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>URL da SEFAZ ou Chave de Acesso (44 dígitos)</Text>
              <TextInput
                style={styles.urlInput}
                value={inputUrl}
                onChangeText={setInputUrl}
                placeholder="Ex: https://sat.sef.sc.gov.br/nfce/consulta"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
              />

              <TouchableOpacity style={styles.actionBtn} onPress={() => handleStartFlow()}>
                <Ionicons name="flash-outline" size={18} color="#FFFFFF" />
                <Text style={styles.actionBtnText}>Processar NFC-e</Text>
              </TouchableOpacity>
            </View>

            {/* Atalhos de Demonstração */}
            <View style={styles.demoSection}>
              <Text style={styles.demoSectionTitle}>Portais Oficiais Homologados (RN07):</Text>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => setInputUrl('https://sat.sef.sc.gov.br/nfce/consulta')}
              >
                <Ionicons name="shield-checkmark" size={14} color="#008D4C" />
                <Text style={styles.demoChipText}>SEFAZ Santa Catarina (SC)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => setInputUrl('http://www.fazenda.pr.gov.br/nfce/consulta')}
              >
                <Ionicons name="shield-checkmark" size={14} color="#008D4C" />
                <Text style={styles.demoChipText}>SEFAZ Paraná (PR)</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}

      {/* ===================== ETAPA 2: WEBVIEW SEFAZ ===================== */}
      {step === 'CAPTCHA_WEBVIEW' && activeUrl && (
        <View style={styles.webViewWrapper}>
          {/* Barra Superior de Ação */}
          <View style={styles.webHeader}>
            <TouchableOpacity style={styles.backBtn} onPress={handleReset}>
              <Ionicons name="arrow-back" size={22} color="#111827" />
            </TouchableOpacity>

            <View style={styles.webHeaderInfo}>
              <Text style={styles.webHeaderTitle} numberOfLines={1}>
                {pageTitle || 'Portal SEFAZ'}
              </Text>
              <Text style={styles.webHeaderUrl} numberOfLines={1}>
                {activeUrl}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.extractBtn, extracting && styles.extractBtnDisabled]}
              disabled={extracting}
              onPress={handleTriggerExtraction}
            >
              {extracting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="checkmark-done" size={16} color="#FFFFFF" />
                  <Text style={styles.extractBtnText}>Extrair</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Dica Flutuante */}
          <View style={styles.floatingTip}>
            <Ionicons name="information-circle-outline" size={18} color="#008D4C" />
            <Text style={styles.floatingTipText}>
              Resolva o Captcha na tela abaixo se solicitado e toque em "Extrair" quando a nota
              carregar.
            </Text>
          </View>

          {/* WebView Nativo */}
          <WebView
            ref={webViewRef}
            source={{ uri: activeUrl }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadStart={() => setWebViewLoading(true)}
            onLoadEnd={() => setWebViewLoading(false)}
            onNavigationStateChange={(nav: any) => setPageTitle(nav.title || '')}
            onMessage={handleWebViewMessage}
          />

          {webViewLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#008D4C" />
              <Text style={styles.loadingText}>Carregando SEFAZ...</Text>
            </View>
          )}
        </View>
      )}

      {/* ===================== ETAPA 3: RESULTADO EXTRAÍDO ===================== */}
      {step === 'RESULT' && parsedData && (
        <NfceResultView data={parsedData} onReset={handleReset} />
      )}

      {/* Modal da Câmera */}
      <QrScannerModal
        visible={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanSuccess}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  brandBadgeText: {
    color: '#008D4C',
    fontSize: 12,
    fontWeight: '700',
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  bigScanBtn: {
    backgroundColor: '#008D4C',
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#008D4C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 24,
  },
  bigScanIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  bigScanBtnTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  bigScanBtnSub: {
    color: '#D1FAE5',
    fontSize: 13,
    marginTop: 4,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    marginHorizontal: 12,
  },
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  urlInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    marginBottom: 12,
  },
  actionBtn: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  demoSection: {
    gap: 8,
  },
  demoSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  demoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  demoChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  webViewWrapper: {
    flex: 1,
  },
  webHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 10,
  },
  backBtn: {
    padding: 4,
  },
  webHeaderInfo: {
    flex: 1,
  },
  webHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  webHeaderUrl: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  extractBtn: {
    backgroundColor: '#008D4C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  extractBtnDisabled: {
    opacity: 0.6,
  },
  extractBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  floatingTip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#A7F3D0',
  },
  floatingTipText: {
    flex: 1,
    fontSize: 12,
    color: '#065F46',
    lineHeight: 16,
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
})
