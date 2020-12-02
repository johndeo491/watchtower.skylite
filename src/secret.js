export const isDev = process.env.NODE_ENV === "development" ? true : false;
export const server_url = "https://skyliteonline.herokuapp.com/api"
export const dev_url = "http://localhost:4050/api"
const back_url = isDev ? dev_url : server_url;
export default back_url