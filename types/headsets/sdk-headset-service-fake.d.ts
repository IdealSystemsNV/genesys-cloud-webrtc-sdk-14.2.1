import { Observable, Subject } from "rxjs";
import { SdkHeadsetBase } from "./sdk-headset-base";
import { ExpandedConsumedHeadsetEvents } from "./headset-types";
import GenesysCloudWebrtcSdk from "../client";
export declare class SdkHeadsetServiceFake extends SdkHeadsetBase {
    _fakeObservable: Subject<ExpandedConsumedHeadsetEvents>;
    headsetEvents$: Observable<ExpandedConsumedHeadsetEvents>;
    constructor(sdk: GenesysCloudWebrtcSdk);
}
