import { Observable } from 'rxjs';
import { VendorImplementation } from 'softphone-vendor-headsets';
import GenesysCloudWebrtcSdk from '../client';
import { ExpandedConsumedHeadsetEvents, ISdkHeadsetService, OrchestrationState } from './headset-types';
export declare class HeadsetProxyService implements ISdkHeadsetService {
    protected sdk: GenesysCloudWebrtcSdk;
    private currentHeadsetService;
    private currentEventSubscription;
    private headsetEventsSub;
    private orchestrationWaitTimer;
    private useHeadsetOrchestration;
    headsetEvents$: Observable<ExpandedConsumedHeadsetEvents>;
    orchestrationState: OrchestrationState;
    constructor(sdk: GenesysCloudWebrtcSdk);
    initialize(): void;
    setUseHeadsets(useHeadsets: boolean): void;
    get currentSelectedImplementation(): VendorImplementation;
    private handleHeadsetEvent;
    updateAudioInputDevice(newMicDeviceId: string): void;
    private startHeadsetOrchestration;
    private setOrchestrationState;
    private handleMediaMessage;
    private getRequestPriority;
    private handleHeadsetControlsRequest;
    private handleHeadsetControlsRejection;
    private handleHeadsetControlsChanged;
    private sendControlsRejectionMessage;
    private sendControlsChangedMessage;
    showRetry(): boolean;
    retryConnection(micDeviceLabel: string): Promise<void>;
    setRinging(callInfo: {
        conversationId: string;
        contactName?: string;
    }, hasOtherActiveCalls: boolean): Promise<void>;
    outgoingCall(callInfo: {
        conversationId: string;
        contactName: string;
    }): Promise<void>;
    endCurrentCall(conversationId: string, hasOtherActiveCalls: boolean): Promise<void>;
    endAllCalls(): Promise<void>;
    answerIncomingCall(conversationId: string, autoAnswer: boolean): Promise<void>;
    rejectIncomingCall(conversationId: string, expectExistingConversation?: boolean): Promise<void>;
    setMute(isMuted: boolean): Promise<void>;
    setHold(conversationId: string, isHeld: boolean): Promise<void>;
    resetHeadsetStateForCall(conversationId: string): Promise<void>;
}
