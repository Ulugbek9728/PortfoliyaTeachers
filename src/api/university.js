import { errorHandler } from "@/utils/errorHandler";
import { getInstance } from "@/utils/httpClient";
import { getLocale } from "@/utils/locales/getLocale";

export const universityHelperHttp = (route) =>
  getInstance().get(route + `?lang=${getLocale()}`);
export const addVirtualReception = async (route, data) => {
  try {
    const fd = new FormData();
    Object.keys(data).forEach((key) => {
      fd.append(key, data[key]);
    });
    const headers = { headers: { "Content-Type": "multipart/form-data" } };
    const res = await getInstance().post(route, fd, headers);
    return { ok: true, ...res.data };
  } catch (e) {
    errorHandler(e);
    return { ok: false };
  }
};
