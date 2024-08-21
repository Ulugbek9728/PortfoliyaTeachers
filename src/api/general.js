import {getInstance, getFacultyList} from "../utils/httpClient";
import axios from "axios";


// login
export const getLogin = (code, state) => getInstance().get(`/api/auth/login`, {
    params: {
        code: code,
        state: state
    }
});
export const getFaculty = () => getFacultyList().get(`/api/department`);

export const ClassifairGet = (e) => getInstance().get(`/api/classifier`,{
    params: {
        key: e
    },
})

export const getProfile = (e) => getInstance().get(`/api/profile`,{
    params: {
        staffPosition: e
    },
})

export const ChangeRole = (value) => getInstance().post(`/api/auth/change-role/${value}`)

export const addDekanInfo = (id, value) => getInstance().put(`/api/profile/mark-as-faculty/${id}`, value)

export const deleteDekanInfo = (id,) => getInstance().delete(`/api/profile/un-mark-as-faculty/${id}`)


export const getFacultyDekan = () => getInstance().get(`/api/profile/read-as-faculty`);

