import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.scss';
import { Buy2Burn } from './components/Buy2Burn';
import { BurnAddresses } from './components/BurnAddresses';
import { Detail } from './components/Detail';
import { Header } from './components/Header';
import { Home } from './components/Home';
import { LeaderBoard } from './components/LeaderBoard';
import { Transactions } from './components/Transactions';
import { useDashBoardInfo } from './hooks/useInfo';

function App() {
  const [pathName, setPathName] = useState(document.location.pathname);
  const [luffyPrice, setLuffyPrice] = useState("0");
  const [luffyPriceChange, setLuffyPriceChange] = useState(0);

  const [totalMarketCap, setTotalMarketCap] = useState("0");
  const [totalMarketCapChange, setTotalMarketCapChange] = useState(0);

  const [circMarketCap, setCircMarketCap] = useState("0");
  const [circMarketCapChange, setCircMarketCapChange] = useState(0);

  const [volume, setVolume] = useState("0");
  const [volumeChange, setVolumeChange] = useState(0);

  const [totalBurn, setTotalBurn] = useState("0");
  const [totalSupply, setTotalSupply] = useState("0");
  const [circSupply, setCircSupply] = useState("0");
  const [lastBurn, setLastBurn] = useState("0");
  const [stakedSupply, setStakedSupply] = useState("0");
  const [burnRate, setBurnRate] = useState(0);

  const [burns, setBurns] = useState("");
  const [leaderboards, setLeaderBoards] = useState("");

  const dashboardInfo = useDashBoardInfo(pathName === "/");

  const [buy2Burn, setBuy2Burn] = useState("");

  useEffect(() => {
    if (dashboardInfo) {
      const info = JSON.parse(dashboardInfo);
      if (info.latest) {
        setLuffyPrice(info.latest.price_usd);
        setLuffyPriceChange((Number(info.latest.price_usd) / Number(info['24_hours_old'].price_usd) * 100 - 100));

        setVolume(Number(info.latest.volume_usd).toLocaleString("en-US"));
        setVolumeChange((Number(info.latest.volume_usd) / Number(info['24_hours_old'].volume_usd) * 100 - 100));

        setTotalBurn(Number(info.latest.burned).toLocaleString("en-US"));

        setTotalSupply(Number(info.supply).toLocaleString("en-US"));
        setCircSupply((Number(info.supply) - Number(info.latest.burned)).toLocaleString("en-US"));

        const lastCircMarketCap = (Number(info.supply) - Number(info.latest.burned)) * Number(info.latest.price_usd);
        setCircMarketCap(lastCircMarketCap.toLocaleString("en-US"));

        const oldCircMarketCap = (Number(info.supply) - Number(info['24_hours_old'].burned)) * Number(info['24_hours_old'].price_usd);
        setCircMarketCapChange((lastCircMarketCap/oldCircMarketCap*100 - 100));

        const lastTotalMarketCap = Number(info.supply) * Number(info.latest.price_usd);
        setTotalMarketCap(lastTotalMarketCap.toLocaleString("en-US"));
        const oldTotalMarketCap = Number(info.supply) * Number(info['24_hours_old'].price_usd);
        setTotalMarketCapChange((lastTotalMarketCap/oldTotalMarketCap*100-100));

        setLastBurn((Number(info.latest.burned) - Number(info['24_hours_old'].burned)).toLocaleString("en-US"));
        setStakedSupply(Number(info.latest.staked).toLocaleString("en-US"));
        setBurnRate(Number(info.latest.burned) / Number(info.supply) * 100);

        if(info.burns) {
          setBurns(JSON.stringify(info.burns));
        }

        if(info.leaderboard) {
          setLeaderBoards(JSON.stringify(info.leaderboard));
        }

        if(info["buy2burn"]) {
          setBuy2Burn(JSON.stringify(info["buy2burn"]));
        }
      }
    }
  }, [dashboardInfo])
  return (
    <BrowserRouter>
      <Header luffyPrice={luffyPrice} changes={[luffyPriceChange, totalMarketCapChange, circMarketCapChange, volumeChange]} marketCap={[totalMarketCap, circMarketCap]} volume={volume} setPath={setPathName}/>
      <Routes>
        <Route path="/" element={<Home totalBurn={totalBurn} totalSupply={totalSupply} circSupply={circSupply} lastBurn={lastBurn} stakedSupply={stakedSupply} burnRate={burnRate} luffyPrice={Number(luffyPrice)} buy2Burn={buy2Burn} burns={burns} leaderboards={leaderboards} />} />
        <Route path="/transactions">
          <Route path=":txId" element={<Detail />} />
          <Route path="" element={<Transactions />} />
        </Route>
        <Route path="/leaderboards" element={<LeaderBoard luffyPrice={Number(luffyPrice)} />} />
        <Route path="/burnaddresses" element={<BurnAddresses info={dashboardInfo} />} />
        <Route path="/buy2burns" element={<Buy2Burn luffyPrice={Number(luffyPrice)} />} />
        <Route path="*" element={<Home totalBurn={totalBurn} totalSupply={totalSupply} circSupply={circSupply} lastBurn={lastBurn} stakedSupply={stakedSupply} burnRate={burnRate} luffyPrice={Number(luffyPrice)} buy2Burn={buy2Burn} burns={burns} leaderboards={leaderboards} />} />
      </Routes >
    </BrowserRouter>
  );
}

export default App;
