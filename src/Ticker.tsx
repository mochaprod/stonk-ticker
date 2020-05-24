import React, { CSSProperties } from "react";

import Rollup from "./Rollup";

interface TickerProps {
    value: string | number;
    direction?: "up" | "down";
    speed?: number;
    dictionary?: string[];
    constantKeys?: string[];
    colors?: string[];
}

const Ticker: React.FC<TickerProps> = ({
    value: valueFromProps,
    direction,
    speed,
    constantKeys,
    dictionary,
    colors,
}) => {
    const value = valueFromProps
        .toString()
        .split("");

    const characterDictionary = dictionary || "0123456789$-.,".split("");
    const constants = constantKeys || ["-", "$"];

    const transitionColors = colors || [];

    const tickerStyle: React.CSSProperties = {
        display: "flex",
        overflow: "hidden",
    };

    return (
        <div
            style={ tickerStyle }
        >
            { value.map((character, i) => {
                const placeRespectiveKey = value.length - i - 1;
                const constantIndex = constants
                    .findIndex((constant) => constant === character);

                const key = constantIndex >= 0
                    ? `${character}-${constantIndex}`
                    : placeRespectiveKey;

                return (
                    <div
                        key={ key }
                    >
                        <Rollup
                            direction={ direction }
                            value={ character }
                            speed={ speed || 500 }
                            dictionary={ characterDictionary }
                            transitionColors={ transitionColors }
                        />
                    </div>
                );
            }) }
        </div>
    );
};

export default Ticker;
