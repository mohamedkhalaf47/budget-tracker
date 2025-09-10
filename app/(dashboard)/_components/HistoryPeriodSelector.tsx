"use client";

import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route";
import SkeletonWrapper from "@/components/SkeletonWrapper";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Period, Timeframe } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface Props {
	period: Period;
	setPeriod: (period: Period) => void;
	timeframe: Timeframe;
	setTimeframe: (timeframe: Timeframe) => void;
}

export default function HistoryPeriodSelector({
	period,
	setPeriod,
	timeframe,
	setTimeframe,
}: Props) {
	const historyPeriods = useQuery<GetHistoryPeriodsResponseType>({
		queryKey: ["overview"],
		queryFn: () => fetch("/api/history-periods").then((res) => res.json()),
	});

	return (
		<div className="flex flex-wrap items-center gap-4">
			<SkeletonWrapper isLoading={historyPeriods.isFetching}>
				<Tabs
					value={timeframe}
					onValueChange={(value) => setTimeframe(value as Timeframe)}
					defaultValue="year"
				>
					<TabsList className="cursor-pointer">
						<TabsTrigger value="year">Year</TabsTrigger>
						<TabsTrigger value="month">Month</TabsTrigger>
					</TabsList>
				</Tabs>
			</SkeletonWrapper>
			<div className="flex flex-wrap items-center gap-2">
				<SkeletonWrapper isLoading={historyPeriods.isFetching}>
					<YearSelector
						period={period}
						setPeriod={setPeriod}
						years={historyPeriods.data || []}
					/>
				</SkeletonWrapper>
				{timeframe === "month" && (
					<SkeletonWrapper isLoading={historyPeriods.isFetching}>
						<MonthSelector period={period} setPeriod={setPeriod} />
					</SkeletonWrapper>
				)}
			</div>
		</div>
	);
}

function MonthSelector({
	period,
	setPeriod,
}: {
	period: Period;
	setPeriod: (period: Period) => void;
}) {
	return (
		<Select
			value={period.month.toString()}
			onValueChange={(value) =>
				setPeriod({
					year: period.year,
					month: parseInt(value),
				})
			}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((month) => {
					const monthStr = new Date(period.year, month, 1).toLocaleString(
						"default",
						{ month: "long" }
					);
					return (
						<SelectItem value={month.toString()} key={month}>
							{monthStr}
						</SelectItem>
					);
				})}
			</SelectContent>
		</Select>
	);
}
function YearSelector({
	period,
	setPeriod,
	years,
}: {
	period: Period;
	setPeriod: (period: Period) => void;
	years: GetHistoryPeriodsResponseType;
}) {
	return (
		<Select
			value={period.year.toString()}
			onValueChange={(value) =>
				setPeriod({
					month: period.month,
					year: parseInt(value),
				})
			}
		>
			<SelectTrigger className="w-[180px]">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{years.map((year) => (
					<SelectItem value={year.toString()} key={year}>
						{year}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
