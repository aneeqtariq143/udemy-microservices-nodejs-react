import axios from "axios";
import { headers } from "next/headers";

interface HeadersObject {
    [key: string]: string;
}

export default () => {
    const headerStore = headers();
    // Convert headers to a plain object
    const headersObject: HeadersObject = {};
    headerStore.forEach((value, key) => {
        headersObject[key] = value;
    });

    if(typeof window === 'undefined'){
        console.log('API hit at Server Side');
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: headersObject
        });
    }else{
        console.log('API hit at Client Side');
        return axios.create({
            baseURL: '/'
        });
    }
};