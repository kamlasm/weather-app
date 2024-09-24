'use client';
import React, { useState } from "react";
import fetchWeather from "@/lib/weatherData";
import capitalise from "@/lib/capitalise";
import WeatherInterface from "@/lib/weatherInterface";
import convertUnix from "@/lib/convertUnix";
import WeatherCard from "./WeatherCard";

export default function Weather() {
    const [city, setCity] = useState("")
    const [weatherData, setWeatherData] = useState<WeatherInterface | null>(null)
    const [error, setError] = useState("")

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCity(e.target.value)
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        try {
            const data = await fetchWeather(city)
            data.city = city
            setWeatherData(data)
            setCity("")
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
                value={city}
                onChange={handleChange}
            />
            <button
                className="rounded-md border border-solid border-gray-900 bg-gray-900 text-gray-50 gap-2 hover:bg-gray-700 dark:hover:bg-[#ccc] text-sm h-8 px-4 py-1.5"
                type="submit"
            >
                Search
            </button>
        </form>

        {error && <p className="text-md pt-1 text-red-500">{error}</p>}

        {weatherData && <div className="bg-gray-200 mt-10 px-2 rounded-md">
            <h2 className="text-xl pt-2 font-bold">{capitalise(weatherData.city)}</h2>
            <p>Hourly forecast</p>

            <div className="flex overflow-x-auto space-x-2 py-2 w-full max-w-screen-lg max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl scrollbar">

                <div className="flex flex-col items-center text-center bg-blue-800 p-4 text-white rounded-md flex-none w-32">
                    <h2 className="text-lg font-bold">Now</h2>
                    <WeatherCard
                        temp={weatherData.current.temp}
                        feels_like={weatherData.current.feels_like}
                        icon={weatherData.current.weather[0].icon}
                        description={weatherData.current.weather[0].description}
                    />
                </div>

                {weatherData.hourly.slice(1).map(hourlyWeather => {
                    return <div key={hourlyWeather.dt} className="flex flex-col items-center text-center bg-blue-200 p-4 rounded-md flex-none w-32">
                        <h3 className="text-lg font-bold">{convertUnix(hourlyWeather.dt)}</h3>
                        <WeatherCard
                            temp={hourlyWeather.temp}
                            feels_like={hourlyWeather.feels_like}
                            icon={hourlyWeather.weather[0].icon}
                            description={hourlyWeather.weather[0].description} />
                    </div>
                })}

            </div>
        </div>}
    </div>
}