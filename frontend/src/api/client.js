import axios from 'axios'

const api = axios.create({
    baseURL: 'https://localhost:7209/',
    headers: {
    'Content-Type': 'application/json',
    },
});