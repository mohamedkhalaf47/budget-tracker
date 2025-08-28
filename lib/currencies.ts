export const currencies = [
	{ value: "EGP", label: "E£ Egyptian Pound", locale: "ar-EG" }, // Egyptian Pound
	{ value: "USD", label: "$ Dollar", locale: "en-US" }, // US Dollar
	{ value: "EUR", label: "€ Euro", locale: "de-DE" }, // Euro
	{ value: "JPY", label: "¥ Yen", locale: "ja-JP" }, // Japanese Yen
	{ value: "GBP", label: "£ Pound", locale: "en-GB" }, // British Pound Sterling
	{ value: "AUD", label: "A$ Australian Dollar", locale: "en-AU" }, // Australian Dollar
	{ value: "CAD", label: "C$ Canadian Dollar", locale: "en-CA" }, // Canadian Dollar
	{ value: "CHF", label: "CHF Swiss Franc", locale: "de-CH" }, // Swiss Franc
	{ value: "CNY", label: "¥ Yuan Renminbi", locale: "zh-CN" }, // Chinese Yuan
	{ value: "HKD", label: "HK$ Hong Kong Dollar", locale: "zh-HK" }, // Hong Kong Dollar
	{ value: "NZD", label: "NZ$ New Zealand Dollar", locale: "en-NZ" }, // New Zealand Dollar
];

export type Currency = (typeof currencies)[0];