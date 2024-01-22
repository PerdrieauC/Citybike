import {socialApi} from "./neighbookApi";
import type {GenericAbortSignal} from "axios";
import type {User} from "./user";

export const getFollows = async (signal: GenericAbortSignal): Promise<Array<User> | null> => {
    const apiRes = await socialApi.get("follows", {signal: signal});
    if(apiRes.status === 200){
        return apiRes.data as [];
    }
    return null;
};

export const getFollowers = async (id: string, signal: GenericAbortSignal): Promise<Array<User>> => {
    const apiRes = await socialApi.get("followers", {signal: signal, params: {id}});
    if(apiRes.status === 200){
        return apiRes.data as [];
    }
    throw Error('error retrieving followers');
};

export const follow = async (idToFollow: string): Promise<void> => {
    const apiRes = await socialApi.post("follow", {idToFollow});
    if(apiRes.status === 200){
        return;
    }
    throw Error('error following ' + idToFollow);
};

export const unfollow = async (id: string): Promise<void> => {
    const apiRes = await socialApi.delete("follow", {params: {id}});
    if(apiRes.status === 200){
        return;
    }
    throw Error('error unfollowing ' + id);
};