import { EventEmitter } from 'events';
import StrictEventEmitter from 'strict-event-emitter-types';
import GenesysCloudWebrtcSdk from '../client';
import { IExtendedMediaSession, IMediaRequestOptions, ISdkMediaState, SdkMediaEvents } from '../types/interfaces';
declare const SdkMedia_base: {
    new (): StrictEventEmitter<EventEmitter, SdkMediaEvents>;
};
export declare class SdkMedia extends SdkMedia_base {
    private sdk;
    private state;
    private audioTracksBeingMonitored;
    private allMediaTracksCreated;
    private onDeviceChangeListenerRef;
    private defaultsBeingMonitored;
    constructor(sdk: GenesysCloudWebrtcSdk);
    /**
     * Function to gain permissions for a given media type. This function should
     *  be called early after constructing the SDK and _before_ calling
     *  `sdk.media.startMedia()` to ensure permissions are granted.
     *
     * This function will call through to `startMedia` to get a `MediaStream`
     *  for the desired media permissions. That is the only surefire way to
     *  gain permissions across all browsers & platforms.
     *
     * It will also call through to `sdk.media.enumerateDevices()` to ensure
     *  all devices have been loaded after permissions have been granted.
     *
     * The media state will be updated with permissions and an event emitted
     *  on `sdk.media.on('permissions', evt)` with any outcomes
     *
     * An error will be thrown if permissions are not granted by either the browser
     *  or the OS (specifically for macOS). With the one exception of the microphone
     *  permission on the OS level. If the microphone permission has not been granted on
     *  the OS level, macOS will still allow the browser to attain an audio track for
     *  the microphone. However, the track will act as if it is in a "hardware mute"
     *  state. There is no API available for the browser to know the microphone is
     *  in a "hardware mute" state. To see if a microphone _may_ be in a "hardware mute"
     *  state, you can listen for microphone volume events on
     *  `sdk.media.on('audioTrackVolume', evt)` and add logic to respond to no volume
     *  coming through the microhpone.
     *
     * If `preserveMedia` is `true`, the `MediaStream` attained through the
     *  `startMedia()` will be returned to the caller. If not, the media will
     *  be destroyed and `undefined` returned.
     *
     * `options` can be any valid deviceId or other media options defined in
     *  `interface IMediaRequestOptions`. These options will be passed to
     *  the `startMedia()` call (which is used to gain permissions)
     *
     * Note #1: the default option for the media type will be `true` (which is SDK default
     *   device). If a value of `false` or `undefined` is passed in, it will
     *   always use `true`. Any options for the other media type will be ignored.
     * Example:
     * ``` ts
     * await requestMediaPermissions(
     *   'audio',
     *   false,
     *   {
     *     audio: false,
     *     video: 'some-video-device-id',
     *     videoFrameRate: 30
     *   }
     * );
     * // since type === 'audio', the options will be converted to:
     * {
     *   // a valid option must be set (`false|undefined` are invalid)
     *   audio: true,
     *   // video will be ignored since permissions are requested one at a time
     *   video: false
     * }
     * ```
     *
     * Note #2: if requesting `'both'`, it will always ask for both permision types
     *   even if the first is denied. For example, if `audio` permissions are denied, this
     *   function will still ask for `video` permissions. If _at least_ one media permission
     *   was denied, it will throw the error. Exception is if `IMediaRequestOptions`'
     *   `preserveMediaIfOneTypeFails` option is `true`, then it will only the error if _both_
     *   media types fail. And then it will throw the audio denied error.
     *
     * Note #3: in some browsers, permissions are not always guaranteed even after
     *   using this function to gain permissions. See [Firefox Behavior] for more details.
     *   It is recommended to use the [permissions event](#permissions) to watch for changes
     *   in permissions since permissions could be denied anytime `startMedia()` is called.
     *
     * @param mediaType media type to request permissions for (`'audio' | 'video' | 'both'`)
     * @param preserveMedia flag to return media after permissions pass
     * @param options optional, advanced options to request media with.
     *
     * @returns a promise either containing a `MediaStream` or `undefined`
     *   depending on the value of `preserveMedia`
     */
    requestMediaPermissions(mediaType: 'audio' | 'video' | 'both', preserveMedia?: boolean, options?: IMediaRequestOptions): Promise<MediaStream | void>;
    /**
     * Call to enumerate available devices. This will update the
     *  cache of devices and emit events on `'state'` & `'devices'`
     *
     * If the devices returned from the browser are the same as the cached
     *  devices, a new event will _NOT_ emit. To force an emit pass in `true`.
     *
     * It is _highly_ recommended that `sdk.media.requestMediaPermissions('audio' | 'video')`
     *  be called at least once to ensure permissions are granted before loading devices.
     *  See `requestMediaPermissions()` for more details.
     *
     * Note: if media permissions have not been granted by the browser,
     *  enumerated devices will not return the full list of devices
     *  and/or the devices will not have ids/labels (varies per browser).
     *
     * @param forceEmit force an event to emit if the devices
     *  have not changed from the cached devices
     *
     * @returns a promise containing the devices enumerated
     *  from `navigator.mediaDevices.enumerateDevices()`
     */
    enumerateDevices(forceEmit?: boolean): Promise<MediaDeviceInfo[]>;
    /**
     * Create media with video and/or audio. See `interface IMediaRequestOptions`
     *  for more information about available options.
     *
     * It is _highly_ recommended that `sdk.media.requestMediaPermissions('audio' | 'video')`
     * be called with each desired media type _before_ using `startMedia`. This will ensure
     *  all media permissions have been granted before starting media. If `requestMediaPermissions()`
     *  has not been called, this function will call it with `preserveMedia = true` and use
     *  the returning media.
     *
     * `getUserMedia` is requested one media type at a time. If requesting both `audio`
     *  and `video`, `getUserMedia` will be called two times -- 1st with `audio` and 2nd
     *  with `video`. The two calls will be combined into a single `MediaStream` and
     *  returned to the caller. If one of the media types fail, execution of this
     *  function will stop and the error thrown (any successful media will be destroyed).
     *  This is in line with `getUserMedia`'s current behavior in the browser.
     *
     * If `mediaReqOptions.retryOnFailure` is `true` (default), the SDK will have the following behavior:
     *  1. If the fail was due to a Permissions issue, it will _NOT_ retry
     *  2. For `video` only: some browsers/hardward configurations throw an error
     *      for invalid resolution requests. If `video` was requested with a
     *      `videoResolution` value (could be a SDK default), it will retry
     *      video with the same passed in value but with _no_ resolution.
     *  3. If a deviceId was requested and there was a failure, this will retry
     *      media with the SDK default deviceId for that media type.
     *  4. If the SDK default deviceId fails (or it didn't exist), then this
     *      will retry with system defaults and no other options (such as `deviceId`s,
     *      `videoFrameRate`, & `videoResolution`)
     *  5. If system defaults fails, it will throw the error and stop attempting
     *      to retry.
     *
     * Note: if using `retryOnFailure` it is recommended to check the media
     *  returned to ensure you received the desired device.
     *
     * _If_ `mediaReqOptions.preserveMediaIfOneTypeFails` is `true` (default is `false`),
     *  _both_ `audio` and `video` media types are requested, _and_ only one type of media fails
     *  then the media error for the failed media type will be ignored and the successful media will be
     *  returned. See `IMediaRequestOptions` for more information.
     *
     * Warning: if `sdk.media.requestMediaPermissions(type)` has NOT been called before
     *  calling `startMedia`, `startMedia` will call `sdk.media.requestMediaPermissions(type)`.
     *
     *  If calling `startMedia` with both `audio` and `video` _before_ requesting permissions,
     *  `startMedia` will attempt to gain permissions for `audio` first and then `video` (because
     *  media permissions must be requested one at a time). If `audio` fails, it will
     *  not attempt to gain permissions for `video` – the error will stop execution.
     *
     * @param mediaReqOptions request video and/or audio with a default device or deviceId.
     *  Defaults to `{video: true, audio: true}`
     * @param retryOnFailure (this option is deprectated – use `mediaReqOptions.retryOnFailure`) whether the sdk should retry on an error
     *
     * @returns a promise containing a `MediaStream` with the requested media
     */
    startMedia(mediaReqOptions?: IMediaRequestOptions, retryOnFailure?: boolean): Promise<MediaStream>;
    /**
     * Creates a `MediaStream` from the screen (this will prompt for user screen selection)
     *
     * @returns a promise containing a `MediaStream` with the requested screen media
     */
    startDisplayMedia(opts?: {
        conversationId?: string;
        sessionId?: string;
    }): Promise<MediaStream>;
    /**
     * Set the sdk default audioStream.
     *
     * Calling with a falsy value will clear out sdk default.
     *
     * @param stream media stream to use
     */
    setDefaultAudioStream(stream?: MediaStream): void;
    /**
     * Look for a valid deviceId in the cached media devices
     *  based on the passed in `deviceId`
     *
     * This will follow these steps looking for a device:
     *  1. If `deviceId` is a `string`, it will look for that device and
     *      return it if found
     *  2. If device could not be found _or_ `deviceId` was not a `string`,
     *      it will look for the sdk default device
     *  3. If device could not be found it will return `undefined`
     *
     * @param kind desired device kind
     * @param deviceId `deviceId` for specific device to look for, `true` for sdk default device, or `null` for system default
     * @param sessions any active sessions (used for logging)
     *
     * @returns a `string` if a valid deviceId was found, or `undefined` if
     *  no device could be found.
     */
    getValidDeviceId(kind: MediaDeviceKind, deviceId: string | boolean | null | undefined, ...sessions: IExtendedMediaSession[]): string | undefined;
    /**
     * Helper function to quickly get a valid SDK media request param. This is
     *  mostly an internally used function to ensure a valid SDK media request
     *  param was used to accept a session. See `interface ISdkMediaDeviceIds`
     *  for requesting media from the SDK.
     *
     * Example: `string | true | null` are valid and be returned as is.
     *  `undefined | false` will return `true` (which will use SDK default deviceId)
     *
     * @param deviceId media request param to validate
     * @returns a valid requestable SDK media value `string|null|true`
     */
    getValidSdkMediaRequestDeviceId(deviceId?: string | boolean | null): string | null | true;
    /**
     * Get a copy of the current media state
     *
     * @returns the current sdk media state
     */
    getState(): ISdkMediaState;
    /**
     * Get the current _cached_ media devices
     *
     * @returns an array of all cached devices
     */
    getDevices(): MediaDeviceInfo[];
    /**
     * Get the current _cached_ audio devices
     *
     * @returns an array of all cached audio devices
     */
    getAudioDevices(): MediaDeviceInfo[];
    /**
     * Get the current _cached_ video devices
     *
     * @returns an array of all cached video devices
     */
    getVideoDevices(): MediaDeviceInfo[];
    /**
     * Get the current _cached_ output devices
     *
     * @returns an array of all cached output devices
     */
    getOutputDevices(): MediaDeviceInfo[];
    /**
     * This will return all active media tracks that
     *  were created by the sdk
     *
     * @returns an array of all active media tracks
     *  created by the sdk
     */
    getAllActiveMediaTracks(): MediaStreamTrack[];
    /**
     * @deprecated use `sdk.media.findCachedDeviceByTrackLabelAndKind(track)`
     */
    findCachedDeviceByTrackLabel(track?: MediaStreamTrack): MediaDeviceInfo | undefined;
    /**
     * Look through the cached devices and match based on
     *  the passed in track's `kind` and `label`.
     *
     * @param track `MediaStreamTrack` with the label to search for
     * @returns the found device or `undefined` if the
     *  device could not be found.
     */
    findCachedDeviceByTrackLabelAndKind(track?: MediaStreamTrack): MediaDeviceInfo | undefined;
    /**
     * Look through the cached video devices and match based on
     *  the passed in video deviceId.
     *
     * @param id video deviceId
     * @returns the found device or `undefined` if the
     *  device could not be found.
     */
    findCachedVideoDeviceById(id?: string): MediaDeviceInfo | undefined;
    /**
     * Look through the cached audio devices and match based on
     *  the passed in audio deviceId.
     *
     * @param id audio deviceId
     * @returns the found device or `undefined` if the
     *  device could not be found.
     */
    findCachedAudioDeviceById(id?: string): MediaDeviceInfo | undefined;
    /**
     * Look through the cached output devices and match based on
     *  the passed in output deviceId.
     *
     * @param id output deviceId
     * @returns the found device or `undefined` if the
     *  device could not be found.
     */
    findCachedOutputDeviceById(id?: string): MediaDeviceInfo | undefined;
    /**
    * Returns the device that matches the passed in deviceId
    * and deviceType
    *
    * @param deviceId ID of device in question
    * @param deviceType device type audioinput | videoinput | audiooutput | etc.
    * @returns the device that matches the deviceId and type
    */
    findCachedDeviceByIdAndKind(deviceId: string, deviceKind: MediaDeviceKind): MediaDeviceInfo;
    /**
     * Determine if the passed in device exists
     *  in the cached devices
     *
     * @param device device to look for
     * @returns boolean whether the device was found
     */
    doesDeviceExistInCache(device?: MediaDeviceInfo): boolean;
    /**
     * This will remove all media listeners, stop any existing media,
     *  and stop listening for device changes.
     *
     * WARNING: calling this effectively renders the SDK
     *  instance useless. A new instance will need to be
     *  created after this has been called.
     */
    destroy(): void;
    /**
     * Determine if the passed in error is a media permissions error.
     *
     * @param error to check
     * @returns whether the error denied permissions or not
     */
    isPermissionsError(error: Error): boolean;
    /**
     * loads devices and listens for devicechange events
     */
    private initialize;
    private setDevices;
    private setPermissions;
    private setStateAndEmit;
    private monitorMicVolume;
    private clearAudioInputMonitor;
    private hasGetDisplayMedia;
    private hasOutputDeviceSupport;
    /**
     * Build valid getUserMedia constraints for passed in SDK media
     *  request options. Behavior is as follows:
     *
     * - If media type (`audio|video`) is `undefined|false`, the media
     *    type will be set to `false`
     * - If media type is a `string`, it will set the media type
     *    deviceId as `exact` to the passed in string. Ex.
     *    `video: { deviceId: { exact: options.video } }`
     * - If media type is `true` _and_ there is an SDK default deviceId
     *    for that media type, it will set the deviceId to the SDK
     *    default.
     * - If media type is `null` or `true` with no SDK default, the
     *    system default will be requested by using a `truthy` value.
     *
     * Note: `videoResolution` and `videoFrameRate` will use the passed
     *  in value or SDK defaults, _unless_ `false` is passed in which
     *  will always override defaults and not use these properties at
     *  all in the gUM request.
     *
     * @param options media request options
     */
    private getStandardConstraints;
    private getScreenShareConstraints;
    private mapOldToNewDevices;
    private doDeviceListsMatch;
    /**
     * Compare the two devices to see if they are the same device.
     * @param d1 first device
     * @param d2 second device
     */
    private compareDevices;
    private handleDeviceChange;
    /**
     * This function will request gUM one media type at a time. It has the
     *  following behavior:
     *  * determine the exact media constraints for gUM
     *  * set the opposite media type to `false` (ensuring
     *      only one media type is requested)
     *  * request gUM
     *
     * It will handle retries in the following pattern:
     *  * permissions errors are not retried
     *  * if retryOnFailure is `false`, it will not retry
     *  * on select video errors for unacceptable video resolutions
     *      it will retry without resolutions
     *  * on all other it will retry the media type with:
     *    * sdk default deviceId (if present)
     *    * system default deviceId
     *  * if all retry attempts were exhausted, it throws
     *      the last error received
     *
     * @param mediaType media type of request from gUM
     * @param mediaRequestOptions sdk media request options
     * @param retryOnFailure attempt to retry on gUM failure
     */
    private startSingleMedia;
    private stopMedia;
    private trackMedia;
    private setupDefaultMediaStreamListeners;
    private removeDefaultAudioStreamAndListeners;
    private setupDefaultMediaTrackListeners;
    private removeDefaultAudioMediaTrackListeners;
}
export {};
