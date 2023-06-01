import axiosClient from "./axiosClient";

const pythonApi = {
    testPythonShell: ({bookinfo}) => {
        const url = `pythons/nlp`
        return axiosClient.get(url, { params: {bookinfo}})
    },
}

export default pythonApi;