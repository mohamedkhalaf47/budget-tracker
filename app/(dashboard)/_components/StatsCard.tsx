"use client";
import { GetBalanceStatsResponseType } from "@/app/api/stats/balance/route";
import {
	CardContent,
} from "@/components/ui/card";
import { UserSettings } from "@/lib/generated/prisma";
import { DateToUTC, GetFormatterForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { ReactNode, useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface Props {
	from: Date;
	to: Date;
	userSettings: UserSettings;
}

export default function StatsCard({ from, to, userSettings }: Props) {
	const statsQuery = useQuery<GetBalanceStatsResponseType>({
		queryKey: ["overview", "stats", from, to],
		queryFn: async () =>
			fetch(
				`/api/stats/balance?from=${DateToUTC(from)}&to=${DateToUTC(to)}`
			).then((res) => res.json()),
	});

	const formatter = useMemo(() => {
		return GetFormatterForCurrency(userSettings.currency);
	}, [userSettings.currency]);

	const income = statsQuery.data?.income || 0;
	const expense = statsQuery.data?.expense || 0;
	const balance = income - expense;

	return (
		<div className="relative flex w-full flex-wrap gap-8 md:flex-nowrap px-8">
			<StatCard
				formatter={formatter}
				value={income}
				title="Income"
				icon={
					<TrendingUp className="w-14 h-14 items-center rounded-lg p-2  text-emerald-500 bg-emerald-400/10" />
				}
			/>
			<StatCard
				formatter={formatter}
				value={expense}
				title="Expense"
				icon={
					<TrendingDown className="w-14 h-14 items-center rounded-lg p-2 text-red-500 bg-red-400/10" />
				}
			/>
			<StatCard
				formatter={formatter}
				value={balance}
				title="Balance"
				icon={
					<Wallet className="w-14 h-14 items-center rounded-lg p-2 text-violet-500 bg-violet-400/10" />
				}
			/>
		</div>
	);
}

function StatCard({
	formatter,
	value,
	title,
	icon,
}: {
	formatter: Intl.NumberFormat;
	value: number;
	title: string;
	icon: ReactNode;
}) {
	const formatFn = useCallback(
		(value: number) => {
			return formatter.format(value);
		},
		[formatter]
	);

	return (
		<CardContent className="flex items-center justify-between w-full h-full gap-4 p-4 bg-[#71717B]/10 rounded-3xl">
			{icon}
			<div className="flex flex-col items-end gap-0">
				<p className="text-muted-foreground text-lg">{title}</p>
				<CountUp
					preserveValue
					redraw={false}
					end={value}
					decimals={2}
					formattingFn={formatFn}
					className="text-2xl"
				/>
			</div>
		</CardContent>
	);
}
