import axiosClient from "./axiosClient"
const config = {     
    headers: { 'content-type': 'multipart/form-data' }
}
const importCSVApi = {
    importBookCSV: (data) => {
        const url = `import/import-book`;
        return axiosClient.post(url, data, config);
    },
}

export default importCSVApi;