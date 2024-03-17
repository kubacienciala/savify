export type QueryGoal = {
	id: number;
	user_id: string;
	title: string;
	goal: number;
	amount: number;
};

export type MutateGoal = {
	id?: number;
	user_id: string;
	title: string;
	goal: number;
	amount: number;
};
