import RPC from '../src/RPC'
import { Application } from '@adonisjs/application'

export default class RPCProvider {
  public static needsApplication = true
  constructor(protected app: Application) {}

  public async register(): Promise<void> {
    this.app.container.singleton('Hermes/RPC', () => {
      const config = this.app.container.use('Adonis/Core/Config').get('rpc', {})
      return new RPC(config)
    })
  }
  public async boot(): Promise<void> {}
}
