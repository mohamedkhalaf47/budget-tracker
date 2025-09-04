import { currencies } from "./currencies";

export function DateToUTC(date: Date | string | number): Date {
	const d = new Date(date);
	return new Date(
		Date.UTC(
			d.getFullYear(),
			d.getMonth(),
			d.getDay(),
			d.getHours(),
			d.getMinutes(),
			d.getSeconds(),
			d.getMilliseconds()
		)
	);
}

export function GetFormatterForCurrency(currency: string) {
	const locale = currencies.find((c) => c.value === currency)?.locale;

	return new Intl.NumberFormat(locale, { style: "currency", currency });
}
