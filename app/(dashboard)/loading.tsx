import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="h-full bg-background">
			<Card className="border-b rounded-none">
				<CardContent className="container flex flex-wrap items-center justify-between gap-6 py-8">
					<Skeleton className="h-9 w-64" />
				</CardContent>
			</Card>

			<div className="container py-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					{[...Array(3)].map((_, i) => (
						<Card key={i} className="w-full">
							<CardContent className="p-6">
								<Skeleton className="h-4 w-[60%] mb-4" />
								<Skeleton className="h-8 w-[80%]" />
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
