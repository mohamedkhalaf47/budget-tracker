"use client";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Popover } from "@/components/ui/popover";
import { Category } from "@/lib/generated/prisma";
import { TransactionType } from "@/lib/types";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { useQuery } from "@tanstack/react-query";
import React, { FormEvent, useCallback } from "react";
import CreateCategory from "./CreateCategory";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
	type: TransactionType;
	onChange: (value: string) => void;
}

export default function CategoryPicker({ type, onChange }: Props) {
	const [open, setOpen] = React.useState(false);
	const [value, setValue] = React.useState("");

	React.useEffect(() => {
		if (!value) return;
		onChange(value);
	}, [onChange, value]);

	const categories = useQuery({
		queryKey: ["categories", type],
		queryFn: () =>
			fetch(`/api/categories?type=${type}`).then((res) => res.json()),
	});

	const selectedCategory = categories.data?.find((category: Category) => {
		return category.name === value;
	});

	const successCallback = useCallback(
		(category: Category) => {
			setValue(category.name);
			setOpen((prev) => !prev);
		},
		[setValue, setOpen]
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					role="combobox"
					aria-expanded={open}
					className="w-fit justify-between"
				>
					{selectedCategory ? (
						<CategoryRow category={selectedCategory} />
					) : (
						"Select a Category"
					)}
					<ChevronsUpDown className="ml-2 w-4 h-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-fit p-0">
				<Command
					onSubmit={(e: FormEvent) => {
						e.preventDefault();
					}}
				>
					<CommandInput placeholder="Search for a category..." />
					<CreateCategory type={type} onSuccessCallback={successCallback} />
					<CommandEmpty>
						<p>Category Not Found</p>
						<p className="text-xs text-muted-foreground">
							Tip: Create a Category
						</p>
					</CommandEmpty>
					<CommandGroup>
						<CommandList>
							{categories.data &&
								categories.data.map((category: Category) => (
									<CommandItem
										key={category.name}
										onSelect={() => {
											setValue(category.name);
											setOpen((prev) => !prev);
										}}
									>
										<CategoryRow category={category} />
										<Check
											className={cn(
												"mr-2 w-4 h-4 opacity-0",
												value === category.name && "opacity-100"
											)}
										/>
									</CommandItem>
								))}
						</CommandList>
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}

function CategoryRow({ category }: { category: Category }) {
	return (
		<div className="flex items-center gap-2">
			<span role="img">{category.icon}</span>
			<span>{category.name}</span>
		</div>
	);
}
