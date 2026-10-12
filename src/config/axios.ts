import axios from "axios";
import {env} from "./env"

export const apiClient = axios.create({
    baseURL: env.apiBaseURL,
    timeout: 15_000,
    headers: {
        Accept: "application/json",
    },
});