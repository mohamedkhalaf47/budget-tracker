import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateTransaction from "./_components/CreateTransaction";
import Overview from "./_components/Overview";
import History from "./_components/History";

export default async function page() {
	const user = await currentUser();
	if (!user) redirect("/sign-in");

	const userSettings = await prisma.userSettings.findUnique({
		where: { userId: user.id },
	});
	if (!userSettings) redirect("/wizard");

	return (
		<div className="h-full bg-background">
			<div className="border-bottom bg-card">
				<div className="flex flex-wrap items-center justify-between gap-6 py-8 px-4">
					<p className="text-3xl font-bold">Welcome, {user.firstName}</p>
					<div className="flex items-center gap-3">
						<CreateTransaction
							trigger={
								<Button
									variant={"secondary"}
									className="border border-emerald-500 bg-emerald-950 text-white duration-300 hover:bg-emerald-700 cursor-pointer"
								>
									New Income
								</Button>
							}
							type="income"
						/>
						<CreateTransaction
							trigger={
								<Button
									variant={"secondary"}
									className="border border-rose-500 bg-rose-950 text-white duration-300 hover:bg-rose-700 cursor-pointer"
								>
									New Expense
								</Button>
							}
							type="expense"
						/>
					</div>
				</div>
			</div>
			<Overview userSettings={userSettings} />
			<History userSettings={userSettings} />
		</div>
	);
}
