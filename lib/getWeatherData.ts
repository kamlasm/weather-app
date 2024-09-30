import { getGeocodes, reverseGeocodes } from "./geoCodes"

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall"

async function fetchFromAPI(url: string) {
    try {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error("City not found")
        }

        const data = await res.json()
        if (!data || Object.keys(data).length === 0) {
            throw new Error("No data found");
        }
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}

function constructWeatherUrl(lat: number, lon: number) {
    return `${BASE_URL}?lat=${lat}&lon=${lon}&units=metric&exclude=alerts&appid=${API_KEY}`
}

export async function fetchWeather(citySearch: string) {
    try {
        const geoCodes = await getGeocodes(citySearch)
        const url = constructWeatherUrl(geoCodes.lat, geoCodes.lon)
        const data = await fetchFromAPI(url)
        data.city = geoCodes.city
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function fetchWeatherFromLocation(latitude: number, longitude: number) {
    try {
        const url = constructWeatherUrl(latitude, longitude)
        const data = await fetchFromAPI(url)
        const cityName = await reverseGeocodes(latitude, longitude)
        data.city = cityName
        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}