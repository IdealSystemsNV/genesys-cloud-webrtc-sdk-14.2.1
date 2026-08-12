import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import StreamingClient, { HttpClient } from 'genesys-cloud-streaming-client';
import Logger from 'genesys-cloud-client-logger';
import { ISdkConfig, ICustomerData, IEndSessionRequest, IAcceptSessionRequest, ISessionMuteRequest, IPersonDetails, IMediaDeviceIds, IUpdateOutgoingMedia, SdkEvents, IMediaSettings, IStartSoftphoneSessionParams, IOrgDetails, IStation, IConversationHeldRequest, IPendingSessionActionParams, IExtendedMediaSession, ScreenRecordingMediaSession, VideoMediaSession, IVideoResolution, ISdkFullConfig, LiveScreenMonitoringSession } from './types/interfaces';
import { MediaHandling, SessionTypes } from './types/enums';
import { SessionManager } from './sessions/session-manager';
import { SdkMedia } from './media/media';
import { Constants } from 'stanza';
import { ISdkHeadsetService } from './headsets/headset-types';
import { SdkAudioProcessor } from './audio-processor/audio-processor';
declare const GenesysCloudWebrtcSdk_base: {
    new (): StrictEventEmitter<EventEmitter, SdkEvents>;
};
/**
 * SDK to interact with GenesysCloud WebRTC functionality
 */
