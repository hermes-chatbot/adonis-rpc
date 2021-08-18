declare module '@ioc:Adonis/Core/Application' {
  import { RPCManagerContract } from '@ioc:Hermes/RPC'

  export interface ContainerBindings {
    'Hermes/RPC': RPCManagerContract
  }
}
