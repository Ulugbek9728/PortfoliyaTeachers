import {getInstance, getFacultyList} from "../utils/httpClient";

export const getLogin = (code, state) => getInstance().get(`/api/auth/login`, {
    params: {
        code: code,
        state: state
    }
});
export const getFaculty = (id,value) => getFacultyList().get(`/api/department`,{
    params:{
        structureCode:id,
        parent:value? value: ''
    }
});
export const ClassifairGet = (e) => getInstance().get(`/api/classifier`,{
    params: {
        key: e
    },
})
export const getProfile = (e,faculty,department,query) => getInstance().get(`/api/profile`,{
    params: {
        staffPosition: e,
        facultyId:faculty? faculty:null,
        departmentId:department? department: null,
        query:query? query: null
    },
})
export const ChangeRole = (value) => getInstance().post(`/api/auth/change-role/${value}`)
export const addDekanInfo = (id, value) => getInstance().put(`/api/profile/mark-as-faculty/${id}`, value)
export const deleteDekanInfo = (id,) => getInstance().delete(`/api/profile/un-mark-as-faculty/${id}`)
export const getFacultyDekan = () => getInstance().get(`/api/profile/read-as-faculty`);
export const getIlmiyNashir = (publicationName,fromlocalDate, tolocalDate, type, employeeId, scientificPublicationType) => getInstance().get(`/api/publication`,{
    params:{
        publicationName,
        fromlocalDate,
        tolocalDate,
        type,
        employeeId,
        scientificPublicationType,
        // intellectualPropertyPublicationType:'',
        // page:'',
        // size:'',
    }
});