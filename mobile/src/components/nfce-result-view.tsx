import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { NfceData, formatCurrency } from '@/utils/nfce-parser'
import { mobileApi } from '@/services/api'

interface NfceResultViewProps {
  data: NfceData
  onReset: () => void
}

export function NfceResultView({ data, onReset }: NfceResultViewProps) {
  const [copiedKey, setCopiedKey] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [syncSuccess, setSyncSuccess] = useState(false)

  const handleCopyKey = async () => {
    try {
      await Clipboard.setStringAsync(data.info.chaveAcesso)
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 2000)
    } catch {
      Alert.alert('Chave copiada!', data.info.chaveAcesso)
    }
  }

  const handleSyncWithApi = async () => {
    setSyncing(true)
    try {
      // Tenta submeter na API oficial de cômputo
      const response = await mobileApi.submitNfce({
        accessKey: data.info.chaveAcesso,
        url: data.url,
      })

      if (response?.data?.nfce || response?.data?.isEligible) {
        setSyncSuccess(true)
        try {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
        } catch {
          // ignore
        }
        Alert.alert(
          'Sucesso no Cash Me! 🎉',
          `NFC-e processada e registrada com sucesso no banco de dados!\n+${data.pontosCalculados} pontos creditados.`
        )
      } else {
        // Se a rota requerer auth ou retornar aviso
        const valRes = await mobileApi.validateNfce({
          accessKey: data.info.chaveAcesso,
          url: data.url,
        })

        if (valRes?.data?.isEligible) {
          setSyncSuccess(true)
          Alert.alert(
            'NFC-e Validada na API! 🎉',
            `Chave válida na SEFAZ ${valRes.data.uf}.\nElegível para pontuação (+${data.pontosCalculados} pts).`
          )
        } else {
          Alert.alert('Aviso da API', valRes?.message || response?.message || 'NFC-e processada.')
        }
      }
    } catch (err: any) {
      Alert.alert(
        'Aviso de Conexão',
        'Não foi possível conectar ao servidor local AdonisJS (:3333). Os dados foram validados no dispositivo.'
      )
    } finally {
      setSyncing(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Card Principal de Pontuação Cash Me */}
      <View style={styles.pointsCard}>
        <View style={styles.pointsBadge}>
          <Ionicons name="sparkles" size={16} color="#B45309" />
          <Text style={styles.pointsBadgeText}>Pontos Calculados (RN03)</Text>
        </View>
        <Text style={styles.pointsValue}>+{data.pontosCalculados} pts</Text>
        <Text style={styles.pointsSubtext}>
          Equivalente a {formatCurrency(data.totais.valorPagar)} em compras locais
        </Text>
      </View>

      {/* Card do Estabelecimento Emissor */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="business-outline" size={20} color="#008D4C" />
          <Text style={styles.cardTitle}>Dados do Emitente</Text>
          <View style={styles.ufBadge}>
            <Text style={styles.ufBadgeText}>{data.info.uf || 'SC'}</Text>
          </View>
        </View>

        <Text style={styles.razaoSocial}>{data.emitente.razaoSocial}</Text>
        <Text style={styles.cnpj}>CNPJ: {data.emitente.cnpj}</Text>

        {data.info.dataEmissao && (
          <Text style={styles.emissao}>Data de Emissão: {data.info.dataEmissao}</Text>
        )}
      </View>

      {/* Card da Chave de Acesso */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="key-outline" size={20} color="#6F35B5" />
          <Text style={styles.cardTitle}>Chave de Acesso (44 Dígitos)</Text>
        </View>

        <Text style={styles.accessKeyText} numberOfLines={2}>
          {data.info.chaveAcesso}
        </Text>

        <TouchableOpacity
          style={[styles.copyBtn, copiedKey && styles.copyBtnSuccess]}
          onPress={handleCopyKey}
        >
          <Ionicons
            name={copiedKey ? 'checkmark' : 'copy-outline'}
            size={16}
            color={copiedKey ? '#008D4C' : '#4B5563'}
          />
          <Text style={[styles.copyBtnText, copiedKey && styles.copyBtnTextSuccess]}>
            {copiedKey ? 'Chave Copiada!' : 'Copiar Chave'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Card de Totais Fiscais */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="receipt-outline" size={20} color="#111827" />
          <Text style={styles.cardTitle}>Resumo da Compra</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Quantidade de Itens</Text>
          <Text style={styles.totalVal}>{data.totais.qtdItens}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Valor Total dos Produtos</Text>
          <Text style={styles.totalVal}>{formatCurrency(data.totais.valorTotal)}</Text>
        </View>

        <View style={[styles.totalRow, styles.totalRowHighlight]}>
          <Text style={styles.totalHighlightLabel}>Valor a Pagar</Text>
          <Text style={styles.totalHighlightVal}>{formatCurrency(data.totais.valorPagar)}</Text>
        </View>
      </View>

      {/* Lista de Itens da Nota */}
      {data.itens.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cart-outline" size={20} color="#008D4C" />
            <Text style={styles.cardTitle}>Itens Processados ({data.itens.length})</Text>
          </View>

          {data.itens.map((item, idx) => (
            <View
              key={idx}
              style={[styles.itemRow, idx === data.itens.length - 1 && styles.itemRowLast]}
            >
              <View style={styles.itemInfo}>
                <Text style={styles.itemDesc} numberOfLines={2}>
                  {item.descricao}
                </Text>
                <Text style={styles.itemMeta}>
                  Cód: {item.codigo} • Qtd: {item.quantidade} {item.unidade}
                </Text>
              </View>
              <Text style={styles.itemPrice}>{formatCurrency(item.valorTotal)}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Ações Inferiores */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.syncBtn, syncSuccess && styles.syncBtnSuccess]}
          disabled={syncing}
          onPress={handleSyncWithApi}
        >
          {syncing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name={syncSuccess ? 'checkmark-circle' : 'cloud-upload-outline'}
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.syncBtnText}>
                {syncSuccess ? 'Sincronizado com a API' : 'Enviar para API Cash Me'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetBtn} onPress={onReset}>
          <Ionicons name="scan-outline" size={18} color="#008D4C" />
          <Text style={styles.resetBtnText}>Escanear Outra Nota</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  pointsCard: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  pointsBadgeText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '700',
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#065F46',
  },
  pointsSubtext: {
    fontSize: 13,
    color: '#047857',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  ufBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ufBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
  },
  razaoSocial: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  cnpj: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  emissao: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  accessKeyText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#374151',
    backgroundColor: '#F3F4F6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
    lineHeight: 18,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  copyBtnSuccess: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  copyBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  copyBtnTextSuccess: {
    color: '#008D4C',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: '#4B5563',
  },
  totalVal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  totalRowHighlight: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 6,
    paddingTop: 10,
  },
  totalHighlightLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  totalHighlightVal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#008D4C',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  itemRowLast: {
    borderBottomWidth: 0,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12,
  },
  itemDesc: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
  },
  itemMeta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  actionsContainer: {
    marginTop: 8,
    gap: 12,
  },
  syncBtn: {
    backgroundColor: '#008D4C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#008D4C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  syncBtnSuccess: {
    backgroundColor: '#059669',
  },
  syncBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  resetBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#008D4C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#008D4C',
    fontSize: 15,
    fontWeight: '700',
  },
})
