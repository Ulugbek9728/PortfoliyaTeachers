import {FONTSIZE} from "@/constants/types";
import {getStorage} from "@/utils/storages/index";

export const getFontSize = () => {
    return getStorage(true).getItem(FONTSIZE) ? parseInt(getStorage(true).getItem(FONTSIZE)) : 0
}

export const setFontSize = (fontSize) => {
    getStorage(true).setItem(FONTSIZE, fontSize)
}