import axiosClient from "./axiosClient";

const recommendApi = {
    // getAll: ({page, limit, sortByDate}) => {
    //     const url = 'rating/'
    //     return axiosClient.get(url, { params: {page, limit, sortByDate}})
    // },
    getById: (id) => {
        const url = `recommend/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `recommend/`
        return axiosClient.post(url, data)
    },
    deleteAll: () => {
        const url = `recommend/`
        return axiosClient.delete(url);
    },
    getDataNLPById: ({key}) => {
        const url = `recommend/search`
        return axiosClient.get(url, { params: {key}})
    },
}

export default recommendApi;