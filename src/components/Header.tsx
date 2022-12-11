import { useEffect, useState } from "react";
import { Container } from "react-bootstrap"
import { Link, useLocation } from "react-router-dom";

interface HeaderInfo {
    luffyPrice: string,
    changes: Array<number>,
    marketCap: Array<string>,
    volume: string,
    setPath: (path:string)=>void;
}

export const Header:React.FC<HeaderInfo> = ({luffyPrice, changes, marketCap, volume, setPath}) => {
    const location = useLocation();
    
    const [capType, setCapType] = useState(0)

    useEffect(()=>{
        if(location.pathname === "/")
            setPath(location.pathname);
    }, [location])

    return (
        <div className="w-100 header">
            <Container>
                <div className="d-flex flex-wrap justify-content-between align-items-center py-3">
                    <div className="logo">
                        <Link to="/">
                            <img src="/logo.png" width={70} alt="logo" />
                            luffy <span>burn</span>
                        </Link>
                    </div>
                    <div className="d-flex justify-content-start info flex-wrap normal-table">
                        <div>
                            <span className="label">Luffy Price</span>
                            <span className="text">
                                ${luffyPrice}
                                <label className={(changes[0]>=0?"text-success":"text-danger").concat(" small-text")}>
                                    ({changes[0]>0 && "+"}{changes[0].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                </label>
                            </span>
                        </div>
                        {
                            capType === 0 &&
                                <div role="button" onClick={()=>setCapType((capType+1)%2)} title="Click to switch">
                                    <span className="label">Market Cap</span>
                                    <span className="text">
                                        ${marketCap[0]}
                                        <label className={(changes[1]>=0?"text-success":"text-danger").concat(" small-text")}>
                                            ({changes[1]>0 && "+"}{changes[1].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                        </label>
                                    </span>
                                </div>      
                        }    
                        {
                            capType === 1 &&               
                                <div role="button" onClick={()=>setCapType((capType+1)%2)} title="Click to switch back">
                                    <span className="label">Circulating Market Cap</span>
                                    <span className="text">
                                        ${marketCap[1]}                                        
                                        <label className={(changes[2]>=0?"text-success":"text-danger").concat(" small-text")}>
                                            ({changes[2]>0 && "+"}{changes[2].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                        </label>
                                    </span>
                                </div>
                        }
                        <div>
                            <span className="label">Volume</span>
                            <span className="text">
                                ${volume}                                
                                <label className={(changes[3]>=0?"text-success":"text-danger").concat(" small-text")}>
                                    ({changes[3]>0 && "+"}{changes[3].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                </label>
                            </span>
                        </div>
                    </div>
                    <table className="mobile-table info">
                        <tbody>
                        <tr>
                            <td className="label">Luffy Price</td>
                            <td className="text">
                                ${luffyPrice}
                                <label className={(changes[0]>=0?"text-success":"text-danger").concat(" small-text")}>
                                    ({changes[0]>0 && "+"}{changes[0].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                </label>
                            </td>
                        </tr>
                        {
                            capType === 0 &&
                                <tr role="button" onClick={()=>setCapType((capType+1)%2)} title="Click to switch">
                                    <td className="label pe-1">Market Cap</td>
                                    <td className="text">
                                        ${marketCap[0]}
                                        <label className={(changes[1]>=0?"text-success":"text-danger").concat(" small-text")}>
                                            ({changes[1]>0 && "+"}{changes[1].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                        </label>
                                    </td>
                                </tr>      
                        }    
                        {
                            capType === 1 &&               
                                <tr role="button" onClick={()=>setCapType((capType+1)%2)} title="Click to switch back">
                                    <td className="label pe-1">Circulating Market Cap</td>
                                    <td className="text">
                                        ${marketCap[1]}                                        
                                        <label className={(changes[2]>=0?"text-success":"text-danger").concat(" small-text")}>
                                            ({changes[2]>0 && "+"}{changes[2].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                        </label>
                                    </td>
                                </tr>
                        }
                        <tr>
                            <td className="label">Volume</td>
                            <td className="text">
                                ${volume}                                
                                <label className={(changes[3]>=0?"text-success":"text-danger").concat(" small-text")}>
                                    ({changes[3]>0 && "+"}{changes[3].toLocaleString("en-Us", { maximumFractionDigits: 1 })}%)
                                </label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Container>
        </div>
    )
}