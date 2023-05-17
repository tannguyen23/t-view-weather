export type Weather =  {
    id : number;
    name : string;
    main : {
        humidity : number;
    }
    weather : [{
        id : number;
        temp : number;
        main : WeatherMainType;
        description : string;
    }]
    wind : {
        speed : number;
    }
}

export type WeatherMainType = 'Clear' | 'Rain' | 'Snow' | 'Clouds' | 'Haze';