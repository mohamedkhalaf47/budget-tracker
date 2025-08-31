"use client";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
	CreateTransactionSchema,
	CreateTransactionSchemaType,
} from "@/schema/transaction";
import React, { ReactNode, useCallback } from "react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CategoryPicker from "./CategoryPicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface Props {
	trigger: ReactNode;
	type: TransactionType;
}

export default function CreateTransaction({ trigger, type }: Props) {
	const form = useForm({
		resolver: zodResolver(CreateTransactionSchema),
		defaultValues: {
			type,
			date: new Date(),
		},
	});

	const handleCategoryChange = useCallback(
		(value: string) => {
			form.setValue("category", value);
		},
		[form]
	);

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Create a New
						<span
							className={cn(
								"m-1",
								type === "income" ? "text-emerald-500" : "text-red-500"
							)}
						>
							{type}
						</span>
						Transaction
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-6">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Input
											defaultValue={""}
											{...field}
											placeholder="Enter The Transaction Description"
										/>
									</FormControl>
									<FormDescription>
										Transaction Description (Optional)
									</FormDescription>
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="amount"
							render={() => (
								<FormItem>
									<FormLabel>Amount</FormLabel>
									<FormControl>
										<Input type="number" defaultValue={0} min={0} />
									</FormControl>
									<FormDescription>Transaction Amount</FormDescription>
								</FormItem>
							)}
						/>
						<div className="flex items-center justify-between gap-6">
							<FormField
								control={form.control}
								name="category"
								render={() => (
									<FormItem>
										<FormLabel>Category</FormLabel>
										<FormControl>
											<CategoryPicker
												type={type}
												onChange={handleCategoryChange}
											/>
										</FormControl>
										<FormDescription>
											Select a Category for This Transaction
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Transaction Date</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant={"outline"}
														className={cn(
															"w-fit pl-3 text-left font-normal",
															!field.value && "text-muted-foreground"
														)}
													>
														{field.value ? (
															//@ts-expect-error type issue
															format(field.value, "PPP")
														) : (
															<span>Select a Date</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													//@ts-expect-error type issue from selection
													selected={field.value}
													onSelect={field.onChange}
													autoFocus
												/>
											</PopoverContent>
										</Popover>
										<FormDescription>
											Select The Transaction Date
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</form>
				</Form>
				{/* <DialogFooter>
					<DialogClose asChild>
						<Button
							type="button"
							variant={"secondary"}
							onClick={() => {
								form.reset();
							}}
						>
							Cancel
						</Button>
					</DialogClose>
					<Button
						className="cursor-pointer"
						onClick={form.handleSubmit(onSubmit)}
						disabled={isPending}
					>
						{isPending ? <Loader2 className="animate-spin" /> : "Create"}
					</Button>
				</DialogFooter> */}
			</DialogContent>
		</Dialog>
	);
}
