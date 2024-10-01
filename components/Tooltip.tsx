interface TooltipProps {
    tooltip: string
    position: "top" | "bottom" | "left"
}

export default function Tooltip({ tooltip, position } : TooltipProps) {
    return <span className={`absolute ${position}-full ${position === "top" && "left-1/4 transform -translate-x-1/2 mt-2"} ${position === "bottom" && "transform -translate-x-16"} px-2 py-1 bg-slate-700 text-xs text-sky-50 font-normal rounded-md border border-solid border-slate-900 opacity-0 group-hover:opacity-100 transition-opacity z-10`}>{tooltip}</span>
}