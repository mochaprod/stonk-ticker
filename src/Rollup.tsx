import React, { useState, useRef, useEffect } from "react";

interface RollupProps {
    value: string;
    direction?: "up" | "down";
    speed: number;
    dictionary: string[];
    transitionColors: string[];
}

const Rollup: React.FC<RollupProps> = ({
    value,
    direction,
    speed,
    dictionary,
    transitionColors,
}) => {
    const visibleValue = useRef<string>(value);
    const valueRef = useRef<HTMLDivElement>(null);
    const [transitioning, setTransitioning] = useState<boolean>(false);
    const [shift, setShift] = useState<number>(0);

    const upColor = transitionColors[0] || "inherit";
    const downColor = transitionColors[1] || "inherit";
    const transitionColor = direction === "down" ? downColor : upColor;

    const containerStyle: React.CSSProperties = {
        position: "relative",
    };

    const valueStyle: React.CSSProperties = {
        opacity: transitioning ? 0 : 1,
    };

    const rollupStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        top: 0,
        color: transitioning ? transitionColor : "inherit",
        opacity: transitioning ? 1 : 0,
        userSelect: "none",
        transition: `transform ${speed}ms ease-in-out`,
    };

    useEffect(
        () => {
            if (transitioning) {
                return;
            }

            const frame = requestAnimationFrame(() => {
                setTransitioning(true);

                setTimeout(() => {
                    setTransitioning(false);
                }, 500);
            });

            return () => cancelAnimationFrame(frame);
        },
        [value],
    );

    useEffect(
        () => {
            if (valueRef && valueRef.current) {
                const { current: element } = valueRef;

                const a = element.getBoundingClientRect().height;
                const rollupMemberLocation = dictionary
                    .findIndex((v) => v === value);

                setShift(rollupMemberLocation * a);
            }
        },
        [value],
    );

    useEffect(
        () => {
            // We store the visible value in a ref to prevent flickering from
            // toggling `opacity` between 0 and 1.
            // This ensures we're always rendering the "previous" value of each
            // at the beginning of the animation.
            visibleValue.current = value;
        },
        [value],
    );

    return (
        <div
            style={ containerStyle }
        >
            <div
                style={ {
                    ...rollupStyle,
                    transform: `translate(0px, -${shift}px)`,
                } }
            >
                { dictionary.map((glyph) => (
                    <div
                        key={ glyph }
                    >
                        { glyph }
                    </div>
                )) }
            </div>
            <div
                ref={ valueRef }
                style={ valueStyle }
            >
                { visibleValue.current }
            </div>
        </div>
    );
};

export default Rollup;
