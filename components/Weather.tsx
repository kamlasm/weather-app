'use client';
import React, { useEffect, useState } from "react";
import fetchWeather from "@/lib/getWeatherData";
import WeatherInterface from "@/lib/weatherInterface";
import getLocalTime from "@/lib/getLocalTime";
import WeatherCardHourly from "./WeatherCardHourly";
import WeatherCardDaily from "./WeatherCardDaily";

export default function Weather() {
    const [error, setError] = useState("")
    const [citySearch, setCitySearch] = useState("")
    const [weatherData, setWeatherData] = useState<WeatherInterface | null>(null)
    const [isHourly, setIsHourly] = useState(true)
    const [favouriteCities, setFavouriteCities] = useState<string[]>([])
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
        try {
            const data = await fetchWeather(citySearch)
            setWeatherData(data)
            setCitySearch("")
        } catch (error) {
            console.error(error)
            setError("City not found. Please try again.")
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
        try {
            const data = await fetchWeather(city)
            setWeatherData(data)
            setCitySearch("")
            setIsDropdownOpen(false)
        } catch (error) {
            console.error(error)
            setError("City not found. Please try again.")
        }
    }

    return <div>
        <form onSubmit={handleSearch}>
            <input type="text"
                className="rounded-md border border-solid border-gray-400 py-1.5 pl-2 pr-15 mr-1 text-gray-900 placeholder:text-gray-400 focus:outline-double focus:border-gray-900 text-sm h-8"
                placeholder="Enter a city"
                value={citySearch}
                onChange={handleChange}
            />
            <button
                className="rounded-md border border-solid border-gray-900 bg-gray-900 text-gray-50 gap-2 hover:bg-gray-700 dark:hover:bg-[#ccc] text-sm h-8 px-4 py-1.5"
                type="submit"
                aria-label="Search for weather"
            >
                Search
            </button>
        </form>

        <div className="mt-4">
            <p className="text-md inline mr-1.5">My Saved Cities</p>

            <button onClick={toggleDropdown} className="space-y-1" aria-label="Toggle favourites dropdown"
            >
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
                <span className="block w-6 h-0.5 bg-gray-800"></span>
            </button>

            {isDropdownOpen && (favouriteCities.length > 0 ? (
                <ul>
                    {favouriteCities.map((city, index) => (
                        <li className={`p-1 rounded ${index % 2 === 0 ? "bg-blue-300" : "bg-blue-600"}`} key={city}>
                            <button className="mr-2" onClick={() => showWeather(city)}>
                                {city}
                            </button>
                            <button className="bg-black text-white px-4 rounded" onClick={() => removeFromFavourites(city)}>
                                -
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>You haven&apos;t saved any cities.</p>
            ))}
        </div>

        {error && <p className="text-md pt-1 text-red-500">{error}</p>}

        {weatherData && <div className="bg-gray-200 mt-10 px-2 rounded-md relative">
            <h2 className="text-xl pt-2 font-bold">{weatherData.city}</h2>
            {!favouriteCities.includes(weatherData.city) && <button className="absolute top-2 right-2 bg-black text-white py-1 px-4 rounded" onClick={addToFavourites}>+</button>}


            <button className="underline" onClick={switchForecast}>{isHourly ? "Switch to Daily Forecast" : "Switch to Hourly Forecast"} </button>

            <div className="flex overflow-x-auto space-x-2 py-2 w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl scrollbar">

                {isHourly && weatherData.hourly.map((hourlyWeather, index) => {
                    const isNow = index === 0
                    return <div key={hourlyWeather.dt} className={`flex flex-col items-center text-center p-4 rounded-md flex-none w-32 ${isNow ? "bg-blue-800 text-white" : "bg-blue-200"}`}>
                        <h3 className="text-lg">{isNow ? "Now" : getLocalTime(hourlyWeather.dt, weatherData.timezone_offset, "hourly")}</h3>
                        {isNow ?
                            <WeatherCardHourly
                                temp={weatherData.current.temp}
                                feels_like={weatherData.current.feels_like}
                                icon={weatherData.current.weather[0].icon}
                                description={weatherData.current.weather[0].description}
                            /> :
                            <WeatherCardHourly
                                temp={hourlyWeather.temp}
                                feels_like={hourlyWeather.feels_like}
                                icon={hourlyWeather.weather[0].icon}
                                description={hourlyWeather.weather[0].description}
                            />}
                    </div>
                })}

                {!isHourly && weatherData.daily.map((dailyWeather, index) => {
                    const isToday = index === 0
                    return <div key={dailyWeather.dt} className={`flex flex-col items-center text-center p-4 rounded-md flex-none w-36 ${isToday ? "bg-blue-800 text-white" : "bg-blue-200"} `}>
                        <h3 className="text-lg">{isToday ? "Today" : getLocalTime(dailyWeather.dt, weatherData.timezone_offset, "daily")}</h3>
                        <WeatherCardDaily
                            maxTemp={dailyWeather.temp.max}
                            minTemp={dailyWeather.temp.min}
                            icon={dailyWeather.weather[0].icon}
                            description={dailyWeather.weather[0].description} />
                    </div>
                })}

            </div>
        </div>}
    </div>
}