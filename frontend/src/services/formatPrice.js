export const formatPrice = (price) =>
    Number(price).toLocaleString("en-ZA", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });