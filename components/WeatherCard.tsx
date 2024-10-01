import roundTemp from "@/lib/roundTemp"
import capitalise from "@/lib/capitalise"
import Image from "next/image"

interface WeatherCardProps {
    minTemp?: number;
    maxTemp?: number;
    icon: string;
    description: string;
    temp?: number;
    feels_like?: number;
    isHourly: boolean;
}

export default function WeatherCard({ minTemp, maxTemp, icon, description, temp, feels_like, isHourly }: WeatherCardProps) {
    return <>
        {isHourly ? <>
            <h3 className="text-xl mt-2 font-bold">{temp !== undefined && roundTemp(temp)}&deg;C</h3>
            <p>Feels like {feels_like !== undefined && roundTemp(feels_like)}&deg;C</p>
        </>
        : <>
            <h3 className="text-xl mt-2 font-bold">High: {maxTemp !== undefined && roundTemp(maxTemp)}&deg;C</h3>
            <h3 className="text-xl mt-2 font-bold">Low: {minTemp !== undefined && roundTemp(minTemp)}&deg;C</h3>
        </>}
        <Image
            priority
            src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
            height={66.63}
            width={66.63}
            alt={description} />
        <p>{capitalise(description)}</p>
    </>
}