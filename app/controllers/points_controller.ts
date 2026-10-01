import type { HttpContext } from '@adonisjs/core/http'
import PointBalance from '#models/point_balance'
import PointTransaction from '#models/point_transaction'
import Establishment from '#models/establishment'
import UserCustomer from '#models/user_customer'
import db from '@adonisjs/lucid/services/db'

export default class PointsController {
  private async getOrCreateCustomerId(user: any): Promise<number> {
    await user.load((loader: any) => loader.load('customerProfile'))
    if (user.customerProfile) {
      return user.customerProfile.id
    }
    const customer = await UserCustomer.create({
      userId: user.id,
      fullName: user.email.split('@')[0],
    })
    return customer.id
  }

  /**
   * GET /api/v1/account/points/balance
   * Retorna os saldos de pontos do usuário autenticado (consolidado e por loja)
   */
  async balance({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const customerId = await this.getOrCreateCustomerId(user)

    const balances = await PointBalance.query()
      .where('customerId', customerId)
      .preload('establishment')

    const totalBalance = balances.reduce((sum, b) => sum + Number(b.currentBalance || 0), 0)
    const totalAccumulated = balances.reduce((sum, b) => sum + Number(b.totalAccumulated || 0), 0)

    return response.status(200).json({
      data: {
        totalBalance,
        totalAccumulated,
        byEstablishment: balances.map((b) => ({
          establishmentId: b.establishmentId,
          establishmentName: b.establishment?.tradeName || b.establishment?.legalName || 'Loja',
          saldoAtual: Number(b.currentBalance || 0),
          totalAcumulado: Number(b.totalAccumulated || 0),
        })),
      },
    })
  }

  /**
   * GET /api/v1/account/points/transactions
   * Retorna o extrato de movimentações (créditos e resgates) do usuário autenticado
   */
  async transactions({ auth, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const customerId = await this.getOrCreateCustomerId(user)

    const transactions = await PointTransaction.query()
      .where('customerId', customerId)
      .preload('establishment')
      .orderBy('createdAt', 'desc')

    return response.status(200).json({
      data: transactions.map((t) => ({
        id: t.id,
        tipo: t.type === 'CREDIT' ? 'CREDITO' : 'DEBITO',
        type: t.type,
        pontos: Number(t.points),
        points: Number(t.points),
        descricao: t.description,
        description: t.description,
        valorCompra: t.purchaseAmount ? Number(t.purchaseAmount) : null,
        purchaseAmount: t.purchaseAmount ? Number(t.purchaseAmount) : null,
        fatorConversao: t.appliedConversionFactor ? Number(t.appliedConversionFactor) : null,
        establishment: t.establishment
          ? {
              id: t.establishment.id,
              nome: t.establishment.tradeName || t.establishment.legalName,
              tradeName: t.establishment.tradeName,
            }
          : null,
        createdAt: t.createdAt.toISO(),
      })),
    })
  }

  /**
   * POST /api/v1/account/points/redeem
   * Resgate de pontos por recompensa/voucher em um estabelecimento específico
   */
  async redeem({ auth, request, response }: HttpContext) {
    const user = auth.getUserOrFail()
    const customerId = await this.getOrCreateCustomerId(user)
    const { establishmentId, pontos, points, descricao, description } = request.only([
      'establishmentId',
      'pontos',
      'points',
      'descricao',
      'description',
    ])

    const pointsToRedeem = Number(pontos || points)
    if (!pointsToRedeem || pointsToRedeem <= 0) {
      return response.status(400).json({
        errors: [{ message: 'Quantidade de pontos inválida para resgate.' }],
      })
    }

    try {
      const result = await db.transaction(async (trx) => {
        const balance = await PointBalance.query({ client: trx })
          .where('customerId', customerId)
          .where('establishmentId', establishmentId)
          .forUpdate()
          .first()

        if (!balance || Number(balance.currentBalance) < pointsToRedeem) {
          throw new Error('Saldo insuficiente de pontos neste estabelecimento para este resgate.')
        }

        const establishment = await Establishment.findOrFail(establishmentId, { client: trx })

        balance.useTransaction(trx)
        balance.currentBalance = Number(balance.currentBalance) - pointsToRedeem
        await balance.save()

        const tx = new PointTransaction()
        tx.useTransaction(trx)
        tx.customerId = customerId
        tx.establishmentId = establishment.id
        tx.type = 'DEBIT'
        tx.points = -pointsToRedeem
        tx.description =
          descricao || description || `Resgate de recompensa em ${establishment.tradeName}`
        await tx.save()

        return {
          novoSaldo: balance.currentBalance,
          newBalance: balance.currentBalance,
          pontosResgatados: pointsToRedeem,
          establishment: establishment.tradeName,
          transactionId: tx.id,
        }
      })

      return response.status(200).json({
        data: result,
        message: 'Resgate efetuado com sucesso!',
      })
    } catch (err: any) {
      return response.status(422).json({
        errors: [{ message: err.message || 'Erro ao realizar resgate.' }],
      })
    }
  }
}
