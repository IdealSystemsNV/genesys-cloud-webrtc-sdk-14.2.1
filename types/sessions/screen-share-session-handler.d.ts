import BaseSessionHandler from './base-session-handler';
import { IPendingSession, IStartSessionParams, IExtendedMediaSession, IUpdateOutgoingMedia, VideoMediaSession } from '../types/interfaces';
import { SessionTypes } from '../types/enums';
import { ConversationUpdate } from '../conversations/conversation-update';
export declare class ScreenShareSessionHandler extends BaseSessionHandler {
    private _screenStreamPromise;
    sessionType: SessionTypes;
    shouldHandleSessionByJid(jid: string): boolean;
    handleConversationUpdate(_update: ConversationUpdate, _sessions: IExtendedMediaSession[]): void;
    startSession(_startParams: IStartSessionParams): Promise<MediaStream>;
    handlePropose(pendingSession: IPendingSession): Promise<void>;
    onTrackEnd(session: VideoMediaSession): Promise<void>;
    handleSessionInit(session: VideoMediaSession): Promise<void>;
    updateOutgoingMedia(session: IExtendedMediaSession, _options: IUpdateOutgoingMedia): never;
}
export default ScreenShareSessionHandler;
