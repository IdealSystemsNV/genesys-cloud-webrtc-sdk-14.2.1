import { JingleReason } from 'stanza/protocol';
import { Constants } from 'stanza';
import { ILogMessageOptions } from 'genesys-cloud-client-logger';
import { GenesysCloudWebrtcSdk } from '../client';
import { LogLevels, SessionTypes } from '../types/enums';
import { SessionManager } from './session-manager';
import { ConversationUpdate } from '../conversations/conversation-update';
import { IPendingSession, IStartSessionParams, IAcceptSessionRequest, ISessionMuteRequest, IExtendedMediaSession, IUpdateOutgoingMedia, IConversationHeldRequest, IActiveConversationDescription, SubscriptionEvent } from '../types/interfaces';
export default abstract class BaseSessionHandler {
    protected sdk: GenesysCloudWebrtcSdk;
    protected sessionManager: SessionManager;
    disabled: boolean;
    abstract sessionType: SessionTypes;
    constructor(sdk: GenesysCloudWebrtcSdk, sessionManager: SessionManager);
    abstract shouldHandleSessionByJid(jid: string): boolean;
    abstract handleConversationUpdate(update: ConversationUpdate, sessions: IExtendedMediaSession[]): void;
    handleConversationUpdateRaw(update: SubscriptionEvent): void;
    protected log(level: LogLevels, message: string, details?: object, logOptions?: ILogMessageOptions): void;
    enableHandler(): Promise<void>;
    disableHandler(): Promise<void>;
    getActiveConversations(): IActiveConversationDescription[];
    startSession(sessionStartParams: IStartSessionParams): Promise<unknown>;
    handlePropose(pendingSession: IPendingSession): Promise<void>;
    proceedWithSession(session: IPendingSession): Promise<void>;
    rejectPendingSession(session: IPendingSession): Promise<void>;
    handleSessionInit(session: IExtendedMediaSession): Promise<void>;
    /**
   * This is somewhat of a hack unfortunately. If the peer connection dies while the computer is sleeping, the peer connection
   * does not send connection updates so the session has no idea the session is dead. We do get a visibility change event
   * however, so we can use that as a manual queue to check the state of the peer connection and clean it up if needed.
   */
    private handleVisibilityChange;
    checkPeerConnectionState(session: IExtendedMediaSession): void;
    onSessionTerminated(session: IExtendedMediaSession, reason: JingleReason): void;
    acceptSession(session: IExtendedMediaSession, params: IAcceptSessionRequest): Promise<void>;
    forceEndSession(session: IExtendedMediaSession, reason?: Constants.JingleReasonCondition): Promise<void>;
    endSession(conversationId: string, session: IExtendedMediaSession, reason?: Constants.JingleReasonCondition): Promise<void>;
    setVideoMute(session: IExtendedMediaSession, params: ISessionMuteRequest): Promise<void>;
    setAudioMute(session: IExtendedMediaSession, params: ISessionMuteRequest): Promise<void>;
    setConversationHeld(session: IExtendedMediaSession, params: IConversationHeldRequest): Promise<void>;
    /**
     * Update the outgoing media for a session.
     *
     * @param session to update
     * @param options for updating outgoing media
     */
    updateOutgoingMedia(session: IExtendedMediaSession, options: IUpdateOutgoingMedia): Promise<void>;
    updateAudioVolume(session: IExtendedMediaSession, volume: number): void;
    updateOutputDevice(session: IExtendedMediaSession, deviceId: string): Promise<void>;
    /**
     * Add new media to a session. Will attempt to use tracksBasedActions if possible.
     * @param session jingle media session
     * @param stream local MediaStream to add to session
     * @param allowLegacyStreamBasedActionsFallback if false, an error will be thrown if track based actions are not supported
     */
    addMediaToSession(session: IExtendedMediaSession, stream: MediaStream): Promise<void>;
    waitForSessionConnected(session: IExtendedMediaSession): Promise<undefined>;
    /**
     * Will try and replace a track of the same kind if possible, otherwise it will add the track
     */
    addReplaceTrackToSession(session: IExtendedMediaSession, track: MediaStreamTrack): Promise<void>;
    private applyTrackConstraints;
    _warnNegotiationNeeded(session: IExtendedMediaSession): void;
    removeMediaFromSession(session: IExtendedMediaSession, sender: RTCRtpSender): Promise<void>;
    getSendersByTrackType(session: IExtendedMediaSession, kind: 'audio' | 'video'): RTCRtpSender[];
    getReceiversByTrackType(session: IExtendedMediaSession, kind: 'audio' | 'video'): RTCRtpReceiver[];
    endTracks(streamOrTrack?: MediaStream | MediaStreamTrack): void;
    fetchConversationStateFromApi(conversationId: string): Promise<ConversationUpdate>;
}
