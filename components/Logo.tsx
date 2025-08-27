import { PiggyBank } from "lucide-react";
import Link from "next/link";

export default function Logo(){
  return(
    <Link href="/" className="flex items-center gap-2">
      <PiggyBank className="stroke w-11 h-11 stroke-amber-500 stroke-[1.5]"/>
      <p className="bg-gradient-to-r from-amber-400 to bg-orange-500 bg-clip-text text-3xl font-bold leading-tight tracking-tight text-transparent">Budget Tracker</p>
    </Link>
  )
}