import axios from "axios";
import { useMemo, useState } from "react";
import { API_BUY2BURN, API_FOR_DASHBOARD, API_FOR_LEADERBOARD, API_FOR_LIST } from "../constants";

export const useDashBoardInfo = (withParam: boolean) => {
  const [info, setInfo] = useState('');
  useMemo(async ()=>{
    if(withParam) {
      const res = await axios.get(API_FOR_DASHBOARD, {
        params: {
          extended: 1,
          count: 20
        },
      });
      setInfo(JSON.stringify(res.data))
    } else {
      const res = await axios.get(API_FOR_DASHBOARD);
      setInfo(JSON.stringify(res.data))
    }
  },[withParam])

  return useMemo(()=>{
    return info;
  },[info])
}

export const useBurnTransactions = (page: number, count: number) => {
  const [info, setInfo] = useState('');
  useMemo(async ()=>{
    const res = await axios.get(API_FOR_LIST, {
      params: {
        page: page,
        count: count
      },
    });
    setInfo(JSON.stringify(res.data))
  },[setInfo, page, count])

  return useMemo(()=>{
    return info;
  },[info])
}

export const useLeaderBoards = (page: number, count: number) => {
  const [info, setInfo] = useState('');
  useMemo(async ()=>{
    const res = await axios.get(API_FOR_LEADERBOARD, {
      params: {
        page: page,
        count: count
      },
    });
    setInfo(JSON.stringify(res.data))
  },[setInfo, page, count])

  return useMemo(()=>{
    return info;
  },[info])
}

export const useBuy2Burns = (page: number, count: number) => {
  const [info, setInfo] = useState('');
  useMemo(async ()=>{
    const res = await axios.get(API_BUY2BURN, {
      params: {
        page: page,
        count: count
      },
    });
    setInfo(JSON.stringify(res.data))
  },[setInfo, page, count])

  return useMemo(()=>{
    return info;
  },[info])
}