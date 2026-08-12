import { GenesysCloudWebrtcSdk } from '../client';
import { IExtendedMediaSession, ISessionIdAndConversationId } from '../types/interfaces';
export declare let _hasTransceiverFunctionality: boolean;
/**
 * Select or create the `audio.__gc-webrtc-inbound` element
 * @deprecated use `createUniqueAudioMediaElement()` instead
 */
export declare const getOrCreateAudioMediaElement: (className?: string) => HTMLAudioElement;
export declare const createUniqueAudioMediaElement: () => HTMLAudioElement;
/**
 * Attach an audio stream to the given audio element.
 *  If no element is provided, a new element will be
 *  created and attached to the DOM.
 *
 * @param sdk sdk instance
 * @param stream audio stream to attach
 * @param audioElement optional audio element to attach stream to
 * @param ids session and/or conversation Ids for logging
 */
export declare const attachAudioMedia: (sdk: GenesysCloudWebrtcSdk, stream: MediaStream, volume?: number, audioElement?: HTMLAudioElement, ids?: ISessionIdAndConversationId) => HTMLAudioElement;
/**
 * Utility method to check if the browser supports
 *  RTC transceivers.
 */
export declare const checkHasTransceiverFunctionality: () => boolean;
/**
 * Utility method to check all tracks on a given stream
 *  to determine if all tracks have ended.
 * @param stream to check tracks on
 */
export declare const checkAllTracksHaveEnded: (stream: MediaStream) => boolean;
/**
 * Utility method to create a new stream and add
 *  the passed in track
 * @param track media track to add
 */
export declare const createNewStreamWithTrack: (track: MediaStreamTrack) => MediaStream;
export type LogDevicesAction = 'sessionStarted' | 'calledToChangeDevices' | 'changingDevices' | 'successfullyChangedDevices' | 'unmutingVideo';
/**
 * Utility to log device changes. It will use the passed in `from` track _or_
 *  look up the currently used devices via the sender (based on labels) to see
 *  what device is currently in use. Then it will log out the device changing `to`
 *  as the new device.
 *
 * NOTE: if the system default is being used and then changes (which will force
 *  devices to be enumerated) the device will not be able to be looked up in the
 *  cached devices. So the caller will need to pass in the "old" system default(s)
 *  as `fromVideoTrack` and/or `fromAudioTrack`.
 *
 * @param sdk sdk instance
 * @param session session devices are changing for
 * @param action action taken
 * @param devicesChange devices changing to/from
 */
export declare function logDeviceChange(sdk: GenesysCloudWebrtcSdk, session: IExtendedMediaSession, action: LogDevicesAction, devicesChange?: {
    toVideoTrack?: MediaStreamTrack;
    toAudioTrack?: MediaStreamTrack;
    fromVideoTrack?: MediaStreamTrack;
    fromAudioTrack?: MediaStreamTrack;
    requestedOutputDeviceId?: string;
    requestedVideoDeviceId?: string | boolean;
    requestedAudioDeviceId?: string | boolean;
    requestedNewMediaStream?: MediaStream;
}): void;
