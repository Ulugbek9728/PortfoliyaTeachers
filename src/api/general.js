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
export const getProfile = (filter) => getInstance().get(`/api/profile`,{
    params:filter ,
})
export const ChangeRole = (value) => getInstance().post(`/api/auth/change-role/${value}`)
export const addDekanInfo = (id, value) => getInstance().put(`/api/profile/mark-as-faculty/${id}`, value)
export const deleteDekanInfo = (id,) => getInstance().delete(`/api/profile/un-mark-as-faculty/${id}`)
export const getFacultyDekan = () => getInstance().get(`/api/profile/read-as-faculty`);
export const getdepartmentAdmin = () => getInstance().get(`/api/profile/read-as-department`);
export const addDepartmentInfo = (id, value) => getInstance().put(`/api/profile/mark-as-department/${id}`, value)
export const deleteDepartment = (id,) => getInstance().delete(`/api/profile/un-mark-as-department/${id}`)
export const getIlmiyNashir = (filter) => getInstance().get(`/api/publication`,{
    params:filter
});
export const getPublikatsiya = (filter) => getInstance().get(`/api/publication/current-user`,{
    params:filter
});
export const getIlmiySaloxiyat = (filter) => getInstance().get(`api/employee-student`,{
    params:filter
});
export const DeletIlmiySalohiyat = (id,) => getInstance().delete(`/api/employee-student/${id}`)
export const DeletIntelektual = (value) => getInstance().put(`/api/publication/update_status`, value)
export const ToglActiveStatusKPIand1030 = (value) => getInstance().put(`/api/kpi/update`, value)
export const ToglActiveStatus = (value) => getInstance().put(`/api/publication/update_status`, value)
