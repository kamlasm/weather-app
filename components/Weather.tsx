'use client';

import React, { useState } from "react";
import fetchWeather from "@/lib/weatherData";
import capitaliseCity from "@/lib/capitalise";
import Image from "next/image";
import roundTemp from "@/lib/roundTemp";
import WeatherInterface from "@/lib/weatherInterface";

export default function Weather() {
    const [city, setCity] = useState('')
    const [weatherData, setWeatherData] = useState<WeatherInterface | null>(null)
    const [error, setError] = useState('')

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCity(e.target.value)
    }

    async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError("")
        try {
            const data = await fetchWeather(city)
            setWeatherData(data)
        } catch (error) {
            console.error(error)
            setError("Not found")
        }
    }

    return <div>
        <form onSubmit={handleSearch}>
        <input type="text"
            className="block flex-1 w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search a city"
            value={city}
            onChange={handleChange}
        />
        <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            type="submit"
        >
            Search
        </button>
        </form>

        {error && <p>{error}</p>}

        {weatherData &&
            <div>
                <h2>{capitaliseCity(city)}</h2>
                <p>Temperature: {roundTemp(weatherData.current.temp)}&deg;C</p>
                <p>Feels like: {roundTemp(weatherData.current.feels_like)}&deg;C</p>
                <p>Weather: {weatherData.current.weather[0].description}</p>
                <Image
                    priority
                    src={`https://openweathermap.org/img/wn/${weatherData.current.weather[0].icon}@2x.png`}
                    height={100}
                    width={100}
                    alt={weatherData.current.weather[0].description} />
            </div>
        }
    </div>

}