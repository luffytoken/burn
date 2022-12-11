import { useEffect, useState } from "react";
import { Container } from "react-bootstrap"
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { EXPLORER_URL, TITLE, TOKEN_URL } from "../constants";
import { transactionForAll } from "../constants/types";
import { useBurnTransactions } from "../hooks/useInfo";
import { getDateFromUTCString, getFromAddress, getShortEndedAddress, getToAddress, secondsToStr } from "../utils";
import { Loading } from "./Loading";

export const Transactions = () => {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const burns = useBurnTransactions(page, count);
    const [burnList, setBurnList] = useState(new Array<transactionForAll>());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (burns) {
            const burnsList = JSON.parse(burns);
            setTotalCount(Number(burnsList.total));
            setBurnList(burnsList.records);
            setPageCount(Math.ceil(Number(burnsList.total) / count));
            setLoading(false);
        }
        document.title = `Burn Transactions | ${TITLE}`;
    }, [burns])

    const handlePageClick = (selectedItem: { selected: number; }) => {
        setBurnList(new Array<transactionForAll>());
        setPage(selectedItem.selected + 1);
        setLoading(true);
    };
    return (
        <Container className="component rounded-4 mt-5">
            <div className="p-4 border-bottom">
                <h4 className="mt-2 mb-0">Burn Transactions</h4>
            </div>
            <div className="p-4">
                <div className="w-100 position-relative" style={{minHeight: "150px"}}>
                    {loading && <Loading />}
                    <table className="w-100 normal-table">
                        <thead>
                            <tr className="text">
                                <td>
                                    From
                                </td>
                                <td>
                                    $Luffy
                                </td>
                                <td>
                                    Method
                                </td>
                                <td>
                                    Time
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {(!loading && burnList.length === 0) && <tr><td colSpan={4} className="text-center">No record</td></tr>}
                            {burnList.map((el, idx) => {
                                if(el) {
                                    return (
                                        <tr className={idx > 0 ? "border-top" : ""} key={idx}>
                                            <td className="table-cell">
                                                <a target="_blank" href={TOKEN_URL.ETH.concat(getFromAddress(el))}>
                                                    {getShortEndedAddress(getFromAddress(el), 15)}
                                                </a>
                                            </td>
                                            <td className="label pe-3">
                                                {Number(el.burned).toLocaleString("en-US")} (${Number(el.burned_usd).toLocaleString("en-US")})
                                            </td>
                                            <td className="table-cell pe-3">                                                
                                                {el.type.toLocaleLowerCase() !== "burn" &&
                                                <a target="_blank" href={EXPLORER_URL.ETH.concat('tx/').concat(el.hash)}>
                                                    {getToAddress(el)}
                                                </a>}
                                                {el.type.toLocaleLowerCase() === "burn" &&
                                                <Link to="/burnaddresses" title={el.wallet_to}>
                                                    Transfer({getToAddress(el)})
                                                </Link>}
                                            </td>
                                            <td className="table-cell">
                                                <a target="_blank" href={EXPLORER_URL.ETH.concat('tx/').concat(el.hash)}>
                                                    {secondsToStr((new Date().getTime() - getDateFromUTCString(el.created_time_utc)) / 1000)}
                                                </a>
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    <div className="mobile-table small-text">
                        {(!loading && burnList.length === 0) && <div className="text-center py-5">No record</div>}
                        {burnList.map((el, idx)=>{
                            return (
                                <div className={idx>0?"border-top py-3":"pb-3"} key={idx}>
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
                                            $Luffy
                                        </div>
                                        <div>
                                            {Number(el.burned).toLocaleString("en-US")} (${Number(el.burned_usd).toLocaleString("en-US")})
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
                                            Time
                                        </div>
                                        <div>
                                            <a target="_blank" href={EXPLORER_URL.ETH.concat('tx/').concat(el.hash)}>
                                                {secondsToStr((new Date().getTime() - getDateFromUTCString(el.created_time_utc))/1000)}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<"
                    className="pagination justify-content-end mt-3"
                    pageClassName="page-item"
                    pageLinkClassName="page-link rounded mx-1"
                    previousLinkClassName="page-link rounded mx-1"
                    nextLinkClassName="page-link rounded mx-1"
                    activeLinkClassName="active"
                />
            </div>
        </Container>
    )
}