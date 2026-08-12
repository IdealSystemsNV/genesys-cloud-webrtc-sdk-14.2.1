import { IPendingSession, IExtendedMediaSession, IAcceptSessionRequest, IUpdateOutgoingMedia, LiveScreenMonitoringSession } from '../types/interfaces';
import BaseSessionHandler from './base-session-handler';
import { SessionTypes } from '../types/enums';
import { Constants } from "stanza";
export declare class LiveMonitoringSessionHandler extends BaseSessionHandler {
    sessionType: SessionTypes;
    _liveMonitoringObserver: boolean;
    shouldHandleSessionByJid(jid: string): boolean;
    handleConversationUpdate(): void;
    handlePropose(pendingSession: IPendingSession): Promise<void>;
    acceptSession(session: LiveScreenMonitoringSession, params: IAcceptSessionRequest): Promise<void>;
    acceptSessionForTarget(session: LiveScreenMonitoringSession, params: IAcceptSessionRequest): Promise<void>;
    acceptSessionForObserver(session: LiveScreenMonitoringSession, params: IAcceptSessionRequest): Promise<void>;
    endSession(conversationId: string, session: IExtendedMediaSession, reason?: Constants.JingleReasonCondition): Promise<void>;
    updateOutgoingMedia(session: IExtendedMediaSession, _options: IUpdateOutgoingMedia): never;
}
export default LiveMonitoringSessionHandler;
