import { getInstance } from "../utils/httpClient";

export const imgUrl = "https://test.tdtu.uz/storage/";
// export const imgUrl = "https://homeworking.uz/storage/";

const lang = localStorage.getItem("i18nextLng");

// news
export const getHomeSlider = () => getInstance().get(`slidernews?lang=${lang}`);

export const getPrepartion = () => getInstance().get(`praper?lang=${lang}`);
export const getSearch = () =>
  getInstance().get(`allnewscategory?lang=${lang}`);

export const getHomeNews = () => getInstance().get(`news?page=1&lang=${lang}`);
export const getMuhimElon = () =>
  getInstance().get(`muhumElonlar?lang=${lang}`);
export const getNews = (p) => getInstance().get(`news?page=${p}&lang=${lang}`);
export const getAnnouncements = (p) =>
  getInstance().get(`getannouncements?page=${p}&lang=${lang}`);
export const getEvents = (p) =>
  getInstance().get(`getevents?page=${p}&lang=${lang}`);
export const getSports = (p) =>
  getInstance().get(`getsports?page=${p}&lang=${lang}`);

export const getNewsId = (id) => getInstance().get(`news/${id}?lang=${lang}`);
export const getAnnouncementsId = (id) =>
  getInstance().get(`getoneannouncements/${id}?lang=${lang}`);
export const getEventsId = (id) =>
  getInstance().get(`getoneevents/${id}?lang=${lang}`);
export const getSportsId = (id) =>
  getInstance().get(`getonesports/${id}?lang=${lang}`);
// news

// home
export const getHomeFacultets = () => getInstance().get(`facults?lang=${lang}`);
export const getHomeOurAlumni = () =>
  getInstance().get(`graduats?lang=${lang}`);
export const getHomeFacts = () => getInstance().get(`facts`);
export const getHomeBussins = () => getInstance().get(`bussins?lang=${lang}`);
export const getHomeContact = () => getInstance().get(`contacts`);
// home

// tuzulma
export const getRectorat = () => getInstance().get(`rectorats?lang=${lang}`);
export const getCenterId = (id) =>
  getInstance().get(`getcenteraboutsById/${id}?lang=${lang}`);

export const getBulimId = (id) =>
  getInstance().get(`getdepartmentaboutById/${id}?lang=${lang}`);

export const getfacultetId = (id) =>
  getInstance().get(`getfilialaboutsById/${id}?lang=${lang}`);
export const getfacultetAboutId = (id) =>
  getInstance().get(`getfilialaboutsById/${id}?lang=${lang}`);

export const getKafedra = () => getInstance().get(`kafedramenu?lang=${lang}`);
export const getFacultetId = (id) =>
  getInstance().get(`facultsinfo/${id}?lang=${lang}`);
export const getKafedraId = (id) =>
  getInstance().get(`kafedrainfo/${id}?lang=${lang}`);

export const getRectoratId = (id) =>
  getInstance().get(`rectorats/count/${id}?lang=${lang}`);
// tuzilma

// faoliyat
export const getFaoliyatFan = () => getInstance().get(`fans?lang=${lang}`);
export const getQabul = () => getInstance().get(`qabul?lang=${lang}`);
export const getFaoliyatDok = () => getInstance().get(`doctorals?lang=${lang}`);
export const getFaoliyatInnov = () =>
  getInstance().get(`inovations?lang=${lang}`);
export const getFaoliyatMadaniyat = () =>
  getInstance().get(`culturals?lang=${lang}`);
export const getFaoliyatMoliyaviy = () =>
  getInstance().get(`finances?lang=${lang}`);
export const getFaoliyatXalqaroHamkor = () =>
  getInstance().get(`internationalconnection?lang=${lang}`);
export const getFaoliyatXalqaroHamkorQoshma = () =>
  getInstance().get(`mixtures?lang=${lang}`);
export const getFaoliyatXalqaroHamkorHodim = () =>
  getInstance().get(`internationalConnectionWorker?lang=${lang}`);
export const getFaoliyatXalqaroHamkorId = (id) =>
  getInstance().get(`getmixturesbyid/${id}?lang=${lang}`);
export const getFaoliyatCreative = () =>
  getInstance().get(`creatives?lang=${lang}`);
export const getFaoliyatErasmusKa = () =>
  getInstance().get(`erasmus?lang=${lang}`);
export const getFaoliyatKa107 = () =>
  getInstance().get(`raqamlis?lang=${lang}`);
export const getFaoliyatErasmusMecha = () =>
  getInstance().get(`mechauzs?lang=${lang}`);
export const getFaoliyatErasmusSpace = () =>
  getInstance().get(`spaces?lang=${lang}`);
export const getFaoliyatYoshlar = () =>
  getInstance().get(`youngs?lang=${lang}`);
// faoliyat

// talabalar
export const getStudentdId = (id) =>
  getInstance().get(`getstudentsbyid/${id}?lang=${lang}`);

export const getTalabaBakalavr = () =>
  getInstance().get(`getstudentsallbycategory/Bakalavriat?lang=${lang}`);
export const getTalabaMagistr = () =>
  getInstance().get(`getstudentsallbycategory/Magistratura?lang=${lang}`);
export const getTalabaKechki = () =>
  getInstance().get(`getstudentsallbycategory/Kechki ta’lim?lang=${lang}`);
export const getTalabaSirtqi = () =>
  getInstance().get(`getstudentsallbycategory/Sirtqi ta’lim?lang=${lang}`);
export const getTalabaBitiruv = () =>
  getInstance().get(
    `getstudentsallbycategory/Bitiruvchilar klubi?lang=${lang}`
  );
// talabalar

// ilmiy-faoliyat
export const getTexnika = (id) =>
  getInstance().get(`gettechniqsfile/${id}?lang=${lang}`);
export const getMahoratDarslar = () =>
  getInstance().get(`masterylessons?lang=${lang}`);
// ilmiy-faoliyat

// abituriyent
export const getAbiturBakalavr = () =>
  getInstance().get(`bachelors?lang=${lang}`);
export const getBachelorsbyidId = (id) =>
  getInstance().get(`bachelorsbyid/${id}?lang=${lang}`);

export const getAbiturMagistr = () => getInstance().get(`masters?lang=${lang}`);
export const getAbiturSirtqi = () =>
  getInstance().get(`extramunals?lang=${lang}`);
export const getAbiturQosma = () =>
  getInstance().get(`jointeducationals?lang=${lang}`);
export const getAbiturXorijiy = () =>
  getInstance().get(`foreigncitizens?lang=${lang}`);
// abituriyent

// korrupsiyasiz soha

export const getKorrupsiyaId = (id) =>
  getInstance().get(`corruptionsectors/${id}?lang=${lang}`);
// korrupsiyasiz soha
