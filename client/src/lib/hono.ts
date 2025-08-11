import { hcWithType } from "server/dist/client";
import { SERVER_URL } from "../util/constants";

export const client = hcWithType(SERVER_URL, {
  init: {
    credentials: 'include'
  },
});
