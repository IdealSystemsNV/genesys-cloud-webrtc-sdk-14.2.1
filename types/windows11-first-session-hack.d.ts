export declare const isWindows11: () => Promise<boolean | undefined>;
export declare const doBasicWebrtcSession: (iceServers: RTCIceServer[]) => Promise<void>;
export declare function setupWebrtcForWindows11(iceServers: RTCIceServer[]): Promise<void>;
