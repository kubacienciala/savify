export const convertDateFormat = (inputDate: string): string => {
	const parts = inputDate.split('.');
	if (parts.length !== 3) {
		throw new Error(
			'Invalid date format. Please provide date in DD.MM.YYYY format.'
		);
	}

	const day = parts[0];
	const month = parts[1];
	const year = parts[2];

	// Pad day and month with leading zeros if necessary
	const paddedDay = day.padStart(2, '0');
	const paddedMonth = month.padStart(2, '0');

	// Concatenate parts in YYYY-MM-DD format
	const convertedDate = `${year}-${paddedMonth}-${paddedDay}`;
	return convertedDate;
};
