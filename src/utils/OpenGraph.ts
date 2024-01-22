const OPEN_GRAPH_API_URL = import.meta.env.OPEN_GRAPH_API_URL as string || null;

export interface OG_DATA {
  ogTitle: string;
  ogDescription: string;
  ogUrl: string;
  requestUrl: string;
  ogSiteName: string;
  ogImage: {
    url: string;
  }
} 

export const getOpenGraphTags = async (url : string): Promise<Error|OG_DATA> => {
    if(!OPEN_GRAPH_API_URL) {
        return new Error('Cannot find OG api url');
    }

    const res = await fetch(`${OPEN_GRAPH_API_URL}?url=${encodeURIComponent(url)}`);

    if(res.status === 200) {
        const json = await res.json() as OG_DATA;
        if(!json.ogTitle || !json.ogDescription || !json.ogUrl || !json.ogImage) {
            return new Error('Invalid OG tags');
        }
        return json;
    }
    return new Error('Failed to get OG data');
};