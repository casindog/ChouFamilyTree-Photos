import axios from 'axios';

export const getPersons = () => {
    return axios.get(`/api/persons`)
}