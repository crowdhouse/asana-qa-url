import axios from "axios";
import axiosRetry from "axios-retry";
import { getInput } from "@actions/core";
import { ASANA_SECRET } from "../constants/inputs";
import * as REQUESTS from "../constants/requests";

const axiosInstance = axios.create({
  baseURL: REQUESTS.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRob3JpemF0aW9uIjoxMjAzMTMzNTY4MzAxMzI2LCJzY29wZSI6ImRlZmF1bHQgaWRlbnRpdHkiLCJzdWIiOjExOTE2ODc2ODY1MTAxMDMsImlhdCI6MTY2NTQwOTAzOCwiZXhwIjoxNjY1NDEyNjM4fQ.rI6SSAWxQFIIKrnADWDOX_Lx94NZCjy2Nv2UI1Px9M4`,
  },
});

axiosRetry(axiosInstance, {
  retries: REQUESTS.RETRIES,
  retryDelay: (retryCount) => retryCount * REQUESTS.RETRY_DELAY,
  retryCondition: (error) => {
    const status = error?.response?.status;
    if (!status) return true;
    return String(status).startsWith("50");
  },
});

export default axiosInstance;
