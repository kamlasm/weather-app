'use client';
import React, { useEffect, useState } from "react";
import { fetchWeather, fetchWeatherFromLocation } from "@/lib/getWeatherData";
import WeatherInterface from "@/lib/weatherInterface";
import getLocalTime from "@/lib/getLocalTime";
import WeatherCard from "./WeatherCard";
import { MdMyLocation } from "react-icons/md";
import { WiSunrise, WiSunset } from "react-icons/wi";
import Tooltip from "./Tooltip";

export default function Weather() {
    const [error, setError] = useState("")
    const [citySearch, setCitySearch] = useState("")
    const [weatherData, setWeatherData] = useState<WeatherInterface | null>(null)
    const [isHourly, setIsHourly] = useState(true)
    const [favouriteCities, setFavouriteCities] = useState<string[]>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const savedCities = localStorage.getItem("favouriteCities")
        if (savedCities) {
            setFavouriteCities(JSON.parse(savedCities))
        }
    }, [])

    useEffect(() => {
        if (favouriteCities.length > 0) {
            localStorage.setItem("favouriteCities", JSON.stringify(favouriteCities));
        } else {
            localStorage.removeItem("favouriteCities")
        }
    }, [favouriteCities])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCitySearch(e.target.value)
        if (error) setError("")
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        setIsLoading(true)
        try {
            const data = await fetchWeather(citySearch)
            setWeatherData(data)
            setCitySearch("")
        } catch (error) {
            console.error(error)
            setError("City not found. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    function switchForecast() {
        setIsHourly(prev => !prev)
    }

    function addToFavourites() {
        if (weatherData && !favouriteCities.includes(weatherData.city)) {
            const copyFavouriteCities = structuredClone(favouriteCities)
            copyFavouriteCities.push(weatherData.city)
            setFavouriteCities(copyFavouriteCities)
        }
    }

    function removeFromFavourites(city: string) {
        const updatedFavourites = favouriteCities.filter(favouriteCity => {
            return favouriteCity !== city
        })
        setFavouriteCities(updatedFavourites)
    }

    function toggleDropdown() {
        setIsDropdownOpen(prev => !prev)
    }

    async function showWeather(city: string) {
        setIsLoading(true)
        try {
            const data = await fetchWeather(city)
            setWeatherData(data)
            setCitySearch("")
            setIsDropdownOpen(false)
        } catch (error) {
            console.error(error)
            setError("City not found. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    function handleLocationClick() {
        if (navigator.geolocation) {
            setIsLoading(true)
            navigator.geolocation.getCurrentPosition(success, () => {
                console.error("Error finding geolocation")
                setError("Error finding geolocation")
                setIsLoading(false)
            })
        } else {
            setError("Geolocation not supported")
        }
    }

    async function success(position: GeolocationPosition) {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude
        const data = await fetchWeatherFromLocation(latitude, longitude)
        setWeatherData(data)
        setError("")
        setIsLoading(false)
    }

    return <>
        <section className="bg-sky-600 w-screen rounded-sm py-10 text-sky-50">
            <h1 className="text-2xl font-bold mb-4">
                WEATHER
            </h1>

            <form onSubmit={handleSearch} className="text-sm flex items-center justify-center">
                <div className="cursor-pointer mr-1 border rounded-md border-solid border-slate-900 bg-slate-700 py-1 px-1 relative group hover:bg-slate-900" >
                    <MdMyLocation size="1.5em" className="fill-sky-50" onClick={handleLocationClick} />
                    <Tooltip
                        tooltip="Get weather for current location"
                        position="top" />
                </div>
                <label htmlFor="citySearch" className="sr-only">Enter a city</label>
                <input
                    id="citySearch"
                    type="text"
                    className="rounded-md border border-solid border-slate-400 h-8 py-1.5 pl-2 mr-1 text-slate-900 placeholder:text-slate-400 focus:outline-double focus:border-slate-900"
                    placeholder="Enter a city"
                    value={citySearch}
                    onChange={handleChange}
                />
                <button
                    className="rounded-md border border-solid border-slate-900 bg-slate-700 h-8 px-4 py-1.5 hover:bg-slate-900"
                    type="submit"
                    aria-label="Search for weather"
                    disabled={isLoading}
                >
                    Search
                </button>
            </form>

            {error && <p className="bg-red-200 pt-1 text-red-500">{error}</p>}

            <div>
                <div className="flex justify-center mt-4">
                    <h3 className="mr-1.5 text-sky-50">My Saved Cities</h3>
                    <button onClick={toggleDropdown} aria-label="Toggle favourites dropdown">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
                {isDropdownOpen && (favouriteCities.length > 0 ? (
                    <ul className="mt-1 text-sm bg-sky-50 font-bold rounded-md">
                        {favouriteCities.map(city => (
                            <li className="p-1 text-sky-700" key={city}>
                                <button className="mr-3" onClick={() => showWeather(city)}>
                                    {city}
                                </button>
                                <div className="relative group inline-block">
                                    <button className="bg-slate-700 text-sm text-sky-50 px-3 rounded mr-1" onClick={() => removeFromFavourites(city)}>
                                        -
                                    </button>
                                    <Tooltip
                                        tooltip="Remove from favourites"
                                        position="left" />
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You haven&apos;t saved any cities.</p>
                ))}
            </div>
        </section>

        {isLoading && <p>Loading...</p>}

        {weatherData && <section className="bg-slate-200 mt-10 px-2 rounded-md">
            <div className="flex">
                <div className="grow">
                    <h2 className="text-xl pt-2 font-bold">{weatherData.city}</h2>
                    <div className="flex justify-center mt-1">
                        <WiSunrise size="2em"/>
                        <p className="mr-2">{getLocalTime(weatherData.current.sunrise, weatherData.timezone_offset, "hourly")}</p>
                        <WiSunset size="2em" />
                        <p>{getLocalTime(weatherData.current.sunset, weatherData.timezone_offset, "hourly")}</p>
                    </div>
                    <button
                        className="underline"
                        onClick={switchForecast}
                        aria-label={`Switch to ${isHourly ? "daily" : "hourly"} forecast`}>{isHourly ? "Switch to Daily Forecast" : "Switch to Hourly Forecast"}
                    </button>

                </div>
                {!favouriteCities.includes(weatherData.city) && <div className="relative group">
                    <button
                        className="absolute right-1 mt-2 bg-slate-700 text-sky-50 py-1 px-4 rounded hover:bg-slate-900"
                        onClick={addToFavourites}
                        aria-label={`Add ${weatherData.city} to favourites`}>
                        +
                    </button>
                    <Tooltip
                        tooltip="Save to favourites"
                        position="bottom" />
                </div>}
            </div>

            <div className="flex overflow-x-auto space-x-2 py-2 w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl scrollbar">
                {isHourly ? weatherData.hourly.map((hourlyWeather, index) => {
                    const isNow = index === 0
                    return <div key={hourlyWeather.dt} className={`flex flex-col items-center text-center p-4 rounded-md flex-none w-32 ${isNow ? "bg-blue-800 text-white" : "bg-blue-200"}`}>
                        <h3 className="text-lg">{isNow ? "Now" : getLocalTime(hourlyWeather.dt, weatherData.timezone_offset, "hourly")}</h3>
                        <WeatherCard
                            temp={isNow ? weatherData.current.temp : hourlyWeather.temp}
                            feels_like={isNow ? weatherData.current.feels_like : hourlyWeather.feels_like}
                            icon={isNow ? weatherData.current.weather[0].icon : hourlyWeather.weather[0].icon}
                            description={isNow ? weatherData.current.weather[0].description : hourlyWeather.weather[0].description}
                            isHourly={true}
                        />
                    </div>
                })
                    : weatherData.daily.map((dailyWeather, index) => {
                        const isToday = index === 0
                        return <div key={dailyWeather.dt} className={`flex flex-col items-center text-center p-4 rounded-md flex-none w-36 ${isToday ? "bg-blue-800 text-white" : "bg-blue-200"} `}>
                            <h3 className="text-lg">{isToday ? "Today" : getLocalTime(dailyWeather.dt, weatherData.timezone_offset, "daily")}</h3>
                            <WeatherCard
                                maxTemp={dailyWeather.temp.max}
                                minTemp={dailyWeather.temp.min}
                                icon={dailyWeather.weather[0].icon}
                                description={dailyWeather.weather[0].description}
                                isHourly={false} />
                        </div>
                    })}
            </div>
        </section>}
    </>
}