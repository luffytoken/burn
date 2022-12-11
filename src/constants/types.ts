export type leaderboard = {
    total_burn_amount: string,
    total_burn_amount_current_month: string,
    wallet: string,
    excluded: boolean,
    rank: string,
}

export interface baseTransaction {
    burned: string,
    price_usd: string,
    hash: string,
    wallet_from: string,
    wallet_to: string,
    type: string
}

export interface transaction extends baseTransaction {
    burn_usd: string,
    time_stamp_utc: string,
}

export interface transactionForAll extends baseTransaction{
    burned_usd: string,
    created_time_utc: string,
}

export type buy2burn = {
    chain: string,
    hash: string,
    wallet: string,
    amount: boolean,
    time_stamp_utc: string,
}