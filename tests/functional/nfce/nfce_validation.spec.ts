import { test } from '@japa/runner'

test.group('NFC-e Validation & Parsing API', () => {
  const validScKey = '42260900012345000189650010000123451000485001'
  const validPrKey = '41260900098765000112650010000987651001320002'
  const invalidSpKey = '35260900098765000112650010000987651001320002'

  test('deve validar com sucesso uma URL da SEFAZ Santa Catarina (RN07)', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/v1/nfce/validate').json({
      url: `https://sat.sef.sc.gov.br/nfce/consulta?p=${validScKey}|2|1|1|ABCD`,
    })

    response.assertStatus(200)
    const body = (response.body() as any).data || (response.body() as any)
    assert.equal(body.uf, 'SC')
    assert.equal(body.chaveAcesso, validScKey)
    assert.isTrue(body.isEligible)
  })

  test('deve validar com sucesso uma URL da SEFAZ Paraná (RN07)', async ({ client, assert }) => {
    const response = await client.post('/api/v1/nfce/validate').json({
      url: `http://www.fazenda.pr.gov.br/nfce/qrcode?p=${validPrKey}|2|1|1|WXYZ`,
    })

    response.assertStatus(200)
    const body = (response.body() as any).data || (response.body() as any)
    assert.equal(body.uf, 'PR')
    assert.equal(body.chaveAcesso, validPrKey)
    assert.isTrue(body.isEligible)
  })

  test('deve rejeitar URL da SEFAZ de estado fora do MVP (ex: SP - RN07)', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/v1/nfce/validate').json({
      url: `https://www.nfce.fazenda.sp.gov.br/consulta?p=${invalidSpKey}`,
    })

    response.assertStatus(422)
    const body = response.body() as any
    assert.exists(body.message)
    assert.include(body.message, 'RN07')
  })

  test('deve rejeitar chave de acesso com menos de 44 dígitos (RN02)', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/api/v1/nfce/validate').json({
      accessKey: '12345',
    })

    response.assertStatus(422)
    const body = response.body() as any
    assert.exists(body.message)
  })

  test('deve processar HTML de NFC-e e extrair itens e cômputo de pontos', async ({
    client,
    assert,
  }) => {
    const sampleHtml = `
      <html>
        <body>
          <div class="txtTopo">Padaria e Confeitaria Bella Vista Ltda</div>
          <span>CNPJ: 12.345.678/0001-90</span>
          <table>
            <tr>
              <td><span class="txtTit">Pão Francês Tradicional 500g</span></td>
              <td><span class="RCod">00102</span></td>
              <td><span class="Rqty">1</span></td>
              <td><span class="Rval">8,50</span></td>
            </tr>
            <tr>
              <td><span class="txtTit">Café Especial Torrado 250g</span></td>
              <td><span class="RCod">00204</span></td>
              <td><span class="Rqty">2</span></td>
              <td><span class="Rval">24,00</span></td>
            </tr>
          </table>
          <label>Valor a pagar</label>
          <span class="txtMax">32,50</span>
          <span>Chave: ${validScKey}</span>
        </body>
      </html>
    `

    const response = await client.post('/api/v1/nfce/parse').json({
      html: sampleHtml,
      factor: 1.0,
    })

    response.assertStatus(200)
    const body = (response.body() as any).data || (response.body() as any)
    assert.equal(body.emitente.cnpj, '12.345.678/0001-90')
    assert.include(body.emitente.razaoSocial, 'Bella Vista')
    assert.lengthOf(body.itens, 2)
    assert.equal(body.totais.valorPagar, 32.5)
    assert.equal(body.pontosEstimados, 32)
    assert.equal(body.uf, 'SC')
  })
})
