export function numberWithCommas(amount: number) {
    if(!amount) return amount;
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}