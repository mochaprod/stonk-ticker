function toMoneyString(numericValue: number) {
    return numericValue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export {
    toMoneyString,
};
