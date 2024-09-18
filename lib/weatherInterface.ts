export default interface WeatherInterface {
    current: {
        temp: number,
        feels_like: number,
        weather: {
            description: string,
            icon: string,
        }[]
    }
}