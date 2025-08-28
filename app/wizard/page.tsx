import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function page() {
	const user = await currentUser();
	if (!user) redirect("/sign-in");

	return (
		<div className="container flex max-w-2xl flex-col items-center justify-between gap-4 max-sm:px-10">
			<div>
				<h1 className="text-center text-3xl">
					Welcome,{" "}
					<span className="ml-2 font-semibold">{user.firstName}👋</span>
				</h1>
				<h2 className="mt-4 text-center text-base text-muted-foreground">
					Let&apos;s Get Started By Setting Up Your Currency
				</h2>
				<h3 className="mt-2 text-center text-sm text-muted-foreground">
					You Can Change These Settings at Anytime
				</h3>
			</div>
			<Separator />
			<Card className="w-full">
				<CardHeader>
					<CardTitle>Currency</CardTitle>
					<CardDescription>
						Set Your Default Currency For Transactions
					</CardDescription>
				</CardHeader>
				<CardContent>
          <CurrencyComboBox />
        </CardContent>
			</Card>
			<Separator />
      <Button className="w-full" asChild>
        <Link href={"/"}>I&apos;m Done! Take Me To The Dashboard</Link>
      </Button>
      <div className="mt-8">
        <Logo />
      </div>
		</div>
	);
}
