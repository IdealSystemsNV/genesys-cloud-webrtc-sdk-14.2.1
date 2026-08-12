import { Constants } from 'stanza';
import { IPendingSession, IAcceptSessionRequest, ISessionMuteRequest, IExtendedMediaSession, IConversationParticipant, IStartVideoSessionParams, IStartVideoMeetingSessionParams, VideoMediaSession, MemberStatusMessage, IConversationParticipantFromEvent } from '../types/interfaces';
import BaseSessionHandler from './base-session-handler';
import { SessionTypes } from '../types/enums';
import { ConversationUpdate } from '../conversations/conversation-update';
import { JsonRpcMessage } from 'genesys-cloud-streaming-client';
export declare class VideoSessionHandler extends BaseSessionHandler {
    requestedSessions: {
        [roomJid: string]: boolean;
    };
    requestedMeetingSessions: {
        [meetingId: string]: boolean;
    };
    sessionType: SessionTypes;
    shouldHandleSessionByJid(jid: string): boolean;
    getUserParticipantFromConversationEvent(update: ConversationUpdate): IConversationParticipantFromEvent | undefined;
    findLocalParticipantInConversationUpdate(conversationUpdate: ConversationUpdate): IConversationParticipant | null;
    handleConversationUpdate(update: ConversationUpdate, sessions: VideoMediaSession[]): void;
    handleConversationUpdateForSession(conversationUpdate: ConversationUpdate, session: VideoMediaSession): void;
    startSession(startParams: IStartVideoSessionParams | IStartVideoMeetingSessionParams): Promise<{
        conversationId: string;
    }>;
    private startVideoSession;
    private startVideoMeetingSession;
    handlePropose(pendingSession: IPendingSession): Promise<void>;
    handleSessionInit(session: VideoMediaSession): Promise<void>;
    acceptSession(session: VideoMediaSession, params: IAcceptSessionRequest): Promise<void>;
    checkInitialConversationParticipants(session: VideoMediaSession): Promise<void>;
    setInitialMuteStates(session: IExtendedMediaSession): Promise<void>;
    setupTransceivers(session: IExtendedMediaSession): void;
    endSession(conversationId: string, session: IExtendedMediaSession, reason?: Constants.JingleReasonCondition): Promise<void>;
    setVideoMute(session: IExtendedMediaSession, params: ISessionMuteRequest, skipServerUpdate?: boolean): Promise<void>;
    setAudioMute(session: IExtendedMediaSession, params: ISessionMuteRequest): Promise<void>;
    startScreenShare(session: VideoMediaSession): Promise<void>;
    stopScreenShare(session: VideoMediaSession): Promise<void>;
    pinParticipantVideo(session: IExtendedMediaSession, participantId?: string): Promise<void>;
    attachIncomingTrackToElement(track: MediaStreamTrack, { audioElement, videoElement, volume }: {
        audioElement?: HTMLAudioElement;
        videoElement?: HTMLVideoElement;
        volume: number;
    }): HTMLAudioElement | HTMLVideoElement;
    /**
     * Parse the trackId from a passed in SDP for a given media type
     *
     * SDP will look like:
     * ```
     * // global stuff...
     * m=audio 1 UDP/TLS/RTP/SAVPF 96
     * // info about the audio offer...
     * a=msid:cbf2ec37-5e50-4ac4-9ae7-1d1dc4508071 19d58781-f708-4945-be91-2758052273bd
     * m=video 1 UDP/TLS/RTP/SAVPF 97 98
     * // info about the video offer...
     * a=msid:cbf2ec37-5e50-4ac4-9ae7-1d1dc4508071 1e3d9e8b-d407-47ee-8dcf-6b5912889a28
     * ```
     *
     * `m=` acts as the delimiter for each audio/video track in the offer
     * `a=misd:{ID for the media stream} {ID for the media track (this is what we will look for)}
     *
     * @param sdp to parse
     * @param kind media type to look for
     */
    getTrackIdFromSdp(sdp: string, kind: 'video' | 'audio'): string;
    isMemberStatusMessage(message: JsonRpcMessage): message is MemberStatusMessage;
    handleDataChannelMessage(session: VideoMediaSession, message: JsonRpcMessage): void;
    handleMemberStatusMessage(message: MemberStatusMessage, session: VideoMediaSession): void;
}
export default VideoSessionHandler;
