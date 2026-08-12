export declare class HeadsetChangesQueue {
    static toDoQueue: any[];
    static processingPromise: boolean;
    static queueHeadsetChanges(fn: () => Promise<unknown> | unknown): Promise<void>;
    static dequeueHeadsetChanges(): Promise<boolean>;
    static clearQueue(): void;
}
