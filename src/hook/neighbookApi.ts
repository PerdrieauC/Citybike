import axios from "axios";
import {config} from "../config/api_config";


class authenticatedApi {
    instance;

    constructor() {
        this.instance = {};
    }

    createInstance(){
        return this.instance = axios.create({
            baseURL: config.api_base_url,
            timeout: 1000,
        });
    }

    getInstance(){
        return this.createInstance();
    }
}
export const api = new authenticatedApi();
