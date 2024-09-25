import roundTemp from "@/lib/roundTemp"
import capitalise from "@/lib/capitalise"
import Image from "next/image"

interface WeatherCardProps {
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
}

export default function WeatherCardDaily({minTemp, maxTemp, icon, description}: WeatherCardProps) {
    return <>
        <h3 className="text-xl mt-2 font-bold">High: {roundTemp(maxTemp)}&deg;C</h3>
        <h3 className="text-xl mt-2 font-bold">Low: {roundTemp(minTemp)}&deg;C</h3>
        <Image
            priority
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            height={66.63}
            width={66.63}
            alt={description} />
        <p>{capitalise(description)}</p>
    </>
}