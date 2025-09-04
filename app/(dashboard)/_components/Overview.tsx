"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { UserSettings } from "@/lib/generated/prisma";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import StatsCard from "./StatsCard";

export default function Overview({
	userSettings,
}: {
	userSettings: UserSettings;
}) {
	const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
		from: startOfMonth(new Date()),
		to: new Date(),
	});

	return (
		<>
			<div className="flex flex-wrap items-end justify-between gap-2 p-6">
				<h2 className="text-3xl font-bold">Overview</h2>
				<div className="flex items-center gap-3">
					<DateRangePicker
						initialDateFrom={dateRange.from}
						initialDateTo={dateRange.to}
						showCompare={false}
						onUpdate={(values) => {
							const { from, to } = values.range;
							if (!from || !to) return;
							if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
								toast.error(
									`The Selected Date Range Is Too Big. Max Allowed Range Is ${MAX_DATE_RANGE_DAYS} Days.`
								);
								return;
							}
							setDateRange({ from, to });
						}}
					/>
				</div>
			</div>
			<div className="flex w-full flex-col items-center gap-2">
				<StatsCard
					userSettings={userSettings}
					from={dateRange.from}
					to={dateRange.to}
				/>
			</div>
		</>
	);
}
