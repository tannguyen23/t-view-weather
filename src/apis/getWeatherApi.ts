import { Weather } from "../types/Weather";
import { axiosClient } from "./axiosClient";
class WeatherApi {
  getWeather = (location : string) => {
    const url = `/weather?q=${location}&units=metric&appid=${process.env.REACT_APP_WEATHER_API}`;
    return axiosClient.get<Weather>(url);
  };
}

const weatherApi = new WeatherApi();
export default weatherApi;