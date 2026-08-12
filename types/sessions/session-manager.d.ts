import { GenesysCloudWebrtcSdk } from '../client';
import BaseSessionHandler from './base-session-handler';
import { SessionTypes } from '../types/enums';
import { IPendingSession, ISessionInfo, IEndSessionRequest, IStartSessionParams, IAcceptSessionRequest, ISessionMuteRequest, IUpdateOutgoingMedia, IStartVideoSessionParams, IStartVideoMeetingSessionParams, IExtendedMediaSession, IStartSoftphoneSessionParams, ISessionIdAndConversationId, IConversationHeldRequest, IPendingSessionActionParams, IActiveConversationDescription, SubscriptionEvent } from '../types/interfaces';
import { ConversationUpdate } from '../conversations/conversation-update';
import { SessionTypesAsStrings } from 'genesys-cloud-streaming-client';
import { Constants } from 'stanza';
import { WebrtcExtensionAPI } from 'genesys-cloud-streaming-client/src/webrtc';
export declare class SessionManager {
    private sdk;
    sessionHandlers: BaseSessionHandler[];
    pendingSessions: IPendingSession[];
    constructor(sdk: GenesysCloudWebrtcSdk);
    private log;
    get webrtcSessions(): WebrtcExtensionAPI;
    addAllowedSessionType(sessionType: SessionTypes): Promise<void>;
    removeAllowedSessionType(sessionType: SessionTypes): Promise<void>;
    handleConversationUpdate(update: ConversationUpdate): void;
    handleConversationUpdateRaw(update: SubscriptionEvent): void;
    getPendingSession(params: {
        conversationId?: string;
        sessionId?: string;
        sessionType?: SessionTypes | SessionTypesAsStrings;
    }): IPendingSession | undefined;
    removePendingSession(params: ISessionIdAndConversationId | IPendingSession): void;
    getSession(params: {
        conversationId: string;
        sessionType?: SessionTypes;
        searchScreenRecordingSessions?: boolean;
    }): IExtendedMediaSession;
    getSessionBySessionId(sessionId: string): IExtendedMediaSession;
    getAllActiveSessions(): IExtendedMediaSession[];
    getAllActiveConversations(): IActiveConversationDescription[];
    getAllSessions(): IExtendedMediaSession[];
    getSessionHandler(params: {
        sessionInfo?: ISessionInfo;
        sessionType?: SessionTypes | SessionTypesAsStrings;
        jingleSession?: IExtendedMediaSession;
    }): BaseSessionHandler;
    startSession(startSessionParams: IStartSessionParams | IStartVideoSessionParams | IStartVideoMeetingSessionParams | IStartSoftphoneSessionParams): Promise<{
        conversationId: string;
    } | {
        id: string;
        selfUri: string;
    } | MediaStream>;
    /**
     * Update the outgoing media for a session.
     *
     * @param options for updating outgoing media
     */
    updateOutgoingMedia(options: IUpdateOutgoingMedia): Promise<void>;
    updateOutgoingMediaForAllSessions(options?: Pick<IUpdateOutgoingMedia, 'audioDeviceId' | 'videoDeviceId'>): Promise<void>;
    updateAudioVolume(volume: number): void;
    updateOutputDeviceForAllSessions(outputDeviceId: string | boolean | null): Promise<void>;
    addOrReplaceTrackOnSession(track: MediaStreamTrack, session: IExtendedMediaSession): Promise<void>;
    /**
     * Event handler for pending webrtc-sessions.
     * @param sessionInfo pending webrtc-session info
     */
    onPropose(sessionInfo: ISessionInfo): Promise<void>;
    /**
     * If we get this event from streaming-client, that means the session was
     *  canceled. We no longer care if it was a LA of 1 session or not
     *  because streaming-client will only emit events for actual sessions
     *  and not our psuedo-events we emit for LA of 1 conversation
     *  events.
     * @param sessionId session id canceled by streaming client
     */
    onCancelPendingSession(sessionId: string, conversationId?: string): void;
    /**
     * If we get this event from streaming-client, that means the session was
     *  canceled. We no longer care if it was a LA of 1 session or not
     *  because streaming-client will only emit events for actual sessions
     *  and not our psuedo-events we emit for LA of 1 conversation
     *  events.
     * @param sessionId session id canceled by streaming client
     */
    onHandledPendingSession(sessionId: string, conversationId?: string): void;
    proceedWithSession(params: IPendingSessionActionParams): Promise<void>;
    rejectPendingSession(params: IPendingSessionActionParams): Promise<void>;
    onSessionInit(session: IExtendedMediaSession): Promise<void>;
    acceptSession(params: IAcceptSessionRequest): Promise<void>;
    endSession(params: IEndSessionRequest): Promise<void>;
    forceTerminateSession(sessionId: string, reason?: Constants.JingleReasonCondition): Promise<void>;
    setVideoMute(params: ISessionMuteRequest): Promise<void>;
    setAudioMute(params: ISessionMuteRequest): Promise<void>;
    setConversationHeld(params: IConversationHeldRequest): Promise<void>;
    validateOutgoingMediaTracks(): Promise<any[]>;
}
