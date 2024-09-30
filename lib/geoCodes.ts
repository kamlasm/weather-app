const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
const BASE_URL = "https://api.openweathermap.org/geo/1.0/"

interface GeoData {
    lat: number;
    lon: number;
    name: string;
}

async function fetchFromAPI(url: string): Promise<GeoData[]> {
    try {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error("Request to API failed")
        }

        const data: GeoData[] = await res.json()
        if (data.length === 0) {
            throw new Error("No data found")
        }

        return data
    } catch (error) {
        console.error(error)
        throw error
    }
}

export async function getGeocodes(citySearch: string) {
    const url = `${BASE_URL}direct?q=${citySearch}&appid=${API_KEY}`
    const data = await fetchFromAPI(url)

    const { lat, lon, name: city } = data[0]
    return { lat, lon, city }
}

export async function reverseGeocodes(latitude: number, longitude: number) {
    const url = `${BASE_URL}reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
    const data = await fetchFromAPI(url)
    
    return data[0].name
}