export interface IAudioProcessor {
    readonly name: string;
    readonly id: string;
    init: () => Promise<void>;
    process: (audioStream: MediaStream) => Promise<MediaStream>;
    destroy: () => Promise<void>;
}
