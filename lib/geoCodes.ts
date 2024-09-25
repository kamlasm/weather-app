const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/geo/1.0/direct"

export default async function fetchGeocodes(citySearch: string) {
    
    try {
        const res = await fetch(`${BASE_URL}?q=${citySearch}&appid=${API_KEY}`)

        if (!res.ok) {
            throw new Error('Not found')
        }

        const data = await res.json()
        
        if (data.length === 0) {
            throw new Error('Not found')
        }

        const lat: number = data[0].lat
        const lon: number = data[0].lon
        const city: string = data[0].name

        return {lat, lon, city}
        
    } catch (error) {
        console.error(error)
        throw error
    }
} 