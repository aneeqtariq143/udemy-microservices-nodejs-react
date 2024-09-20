import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    private _client?: Stan;

    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS client before connecting');
        }
        return this._client;
    }

    async connect(clusterId: string, clientId: string, url: string, retries: number = 5, delay: number = 5000) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                this._client = nats.connect(clusterId, clientId, { url });

                await new Promise<void>((resolve, reject) => {
                    this._client!.on('connect', () => {
                        console.log('Connected to NATS');
                        resolve();
                    });

                    this._client!.on('error', (err) => {
                        reject(err);
                    });
                });

                // Exit the loop if connection is successful
                break;
            } catch (err) {
                console.error(`Attempt ${attempt} - Failed to connect to NATS: ${err}`);

                if (attempt === retries) {
                    throw new Error('Failed to connect to NATS after multiple attempts');
                }

                // Calculate exponential backoff with jitter
                const exponentialDelay = Math.min(Math.pow(2, attempt) * 1000, 30000); // Cap at 30 seconds
                const jitter = Math.random() * 1000; // Add up to 1 second of randomness
                const totalDelay = exponentialDelay + jitter;

                console.log(`Retrying connection in ${totalDelay}ms...`);

                await new Promise(res => setTimeout(res, totalDelay));
            }
        }
    }
}

export const natsWrapper = new NatsWrapper();