import {messagerieApi} from "./neighbookApi";
import type { GenericAbortSignal } from "axios";

export interface GroupRoom {
    id: string;
    name: string;
    idUtilisateurs: Array<string>;
}

export interface Message {
    idMessage?: number;
    senderId: string;
    receiverOrRoomId?: string;
    isRoomMessage?: boolean;
    content: string;
    date?: string;
}

export const createGroup = async (
    groupName: string,
    idUtilisateurs: Array<string>,
): Promise<GroupRoom> => {
    const apiRes = await messagerieApi.post("group", {
        groupName,
        idUtilisateurs
    });
    if (apiRes.status === 200) {
        return apiRes.data as GroupRoom;
    }
    throw Error("Error creating event");
};

export const getGroups = async (userId: string, signal: GenericAbortSignal): Promise<Array<GroupRoom> | null> => {
    const apiRes = await messagerieApi.get("groups", {signal: signal, params: {idUser: userId}});
    if(apiRes.status === 200){
        return apiRes.data as Array<GroupRoom>;
    }
    return null;
};

export const getMessages = async (userId: string, receiverOrRoomId: string, signal: GenericAbortSignal): Promise<Array<Message> | null> => {
    const apiRes = await messagerieApi.get("messages", {
        signal: signal, 
        params: {
            idUser: userId,
            receiverOrRoomId: receiverOrRoomId
        }}
    );
    if(apiRes.status === 200){
        return apiRes.data as Array<Message>;
    }
    return null;
};

