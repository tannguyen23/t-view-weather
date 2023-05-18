export type Weather =  {
    id : number;
    name : string;
    main : {
        humidity : number;
        temp : number;
    }
    weather : [{
        id : number;
        main : WeatherMainType;
        description : string;
    }]
    wind : {
        speed : number;
    }
}

export type WeatherMainType = 'Clear' | 'Rain' | 'Snow' | 'Clouds' | 'Haze';