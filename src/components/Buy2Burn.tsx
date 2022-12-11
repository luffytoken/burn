import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { EXPLORER_URL, TITLE, TOKEN_URL } from "../constants";
import { buy2burn } from "../constants/types";
import { useBuy2Burns } from "../hooks/useInfo";
import { getDateFromUTCString, getShortEndedAddress, secondsToStr } from "../utils";
import { Loading } from "./Loading";

interface Buy2BurnProps {
    luffyPrice: Number,
}

export const Buy2Burn: React.FC<Buy2BurnProps> = ({luffyPrice}) => {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const buy2burns = useBuy2Burns(page, count);
    const [buy2burnList, setBuy2BurnList] = useState(new Array<buy2burn>());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (buy2burns) {
            const buy2burnlist = JSON.parse(buy2burns);
            setTotalCount(Number(buy2burnlist.total));
            setBuy2BurnList(buy2burnlist.records);
            setPageCount(Math.ceil(Number(buy2burnlist.total) / count));
            setLoading(false);
        }

        document.title = `B2B (BUY2BURN) | ${TITLE}`;
    }, [buy2burns])

    const handlePageClick = (selectedItem: { selected: number; }) => {
        setBuy2BurnList(new Array<buy2burn>());
        setPage(selectedItem.selected + 1);
        setLoading(true);
    };
    return (
        <Container className="component rounded-4 mt-5">
            <div className="p-4 border-bottom">
                <h4 className="mt-2 mb-0">B2B (BUY2BURN)</h4>
            </div>
            <div className="p-4">
                <div className="w-100 position-relative" style={{minHeight:"150px"}}>
                    {loading && <Loading />}
                    <table className="w-100 normal-table">
                        <thead>
                            <tr className="text">
                                <td>
                                    Time
                                </td>
                                <td>
                                    Wallet
                                </td>
                                <td>
                                    Amount
                                </td>
                                <td>
                                    Chain
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                            {(!loading && buy2burnList.length === 0) && <tr><td colSpan={4} className="text-center py-5">No record</td></tr>}
                            {buy2burnList.map((el, idx) => {
                                if (el) {
                                    return (
                                        <tr className={idx > 0 ? "border-top label" : "label"} key={idx}>
                                            <td className="table-cell">
                                                <a target="_blank" href={EXPLORER_URL[el.chain as keyof typeof EXPLORER_URL].concat("tx/").concat(el.hash)}>
                                                    {secondsToStr((new Date().getTime() - getDateFromUTCString(el.time_stamp_utc))/1000)}
                                                </a>
                                            </td>
                                            <td className="table-cell">
                                                <a target="_blank" href={TOKEN_URL[el.chain as keyof typeof TOKEN_URL].concat(el.wallet)}>
                                                    {getShortEndedAddress(el.wallet, 15)}
                                                </a>
                                            </td>
                                            <td>
                                                {Number(el.amount).toLocaleString("en-US")} (${(Number(el.amount) * Number(luffyPrice)).toLocaleString("en-US")})
                                            </td>
                                            <td>
                                                {el.chain}
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    <div className="mobile-table label small-text">
                        {(!loading && buy2burnList.length === 0) && <div className="text-center py-5">No record</div>}
                        {buy2burnList.map((el, idx) => {
                            return (
                                <div className={(idx > 0 ? "border-top py-3" : "pb-3")} key={idx}>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            Time
                                        </div>
                                        <div>
                                            <a target="_blank" href={EXPLORER_URL[el.chain as keyof typeof EXPLORER_URL].concat("tx/").concat(el.hash)}>
                                                {secondsToStr((new Date().getTime() - getDateFromUTCString(el.time_stamp_utc))/1000)}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            Wallet
                                        </div>
                                        <div>
                                            <a target="_blank" href={TOKEN_URL[el.chain as keyof typeof TOKEN_URL].concat(el.wallet)}>
                                                {getShortEndedAddress(el.wallet, 15)}
                                            </a>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            Amount
                                        </div>
                                        <div>
                                            {Number(el.amount).toLocaleString("en-US")} (${(Number(el.amount) * Number(luffyPrice)).toLocaleString("en-US")})
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            Chain
                                        </div>
                                        <div>
                                            {el.chain}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                        }
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