/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import AutoSwagger from 'adonis-autoswagger'
import swagger from '#config/swagger'

router.get('/', () => {
  return { hello: 'world' }
})

// Especificação OpenAPI em formato JSON
router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// Interface Gráfica Interativa Swagger UI
router.get('/docs', async () => {
  return AutoSwagger.default.ui('/swagger', swagger)
})

const CustomerInvoicesController = () => import('#controllers/customer_invoices_controller')
const CustomerPointsController = () => import('#controllers/customer_points_controller')
const EstablishmentsController = () => import('#controllers/establishments_controller')
const EstablishmentRulesController = () => import('#controllers/establishment_rules_controller')

router
  .group(() => {
    router
      .group(() => {
        router.post('signup', [controllers.NewAccount, 'store']).as('signup')
        router
          .post('customer/signup', [
            () => import('#controllers/user_customers_controller'),
            'store',
          ])
          .as('customer.signup')
        router
          .post('establishment/signup', [
            () => import('#controllers/user_establishments_controller'),
            'store',
          ])
          .as('establishment.signup')
        router
          .post('establishment/register', [
            () => import('#controllers/user_establishments_controller'),
            'register',
          ])
          .as('establishment.register')
        router.post('login', [controllers.AccessTokens, 'store']).as('login')
      })
      .prefix('auth')
      .as('auth')

    router
      .group(() => {
        router.get('profile', [controllers.Profile, 'show']).as('profile')
        router
          .get('customer/profile', [() => import('#controllers/user_customers_controller'), 'show'])
          .as('customer.profile')
        router
          .put('customer/profile', [
            () => import('#controllers/user_customers_controller'),
            'update',
          ])
          .as('customer.update')
        router
          .get('establishment/profile', [
            () => import('#controllers/user_establishments_controller'),
            'show',
          ])
          .as('establishment.profile')
        router
          .put('establishment/profile', [
            () => import('#controllers/user_establishments_controller'),
            'update',
          ])
          .as('establishment.update')
        router.post('logout', [controllers.AccessTokens, 'destroy']).as('logout')
        router
          .get('points/balance', [() => import('#controllers/points_controller'), 'balance'])
          .as('points.balance')
        router
          .get('points/transactions', [
            () => import('#controllers/points_controller'),
            'transactions',
          ])
          .as('points.transactions')
        router
          .post('points/redeem', [() => import('#controllers/points_controller'), 'redeem'])
          .as('points.redeem')
      })
      .prefix('account')
      .as('account')
      .use(middleware.auth())

    // Rotas do Consumidor (NFC-e e Pontos)
    router
      .group(() => {
        router
          .post('invoices/process', [CustomerInvoicesController, 'process'])
          .as('invoices.process')
        router.get('invoices', [CustomerInvoicesController, 'index']).as('invoices.index')
        router.get('invoices/:id', [CustomerInvoicesController, 'show']).as('invoices.show')
        router.get('balances', [CustomerPointsController, 'balances']).as('balances')
        router
          .get('establishments/:establishmentId/statement', [CustomerPointsController, 'statement'])
          .as('statement')
      })
      .prefix('customer')
      .as('customer')
      .use(middleware.auth())

    // Rotas de Estabelecimentos (CRUD, Endereço e Aprovação)
    router
      .group(() => {
        router.get('/', [EstablishmentsController, 'index']).as('index')
        router.get('/:id', [EstablishmentsController, 'show']).as('show')
        router.post('/', [EstablishmentsController, 'store']).as('store')
        router.put('/:id', [EstablishmentsController, 'update']).as('update')
        router.get('/:id/address', [EstablishmentsController, 'showAddress']).as('showAddress')
        router.put('/:id/address', [EstablishmentsController, 'updateAddress']).as('updateAddress')
        router
          .patch('/:id/approve', [EstablishmentsController, 'approve'])
          .as('approve')
          .use([middleware.auth(), middleware.role(['SUPER_ADMIN'])])
      })
      .prefix('establishments')
      .as('establishments')

    // Rotas de Regras de Fidelidade do Lojista (Task #6)
    router
      .group(() => {
        router.get('loyalty-rule', [EstablishmentRulesController, 'show']).as('loyaltyRule.show')
        router
          .get('loyalty-rule/simulate', [EstablishmentRulesController, 'simulate'])
          .as('loyaltyRule.simulate')
        router
          .get('loyalty-rule/history', [EstablishmentRulesController, 'history'])
          .as('loyaltyRule.history')
        router
          .put('loyalty-rule', [EstablishmentRulesController, 'update'])
          .as('loyaltyRule.update')
          .use(middleware.role(['LOJISTA_ADMIN', 'SUPER_ADMIN']))
      })
      .prefix('establishment')
      .as('establishment')
      .use([
        middleware.auth(),
        middleware.role(['LOJISTA_ADMIN', 'LOJISTA_OPERADOR', 'SUPER_ADMIN']),
      ])

    // Rotas de Validação e Submissão de NFC-e
    router
      .group(() => {
        router
          .post('validate', [() => import('#controllers/nfce_controller'), 'validate'])
          .as('validate')
        router.post('parse', [() => import('#controllers/nfce_controller'), 'parse']).as('parse')
        router
          .post('submit', [() => import('#controllers/nfce_controller'), 'submit'])
          .as('submit')
          .use(middleware.auth())
      })
      .prefix('nfce')
      .as('nfce')
  })
  .prefix('/api/v1')
