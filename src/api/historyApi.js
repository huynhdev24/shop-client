import axiosClient from "./axiosClient";

const historyApi = {
    getAll: ({page = 1, limit, sort = { createdAt: -1 }, userId}) => {
        const url = 'history/';
        return axiosClient.get(url, { params: {page, limit, sort, userId}});
    },
    getById: (id) => {
        const url = `history/${id}`;
        return axiosClient.get(url);
    },
    create: (data) => {
        const url = `history/`;
        return axiosClient.post(url, data);
    },
    update: (id, data) => {
        const url = `history/${id}`
        return axiosClient.put(url, data)
    },
    delete: (id) => {
        const url = `history/${id}`
        return axiosClient.delete(url)
    },
    getSearch: ({page = 1, limit, sort = { createdAt: -1 }, query}) => {
        const url = 'history/searchstring'
        return axiosClient.get(url, { params: {page, limit, sort, query}})
    },
}

export default historyApi;