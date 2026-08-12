import { Constants } from 'stanza';
import { IPendingSession, IExtendedMediaSession, ScreenRecordingMediaSession, IAcceptSessionRequest, IUpdateOutgoingMedia } from '../types/interfaces';
import BaseSessionHandler from './base-session-handler';
import { SessionTypes } from '../types/enums';
export declare class ScreenRecordingSessionHandler extends BaseSessionHandler {
    requestedSessions: {
        [roomJid: string]: boolean;
    };
    sessionType: SessionTypes;
    shouldHandleSessionByJid(jid: string): boolean;
    handleConversationUpdate(): void;
    handlePropose(pendingSession: IPendingSession): Promise<void>;
    acceptSession(session: ScreenRecordingMediaSession, params: IAcceptSessionRequest): Promise<void>;
    private sendMetadataWhenSessionConnects;
    _logSubscriptionError(_: unknown): void;
    endSession(conversationId: string, _session: IExtendedMediaSession, _reason?: Constants.JingleReasonCondition): Promise<void>;
    updateOutgoingMedia(session: IExtendedMediaSession, _options: IUpdateOutgoingMedia): never;
    private updateScreenRecordingMetadatas;
}
export default ScreenRecordingSessionHandler;
