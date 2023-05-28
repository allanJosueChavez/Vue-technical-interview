import axios from 'axios'

const axiosInstance = axios.create({
    baseURL:'https://servicios.mem.gob.gt/api/api_prueba/prueba',
    headers: {
        'Content-Type' : 'application/json'
    }
})

export default axiosInstance