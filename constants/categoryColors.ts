import { TransactionCategoryEnum } from "@/types/enums";

const categoryColors = {
    [TransactionCategoryEnum.Food]: "#FF5733",
    [TransactionCategoryEnum.Transport]: "#FFC300",
    [TransactionCategoryEnum.Health]: "#36DBCA",
    [TransactionCategoryEnum.Education]: "#FF006E",
    [TransactionCategoryEnum.Entertainment]: "#6B5B95",
    [TransactionCategoryEnum.Empty]: "#000000", 
    [TransactionCategoryEnum.Other]: "#FFFFFF", 
};

export const assignColorToCategory = (category: TransactionCategoryEnum) => {
    if (categoryColors.hasOwnProperty(category)) {
        return categoryColors[category];
    } else {
        return categoryColors[TransactionCategoryEnum.Other];
    }
}