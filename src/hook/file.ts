import {fileApi} from "./neighbookApi";

interface file_res{
    file_url: string;
}
export const getFileUrl = async (file_name: string): Promise<string> => {
    const apiRes = await fileApi.get("profilec/"+file_name);
    if(apiRes.status === 200){
        return (apiRes.data as file_res).file_url;
    }
    throw Error('error while getting file url');
};

export const renewFileUrl = async (file_url: string): Promise<string> => {
    const file_name = file_url.split("?")[0].split("profilec/")[1];
    if(!file_name){
        throw Error("invalid file url");
    }
    const apiRes = await fileApi.get("profilec/"+file_name);
    if(apiRes.status === 200){
        return (apiRes.data as file_res).file_url;
    }
    throw Error('error while getting file url');
};

export const deleteFile = async (file_url: string): Promise<void> => {
    const file_name = file_url.split("?")[0].split("profilec/")[1];
    if(!file_name){
        throw Error("invalid file url");
    }
    const apiRes = await fileApi.delete("delete/profilec/"+file_name);
    if(apiRes.status === 200){
        return;
    }
    throw Error('error while deleting file');
};

export const uploadFile = async (file_name: string, file: File): Promise<string> => {
    const apiRes = await fileApi.post("upload/profilec/"+file_name, {file}, {headers: {
        'Content-Type': 'multipart/form-data'
    }});
    if(apiRes.status === 200){
        return (apiRes.data as file_res).file_url;
    }
    throw Error('error while uploading file');
};

