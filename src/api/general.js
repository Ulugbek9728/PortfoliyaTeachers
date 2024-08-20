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

