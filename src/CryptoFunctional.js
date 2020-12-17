import React, { useState, useEffect } from 'react';
import './CryptoFunctional.css';

import axios from 'axios';
import CryptoList from './CryptoList'; 

const CryptoFunctional = (props) => {

    const [cryptoList, filteredCryptoList] = useState([]);

    useEffect(() => {
        let timerID = setInterval(() => getCryptoData(), 5000);

        return(() => {
            clearInterval(this.timerID);
        })
    },[cryptoList, filteredCryptoList]);

    getCryptoData = () => {
        axios.get('https://blockchain.info/pl/ticker')
            .then(res => {
                const tickers = res.data;

                setState((state) => {
                    let newCryptoList = [];

                    for (const [ticker, cryptoRate] of Object.entries(tickers)) {
                        let lastCryptoObj = state.cryptoList.find((cryptoObj) => {
                            return(cryptoObj.currency === ticker);
                        })

                        let newCryptoObj = {
                            currency: ticker,
                            symbol: cryptoRate.symbol,
                            buy: cryptoRate.buy,
                            sell: cryptoRate.sell,
                            lastRate: cryptoRate.last,
                       } 

                       if (lastCryptoObj !== undefined) {
                           if (newCryptoObj.lastRate > lastCryptoObj.lastRate) {
                                newCryptoObj.cssClass = 'green';
                                newCryptoObj.htmlArray = String.fromCharCode(8593);
                            } else if (newCryptoObj.lastRate < lastCryptoObj.lastRate) {
                                newCryptoObj.cssClass = 'red';
                                newCryptoObj.htmlArray = String.fromCharCode(8595);
                            } else {
                                newCryptoObj.cssClass = 'blue';
                                newCryptoObj.htmlArray = String.fromCharCode(8596);
                            }

                       } else {
                           newCryptoObj.cssClass = 'blue';
                           newCryptoObj.htmlArray = String.fromCharCode(8596);
                       }

                       newCryptoList.push(newCryptoObj);
                    }

                    return({
                        cryptoList: newCryptoList
                    })

                });

                filterCryptoList();

            });
    }

    filterCryptoList = () => {
        _inputFilter.value = _inputFilter.value.trim().toUpperCase();

        setState((state) => {
            let newFilteredCryptoList = state.cryptoList.filter((cryptoObj) => {
                return(cryptoObj.currency.includes(this._inputFilter.value))
            });

            return({
                filteredCryptoList: newFilteredCryptoList
            });
        });

    }



    return(
        <div className="Crypto">
            <input ref={element => _inputFilter = element} onChange={filterCryptoList}
            type="text" placeholder="Filter"/>
           <CryptoList cryptoList={state.filteredCryptoList} />
        </div>
    );
}

export default CryptoFunctional;