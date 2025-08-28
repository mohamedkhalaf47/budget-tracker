import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export default function SkeletonWrapper({
	children,
	isLoading,
	fitWidth = true,
}: {
	children: React.ReactNode;
	isLoading: boolean;
	fitWidth?: boolean;
}) {
	if (!isLoading) return children;

	return (
		<Skeleton className={cn(fitWidth && "w-fit")}>
			<div className="opacity-0">{children}</div>
		</Skeleton>
	);
}
