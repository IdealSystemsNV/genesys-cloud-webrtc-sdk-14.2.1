import { IConversationParticipantFromEvent } from '../types/interfaces';
export declare class ConversationUpdate {
    id: string;
    participants: Array<IConversationParticipantFromEvent>;
    constructor(rawUpdate: any);
}
