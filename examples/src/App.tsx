import React, { useState, useEffect } from "react";
import clsx from "clsx";

import Ticker from "../../src/Ticker";

import { toMoneyString } from "../../src/money";

import styles from "./App.mod.scss";

interface StonkPrice {
    movement: "up" | "down" | "none";
    value: number;
}

const App: React.FC = () => {
    const [stockMode, setStockMode] = useState<boolean>(false);
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
                    const priceChangeInterval = prev * 0.005;

                    // Slightly more inclined to go up like STONKS
                    const stockNextTick = Math.round(Math.random() * priceChangeInterval * 100) / 100 - priceChangeInterval / 2.25;
                    const nextValue = prev + stockNextTick;

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
                    onClick={ () => {
                        setPrice(({ value: prev }) => ({
                            value: prev * 2,
                            movement: "up",
                        }));
                    } }
                >
                    Double My Money
                </button>
                <button
                    onClick={ () => setStockMode(!stockMode) }
                >
                    { stockMode ? "Close the exchange!" : "Let the stonks out!" }
                </button>
                <button
                    onClick={ tslaCalls }
                >
                    Buy $TSLA Calls
                </button>
                <button
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
        </main>
    );
};

export default App;
