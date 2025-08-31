"use client";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { TransactionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
	CreateCategorySchema,
	CreateCategorySchemaType,
} from "@/schema/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleOff, Loader2, PlusSquare } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateCategoryAction } from "../_actions/categories";
import { Category } from "@/lib/generated/prisma";
import { toast } from "sonner";
import { useTheme } from "next-themes";

interface Props {
	type: TransactionType;
	onSuccessCallback: (category: Category) => void;
}

export default function CreateCategory({ type, onSuccessCallback }: Props) {
	const [open, setOpen] = useState(false);
	const form = useForm<CreateCategorySchemaType>({
		resolver: zodResolver(CreateCategorySchema),
		defaultValues: { type },
	});

	const queryClient = useQueryClient();
	const theme = useTheme();

	const { mutate, isPending } = useMutation({
		mutationFn: CreateCategoryAction,
		onSuccess: async (data: Category) => {
			form.reset({ name: "", icon: "", type });

			toast.success(`The Category ${data.name} Has Been Created Successfully`, {
				id: "create-category",
			});

			onSuccessCallback(data);

			await queryClient.invalidateQueries({
				queryKey: ["categories"],
			});

			setOpen((prev) => !prev);
		},
		onError: () => {
			toast.error("Something Went Wrong", { id: "create-category" });
		},
	});

	const onSubmit = useCallback(
		(values: CreateCategorySchemaType) => {
			toast.loading("Creating Category...", { id: "create-category" });
			mutate(values);
		},
		[mutate]
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button
					variant={"ghost"}
					className="border-separate items-center justify-start rounded-none border-b p-3 text-muted-foreground cursor-pointer"
				>
					<PlusSquare className="mr-2 h-4 w-4" />
					Create a New Category
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Create
						<span
							className={cn(
								"m-1",
								type === "income" ? "text-emerald-500" : "text-red-500"
							)}
						>
							{type}
						</span>
						Category
					</DialogTitle>
					<DialogDescription>
						Categories Used To Group Your Transactions
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input placeholder="Category" {...field} />
									</FormControl>
									<FormDescription>
										This is How Your Category Will Appear
									</FormDescription>
								</FormItem>
							)}
						></FormField>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Icon</FormLabel>
									<FormControl>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant={"outline"} className="h-fit w-full">
													{form.watch("icon") ? (
														<div className="flex flex-col items-center gap-2">
															<span className="text-4xl" role="img">
																{field.value}
															</span>
															<p className="text-xs text-muted-foreground">
																Click To Change
															</p>
														</div>
													) : (
														<div className="flex flex-col items-center gap-2">
															<CircleOff className="h-[48px] w-[48px]" />
															<p className="text-xs text-muted-foreground">
																Click To Select
															</p>
														</div>
													)}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-full">
												<Picker
													data={data}
													theme={theme.resolvedTheme}
													onEmojiSelect={(emoji: { native: string }) => {
														field.onChange(emoji.native);
													}}
												/>
											</PopoverContent>
										</Popover>
									</FormControl>
									<FormDescription>
										This How Your Category Will Appear
									</FormDescription>
								</FormItem>
							)}
						></FormField>
					</form>
				</Form>
				<DialogFooter>
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
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
