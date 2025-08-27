"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, buttonVariants } from "./ui/button";
import Logo from "./Logo";
import { ModeToggle } from "./ModeToggle";
import { UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";

export default function Navbar() {
	return (
		<>
			<DesktopNavbar />
			<MobileNavbar />
		</>
	);
}

type Link = {
	label: string;
	link: string;
};

const items: Link[] = [
	{ label: "Dashboard", link: "/" },
	{ label: "Transactions", link: "/transactions" },
	{ label: "Manage", link: "/manage" },
];

function DesktopNavbar() {
	return (
		<div className="hidden border-separate border-b bg-background md:block">
			<nav className="flex items-center justify-between px-8">
				<div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
					<Logo />
					<div className="flex h-full">
						{items.map((item) => (
							<NavbarItem
								key={item.label}
								link={item.link}
								label={item.label}
							/>
						))}
					</div>
				</div>
				<div className="flex items-center gap-4">
					<ModeToggle />
					<UserButton />
				</div>
			</nav>
		</div>
	);
}

function NavbarItem({ link, label }: { link: string; label: string }) {
	const pathname = usePathname();
	const isActive = pathname === link;
	return (
		<div className="relative flex items-center">
			<Link
				href={link}
				className={cn(
					buttonVariants({
						variant: "ghost",
					}),
					"w-full justify-start text-lg text-muted-foreground hover:text-foreground",
					isActive && "text-foreground"
				)}
			>
				{label}
			</Link>
			{isActive && (
				<div className="absolute -bottom-[2px] left-1/2 hidden h-[2px] w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block"></div>
			)}
		</div>
	);
}

function MobileNavbar(){
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div className="block border-separate bg-background md:hidden">
			<nav className="flex items-center justify-between px-8 py-4">
				<Sheet open={isOpen} onOpenChange={setIsOpen}>
					<SheetTrigger asChild>
						<Button variant={"ghost"} size={"icon"}>
							<Menu />
						</Button>
					</SheetTrigger>
					<SheetContent className="w-[400px] sm:w-[540px] p-3" side="left">
						<Logo />
						<div className="flex flex-col gap-1 pt-4">
							{items.map((item) => (
								<NavbarItem
									key={item.label}
									link={item.link}
									label={item.label}
								/>
							))}
						</div>
					</SheetContent>
				</Sheet>
				<div className="flex items-center gap-4">
					<ModeToggle />
					<UserButton />
				</div>
			</nav>
		</div>
	);
}