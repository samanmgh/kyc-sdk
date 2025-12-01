export type SDKOptions = {
    apiKey?: string
    debug?: boolean
}

export class KYC_SDK {
    private apiKey?: string
    private debug: boolean

    static version = '0.1.0'

    constructor(options: SDKOptions = {}) {
        this.apiKey = options.apiKey
        this.debug = !!options.debug
        if (this.debug) this.log('HelloWorldSDK constructed', options)
    }

    init() {
        this.log('HelloWorldSDK initialized', this.apiKey)
        return Promise.resolve({ ok: true })
    }

    identify(id: string, meta: Record<string, any> = {}) {
        this.log('identify', id, meta)
        return Promise.resolve({ id, received: meta })
    }

    track(event: string, props: Record<string, any> = {}) {
        this.log('track', event, props)
        return Promise.resolve({ event, props })
    }

    private log(...args: any[]) {
        if (this.debug) {
            console.log('[HelloWorldSDK]', ...args)
        }
    }
}

// Explicit exports for different module systems
export default KYC_SDK