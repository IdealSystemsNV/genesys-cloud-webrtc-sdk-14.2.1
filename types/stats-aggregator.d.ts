import GenesysCloudWebrtSdk, { IExtendedMediaSession } from ".";
export declare class StatsAggregator {
    private session;
    private sdk;
    private statsGatherer?;
    private setBaseline;
    private baselinePacketsReceived;
    private baselinePacketsLost;
    private baselineRtt;
    private baselineRttMeasurements;
    private totalJitter;
    private jitterMeasurements;
    private boundStatsHandler?;
    constructor(session: IExtendedMediaSession, sdk: GenesysCloudWebrtSdk);
    private shouldGatherImmediately;
    private startGatheringStats;
    private stopGatheringStats;
    private onSessionStarted;
    private onPrivateSessionEnded;
    private isGetStatsEvent;
    private handleStatsUpdate;
    /**
     * Calculates an estimated MOS (Mean Opinion Score) based on statistics from WebRTC's `getStats`.
     *
     * @param averageLatency The average latency for the call, measured in seconds. e.g. `0.071869`
     * @param averageJitter The average jitter for the call, measured in seconds. e.g. `0.0008539`
     * @param packetLoss The decimal representation of the packet loss over the duration of the call. e.g. 1% packet loss should be passed in as `0.01`
     *
     * @returns An estimated MOS ranging from 1.0 to 5.0.
     */
    private calculateEstimatedMos;
    private sendStats;
}
