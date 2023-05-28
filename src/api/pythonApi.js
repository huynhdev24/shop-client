import axiosClient from "./axiosClient"

const pythonApi = {
    testPythonShell: ({bookname}) => {
        const url = `pythons/nlp`
        return axiosClient.get(url, { params: {bookname}})
    },
}

export default pythonApi;