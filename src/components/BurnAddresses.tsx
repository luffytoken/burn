import { useEffect, useState } from "react";
import { Container } from "react-bootstrap"
import { BURN_ADDRESSES, TITLE, TOKEN_URL } from "../constants"

interface BurnAddressesProp {
    info: string
}
export const BurnAddresses:React.FC<BurnAddressesProp> = ({info}) => {
    const [burnAmount1, setBurnAmount1] = useState("0");
    const [burnAmount2, setBurnAmount2] = useState("0");
    const [burnAmount3, setBurnAmount3] = useState("0");

    const [changes1, setChanges1] = useState(0);
    const [changes2, setChanges2] = useState(0);
    const [changes3, setChanges3] = useState(0);

    useEffect(()=>{
        if(info) {
            const parsed = JSON.parse(info);
            const price = Number(parsed.latest.price_usd);

            setBurnAmount1((Number(parsed.latest["burned_1"].burned)*price).toLocaleString("en-US"));
            setBurnAmount2((Number(parsed.latest["burned_2"].burned)*price).toLocaleString("en-US"));
            setBurnAmount3((Number(parsed.latest["burned_3"].burned)*price).toLocaleString("en-US"));

            if(Number(parsed["24_hours_old"]["burned_1"].burned)>0) {
                setChanges1(Number(parsed.latest["burned_1"].burned)/Number(parsed["24_hours_old"]["burned_1"].burned)*100-100);
            }
            if(Number(parsed["24_hours_old"]["burned_2"].burned)>0) {
                setChanges2(Number(parsed.latest["burned_2"].burned)/Number(parsed["24_hours_old"]["burned_2"].burned)*100-100);
            }
            if(Number(parsed["24_hours_old"]["burned_3"].burned)>0) {
                setChanges3(Number(parsed.latest["burned_3"].burned)/Number(parsed["24_hours_old"]["burned_3"].burned)*100-100);
            }
        }
        document.title = `Burn Addresses | ${TITLE}`;
    }, [info])

    return (
        <Container className="component rounded-4 mt-5">
            <div className="p-4 border-bottom">
                <h4 className="mt-2 mb-0">Burn Addresses</h4>
            </div>
            <div className="p-4 label mt-5 burn-addresses">
                <div>
                    There are 3 special null addresses that are currently being used to burn $Luffy tokens, they are part of Ethereum and are used for other tokens as well.
                </div>
                <div className="mt-5">
                    <div>
                        <b>Burn Address 1 (BA-1):</b>
                    </div>
                    <div className="text-break">                        
                        <a target="_blank" href={TOKEN_URL.ETH.concat(BURN_ADDRESSES[0].address)}>
                            {BURN_ADDRESSES[0].address}
                        </a>
                    </div>
                    <div>
                        This address is used to burn ${burnAmount1} <span className={changes1>0?"text-success":"text-danger"}>({changes1 > 0 && "+"}{changes1}%)</span> in $Luffy Tokens.
                    </div>
                </div>
                <div className="mt-5">
                    <div>
                        <b>Burn Address 2 (BA-2):</b>
                    </div>
                    <div className="text-break">                        
                        <a target="_blank" href={TOKEN_URL.ETH.concat(BURN_ADDRESSES[1].address)}>
                            {BURN_ADDRESSES[1].address}
                        </a>
                    </div>
                    <div>
                        This address is used to burn ${burnAmount2} <span className={changes2>0?"text-success":"text-danger"}>({changes2 > 0 && "+"}{changes2.toLocaleString("en-US", {maximumFractionDigits:6})}%)</span> in $Luffy Tokens.
                    </div>
                </div>
                <div className="mt-5 mb-5">
                    <div>
                        <b>Burn Address 3 (BA-3):</b>
                    </div>
                    <div className="text-break">                        
                        <a target="_blank" href={TOKEN_URL.ETH.concat(BURN_ADDRESSES[2].address)}>
                            {BURN_ADDRESSES[2].address}
                        </a>
                    </div>
                    <div>
                        This address is used to burn ${burnAmount3} <span className={changes3>0?"text-success":"text-danger"}>({changes3 > 0 && "+"}{changes3.toLocaleString("en-US", {maximumFractionDigits:6})}%)</span> in $Luffy Tokens.
                    </div>
                </div>
            </div>
        </Container>
    )
}