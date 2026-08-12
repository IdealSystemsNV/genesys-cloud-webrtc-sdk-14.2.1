import GenesysCloudWebrtcSdk from '../client';
import { IAudioProcessor } from "./interface";
export declare class SdkAudioProcessor {
    protected sdk: GenesysCloudWebrtcSdk;
    private audioProcessor?;
    constructor(sdk: GenesysCloudWebrtcSdk, audioProcessor?: IAudioProcessor);
    /**
     * Whether an audio processor is actually configured. This wrapper is always
     * instantiated (so consumers can call `setAudioProcessor` after SDK init), so
     * callers must use this to determine if outbound audio should be processed.
     */
    get isEnabled(): boolean;
    /**
     * Set the audio processor for enhanced noise suppression. This can be called
     * as part of SDK initialization based on configuration or after SDK initialization.
     * @param audioProcessor
     * @returns void
     */
    setAudioProcessor(audioProcessor: IAudioProcessor): void;
    /**
     * Initialize the audio processor for enhanced noise suppression. This will
     * initialize the audio processor and start the audio context.
     * @returns void
     */
    init(): Promise<void>;
    /**
     * Begin processing the audio stream for enhanced noise suppression. This will
     * pass the audio stream into the audio processor. Unfiltered audio will never leave the user's machine.
     * @param audioStream - the audio stream to process.
     * @returns the processed audio stream.
     */
    process(audioStream: MediaStream): Promise<MediaStream>;
    /**
     * Destroy the audio processor for enhanced noise suppression. This will
     * stop the audio context and clean up the audio processor.
     * @returns void
     */
    destroy(): Promise<void>;
}
