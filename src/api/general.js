import {getInstance} from "../utils/httpClient";

export const getLogin = (code, state) => getInstance().get(`/api/auth/login`, {
    params: {
        code: code,
        state: state
    }
});
export const getUserInfo = (value) => getInstance().get(`/api/profile/current`,value);
export const getFaculty = (id,value) => getInstance().get(`/api/department`,{
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
export const getdepartmentAdmin = (value) => getInstance().get(`/api/profile/read-as-department`,{params:value});
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
export const EmployeeStatusKPIand1030 = (value) => getInstance().put(`/api/kpi/employee-student`, value)
export const ToglActiveStatus = (value) => getInstance().put(`/api/publication/update_status`, value)
export const EmployeeStatus = (value) => getInstance().put(`/api/employee-student/status`, value)
export const Comment = (value) => getInstance().post(`/api/comment`, value)
export const getComment = (filter) => getInstance().get(`/api/comment/${filter}`);

export const fetchCurrentUser = () => getInstance().get(`/api/profile/current`);

export const profileUpdate = (data) => getInstance().put(`/api/profile/update`, data);
// Ilmiy nashrni yaratish uchun funksiyasi
export const IlmiyNashrCreate = (data) => getInstance().post('/api/publication/create', data);

// Ilmiy nashrni yangilash uchun funksiyasi
export const IlmiyNashrUpdate = (data) => getInstance().put('/api/publication/update', data);

// mualliflarni qoshish uchun
export const addAuthor = (data2) => getInstance().post('/api/author/create', data2)
 
//Search

export const search = (filter) => getInstance().get('/api/author/search',{
    params: filter
})

//Ilmiy Nashrlar Deleted

export const DeletIlmiyNashr = (value) => getInstance().put(`/api/publication/update_status`, value)

// getPublikatsiya Ilmiy Nashrlar

export const getIlmiyNashrPublikatsiya = (filter) => getInstance().get(`/api/publication/current-user`,{
    params:filter
});

// Ilmiy nashrni yaratish uchun funksiyasi
export const UslubiyNashrCreate = (data) => getInstance().post('/api/publication/create', data);

// Ilmiy nashrni yangilash uchun funksiyasi
export const UslubiyNashrUpdate = (data) => getInstance().put('/api/publication/update', data);

// Uslubiy Nashrlar get
export const getUslubiyNashrPublikatsiya = (filter) => getInstance().get(`/api/publication/current-user`,{
    params:filter
});

// Ilmiy nashrni yaratish uchun funksiyasi
export const IntelektualCreate = (data) => getInstance().post('/api/publication/create', data);

// Ilmiy nashrni yangilash uchun funksiyasi
export const IntelektualUpdate = (data) => getInstance().put('/api/publication/update', data);
// Ilmiy Saloxiyat yaratish uchun funksiyasi
export const SaloxiyatCreate = (data) => getInstance().post('/api/employee-student', data);

// Ilmiy Saloxiyat yangilash uchun funksiyasi
export const SaloxiyatUpdate = (data,id) => getInstance().put(`/api/employee-student/${id}`, data);

export const TeacherList = (params) => getInstance().get('/api/profile/admin/teacher-list', { params });

export const TeacherFullInfoList = () => {
    return getInstance().get(`/api/profile/admin/teacher-list`);
  };
 export const TeacherInfoLinks = (data) => {return getInstance().get(`/api/author-profile/${data}`)};
 export const TeacherInfo = (data) => {return getInstance().get(`/api/employee/get/${data}`)};