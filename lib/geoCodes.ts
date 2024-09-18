const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/geo/1.0/direct"

export default async function fetchGeocodes(city: string) {
    
    try {
        const res = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}`)

        if (!res.ok) {
            throw new Error('Not found')
        }

        const data = await res.json()
        
        if (data.length === 0) {
            throw new Error('Not found')
        }

        const lat: number = data[0].lat
        const lon: number = data[0].lon

        return {lat, lon}
        
    } catch (error) {
        console.error(error)
        throw error
    }
} 