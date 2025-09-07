"use client";
import { GetCategoriesStatsResponseType } from "@/app/api/stats/categories/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserSettings } from "@/lib/generated/prisma";
import { DateToUTC, GetFormatterForCurrency } from "@/lib/helpers";
import { TransactionType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

interface Props {
	userSettings: UserSettings;
	from: Date;
	to: Date;
}
export default function CategoriesStats({ userSettings, from, to }: Props) {
	const statsQuery = useQuery<GetCategoriesStatsResponseType>({
		queryKey: ["overview", "stats", "categories", from, to],
		queryFn: () =>
			fetch(
				`/api/stats/categories?from=${DateToUTC(from)}&to=${DateToUTC(to)}`
			).then((res) => res.json()),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(userSettings.currency);
	}, [userSettings.currency]);

	return (
		<div className="flex flex-wrap gap-4 md:flex-nowrap px-6">
			<SkeletonWrapper isLoading={statsQuery.isFetching}>
				<CategoriesCard
					formatter={formatter}
					type={"income"}
					data={statsQuery.data || []}
				/>
			</SkeletonWrapper>
			<SkeletonWrapper isLoading={statsQuery.isFetching}>
				<CategoriesCard
					formatter={formatter}
					type={"expense"}
					data={statsQuery.data || []}
				/>
			</SkeletonWrapper>
		</div>
	);
}

function CategoriesCard({
	data,
	type,
	formatter,
}: {
	data: GetCategoriesStatsResponseType;
	type: TransactionType;
	formatter: Intl.NumberFormat;
}) {
	const filteredData = data.filter((el) => el.type === type);
	const total = filteredData.reduce(
		(acc, el) => acc + (el._sum?.amount || 0),
		0
	);

	return (
		<Card className="h-80 w-full col-span-6 my-3">
			<CardHeader>
				<CardTitle className="grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col">
					{type === "income" ? "Incomes" : "Expenses"} By Category
				</CardTitle>
			</CardHeader>
			<div className="flex items-center justify-between gap-2">
				{filteredData.length === 0 && (
					<div className="flex h-60 w-full flex-col items-center justify-center">
						No Data For The Selected Period.
						<p className="text-sm text-muted-foreground">
							Try Selecting a Different Period or Try Adding a New{" "}
							{type === "income" ? "Incomes" : "Expenses"}
						</p>
					</div>
				)}
				{filteredData.length > 0 && (
					<ScrollArea className="h-60 w-full px-4">
						<div className="flex w-full flex-col gap-4 p-4">
							{filteredData.map((item) => {
								const amount = item._sum.amount || 0;
								const percentage = (amount * 100) / (total || amount);
								return (
									<div key={item.category} className="flex flex-col gap-2">
										<div className="flex items-center justify-between">
											<span className="flex items-center text-gray-400">
												{item.categoryIcon} {item.category}
												<span className="ml-2 text-xs text-muted-foreground">
													({percentage.toFixed(0)}%)
												</span>
											</span>
											<span className="text-sm text-gray-400">
												{formatter.format(amount)}
											</span>
										</div>
										<Progress
											value={percentage}
											indicator={
												type === "income" ? "bg-emerald-500" : "bg-red-500"
											}
										/>
									</div>
								);
							})}
						</div>
					</ScrollArea>
				)}
			</div>
		</Card>
	);
}
