import type { HttpContext } from '@adonisjs/core/http'
import { NfceService } from '#services/nfce_service'

export default class NfceController {
  /**
   * POST /api/v1/nfce/validate
   * Valida URL da SEFAZ ou Chave de Acesso (RN02 e RN07)
   */
  async validate({ request, response }: HttpContext) {
    const { url, accessKey } = request.only(['url', 'accessKey'])
    const input = url || accessKey

    if (!input) {
      return response.status(400).json({
        errors: [{ message: 'É obrigatório informar "url" ou "accessKey" para validação.' }],
      })
    }

    const result = NfceService.validate(input)

    if (!result.isEligible) {
      return response.status(422).json({
        data: result,
        message: result.reasons[0] || 'NFC-e inelegível para cômputo de pontos.',
      })
    }

    return response.status(200).json({
      data: result,
      message: 'NFC-e validada com sucesso!',
    })
  }

  /**
   * POST /api/v1/nfce/parse
   * Processa o HTML ou URL da NFC-e e extrai itens, totais e cômputo de pontos
   */
  async parse({ request, response }: HttpContext) {
    const { html, url, accessKey, factor } = request.only(['html', 'url', 'accessKey', 'factor'])
    const input = url || accessKey || html

    if (!input) {
      return response.status(400).json({
        errors: [{ message: 'É necessário fornecer "html", "url" ou "accessKey".' }],
      })
    }

    // Se temos HTML para processar
    if (html) {
      const parsed = NfceService.parseHtml(html, url, factor ? Number(factor) : 1.0)
      return response.status(200).json({
        data: parsed,
        message: 'NFC-e processada com sucesso!',
      })
    }

    // Se temos apenas a URL ou chave
    const validation = NfceService.validate(input)
    if (!validation.isEligible) {
      return response.status(422).json({
        data: validation,
        message: validation.reasons[0] || 'NFC-e inelegível.',
      })
    }

    return response.status(200).json({
      data: {
        chaveAcesso: validation.chaveAcesso,
        uf: validation.uf,
        isEligible: true,
      },
      message: 'Chave de acesso validada com sucesso.',
    })
  }

  /**
   * POST /api/v1/nfce/submit
   * Processa, valida e credita uma NFC-e na carteira do consumidor autenticado (RN01-RN07)
   */
  async submit({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const { url, accessKey, html, factor } = request.only(['url', 'accessKey', 'html', 'factor'])

    try {
      const result = await NfceService.submitNfce({
        userId: user.id,
        url,
        accessKey,
        html,
        factor: factor ? Number(factor) : undefined,
      })

      return response.status(201).json({
        data: result,
        message: 'NFC-e processada e pontos creditados com sucesso!',
      })
    } catch (err: any) {
      return response.status(422).json({
        errors: [{ message: err.message || 'Erro ao processar e creditar NFC-e.' }],
      })
    }
  }
}
