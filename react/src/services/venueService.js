import axios from "axios";
import * as serviceHelper from "./serviceHelpers";
axios.defaults.withCredentials = true;

const venueUrl = serviceHelper.API_HOST_PREFIX + "/api/venue";

let getById = id => {
  const config = {
    method: "GET",
    url: `${venueUrl}/${id}`,
    crossdomin: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

let paginate = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: venueUrl + `/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    crossdomin: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

let add = payload => {
  const config = {
    method: "POST",
    url: venueUrl,
    data: payload,
    withCredentials: true,
    crossdomin: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

let update = (id, myData) => {
  const config = {
    method: "PUT",
    data: JSON.stringify(myData),
    dataType: "json",
    url: venueUrl + `/${id}`,
    crossdomin: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

let deleteById = id => {
  const config = {
    method: "DELETE",
    url: venueUrl + `/${id}`,
    crossdomin: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

let search = (data, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      venueUrl +
      `/search?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${data}`,
    crossdomin: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

let getIdName = search => {
  const config = {
    method: "GET",
    url: venueUrl + "/simplesearch?search=" + search,
    crossdomin: true,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

export { getById, paginate, deleteById, add, update, search, getIdName };
