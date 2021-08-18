import { RpcHandler } from '@ioc:Hermes/RPC'
import { ApplicationContract } from '@ioc:Adonis/Core/Application'

export class IocResolver {
  /**
   * A reference to the event handlers resolved from the IoC container and
   * cached. It is a map of
   *
   * [event, [namespace, resolvedHandler]]
   */
  private eventHandlers: Map<string, Map<string, RpcHandler>> = new Map()

  /**
   * Reference to AdonisJS IoC container resolver. It looks for listeners inside the
   * `App/Listeners` namespace or the namespace defined inside `eventListeners`
   * property
   */
  private containerResolver: ReturnType<ApplicationContract['container']['getResolver']>

  /**
   * A custom base namespace defined directly on the event class.
   */
  private listenersBaseNamespace?: string

  constructor(app: ApplicationContract) {
    this.containerResolver = app.container.getResolver(
      undefined,
      'rpcListeners',
      'App/Listeners/Rpc'
    )
  }

  /**
   * Returns the listener by resolving the namespace from the IoC container
   */
  private getReferenceListener(handler: string): RpcHandler {
    return (...args: any[]) => {
      return this.containerResolver.call(handler, this.listenersBaseNamespace, args)
    }
  }

  /**
   * Returns all handlers for a given event.
   */
  private getHandlersFor(event: string) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Map())
    }

    return this.eventHandlers.get(event)!
  }

  /**
   * Define custom namespace for Event listeners
   */
  public namespace(namespace: string) {
    this.listenersBaseNamespace = namespace
  }

  /**
   * Returns event handler callback for an IoC container string reference.
   * Adding same handler for the same event is noop.
   */
  public getEventHandler(event: string, handler: string): RpcHandler {
    const handlers = this.getHandlersFor(event)

    /**
     * Return the existing handler when same handler for the
     * same event already exists.
     *
     * Emittery will also re-use the same handler. So it is a noop
     * everywhere.
     */
    if (handlers.has(handler)) {
      return handlers.get(handler)!
    }

    const eventHandler = this.getReferenceListener(handler)

    /**
     * Store reference to the handler, so that we can clean it off
     * later.
     */
    handlers.set(handler, eventHandler)

    return eventHandler
  }
}
