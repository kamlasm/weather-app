export default interface WeatherInterface {
    city: string,
    current: {
        temp: number,
        feels_like: number,
        weather: {
            description: string,
            icon: string,
        }[],
        sunrise: number,
        sunset: number
    }
    hourly: {
        dt: number,
        temp: number,
        feels_like: number,
        weather: {
            description: string,
            icon: string,
        }[]
    }[]
    timezone_offset: number,
    daily: {
        dt: number,
        temp: {
            min: number,
            max: number,
        },
        weather: {
            description: string,
            icon: string,
        }[],
    }[]
}