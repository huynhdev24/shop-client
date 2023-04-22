import axiosClient from "./axiosClient"

const historyApi = {
    getAll: ({page = 1, limit, sort = { createdAt: -1 }, query = null}) => {
        const url = 'history/'
        return axiosClient.get(url, { params: {page, limit, sort, query}})
    },
    getById: (id) => {
        const url = `history/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `history/`
        return axiosClient.post(url, data)
    },
    update: (id, data) => {
        const url = `history/${id}`
        return axiosClient.put(url, data)
    },
    delete: (id) => {
        const url = `history/${id}`
        return axiosClient.delete(url)
    }
}

export default historyApi;