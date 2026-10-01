import { test } from '@japa/runner'
import User from '#models/user'
import Invoice from '#models/invoice'
import PointBalance from '#models/point_balance'
import PointTransaction from '#models/point_transaction'
import Establishment from '#models/establishment'
import { NfceService } from '#services/nfce_service'

test.group('NFC-e Submission & Multi-Tenant Loyalty Ledger API', (group) => {
  const baseKeyPrefix = '422609123456780001996500100005544310009988'

  group.each.setup(async () => {
    // Limpeza de registros de teste e reset de cache
    NfceService.resetProcessedKeys()
    await Invoice.query().where('accessKey', 'like', `${baseKeyPrefix}%`).delete()
    const user = await User.findBy('email', 'loyalty.user@example.com')
    if (user) {
      await user.load('customerProfile')
      if (user.customerProfile) {
        await PointTransaction.query().where('customerId', user.customerProfile.id).delete()
        await PointBalance.query().where('customerId', user.customerProfile.id).delete()
        await user.customerProfile.delete()
      }
      await user.delete()
    }
    await Establishment.query().where('cnpj', '12345678000199').delete()
  })

  test('deve processar uma NFC-e válida, computar pontos, salvar nota e atualizar saldo no banco', async ({
    client,
    assert,
  }) => {
    const key = `${baseKeyPrefix}01`

    // 1. Cria usuário consumidor e token
    const user = await User.create({
      email: 'loyalty.user@example.com',
      password: 'password123',
      userType: 'CUSTOMER',
    })
    const token = await User.accessTokens.create(user)

    // 2. Submete a NFC-e autenticado
    const response = await client
      .post('/api/v1/nfce/submit')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({
        accessKey: key,
        factor: 1.0,
      })

    response.assertStatus(201)
    const body = (response.body() as any).data

    assert.equal(body.nfce.chaveAcesso, key)
    assert.equal(body.nfce.uf, 'SC')
    assert.isAbove(body.nfce.pontosGerados, 0)
    assert.equal(body.saldo.atual, body.nfce.pontosGerados)
    assert.equal(body.establishment.cnpj, '12345678000199')

    // 3. Valida persistência direta no banco de dados SQLite
    const dbInvoice = await Invoice.findBy('accessKey', key)
    assert.isNotNull(dbInvoice)

    const dbBalance = await PointBalance.query()
      .where('establishmentId', body.establishment.id)
      .first()
    assert.isNotNull(dbBalance)
    assert.equal(Number(dbBalance!.currentBalance), body.nfce.pontosGerados)

    const dbTx = await PointTransaction.query().where('invoiceId', dbInvoice!.id).first()
    assert.isNotNull(dbTx)
    assert.equal(dbTx!.type, 'CREDIT')
  })

  test('deve rejeitar submissão duplicada da mesma nota fiscal (Anti-Fraude RN02)', async ({
    client,
    assert,
  }) => {
    const key = `${baseKeyPrefix}02`
    const user = await User.create({
      email: 'loyalty.user@example.com',
      password: 'password123',
      userType: 'CUSTOMER',
    })
    const token = await User.accessTokens.create(user)

    // Primeira submissão com sucesso
    const res1 = await client
      .post('/api/v1/nfce/submit')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({ accessKey: key })
    res1.assertStatus(201)

    // Segunda submissão com a MESMA chave
    const res2 = await client
      .post('/api/v1/nfce/submit')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({ accessKey: key })

    res2.assertStatus(422)
    const errBody = res2.body() as any
    assert.include(errBody.errors[0].message, 'RN02')
  })

  test('deve consultar saldo consolidado e extrato de transações do usuário', async ({
    client,
    assert,
  }) => {
    const key = `${baseKeyPrefix}03`
    const user = await User.create({
      email: 'loyalty.user@example.com',
      password: 'password123',
      userType: 'CUSTOMER',
    })
    const token = await User.accessTokens.create(user)

    // Submete uma nota
    const subRes = await client
      .post('/api/v1/nfce/submit')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({ accessKey: key })
    subRes.assertStatus(201)

    // Consulta saldo
    const balanceRes = await client
      .get('/api/v1/account/points/balance')
      .header('Authorization', `Bearer ${token.value!.release()}`)
    balanceRes.assertStatus(200)
    assert.isAbove(balanceRes.body().data.totalBalance, 0)

    // Consulta extrato
    const txRes = await client
      .get('/api/v1/account/points/transactions')
      .header('Authorization', `Bearer ${token.value!.release()}`)
    txRes.assertStatus(200)
    assert.lengthOf(txRes.body().data, 1)
    assert.equal(txRes.body().data[0].tipo, 'CREDITO')
  })

  test('deve realizar resgate de pontos (DEBITO) com validação de saldo', async ({
    client,
    assert,
  }) => {
    const key = `${baseKeyPrefix}04`
    const user = await User.create({
      email: 'loyalty.user@example.com',
      password: 'password123',
      userType: 'CUSTOMER',
    })
    const token = await User.accessTokens.create(user)

    // Submete uma nota para ganhar 50 pontos
    const subRes = await client
      .post('/api/v1/nfce/submit')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({ accessKey: key })
    subRes.assertStatus(201)
    const estId = (subRes.body() as any).data.establishment.id

    // Resgata 20 pontos
    const redeemRes = await client
      .post('/api/v1/account/points/redeem')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({
        establishmentId: estId,
        pontos: 20,
        descricao: 'Resgate de Voucher Desconto R$ 5,00',
      })
    redeemRes.assertStatus(200)
    assert.equal(Number((redeemRes.body() as any).data.novoSaldo), 30)

    // Tenta resgatar mais do que tem (ex: 100 pontos)
    const failRes = await client
      .post('/api/v1/account/points/redeem')
      .header('Authorization', `Bearer ${token.value!.release()}`)
      .json({
        establishmentId: estId,
        pontos: 100,
      })
    failRes.assertStatus(422)
    assert.include((failRes.body() as any).errors[0].message, 'Saldo insuficiente')
  })
})
