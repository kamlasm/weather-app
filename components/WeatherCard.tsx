import roundTemp from "@/lib/roundTemp"
import capitalise from "@/lib/capitalise"
import Image from "next/image"

interface WeatherCardProps {
  temp: number;
  feels_like: number;
  icon: string;
  description: string;
}

export default function WeatherCard({temp, feels_like, icon, description}: WeatherCardProps) {
    return <>
        <h3 className="text-xl mt-2 font-bold">{roundTemp(temp)}&deg;C</h3>
        <p>Feels like {roundTemp(feels_like)}&deg;C</p>
        <Image
            priority
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            height={66.63}
            width={66.63}
            alt={description} />
        <p>{capitalise(description)}</p>
    </>
}