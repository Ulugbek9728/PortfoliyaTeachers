import { toast } from "react-toastify"

export const errorHandler = (e)  => {
    toast.error(e?.response?.data.message)
}