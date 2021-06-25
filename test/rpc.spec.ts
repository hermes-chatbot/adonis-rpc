import test from 'japa'
import AdonisApplication from 'adonis-provider-tester'
import RPCProvider from '../providers/RPCProvider'
import { RPCManagerContract } from '@ioc:Hermes/RPC'

test.group('Adonis RPC Provider', (group) => {
  let app: AdonisApplication
  let rpc: RPCManagerContract
  group.before(async () => {
    app = await AdonisApplication.initApplication(
      [RPCProvider],
      [
        {
          configName: 'rpc',
          appConfig: {
            transport: 'redis',
            transports: {
              redis: {
                driver: 'redis',
                channels: {
                  request: 'rpc:req',
                  response: 'rpc:res',
                },
              },
            },
          },
        },
      ]
    )
    rpc = app.application.container.use('Hermes/RPC')
  })

  group.after(async () => {
    await app.stopServer()
  })

  test('should be able to register and call a method', async (assert) => {
    rpc.use().register('test', (data) => {
      return data.toUpperCase()
    })
    const { data } = await rpc.use().call('test', 'test')
    assert.equal(data, 'TEST')
  })

  test('should be able to call a diferent instance method', async () => {})
})