export declare class GenesysCloudWebrtcSdk extends GenesysCloudWebrtcSdk_base {
    static readonly VERSION = "__GENESYS_CLOUD_WEBRTC_SDK_VERSION__";
    logger: Logger;
    sessionManager: SessionManager;
    audioProcessor: SdkAudioProcessor;
    media: SdkMedia;
    station: IStation | null;
    headset: ISdkHeadsetService;
    _pauseDisconnectedMessages: boolean;
    _preDisconnectSessionIds: string[];
    _connected: boolean;
    _streamingConnection: StreamingClient;
    _http: HttpClient;
    _orgDetails: IOrgDetails;
    _personDetails: IPersonDetails;
    _clientId: string;
    _customerData: ICustomerData;
    _hasConnected: boolean;
    _config: ISdkFullConfig;
    _mediaHandling: MediaHandling;
    get isInitialized(): boolean;
    get connected(): boolean;
    get isJwtAuth(): boolean;
    get isGuest(): boolean;
    get VERSION(): string;
    constructor(options: ISdkConfig);
    /**
     * Setup the SDK for use and authenticate the user
     *  - agents must have an accessToken passed into the constructor options
     *  - guests need a securityCode (or the data received from an
     *    already redeemed securityCode). If the customerData is not passed in
     *    this will redeem the code for the data, else it will use the data
     *    passed in.
     *
     * @param opts optional initialize options
     *
     * @returns a promise that is fulled once the web socket is connected
     *  and other necessary async tasks are complete.
     */
    initialize(opts?: {
        securityCode: string;
    } | ICustomerData): Promise<void>;
    addAllowedSessionType(sessionType: SessionTypes): Promise<void>;
    removeAllowedSessionType(sessionType: SessionTypes): Promise<void>;
    isScreenRecordingSession(session: IExtendedMediaSession): session is ScreenRecordingMediaSession;
    isVideoSession(session: IExtendedMediaSession): session is VideoMediaSession;
    isLiveScreenMonitoringSession(session: IExtendedMediaSession): session is LiveScreenMonitoringSession;
    /**
     * Start a screen share. Currently, screen share is only supported
     *  for guest users.
     *
     *  `initialize()` must be called first.
     *
     * @returns MediaStream promise of the selected screen stream
     */
    startScreenShare(): Promise<MediaStream>;
    /**
     * Start a video conference. Not supported for guests.
     *  Conferences can only be joined by authenticated users
     *  from the same organization. If `inviteeJid` is provided,
     *  the specified user will receive a propose/pending session
     *  they can accept and join the conference.
     *
     *  `initialize()` must be called first.
     *
     * @param roomJid jid of the conference to join. Can be made up if
     *  starting a new conference but must adhere to the format:
     *  <lowercase string>@conference.<lowercase string>
     * @param inviteeJid jid of a user to invite to this conference.
     *
     * @returns a promise with an object with the newly created `conversationId`
     */
    startVideoConference(roomJid: string, inviteeJid?: string): Promise<{
        conversationId: string;
    }>;
    /**
     * Start a video conference using a meeting id. Not supported for guests.
     *  Conferences can only be joined by authenticated users
     *  from the same organization.
     *
     *  `initialize()` must be called first.
     *
     * @param meetingId meetingId of the conference to join.
     *
     * @returns a promise with an object with the newly created 'conversationId'
     */
    startVideoMeeting(meetingId: string): Promise<{
        conversationId: string;
    }>;
    /**
     * Start a softphone session with the given peer or peers.
     *  `initialize()` must be called first.
     *
     * @param softphoneParams participant information for initiating a softphone session. See IStartSoftphoneSessionParams for more details.
     */
    startSoftphoneSession(softphoneParams: Omit<IStartSoftphoneSessionParams, 'sessionType'>): Promise<{
        id: string;
        selfUri: string;
    }>;
    /**
     * Update the output device for all incoming audio
     *
     *  NOTES:
     *    - This will log a warning and not attempt to update
     *        the output device if the a broswer
     *        does not support output devices
     *    - This will attempt to update all active sessions
     *    - This does _not_ update the sdk `defaultOutputDeviceId`
     * @param deviceId `deviceId` for audio output, `true` for sdk default output, or `null` for system default
     * @returns a promise that fullfils once the output deviceId has been updated
     */
    updateOutputDevice(deviceId: string | true | null): Promise<void>;
    /**
     * Update outgoing media for a specified session
     *  - `conversationId` _or_ `session` is required to find the session to update
     *  - `stream`: if a stream is passed in, the session media will be
     *    updated to use the media on the stream. This supercedes deviceId(s)
     *    passed in.
     *  - `videoDeviceId` & `audioDeviceId` (superceded by `stream`)
     *    - `undefined|false`: the sdk will not touch the `video|audio` media
     *    - `null`: the sdk will update the `video|audio` media to system default
     *    - `string`: the sdk will attempt to update the `video|audio` media
     *        to the passed in deviceId
     *
     * Note: this does not update the SDK default device(s). Also, if the requested
     *  device is _already in use_ by the session, the media will not be re-requested.
     *
     * @param updateOptions device(s) to update
     *
     * @returns a promise that fullfils once the outgoing
     *  media devices have been updated
     */
    updateOutgoingMedia(updateOptions: IUpdateOutgoingMedia): Promise<void>;
    /**
     * Update the default device(s) for the sdk.
     *  Pass in the following:
     *  - `string`: sdk will update that default to the deviceId
     *  - `null`: sdk will update to system default device
     *  - `undefined`: sdk will not update that media deviceId
     *
     * If `updateActiveSessions` is `true`, any active sessions will
     *  have their outgoing media devices updated and/or the output
     *  deviceId updated. Note, if the requested device is
     *  _already in use_ by the session, the media will not be re-requested.
     *
     * Else, only the sdk defaults will be updated and active sessions'
     * media devices will not be touched.
     *
     * @param options default device(s) to update
     *
     * @returns a promise that fullfils once the default
     *  device values have been updated
     */
    updateDefaultDevices(options?: IMediaDeviceIds & {
        updateActiveSessions?: boolean;
    }): Promise<void>;
    /**
   * Update the default resolution of the selected video track for the sdk.
   *  Pass in the following:
   *  - resolution: Either undefined or an object containing ConstrainULongs
   *      representing both width and height
   *  - updateActiveSessions: boolean
   *
   * If `updateActiveSessions` is `true`, any active sessions will
   *  have their video resolutions updated to either the selected resolution
   *  or the next best resolution the device is capable of
   *
   * Else, only the sdk defaults will be updated and active sessions'
   * resolutions will not be touched
   *
   * Success or failure of `applyConstraints` will emit an event for
   * the consuming app to listen for so that it can determine if the
   * resolution they requested is actually in place or the next best
   * option. This will allow the consuming app to notify the user as
   * they see fit.
   *
   * @param resolution the width and height that was requested
   * to update the video; could be undefined to represent the default value
   *
   * @returns a promise that fullfils once the event has been emitted
   * signaling that the resolution has updated
   */
    updateDefaultResolution(resolution: IVideoResolution | undefined, updateActiveSessions: boolean): Promise<void>;
    /**
     * Update the default media settings from the config.
     *
     * If `updateActiveSessions` is `true`, any active sessions will
     *  have their outgoing media devices updated.
     *
     * Else, only the defaults will be updated and active sessions'
     * media devices will not be touched.
     *
     * @returns a promise that fullfils once the default
     *  settings and sessions are updated (if specified)
     */
    updateDefaultMediaSettings(settings: IMediaSettings & {
        updateActiveSessions?: boolean;
    }): Promise<void>;
    /**
     * Updates the audio volume for all active applicable sessions
     * as well as the default volume for future sessions
     *
     * @param volume desired volume between 0 and 100
     *
     * @returns void
     */
    updateAudioVolume(volume: number): void;
    fetchOrganization(): Promise<IOrgDetails>;
    fetchAuthenticatedUser(): Promise<IPersonDetails>;
    parseJwt(): void;
    fetchUsersStation(): Promise<IStation>;
    /**
     * Check to see if the user's currently effective station has
     *  persistent connection enabled.
     *
     * @returns if the station has persistent connection enabled
     */
    isPersistentConnectionEnabled(): boolean;
    /**
     * Check to see if the user's currently effective station has
     *  Line Appearance > 1.
     *
     * @returns if the station has Line Appearance > 1
     */
    isConcurrentSoftphoneSessionsEnabled(): boolean;
    /**
     * Mutes/Unmutes video/camera for a session and updates the conversation accordingly.
     * Will fail if the session is not found.
     * Incoming video is unaffected.
     *
     * When muting, the camera track is destroyed. When unmuting, the camera media
     *  must be requested again.
     *
     * NOTE: if no `unmuteDeviceId` is provided when unmuting, it will unmute and
     *  attempt to use the sdk `defaultVideoDeviceId` as the camera device
     *
     * @returns a promise that fullfils once the mute request has completed
     */
    setVideoMute(muteOptions: ISessionMuteRequest): Promise<void>;
    /**
     * Mutes/Unmutes audio/mic for a session and updates the conversation accordingly.
     * Will fail if the session is not found.
     * Incoming audio is unaffected.
     *
     * NOTE: if no `unmuteDeviceId` is provided when unmuting _AND_ there is no active
     *  audio stream, it will unmute and attempt to use the sdk `defaultAudioDeviceId`
     *  at the device
     *
     * @returns a promise that fullfils once the mute request has completed
     */
    setAudioMute(muteOptions: ISessionMuteRequest): Promise<void>;
    /**
     * Set a conversation's hold state.
     *
     * > NOTE: only applicable for softphone conversations
     *
     * @param heldOptions conversationId and desired held state
     */
    setConversationHeld(heldOptions: IConversationHeldRequest): Promise<void>;
    /**
     * Set the accessToken the sdk uses to authenticate
     *  to the API.
     * @param token new access token
     *
     * @returns void
     */
    setAccessToken(token: string): void;
    /**
   * Set the JWT the sdk uses to authenticate
   *  to the API.
   * @param jwt new jwt
   *
   * @returns void
   */
    setJwt(jwt: string): void;
    /**
     * Changes the headset functionality for the sdk
     * @param useHeadsets if true, this enables events from active headsets
     *
     * @returns void
     */
    setUseHeadsets(useHeadsets: boolean): void;
    /**
     * Set the sdk default audioStream. This will call
     *  through to `sdk.media.setDefaultAudioStream(stream);`
     *
     * Calling with a falsy value will clear out sdk default.
     *
     * @param stream media stream to use
     */
    setDefaultAudioStream(stream?: MediaStream): void;
    /**
     * **Genesys internal use only** - non-Genesys apps may experience unexpected behavior.
     *
     * Change the media handling for softphone sessions, which should be
     * be chosen based on the alerting leader status of the consuming client.
     *
     * If media handling is reduced, idle persistent connections will be
     * disconnected.
     *
     * @param mediaHandling how softphone media should be handled
     */
    setMediaHandling(mediaHandling: MediaHandling): void;
    /**
     * Accept a pending session based on the passed in conversation ID.
     *
     * @param params conversationId of the pending session to accept
     * @returns a promise that fullfils once the session accept goes out
     */
    acceptPendingSession(params: IPendingSessionActionParams): Promise<void>;
    /**
     * Reject a pending session based on the passed in conversation ID.
     *
     * @param params conversationId of the pending session to reject
     * @returns a promise that fullfils once the session reject goes out
     */
    rejectPendingSession(params: IPendingSessionActionParams): Promise<void>;
    /**
     * Accept a pending session based on the passed in ID.
     *
     * @param acceptOptions options with which to accept the session
     * @returns a promise that fullfils once the session accept goes out
     */
    acceptSession(acceptOptions: IAcceptSessionRequest): Promise<void>;
    /**
     * End an active session based on the conversation ID (one is required)
     * @param opts object with conversation ID
     * @returns a promise that fullfils once the session has ended
     */
    endSession(endOptions: IEndSessionRequest): Promise<void>;
    /**
     * End an active session based on the session ID
     * @param sessionId session ID corresponding to the session you want to force terminate
     * @param reason optional reason to terminate the session with. defaults to "success"
     * @returns a promise that fullfils once the session has ended
     */
    forceTerminateSession(sessionId: string, reason?: Constants.JingleReasonCondition): Promise<void>;
    /**
     * Disconnect the streaming connection
     * @returns a promise that fullfils once the web socket has disconnected
     */
    disconnect(): Promise<void>;
    /**
     * Ends all active sessions, disconnects the
     *  streaming-client, removes all event listeners,
     *  and cleans up media.
     *
     * WARNING: calling this effectively renders the SDK
     *  instance useless. A new instance will need to be
     *  created after this is called.
     *
     * @returns a promise that fullfils once all the cleanup
     *  tasks have completed
     */
    destroy(): Promise<void>;
    private listenForStationEvents;
}
export default GenesysCloudWebrtcSdk;
