export default interface WeatherInterface {
    city: string,
    current: {
        temp: number,
        feels_like: number,
        weather: {
            description: string,
            icon: string,
        }[]
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
}