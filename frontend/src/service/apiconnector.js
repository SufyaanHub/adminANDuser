import axios from "axios"

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json"
  }
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    const config = {
        method: method,
        url: url,
        headers: headers ? headers : { "Content-Type": "application/json" },
        params: params ? params : null,
    };
    
    // Don't send data for GET and DELETE requests
    if (method !== 'GET' && method !== 'DELETE') {
        config.data = bodyData || null;
    }
    
    return axiosInstance(config);
}