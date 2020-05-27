import React, { useRef, useState, useEffect } from "react";

import Rollup from "./Rollup";
import { warnNonProduction, domExists } from "./utils";

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
    const [height, setHeight] = useState<number>(0);
    const rollups = useRef<HTMLDivElement[]>([]);
    const [currentWidths, setCurrentWidths] = useState<number[]>([]);
    const value = valueFromProps
        .toString()
        .split("");

    const characterDictionary = dictionary || "9876543210$-.,".split("");
    const constants = constantKeys || ["-", "$"];

    const transitionColors = colors || [];

    const tickerStyle: React.CSSProperties = {
        display: "flex",
        width: currentWidths.reduce((total, current) => total + current, 0),
        height,
        transition: `width ${speed}ms ease-in-out`,
    };

    useEffect(
        () => {
            rollups.current = rollups.current.slice(0, value.length);
        },
        [valueFromProps],
    );

    useEffect(
        () => {
            if (!domExists()) {
                return;
            }

            // Do this to force an update that reflects the widths of the
            // elements in the `rollups` ref collection.
            setCurrentWidths(rollups.current.map((element) => {
                const { width } = element.getBoundingClientRect();

                return width;
            }));
        },
        [valueFromProps],
    );

    return (
        <div
            style={ tickerStyle }
        >
            { value.map((character, i) => {
                if (!characterDictionary.includes(character)) {
                    warnNonProduction(`Stonk Ticker: '${character}' is not included in the character dictionary.`);
                }

                const constantIndex = constants
                    .findIndex((constant) => constant === character);
                const leftRespectiveKey = `${character}-${constantIndex}`;
                const placeRespectiveKey = value.length - i - 1;

                const key = constantIndex >= 0
                    ? leftRespectiveKey
                    : placeRespectiveKey;

                const reducedWidth = currentWidths.reduce((total, current, index) => {
                    if (index > i - 1) {
                        return total;
                    }

                    return total + (current || 0);
                }, 0);

                const offsettedRollupStyle: React.CSSProperties = {
                    position: "absolute",
                    transform: `translate(${reducedWidth}px, 0px)`,
                    transition: `transform ${speed}ms ease-in-out`,
                };

                const heightSetter = (height: number) => {
                    setHeight((prevHeight) => Math.max(height, prevHeight));
                };

                const widthRef = (r: HTMLDivElement) => {
                    if (!r) {
                        return;
                    }

                    rollups.current[i] = r;
                };

                return (
                    <div
                        key={ key }
                        style={ offsettedRollupStyle }
                    >
                        <Rollup
                            widthRef={ widthRef }
                            setHeight={ heightSetter }
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

Ticker.defaultProps = {
    speed: 500,
};

export default Ticker;
