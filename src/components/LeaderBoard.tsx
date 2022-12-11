import { useEffect, useState } from "react";
import { Container } from "react-bootstrap"
import ReactPaginate from "react-paginate";
import { CUP_IMAGE_URL, EXCLUDED_ICON_URL, EXCLUDED_WALLET_COMMENT, TITLE, TOKEN_URL } from "../constants";
import { leaderboard } from "../constants/types";
import { useLeaderBoards } from "../hooks/useInfo";
import { getCupComment, getCupImageUrl, getShortEndedAddress } from "../utils";
import { Loading } from "./Loading";

interface BoardProps {
    luffyPrice: Number,
}

export const LeaderBoard: React.FC<BoardProps> = ({ luffyPrice }) => {
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(20);
    const [pageCount, setPageCount] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const leaderboards = useLeaderBoards(page, count);
    const [boardList, setBoardList] = useState(new Array<leaderboard>());
    const [loading, setLoading] = useState(true);

    const [tooltipIdx, setTooltipIdx] = useState(999);

    useEffect(() => {
        if (leaderboards) {
            const boardList = JSON.parse(leaderboards);
            setTotalCount(Number(boardList.total));
            setBoardList(boardList.records);
            setPageCount(Math.ceil(Number(boardList.total) / count));
            setLoading(false);
        }

        document.title = `Top Burners | ${TITLE}`;
    }, [leaderboards])

    const handlePageClick = (selectedItem: { selected: number; }) => {
        setBoardList(new Array<leaderboard>());
        setPage(selectedItem.selected + 1);
        setLoading(true);
    };

    const showTooltip = (idx: number) => {
        setTooltipIdx(idx);
        setTimeout(()=>{
            setTooltipIdx(999);
        }, 2000);
    }
    return (
        <Container className="component rounded-4 mt-5">
            <div className="p-4 border-bottom">
                <h4 className="mt-2 mb-0">Top Burners</h4>
            </div>
            <div className="p-4">
                <div className="w-100 position-relative" style={{minHeight:"150px"}}>
                    {loading && <Loading />}
                    <table className="w-100 normal-table">
                        <thead>
                            <tr className="text">
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
                        <tbody>
                            {(!loading && boardList.length === 0) && <tr><td colSpan={4} className="text-center py-5">No record</td></tr>}
                            {boardList.map((el, idx) => {
                                if (el) {
                                    return (
                                        <tr className={idx > 0 ? "border-top label" : "label"} key={idx} title={el.excluded ? EXCLUDED_WALLET_COMMENT : (el.rank?getCupComment(el.rank):"")}>
                                            <td className="table-cell">
                                                {(page - 1) * count + idx + 1} {el.excluded?(<span className="tooltip-container"><img src={EXCLUDED_ICON_URL} alt="excluded" width={15} />{tooltipIdx === idx && <span className="tooltip-content">{EXCLUDED_WALLET_COMMENT}</span>}</span>):(el.rank && (<img src={getCupImageUrl(el.rank)} width={15} alt="cup" />))} 
                                            </td>
                                            <td className="table-cell">
                                                <a target="_blank" href={TOKEN_URL.ETH.concat(el.wallet)}>
                                                    {getShortEndedAddress(el.wallet, 15)}
                                                </a>
                                            </td>
                                            <td>
                                                {Number(el.total_burn_amount_current_month).toLocaleString("en-US")} (${(Number(el.total_burn_amount_current_month) * Number(luffyPrice)).toLocaleString("en-US")})
                                            </td>
                                            <td>
                                                {Number(el.total_burn_amount).toLocaleString("en-US")} (${(Number(el.total_burn_amount) * Number(luffyPrice)).toLocaleString("en-US")})
                                            </td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                    <div className="mobile-table label small-text">
                        {(!loading && boardList.length === 0) && <div className="text-center py-5">No record</div>}
                        {boardList.map((el, idx) => {
                            return (
                                <div className={(idx > 0 ? "border-top py-3" : "pb-3")} key={idx}>
                                    <div className="d-flex justify-content-between">
                                        <div>
                                            Rank
                                        </div>
                                        <div>
                                            {(page - 1) * count + idx + 1} {
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