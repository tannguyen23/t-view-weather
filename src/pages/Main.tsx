import {
  faLocationDot,
  faMagnifyingGlass,
  faTemperatureLow,
  faWater,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import styled, { keyframes } from "styled-components";
import weatherApi from "../apis/getWeatherApi";
import { AxiosResponse } from "axios";
import { Weather, WeatherMainType } from "../types/Weather";

const Bloom = keyframes`
    from {
        width: 0%;
    }    

    to {
        width: 80%;
    }
`;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: #0b2447;
`;

const CardContainer = styled.div`
  background-color: #ffffff;
  width: 580px;
  padding: 8px;
  border-radius: 8px;
`;
const CardHeader = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-weight: bold;
  font-size: 48px;
  padding: 8px;
  color: #2c3333;
`;

const InputSearchWrapper = styled.div`
  padding: 6px;
  width: 80%;
  display: none;
  border: 2px solid #2c3333;
  border-radius: 4px;
  align-items: center;
  justify-content: space-between;
  &.active {
    animation: ${Bloom} 1 1.5s;
    display: flex;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  gap: 100px;
`;

const InputSearch = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transpredarent;
  padding: 8px;
  color: #2c3333;
  font-size: 24px;
`;

export default function Main() {
  const [openSearchInput, setOpenSearchInput] = useState(false);
  const [searchTextInput, setSearchTextInput] = useState("");
  const [humidity, setHumidity] = useState<number>();
  const [speedWind, setSpeedWind] = useState<number>();
  const [weatherMain, setWeatherMain] = useState<WeatherMainType>();
  const [weatherTemp, setWeatherTemp] = useState<number>(0);
  const [weatherDescription, setWeatherDescription] = useState<string>("");
  const [isShowResult, setIsShowResult] = useState<boolean>(false);

  const handleGetWeatherInfo = () => {
    weatherApi
      .getWeather(searchTextInput)
      .then((value: AxiosResponse<Weather>) => {
        console.log(value.data);
        setHumidity(value.data.main.humidity);
        setSpeedWind(value.data.wind.speed);
        setWeatherMain(value.data.weather[0].main);
        setWeatherTemp(value.data.weather[0].temp);
        setWeatherDescription(value.data.weather[0].description);
      })
      .catch((error: any) => {
        if (error.response.data.cod === "404") {
          console.log("Citi not found");
        }
      })
      .finally(() => {
        setIsShowResult(true);
      });
  };

  return (
    <Container>
      <CardContainer>
        <CardHeader>Weather forecast</CardHeader>
        <InputWrapper>
          <InputSearchWrapper className={openSearchInput ? "active" : ""}>
            <FontAwesomeIcon icon={faLocationDot} size="2x" color="#1D267D" />
            <InputSearch
              type="text"
              placeholder="Enter your location (city, country)"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleGetWeatherInfo();
                }
              }}
              value={searchTextInput}
              onChange={(event) => {
                setSearchTextInput(event.target.value);
              }}
            />
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              size="2x"
              color="#1D267D"
            />
          </InputSearchWrapper>
          <FontAwesomeIcon
            style={{
              cursor: "pointer",
              display: openSearchInput ? "none" : "flex",
              padding: "8px",
            }}
            icon={faMagnifyingGlass}
            size="2x"
            color="#1D267D"
            onClick={() => {
              setOpenSearchInput(true);
            }}
          />
        </InputWrapper>
      </CardContainer>
      {isShowResult && (
        <>
          <CardContainer>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: "500",
                  }}
                >
                  {weatherMain}
                </span>
                <div
                  style={{ display: "flex", gap: "16px", alignItems: "center" }}
                >
                  <FontAwesomeIcon
                    icon={faTemperatureLow}
                    size="2xl"
                    color="#F4B183"
                  />
                  <span style={{ fontWeight: 700 }}>{humidity} °C</span>
                </div>
              </div>

              <div
                style={{ width: "100%", borderTop: "1px solid #19376D" }}
              ></div>
              <img
                src={process.env.PUBLIC_URL + `/img/` + weatherMain + `.svg`}
                alt="image weather main"
                height={"auto"}
                width={"70%"}
              />
            </div>
            <div
              style={{
                padding: "16px",
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                borderTop: "1px solid #19376D",
              }}
            >
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <FontAwesomeIcon icon={faWater} size="2x" color="#3795BD" />
                <span style={{ fontWeight: 700 }}>{humidity} %</span>
              </div>
              <div
                style={{ display: "flex", gap: "16px", alignItems: "center" }}
              >
                <FontAwesomeIcon icon={faWind} size="2x" color="#576CBC" />
                <span style={{ fontWeight: 700 }}>{speedWind} km/h</span>
              </div>
            </div>
          </CardContainer>
        </>
      )}
    </Container>
  );
}
