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
import LoadingComponent from "../components/LoadingComponent";

const Bloom = keyframes`
    from {
        opacity: 0;
        width: 0%;
    }    

    to {
        opacity: 1;
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
  @media (max-width: 992px) {
    width : 80%;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  font-weight: bold;
  font-size: 48px;
  padding: 8px;
  color: #2c3333;
  @media (max-width: 992px) {
    font-size : 24px;
  }
`;

const PreSearchWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  cursor: pointer;
  padding: 8px;
  gap: 20px;
  &:hover {
    background-color: #537188;
    color: #fff;
    border-radius: 4px;
  }
  @media (max-width: 992px) {
    width: 50%;
  }
  @media (max-width : 786px) {
    width: 80%;
  }
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
  align-items: center;
  width: 100%;
  gap: 20px;
`;

const InputSearch = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: transpredarent;
  padding: 8px;
  color: #2c3333;
  font-size: 24px;
  @media (max-width: 992px) {
    font-size : 18px;
  }
`;

export default function Main() {
  const [openSearchInput, setOpenSearchInput] = useState(false);
  const [searchTextInput, setSearchTextInput] = useState("");
  const [humidity, setHumidity] = useState<number>();
  const [speedWind, setSpeedWind] = useState<number>();
  const [weatherMain, setWeatherMain] = useState<WeatherMainType>();
  const [weatherTemp, setWeatherTemp] = useState<number>(0);
  const [weatherDescription, setWeatherDescription] = useState<string>("");
  const [isShowResult, setIsShowResult] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGetWeatherInfo = () => {
    setIsLoading(true);
    weatherApi
      .getWeather(searchTextInput)
      .then((value: AxiosResponse<Weather>) => {
        console.log(value.data);
        setHumidity(value.data.main.humidity);
        setSpeedWind(value.data.wind.speed);
        setWeatherTemp(value.data.main.temp);
        setWeatherMain(value.data.weather[0].main);
        setWeatherDescription(value.data.weather[0].description);
        setIsShowResult(true);
      })
      .catch((error: any) => {
        if (error.response.data.cod === "404") {
          console.log("Citi not found");
        }
        setIsShowResult(false);
      })
      .finally(() => {
        setIsLoading(false);
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
          {!openSearchInput && (
            <PreSearchWrapper
              onClick={() => {
                setOpenSearchInput(true);
              }}
            >
              <span>Click to search</span>
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                size="2x"
                color="#1D267D"
              />
            </PreSearchWrapper>
          )}
        </InputWrapper>
      </CardContainer>
      {isLoading ? (
        <CardContainer
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LoadingComponent></LoadingComponent>
        </CardContainer>
      ) : (
        <>
          {isShowResult === true ? (
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
                      style={{
                        display: "flex",
                        gap: "16px",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTemperatureLow}
                        size="2xl"
                        color="#F4B183"
                      />
                      <span style={{ fontWeight: 700 }}>
                        Temp {weatherTemp} °C
                      </span>
                    </div>
                  </div>

                  <div
                    style={{ width: "100%", borderTop: "1px solid #19376D" }}
                  ></div>
                  <img
                    src={
                      process.env.PUBLIC_URL + `/img/` + weatherMain + `.svg`
                    }
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
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon icon={faWater} size="2x" color="#3795BD" />
                    <span style={{ fontWeight: 700 }}>
                      Humidity : {humidity} %
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <FontAwesomeIcon icon={faWind} size="2x" color="#576CBC" />
                    <span style={{ fontWeight: 700 }}>
                      Speed : {speedWind} km/h
                    </span>
                  </div>
                </div>
              </CardContainer>
            </>
          ) : (
            <>
              {" "}
              {isShowResult !== null && (
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
                    <span
                      style={{
                        fontSize: "24px",
                        fontWeight: "500",
                      }}
                    >
                      Location not found, please try again
                    </span>
                    <img
                      src={process.env.PUBLIC_URL + `/img/` + `404.png`}
                      alt="image weather main"
                      height={"auto"}
                      width={"70%"}
                    />
                  </div>
                </CardContainer>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
}
