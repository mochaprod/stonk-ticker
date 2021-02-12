import React, { useState, useEffect } from "react";
import clsx from "clsx";
import random from "random";

import Ticker from "../../src/Ticker";
import { Chart } from "./Chart";

import { toMoneyString } from "../../src/money";

import styles from "./App.mod.scss";

interface StonkPrice {
    movement: "up" | "down" | "none";
    value: number;
}

const App: React.FC = () => {
    const [stockMode, setStockMode] = useState<boolean>(false);
    const [priceHistory, setPriceHistory] = useState<number[]>([0]);
    const [price, setPrice] = useState<StonkPrice>({
        movement: "up",
        value: 0,
    });

    const bankruptcy = () => {
        setStockMode(false);
        setPrice({
            value: 0,
            movement: "none",
        });
    };

    const tslaCalls = () => {
        setPrice(({ value: prev }) => ({
            value: prev + Math.random() * 1000 + 99999,
            movement: "up",
        }));
    };

    useEffect(() => {
        let timeout: number;

        if (stockMode) {
            const shuffle = () => {
                setPrice(({ value: prev }) => {
                    const priceChangeInterval = 0;
                    const sd = prev * 0.005;

                    // Slightly more inclined to go up like STONKS
                    const stockNextTick = random.normal(
                        priceChangeInterval,
                        sd,
                    );
                    const nextValue = prev + stockNextTick();
                    const movement = nextValue > prev ? "up" : "down";

                    return {
                        value: nextValue,
                        movement,
                    };
                });

                if (stockMode) {
                    timeout = window.setTimeout(shuffle, 1000);
                }
            };

            shuffle();
        }

        return () => {
            if (timeout) {
                window.clearTimeout(timeout);
            }
        };
    }, [stockMode]);

    useEffect(() => {
        if (stockMode) {
            setPriceHistory([price.value]);
        }
    }, [stockMode]);

    useEffect(() => {
        setPriceHistory((prev) => [...prev, price.value]);
    }, [price]);

    useEffect(() => {
        if (!document) {
            return;
        }

        const { body } = document;

        if (stockMode) {
            body.classList.add("stonks");
        } else {
            body.classList.remove("stonks");
        }
    }, [stockMode]);

    return (
        <main
            className={ clsx(
                styles.app,
                stockMode && styles.stonks,
            ) }
        >
            { price.value > 100000000000 && (
                <div
                    className={ styles.bezos }
                >
                    Bezos, is that you?
                </div>
            ) }
            <div
                className={ styles.controls }
            >
                <button
                    className={ styles.bear }
                    onClick={ () => {
                        setPrice({
                            value: Math.floor(Math.random() * 1000),
                            movement: "none",
                        });
                    } }
                >
                    Random Value
                </button>
                <button
                    className={ styles.stonks }
                    onClick={ () => {
                        setPrice(({ value: prev }) => ({
                            value: prev * 2,
                            movement: "up",
                        }));
                    } }
                >
                    🚀
                </button>
                <button
                    className={ styles.bull }
                    onClick={ () => setStockMode(!stockMode) }
                >
                    { stockMode ? "Automatic" : "Manual" }
                </button>
                <button
                    className={ styles.stonks }
                    onClick={ tslaCalls }
                >
                    📈
                </button>
                <button
                    className={ styles.bear }
                    onClick={ bankruptcy }
                >
                    Buy $LK
                </button>
            </div>
            <div
                className={ styles.ticker }
            >
                <Ticker
                    value={ toMoneyString(price.value) }
                    direction={ price.movement === "none" ? "up" : price.movement }
                    colors={ ["var(--g)", "var(--r)"] }
                />
            </div>
            <div>
                <Chart
                    initialValue={ priceHistory[0] || 0 }
                    data={ priceHistory }
                />
            </div>
        </main>
    );
};

export default App;
