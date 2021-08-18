import RPC from '../src/RPC'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export default class RPCProvider {
  public static needsApplication = true
  constructor(protected app: ApplicationContract) {}

  public async register(): Promise<void> {
    this.app.container.singleton('Hermes/RPC', () => {
      const config = this.app.container.use('Adonis/Core/Config').get('rpc', {})
      return new RPC(config, this.app)
    })
  }
  public async boot(): Promise<void> {}
}
