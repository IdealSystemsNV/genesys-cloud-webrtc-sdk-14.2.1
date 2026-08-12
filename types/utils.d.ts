import { ConnectionState, RequestApiOptions } from 'genesys-cloud-streaming-client';
import { RetryPromise } from 'genesys-cloud-streaming-client/src/utils';
import { GenesysCloudWebrtcSdk } from './client';
import { SdkErrorTypes, LogLevels } from './types/enums';
import { IPendingSession, ISessionInfo } from './types/interfaces';
import { ILogger } from 'genesys-cloud-client-logger';
import { ConversationUpdate } from './conversations/conversation-update';
export declare class SdkError extends Error {
    type: SdkErrorTypes;
    details: any;
    constructor(errorType: SdkErrorTypes | null, messageOrError: string | Error, details?: any);
}
/**
 * This will create an `SdkError`, emit the error on `sdk.on('sdkError', error)`,
 *  and return the error. It will not `throw` the error. It is up to the caller
 *  on what to do with it.
 * @param this sdk instance
 * @param errorType SdkError type
 * @param message message as string or Error instance
 * @param details any additional details to log with the error
 */
export declare const createAndEmitSdkError: (this: GenesysCloudWebrtcSdk, errorType: SdkErrorTypes | null, messageOrError?: string | Error, details?: any) => SdkError;
export declare const defaultConfigOption: (providedOption: any, defaultValue: any, defaultConditions?: {
    undefined?: boolean;
    null?: boolean;
    falsy?: boolean;
}) => any;
export declare const requestApiWithRetry: (this: GenesysCloudWebrtcSdk, path: string, opts?: Partial<RequestApiOptions>) => RetryPromise<any>;
export declare const requestApi: (this: GenesysCloudWebrtcSdk, path: string, opts?: Partial<RequestApiOptions>) => Promise<any>;
export declare function buildRequestApiOptions(sdk: GenesysCloudWebrtcSdk, opts?: Partial<RequestApiOptions>): Partial<RequestApiOptions>;
export declare const isAcdJid: (jid: string) => boolean;
export declare const isScreenRecordingJid: (jid: string) => boolean;
export declare const isSoftphoneJid: (jid: string) => boolean;
export declare const isPeerVideoJid: (jid: string) => boolean;
export declare const isAgentVideoJid: (jid: string) => boolean;
export declare const isLiveScreenMonitorJid: (jid: string) => boolean;
export declare const isVideoJid: (jid: string) => boolean;
export declare const isPeerConnectionDisconnected: (state: ConnectionState) => boolean;
export declare const logPendingSession: (logger: ILogger, message: string, pendingSession: IPendingSession | ISessionInfo, level?: LogLevels) => void;
export declare function getBareJid(sdk: GenesysCloudWebrtcSdk): string;
export declare function delay(timeMs: number): Promise<void>;
export declare function removeAddressFieldFromConversationUpdate(update: ConversationUpdate): any;
