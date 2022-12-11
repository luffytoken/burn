import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap"
import { Link } from "react-router-dom";
import { EXCLUDED_ICON_URL, EXCLUDED_WALLET_COMMENT, EXPLORER_URL, TITLE, TOKEN_URL } from "../constants";
import { leaderboard, transaction } from "../constants/types";
import { getBurnAddressName, getCupComment, getCupImageUrl, getDateFromUTCString, getFromAddress, getNumberString, getShortEndedAddress, getToAddress, secondsToStr } from "../utils";
import { Loading } from "./Loading";

interface HomeInfo {
    totalBurn: string,
    totalSupply: string,
    circSupply: string,
    lastBurn: string,
    stakedSupply: string,
    burnRate: number,
    luffyPrice: number,
    buy2Burn: string,
    burns: string,
    leaderboards: string,
}

export const Home: React.FC<HomeInfo> = ({ totalBurn, totalSupply, circSupply, lastBurn, stakedSupply, burnRate, luffyPrice, buy2Burn, burns, leaderboards }) => {
    const [latestBurns, setLatestBurns] = useState(Array<transaction>);
    const [leaderBoard, setLeaderBoard] = useState(Array<leaderboard>);
    const buy2Burns = buy2Burn ? JSON.parse(buy2Burn) : {};
    const [totalBuys, setTotalBuys] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    const [loading1, setLoading1] = useState(true);
    const [loading2, setLoading2] = useState(true);

    const [tooltipIdx, setTooltipIdx] = useState(999);

    const [showB2B, setShowB2B] = useState(0);

    useEffect(() => {
        if (burns) {
            const burnsList = JSON.parse(burns);
            setLatestBurns(burnsList);
            setLoading1(false);
        }
        if (leaderboards) {
            const leaderboardList = JSON.parse(leaderboards);
            setLeaderBoard(leaderboardList);
            setLoading2(false);
        }
        if(buy2Burn) {
            setShowB2B(buy2Burns.show?2:1);
            if(buy2Burns.show) {
                let totalbuys = 0;
                let totalamount = 0;
                for (let i = 0; i < buy2Burns.records.length; i++) {
                    totalbuys += Number(buy2Burns.records[i].buys);
                    totalamount += Number(buy2Burns.records[i].amount);
                }
                setTotalBuys(totalbuys);
                setTotalAmount(totalamount);
            }
        }
        document.title = `${TITLE}`;
    }, [burns, leaderboards, buy2Burn])

    const showTooltip = (idx: number) => {
        setTooltipIdx(idx);
        setTimeout(()=>{
            setTooltipIdx(999);
        }, 2000);
    }
    return (
        <Container>
            <Row className="home-container pt-5">
                <Col lg={4}>
                    <div className="w-100 component rounded-4">
                        <div className="p-4 border-bottom">
                            <h4 className="ps-2 mt-2 mb-0">Burn & Supply</h4>
                        </div>
                        <div className="p-4 lh-1">
                            <div className="ps-2 mt-2 d-flex">
                                <img src="/fire.png" alt="fire" width={14} height={32} />
                                <div className="ms-2">
                                    <div className="text">Total burn from initial supply</div>
                                    <div className="label small-text lh-lg">{totalBurn} Luffy</div>
                                </div>
                            </div>
                            <div className="ps-2 mt-3 d-flex">
                                <img src="/fire.png" alt="fire" width={14} height={32} />
                                <div className="ms-2">
                                    <div className="text">Last 24 hours</div>
                                    <div className="label small-text lh-lg">{lastBurn} Luffy</div>
                                </div>
                            </div>
                            <div className="ps-2 mt-3 d-flex">
                                <img src="/fire.png" alt="fire" width={14} height={32} />
                                <div className="ms-2">
                                    <div className="text">Burn Percentage</div>
                                    <div className="label small-text lh-lg">{burnRate.toLocaleString("en-US")}%</div>
                                </div>
                            </div>
                            <div className="ps-4 mt-3 d-flex">
                                <div className="ps-2">
                                    <div className="text">Total Supply</div>
                                    <div className="label small-text lh-lg">{totalSupply}</div>
                                </div>
                            </div>
                            <div className="ps-4 mt-3 d-flex">
                                <div className="ps-2">
                                    <div className="text">Circulating Supply</div>
                                    <div className="label small-text lh-lg">{circSupply}</div>
                                </div>
                            </div>
                            <div className="ps-4 mt-3 mb-2 d-flex">
                                <div className="ps-2">
                                    <div className="text">Staked Luffy</div>
                                    <div className="label small-text lh-lg">{stakedSupply}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 mt-3 component rounded-4">
                        <div className="p-4 border-bottom">
                            <h4 className="ps-2 mt-2 mb-0">Burn Goal</h4>
                        </div>
                        <div className="p-4 lh-1">
                            <div className="mt-3 progress-back bg-gradient w-100 rounded-pill border-light overflow-hidden">
                                <div className="progress-bar bg-gradient py-2" style={{ width: `${burnRate * 2}%` }}></div>
                            </div>
                            <div className="px-2 d-flex mt-2 mb-2 justify-content-between">
                                <div className="orange-text">
                                    {burnRate.toLocaleString("en-US")}% burnt
                                </div>
                                <div className="light-orange-text">
                                    50% burn goal
                                </div>
                            </div>
                            <div className="text-end mt-3">
                                <Link to="/burnaddresses">
                                    <Button variant="primary">
                                        Burn Addresses
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="w-100 mt-3 component rounded-4">
                        <div className="p-4 border-bottom">
                            <h4 className="ps-2 mt-2 mb-0">B2B (BUY2BURN)</h4>
                        </div>
                        <div className="p-4">
                            <div className="mb-3">
                                {showB2B>0 && (showB2B==2 ?
                                <table className="w-100">
                                    <tbody>                                            
                                        <tr className="orange-text">
                                            <td>
                                                Start date
                                            </td>
                                            <td>
                                                End date
                                            </td>
                                            <td>
                                                Minumum buy
                                            </td>
                                        </tr>
                                        <tr className="small-text border-bottom">
                                            <td className="pb-3">
                                                {format(getDateFromUTCString(buy2Burns.start_date_utc), "dd/LL/yyyy H:mm")}
                                            </td>
                                            <td className="pb-3">
                                                {format(getDateFromUTCString(buy2Burns.end_date_utc), "dd/LL/yyyy H:mm")}
                                            </td>
                                            <td className="pb-3">
                                                {Number(buy2Burns.minimum_dollar_buy).toLocaleString("en-US")}
                                            </td>
                                        </tr>
                                        <tr className="orange-text">
                                            <td className="pt-3 pe-3">
                                                Chain
                                            </td>
                                            <td className="pt-3 pe-3">
                                                Buys
                                            </td>
                                            <td className="pt-3">
                                                Amount
                                            </td>
                                        </tr>
                                        {buy2Burns.records.length === 0 && <tr><td className="text-center" colSpan={3}>No record</td></tr>}
                                        {buy2Burns.records.map((el: any, idx: number) => {
                                            return (
                                                <tr key={idx} className="small-text">
                                                    <td className="py-1">
                                                        {el.chain}
                                                    </td>
                                                    <td>
                                                        {Number(el.buys).toLocaleString("en-US")}
                                                    </td>
                                                    <td>
                                                        {Number(el.amount).toLocaleString("en-US")} (${(Number(el.amount) * Number(luffyPrice)).toLocaleString("en-US")})
                                                    </td>
                                                </tr>
                                            )
                                        })}
                                        <tr className="small-text fw-bold py-2">
                                            <td className="py-1 pb-3">
                                                Total
                                            </td>
                                            <td className="pb-3">
                                                {totalBuys.toLocaleString("en-US")}
                                            </td>
                                            <td className="pb-3">
                                                {totalAmount.toLocaleString("en-US")} (${(totalAmount * Number(luffyPrice)).toLocaleString("en-US")})
                                            </td>
                                        </tr>
                                        <tr className="border-top border-bottom">
                                            <td colSpan={2} className="py-3 text-success">Pledged burn amount</td>
                                            <td className="text-success">{getNumberString(totalBuys*Number(buy2Burns.burn_amount_per_buy))} (${(totalBuys*Number(buy2Burns.burn_amount_per_buy)*luffyPrice).toLocaleString("en-US")})</td>
                                        </tr>
                                    </tbody>
                                </table>: <div>Status: <b className="orange-text">Not running</b></div>)}
                            </div>
                            {showB2B>0 && (showB2B==2 &&
                            <div className="pt-1 text-end">
                                <Link to="/buy2burns">
                                    <Button variant="primary px-4">View Buys</Button>
                                </Link>
                            </div>)}
                        </div>
                    </div>
                </Col>
                <Col>
                    <div className="component rounded-4 h-100 d-flex flex-column">
                        <div className="p-4 border-bottom">
                            <h4 className="ps-2 mt-2 mb-0">
                                Latest burns
                            </h4>
                        </div>
                        <div className="p-4 flex-fill">
                            <div className="ps-2 d-flex flex-column justify-content-between h-100">
                                <div className="w-100 position-relative" style={{minHeight: "150px"}}>
                                    {loading1 && <Loading />}
                                    <table className="w-100 normal-table">
                                        <thead className="text">
                                            <tr>
                                                <td className="w-25">
                                                    Time
                                                </td>
                                                <td>
                                                    From
                                                </td>
                                                <td className="pe-3">
                                                    Method
                                                </td>
                                                <td className="pe-3">
                                                    $Luffy
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody className="small-text">
                                            {(!loading1 && latestBurns.length === 0) && <tr><td colSpan={4} className="text-center py-5">No record</td></tr>}
                                            {latestBurns.map((el, idx) => {
                                                if(idx < (buy2Burns.show?18:14)) 
                                                {
                                                    return (
                                                        <tr className={idx > 0 ? "border-top" : ""} key={idx}>
                                                            <td className="table-cell">
                                                                <a target="_blank" href={EXPLORER_URL.ETH.concat('tx/').concat(el.hash)}>
                                                                    {secondsToStr((new Date().getTime() - getDateFromUTCString(el.time_stamp_utc)) / 1000)}
                                                                </a>
                                                            </td>
                                                            <td className="table-cell">
                                                                <a target="_blank" href={TOKEN_URL.ETH.concat(getFromAddress(el))}>
                                                                    {getShortEndedAddress(getFromAddress(el), 15)}
                                                                </a>
                                                            </td>
                                                            <td className="table-cell">
                                                                {el.type.toLocaleLowerCase() !== "burn" &&
                                                                    <a target="_blank" href={EXPLORER_URL.ETH.concat('tx/').concat(el.hash)}>
                                                                        {getToAddress(el)}
                                                                    </a>}
                                                                {el.type.toLocaleLowerCase() === "burn" &&
                                                                    <Link to="/burnaddresses" title={el.wallet_to}>
                                                                        Transfer({getToAddress(el)})
                                                                    </Link>}
                                                            </td>
                                                            <td className="label">
                                                                {Number(el.burned).toLocaleString("en-US")} (${Number(el.burn_usd).toLocaleString("en-US")})
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })}
                                        </tbody>
                                    </table>
                                    <div className="mobile-table small-text">
                                        {(!loading1 && latestBurns.length === 0) && <div className="text-center py-5">No record</div>}
                                        {latestBurns.map((el, idx) => {
                                            if(idx < (buy2Burns.show?18:14)) 
                                            {
                                                return (
                                                    <div className={idx > 0 ? "border-top py-3" : "pb-3"} key={idx}>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                Time
                                                            </div>
                                                            <div>
                                                                <a target="_blank" href={EXPLORER_URL.ETH.concat('tx/').concat(el.hash)}>
                                                                    {secondsToStr((new Date().getTime() - getDateFromUTCString(el.time_stamp_utc)) / 1000)}
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                From
                                                            </div>
                                                            <div>
                                                                <a target="_blank" href={TOKEN_URL.ETH.concat(getFromAddress(el))}>
                                                                    {getShortEndedAddress(getFromAddress(el), 15)}
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                Method
                                                            </div>
                                                            <div>
                                                                {el.type.toLocaleLowerCase() !== "burn" &&
                                                                    <a target="_blank" href={EXPLORER_URL.ETH.concat('tx/').concat(el.hash)}>
                                                                        {getToAddress(el)}
                                                                    </a>}
                                                                {el.type.toLocaleLowerCase() === "burn" &&
                                                                    <Link to="/burnaddresses" title={el.wallet_to}>
                                                                        Transfer({getToAddress(el)})
                                                                    </Link>}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                $Luffy
                                                            </div>
                                                            <div>
                                                                {Number(el.burned).toLocaleString("en-US")} (${Number(el.burn_usd).toLocaleString("en-US")})
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })}
                                    </div>
                                </div>

                                <div className="pt-1">
                                    {!loading1 &&
                                    <Link to="/transactions">
                                        <Button variant="primary px-4">View all</Button>
                                    </Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="mt-4 mb-5">
                <Col>
                    <div className="component rounded-4">
                        <div className="p-4 border-bottom">
                            <h4 className="ps-2 mt-2 mb-3">
                                Top Burners
                            </h4>
                            <div className="ps-2 label">
                                Help Luffy to reach its burning goal and win amazing prizes such as NFTs, Ethereum, Luffy merch and more!
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="px-2">
                                <div className="w-100 position-relative" style={{minHeight:"150px"}}>
                                    {loading2 && <Loading />}
                                    <table className="w-100 normal-table">
                                        <thead className="text">
                                            <tr>
                                                <td>
                                                    Rank
                                                </td>
                                                <td>
                                                    Address
                                                </td>
                                                <td>
                                                    Burn amount(Month)
                                                </td>
                                                <td>
                                                    Burn amount(Total)
                                                </td>
                                            </tr>
                                        </thead>
                                        <tbody className="small-text">
                                            {(!loading2 && leaderBoard.length === 0) && <tr><td colSpan={4} className="py-5 text-center">No record</td></tr>}
                                            {leaderBoard.map((el, idx) => {
                                                if (idx < 10) 
                                                {
                                                    return (
                                                        <tr className={(idx > 0 ? "border-top" : "").concat(" label")} key={idx} title={el.excluded ? EXCLUDED_WALLET_COMMENT : (el.rank?getCupComment(el.rank):"")}>
                                                            <td className="table-cell">
                                                                {idx + 1} {el.excluded?(<span className="tooltip-container"><img src={EXCLUDED_ICON_URL} alt="excluded" width={15} />{tooltipIdx === idx && <span className="tooltip-content">{EXCLUDED_WALLET_COMMENT}</span>}</span>):(el.rank && (<img src={getCupImageUrl(el.rank)} width={15} alt="cup" />))} 
                                                            </td>
                                                            <td className="table-cell">
                                                                <a target="_blank" href={TOKEN_URL.ETH.concat(el.wallet)}>
                                                                    {getShortEndedAddress(el.wallet, 15)}
                                                                </a>
                                                            </td>
                                                            <td>
                                                                {Number(el.total_burn_amount_current_month).toLocaleString("en-US")} (${(Number(el.total_burn_amount_current_month) * luffyPrice).toLocaleString("en-US")})
                                                            </td>
                                                            <td>
                                                                {Number(el.total_burn_amount).toLocaleString("en-US")} (${(Number(el.total_burn_amount) * luffyPrice).toLocaleString("en-US")})
                                                            </td>
                                                        </tr>
                                                    )
                                                }
                                            })
                                            }
                                        </tbody>
                                    </table>
                                    <div className="mobile-table label small-text">
                                        {(!loading2 && leaderBoard.length === 0) && <div className="text-center py-5">No record</div>}
                                        {leaderBoard.map((el, idx) => {
                                            if (idx < 10) 
                                            {
                                                return (
                                                    <div className={(idx > 0 ? "border-top py-3" : "pb-3")} key={idx} title={el.excluded ? EXCLUDED_WALLET_COMMENT : (el.rank?getCupComment(el.rank):"")}>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                Rank
                                                            </div>
                                                            <div>
                                                                {idx + 1} {
                                                                    el.excluded ? 
                                                                    (<span className="tooltip-container"><img src={EXCLUDED_ICON_URL} alt="excluded" width={15} onClick={()=>showTooltip(idx)} />{tooltipIdx === idx && <span className="tooltip-content">{EXCLUDED_WALLET_COMMENT}</span>}</span>)
                                                                    :
                                                                    (el.rank && (<span className="tooltip-container"><img src={getCupImageUrl(el.rank)} onClick={()=>showTooltip(idx)} width={15} alt="cup" />{tooltipIdx === idx && <span className="tooltip-content">{getCupComment(el.rank)}</span>}</span>))
                                                                } 
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                Wallet
                                                            </div>
                                                            <div>
                                                                <a target="_blank" href={TOKEN_URL.ETH.concat(el.wallet)}>
                                                                    {getShortEndedAddress(el.wallet, 15)}
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                Burn amount(Month)
                                                            </div>
                                                            <div>
                                                                {Number(el.total_burn_amount_current_month).toLocaleString("en-US")} (${(Number(el.total_burn_amount_current_month) * Number(luffyPrice)).toLocaleString("en-US")})
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                Burn amount(Total)
                                                            </div>
                                                            <div>
                                                                {Number(el.total_burn_amount).toLocaleString("en-US")} (${(Number(el.total_burn_amount) * Number(luffyPrice)).toLocaleString("en-US")})
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        })
                                        }
                                    </div>
                                </div>

                                <div className="py-2 text-end w-100">
                                    {!loading2 &&
                                    <Link to="/leaderboards">
                                        <Button variant="primary px-4">View all</Button>
                                    </Link>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}