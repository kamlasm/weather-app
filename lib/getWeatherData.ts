import fetchGeocodes from "./geoCodes"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall"

export default async function fetchWeather(citySearch: string) {
    try {
        const geoCodes = await fetchGeocodes(citySearch)

        const res = await fetch(`${BASE_URL}?lat=${geoCodes.lat}&lon=${geoCodes.lon}&units=metric&exclude=alerts&appid=${API_KEY}`)

        if (!res.ok) {
            throw new Error('City not found')
        }

        const data = await res.json()
        data.city = geoCodes.city
        return data

    } catch (error) {
        console.error(error)
        throw error
    }
}
