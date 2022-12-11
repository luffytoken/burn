import { BURN_ADDRESSES, CUP_IMAGE_URL, CUP_WALLET_COMMENT } from "../constants";
import { baseTransaction } from "../constants/types";

export const getShortEndedAddress = (address: string, count: number) => {
    return address.substring(0, count).concat("...").concat(address.substr(-1 * count));
}

export const getFromAddress = (transaction: baseTransaction) => {
    switch (transaction.type.toLowerCase()) {
        case "buy":
            return transaction.wallet_to;
        case "sell":
            return transaction.wallet_from;
        case "add_liquidity":
            return transaction.wallet_from;
        case "remove_liquidity":
            return transaction.wallet_to;
        case "burn":
            return transaction.wallet_from;
        default:
            break;
    }
    return "";
}

export const getToAddress = (transaction: baseTransaction) => {
    switch (transaction.type.toLowerCase()) {
        case "buy":
            return "Buy";
        case "sell":
            return "Sell";
        case "add_liquidity":
            return "Add Liquidity";
        case "remove_liquidity":
            return "Remove Liquidity";
        case "burn":
            let realAddress = "";
            for (let i = 0; i < BURN_ADDRESSES.length; i++) {
                if (BURN_ADDRESSES[i].address === transaction.wallet_to) {
                    realAddress = BURN_ADDRESSES[i].name;
                    break;
                }
            }
            return realAddress;
        default:
            break;
    }
    return "";
}

export const getBurnAddressName = (address: string) => {
    for(let i = 0; i < BURN_ADDRESSES.length; i++) {
        if(BURN_ADDRESSES[i].address === address) {
            return BURN_ADDRESSES[i].name;
        }
    }
}

export const secondsToStr = (seconds: number) => {
    if (seconds > 86400) // days
    {
        const day = Math.floor(seconds / 86400);
        if (day === 1)
            return "yesterday";
        return day.toString().concat(" days ago");
    }
    else if (seconds > 3600) // hours
    {
        const hour = Math.floor(seconds / 3600);
        if (hour === 1)
            return "an hour ago";
        return hour.toString().concat(hour > 1 ? " hours ago" : " hour ago");
    }
    else if (seconds > 60) // minutes
    {
        const min = Math.floor(seconds / 60);
        return min.toString().concat(min > 1 ? " minutes ago" : " minute ago");
    }
    else {
        return Math.floor(seconds).toString().concat(seconds > 1 ? " seconds ago" : " second ago");
    }
}

export const getCupImageUrl = (rank: string) => {
    switch (rank) {
        case "gold":
            return CUP_IMAGE_URL[0];
        case "silver":
            return CUP_IMAGE_URL[1];
        case "bronze":
            return CUP_IMAGE_URL[2];
    }
    return "";
}

export const getCupComment = (rank: string) => {
    switch (rank) {
        case "gold":
            return CUP_WALLET_COMMENT[0];
        case "silver":
            return CUP_WALLET_COMMENT[1];
        case "bronze":
            return CUP_WALLET_COMMENT[2];
    }
    return "";
}

export const getDateFromUTCString = (datestring: string) => {
    let dateTime = datestring.split(' ');
    let dateBits = dateTime[0].split('-');
    let timeBits = dateTime[1].split(':');

    const dateObj = new Date(parseInt(dateBits[0]), parseInt(dateBits[1]) - 1, parseInt(dateBits[2]), parseInt(timeBits[0]), parseInt(timeBits[1]), parseInt(timeBits[2]));
    return dateObj.valueOf() - (dateObj.getTimezoneOffset()*60*1000);
}

export const getNumberString = (num: number) => {
    const trillion = 1000000000000;
    const billion = 1000000000;
    let divided = 0;
    let unit = "";
    if(num > trillion)
    {
        divided = Math.floor(num/trillion);
        unit = " trillion";
    }
    else if(num > billion) {
        divided = Math.floor(num/billion);
        unit = " billion";
    }
    return divided.toLocaleString("en-US").concat(unit).concat(divided>1?"s":"");
}