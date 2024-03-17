export type QueryTransaction = {
	id: number;
	created_at: string;
	amount: number;
	type: string;
	description: string;
	category: string;
	payment_method: string;
	date: string;
	user_id: string;
	color: string;
};

export type QueryTransactionByMonth = {
	year_month: string;
	total_amount: number;
	categories: string[];
	ids: number[];
	user_id: string;
	amounts: number[];
	colors: string[];
};

export type MutateTransaction = {
	amount: number;
	type: string;
	description: string;
	category: string;
	payment_method: string;
	date: string;
	user_id: string;
	color: string;
};
