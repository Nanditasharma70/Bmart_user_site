// import MainApi from "../MainApi";
import MainApi from "api-manage/MainApi";
// import { config_api } from "../ApiRoutes";
import { config_api } from "api-manage/ApiRoutes";
export const ConfigApi = {
  config: () => MainApi.get(config_api),
};
