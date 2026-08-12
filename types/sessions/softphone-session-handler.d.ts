import { DebouncedFunc } from 'lodash';
import { Constants } from 'stanza';
import BaseSessionHandler from './base-session-handler';
import { IPendingSession, IAcceptSessionRequest, ISessionMuteRequest, IExtendedMediaSession, IUpdateOutgoingMedia, IStartSoftphoneSessionParams, IConversationParticipantFromEvent, ICallStateFromParticipant, IStoredConversationState, ISdkConversationUpdateEvent, IConversationHeldRequest, IActiveConversationDescription, PersistentConnectionEvent, HawkNotification } from '../types/interfaces';
import { SessionTypes, CommunicationStates } from '../types/enums';
import { ConversationUpdate } from '../conversations/conversation-update';
import { GenesysCloudWebrtcSdk } from '..';
import { SessionManager } from './session-manager';
type SdkConversationEvents = 'added' | 'removed' | 'updated';
export declare class SoftphoneSessionHandler extends BaseSessionHandler {
    sessionType: SessionTypes;
    activeSession?: IExtendedMediaSession;
    conversations: {
        [convesationId: string]: IStoredConversationState;
    };
    lastEmittedSdkConversationEvent: ISdkConversationUpdateEvent;
    boundPersistentConnectionEventHandler: (event: HawkNotification<PersistentConnectionEvent>) => void;
    debouncedEmitCallError: DebouncedFunc<(update: ConversationUpdate, participant: IConversationParticipantFromEvent, callState: ICallStateFromParticipant) => void>;
    lastPersistentConnectionEvent?: PersistentConnectionEvent;
    constructor(sdk: GenesysCloudWebrtcSdk, sessionManager: SessionManager);
    handlePersistentConnectionEvent(event: HawkNotification<PersistentConnectionEvent>): void;
    listenForPersistentConnectionEvents(): Promise<void>;
    enableHandler(): Promise<void>;
    disableHandler(): Promise<void>;
    shouldHandleSessionByJid(jid: string): boolean;
    handleConversationUpdate(update: ConversationUpdate, sessions: IExtendedMediaSession[]): void;
    hasActiveSession(): boolean;
    handlePropose(pendingSession: IPendingSession): Promise<void>;
    getActiveConversations(): IActiveConversationDescription[];
    handleSoftphoneConversationUpdate(update: ConversationUpdate, participant: IConversationParticipantFromEvent, callState: ICallStateFromParticipant, session?: IExtendedMediaSession): void;
    diffConversationCallStates(call1: ICallStateFromParticipant, call2: ICallStateFromParticipant): boolean;
    checkForCallErrors(update: ConversationUpdate, participant: IConversationParticipantFromEvent, callState: ICallStateFromParticipant): void;
    private emitCallError;
    emitConversationEvent(event: SdkConversationEvents, conversation: IStoredConversationState, session: IExtendedMediaSession): void;
    private pruneConversationUpdateForLogging;
    determineActiveConversationId(session?: IExtendedMediaSession): string;
    getUsersCallStateFromConversationEvent(update: ConversationUpdate, state?: CommunicationStates): ICallStateFromParticipant | undefined;
    getUserParticipantFromConversationEvent(update: ConversationUpdate, state?: CommunicationStates): IConversationParticipantFromEvent | undefined;
    getCallStateFromParticipant(participant: IConversationParticipantFromEvent): ICallStateFromParticipant | undefined;
    private setCurrentSession;
    handleSessionInit(session: IExtendedMediaSession): Promise<void>;
    acceptSession(session: IExtendedMediaSession, params: IAcceptSessionRequest): Promise<void>;
    proceedWithSession(pendingSession: IPendingSession): Promise<void>;
    rejectPendingSession(pendingSession: IPendingSession): Promise<void>;
    _rejectUcCall(conversationId: string, participantId: string): Promise<void>;
    endSession(conversationId: string, session: IExtendedMediaSession, reason?: Constants.JingleReasonCondition): Promise<void>;
    endSessionFallback(conversationId: string, session: IExtendedMediaSession, reason?: Constants.JingleReasonCondition): Promise<void>;
    fetchUserParticipantFromConversationId(conversationId: string): Promise<IConversationParticipantFromEvent>;
    private getUserParticipantFromConversationId;
    setAudioMute(session: IExtendedMediaSession, params: ISessionMuteRequest): Promise<void>;
    setConversationHeld(session: IExtendedMediaSession, params: IConversationHeldRequest): Promise<void>;
    holdOtherSessions(currentSession: IExtendedMediaSession): void;
    isConversationHeld(conversationId: string): boolean;
    updateOutgoingMedia(session: IExtendedMediaSession, options: IUpdateOutgoingMedia): Promise<void>;
    startSession(params: IStartSoftphoneSessionParams): Promise<{
        id: string;
        selfUri: string;
    }>;
    private patchPhoneCall;
    private isPendingState;
    private isConnectedState;
    private isEndedState;
    /**
     * Notify the backend that a call has connected for this client.
     * The server captures the client's IP address from the HTTP request.
     * This is fire-and-forget — errors are logged but do not affect call handling.
     */
    private notifyClientMetadata;
}
export default SoftphoneSessionHandler;
