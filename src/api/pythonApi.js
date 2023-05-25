import axiosClient from "./axiosClient"

const pythonApi = {
    testPythonShell: () => {
        const url = `pythons/nlp`
        return axiosClient.get(url)
    },
}

export default pythonApi;