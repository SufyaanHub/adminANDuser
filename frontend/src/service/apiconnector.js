import axios from "axios"

export const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json"
  }
});

export const apiConnector = (method, url, bodyData, headers, params) => {
    return axiosInstance({
        method: method,
        url: url,
        data: bodyData ? bodyData : null,
        headers: headers ? headers : { "Content-Type": "application/json" },
        params: params ? params : null,
    });
}