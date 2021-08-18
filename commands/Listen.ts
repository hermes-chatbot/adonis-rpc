import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class Listen extends BaseCommand {
  public static commandName = 'rpc:listen'
  public static description = 'Start the RPC server'
  public static settings = {
    loadApp: true,
    stayAlive: true,
  }

  /**
   * Execute command
   */
  public async run(): Promise<void> {
    const config = this.application.container.use('Adonis/Core/Config')

    const preloadFileName = config.get('rpc.preloadFile', 'rpc')

    const rpcFile = this.application.startPath(preloadFileName)

    await import(rpcFile)
  }
}
