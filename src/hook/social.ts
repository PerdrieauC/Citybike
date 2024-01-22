import {socialApi} from "./neighbookApi";
import type { GenericAbortSignal } from "axios";

export interface Image {
  id: string;
  url: string;
}

export interface Commentaire {
  id: string;
  idUtilisateur: string;
  contenu: string;
  idCommentaire: string | null;
  dateDeCreation: string;
}

export interface NombreReactions {
  like: number;
  mdr: number;
  Oo: number;
  snif: number;
  grr: number;
  ok: number;
}

export interface Post {
  id: string;
  titre: string;
  description: string;
  estPartage: boolean;
  idUtilisateur: string;
  dateDeCreation: Date;
  dateDeModification: Date;
  commentaires?: Array<Commentaire>;
  ncommentaires: number;
  reactionUtilisateur: number;
  images: Array<Image>;
  evenement?: Event;
  nombreReactions: NombreReactions;
  repost: Post | null;
}

export interface Event {
    id?: string;
    titre?: string;
    dateEvenement: Date;
    longitude?: number;
    latitude?: number;
    adresse?: string;
    dateDeCreation?: Date;
    dateDeModification?: Date;
    dateDeSuppression?: Date;
}

export const addPost = async (
    titre: string,
    description: string,
    idRepost: string | null,
    idEvent: string | null
): Promise<Post> => {
    const apiRes = await socialApi.post("post", {
        titre,
        description,
        idRepost,
        idEvenement: idEvent
    });
    if (apiRes.status === 200) {
        return apiRes.data as Post;
    }
    throw Error("Error creating post");
};

export const removePost = async (post: Post): Promise<void> => {
    await Promise.all(post.images.map(async(img)=>{
        const res = await socialApi.delete('image', {params: {id: img.id}});
        return res.status;
    }));
    await socialApi.delete('post', {params: {id: post.id}});
};

export const addPostImage = async (postId: string, file: File): Promise<Image> => {
    const apiRes = await socialApi.post("image/"+postId, {file}, {headers: {
        'Content-Type': 'multipart/form-data'
    }});
    if(apiRes.status === 200){
        return apiRes.data as Image;
    }
    throw Error('error while uploading file');
};

export const addEvent = async (
    titre: string,
    dateEvenement: Date,
    adresse: string
): Promise<Event> => {
    const date = dateEvenement.toISOString();
    const apiRes = await socialApi.post("event", {
        titre,
        dateEvenement: date,
        adresse
    });
    if (apiRes.status === 200) {
        return apiRes.data as Event;
    }
    throw Error("Error creating event");
};

export const getFeed = async (signal: GenericAbortSignal): Promise<Array<Post> | null> => {
    const apiRes = await socialApi.get("feed", {signal: signal});
    if(apiRes.status === 200){
        return apiRes.data as Array<Post>;
    }
    return null;
};

export const getUserPosts = async (userId: string, signal: GenericAbortSignal): Promise<Array<Post> | null> => {
    const apiRes = await socialApi.get("posts", {signal: signal, params: {userId}});
    if(apiRes.status === 200){
        return apiRes.data as Array<Post>;
    }
    return null;
};

export const getEvents = async (signal: GenericAbortSignal): Promise<Array<Event> | null> => {
    const apiRes = await socialApi.get("events", {signal: signal});
    if(apiRes.status === 200){
        return apiRes.data as Array<Event>;
    }
    return null;
};

export const getEvent = async (userId: string,signal: GenericAbortSignal): Promise<Event | null> => {
    const apiRes = await socialApi.get("event", {signal: signal, params:{id:userId}});
    if(apiRes.status === 200){
        return apiRes.data as Event;
    }
    return null;
};

export const getLocationFeed = async (
    distance: number, longitude: number, latitude: number, signal: GenericAbortSignal
): Promise<Array<Post> | null> => {
    const apiRes = await socialApi.get("localisationFeed",
        {
            signal: signal,
            params: {distance: distance, longitude: longitude, latitude: latitude}
        });
    console.log(apiRes);
    if(apiRes.status === 200){
        return apiRes.data as Array<Post>;
    }
    return null;
};

export const getPost = async (id: string, signal: GenericAbortSignal): Promise<Post | null> => {
    const apiRes = await socialApi.get("post", {signal: signal, params:{id}});
    if(apiRes.status === 200){
        return apiRes.data as Post;
    }
    return null;
};

export const postComment = async (idPost: string, contenu: string, idCommentaire: string | null): Promise<Commentaire> => {
    const apiRes = await socialApi.post("comment", {idPost, contenu, idCommentaire});
    if(apiRes.status === 200){
        return apiRes.data as Commentaire;
    }
    throw Error('impossible de commenter');
};

export const deleteComment = async (id: string): Promise<void> => {
    const apiRes = await socialApi.delete("comment", {params:{id}});
    if(apiRes.status === 200){
        return;
    }
    throw Error('impossible de supprimer');
};

export const updateReaction = async (reactionId: number | null, postId: string): Promise<void> => {
    await socialApi.patch("reaction", {reactionId, postId});
};