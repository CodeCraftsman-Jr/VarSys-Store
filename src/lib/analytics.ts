// Analytics Event Types for MongoDB Tracking

export interface AnalyticsEvent {
    userId: string;
    sessionId: string;
    app: AppName;
    platform: Platform;
    operation: OperationType;
    collection: string;
    documentCount?: number;
    documentId?: string;
    page: string;
    timestamp: Date;
    metadata?: Record<string, unknown>;
}

export type AppName = 'traquify' | 'joint-journey' | 'cooksuite' | 'varsys-store';
export type Platform = 'web' | 'mobile';
export type OperationType = 'read' | 'create' | 'update' | 'delete';

export interface AnalyticsConfig {
    app: AppName;
    platform: Platform;
    apiUrl: string;
    userId?: string;
    enabled?: boolean;
}

export interface TrackReadOptions {
    collection: string;
    page: string;
    documentCount?: number;
    metadata?: Record<string, unknown>;
}

export interface TrackWriteOptions {
    collection: string;
    operation: 'create' | 'update' | 'delete';
    page: string;
    documentId?: string;
    metadata?: Record<string, unknown>;
}

// Analytics Service - fire-and-forget pattern for non-blocking tracking
class AnalyticsService {
    private config: AnalyticsConfig | null = null;
    private sessionId: string = '';
    private eventBuffer: AnalyticsEvent[] = [];
    private flushTimeout: ReturnType<typeof setTimeout> | null = null;
    private readonly BUFFER_SIZE = 10;
    private readonly FLUSH_INTERVAL = 5000;

    init(config: AnalyticsConfig): void {
        this.config = { enabled: true, ...config };
        this.sessionId = this.generateSessionId();
        console.log(`[Analytics] Initialized for ${config.app} (${config.platform}), session: ${this.sessionId}`);
    }

    setUserId(userId: string): void {
        if (this.config) {
            this.config.userId = userId;
        }
    }

    clearUserId(): void {
        if (this.config) {
            this.config.userId = undefined;
        }
    }

    trackRead(options: TrackReadOptions): void {
        if (!this.isEnabled()) return;
        this.queueEvent(this.createEvent({ operation: 'read', ...options }));
    }

    trackWrite(options: TrackWriteOptions): void {
        if (!this.isEnabled()) return;
        this.queueEvent(this.createEvent(options));
    }

    private generateSessionId(): string {
        return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
    }

    private isEnabled(): boolean {
        return !!(this.config && this.config.enabled && this.config.apiUrl);
    }

    private createEvent(options: Partial<AnalyticsEvent> & { collection: string; page: string }): AnalyticsEvent {
        return {
            userId: this.config?.userId || 'anonymous',
            sessionId: this.sessionId,
            app: this.config!.app,
            platform: this.config!.platform,
            operation: options.operation || 'read',
            collection: options.collection,
            page: options.page,
            documentCount: options.documentCount,
            documentId: options.documentId,
            timestamp: new Date(),
            metadata: options.metadata,
        };
    }

    private queueEvent(event: AnalyticsEvent): void {
        this.eventBuffer.push(event);
        if (this.eventBuffer.length >= this.BUFFER_SIZE) {
            this.flush();
            return;
        }
        if (!this.flushTimeout) {
            this.flushTimeout = setTimeout(() => this.flush(), this.FLUSH_INTERVAL);
        }
    }

    flush(): void {
        if (this.eventBuffer.length === 0 || !this.config?.apiUrl) return;
        if (this.flushTimeout) {
            clearTimeout(this.flushTimeout);
            this.flushTimeout = null;
        }
        const events = [...this.eventBuffer];
        this.eventBuffer = [];

        fetch(this.config.apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ events }),
        }).catch((error) => {
            console.warn('[Analytics] Failed to send events:', error);
            if (this.eventBuffer.length < 100) {
                this.eventBuffer.unshift(...events);
            }
        });
    }

    getSessionId(): string {
        return this.sessionId;
    }
}

export const analytics = new AnalyticsService();

// Tracked Databases Wrapper - wraps Appwrite Databases to auto-track operations
import { Databases } from 'appwrite';
import type { Models } from 'appwrite';

type DatabasesInstance = InstanceType<typeof Databases>;

export function createTrackedDatabases(
    databases: DatabasesInstance,
    getCurrentPage: () => string = () => typeof window !== 'undefined' ? window.location?.pathname || 'unknown' : 'unknown'
): DatabasesInstance {
    return new Proxy(databases, {
        get(target, prop, receiver) {
            const original = Reflect.get(target, prop, receiver);
            if (typeof original !== 'function') return original;

            switch (prop) {
                case 'listDocuments':
                    return async function (databaseId: string, collectionId: string, queries?: string[]): Promise<Models.DocumentList<Models.Document>> {
                        const result = await original.call(target, databaseId, collectionId, queries);
                        analytics.trackRead({ collection: collectionId, page: getCurrentPage(), documentCount: result.documents.length });
                        return result;
                    };

                case 'getDocument':
                    return async function (databaseId: string, collectionId: string, documentId: string, queries?: string[]): Promise<Models.Document> {
                        const result = await original.call(target, databaseId, collectionId, documentId, queries);
                        analytics.trackRead({ collection: collectionId, page: getCurrentPage(), documentCount: 1 });
                        return result;
                    };

                case 'createDocument':
                    return async function (databaseId: string, collectionId: string, documentId: string, data: object, permissions?: string[]): Promise<Models.Document> {
                        const result = await original.call(target, databaseId, collectionId, documentId, data, permissions);
                        analytics.trackWrite({ collection: collectionId, operation: 'create', page: getCurrentPage(), documentId: result.$id });
                        return result;
                    };

                case 'updateDocument':
                    return async function (databaseId: string, collectionId: string, documentId: string, data?: object, permissions?: string[]): Promise<Models.Document> {
                        const result = await original.call(target, databaseId, collectionId, documentId, data, permissions);
                        analytics.trackWrite({ collection: collectionId, operation: 'update', page: getCurrentPage(), documentId });
                        return result;
                    };

                case 'deleteDocument':
                    return async function (databaseId: string, collectionId: string, documentId: string): Promise<{}> {
                        const result = await original.call(target, databaseId, collectionId, documentId);
                        analytics.trackWrite({ collection: collectionId, operation: 'delete', page: getCurrentPage(), documentId });
                        return result;
                    };

                default:
                    return original.bind(target);
            }
        },
    });
}
