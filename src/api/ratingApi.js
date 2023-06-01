import axiosClient from "./axiosClient";

const ratingApi = {
    getAll: ({page, limit, sortByDate}) => {
        const url = 'rating/'
        return axiosClient.get(url, { params: {page, limit, sortByDate}})
    },
    getById: (id) => {
        const url = `rating/${id}`
        return axiosClient.get(url)
    },
    create: (data) => {
        const url = `rating/`
        return axiosClient.post(url, data)
    },
    getAverage: (data) => {
        const url = `rating/average-ratings/`
        return axiosClient.post(url, data)
    }
}

export default ratingApi;