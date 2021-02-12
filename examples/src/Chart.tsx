import React, { useRef, useEffect } from "react";
import { Chart as ChartJS } from "chart.js";

interface ChartProps {
    initialValue: number;
    data: number[];
}

function fixedLengthDataset(dataset: number[], length = 100): number[] {
    const newDataset: number[] = [];
    const startAt = Math.max(0, dataset.length - length - 1);

    for (let i = 0; i < length; i++) {
        const currentAt = startAt + i;

        newDataset.push(currentAt >= dataset.length ? NaN : dataset[currentAt]);
    }

    return newDataset;
}

export const Chart: React.FC<ChartProps> = ({ initialValue, data }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(() => {
        if (canvasRef.current && !chartRef.current) {
            chartRef.current = new ChartJS(canvasRef.current, {
                type: "line",
                data: {
                    datasets: [
                        {
                            data: fixedLengthDataset(data).map((value, i) => ({
                                x: i,
                                y: value,
                            })),
                            type: "line",
                            borderColor:
                                data[data.length - 1] < initialValue
                                    ? "rgb(250, 5, 0)"
                                    : "rgb(0, 250, 5)",
                            fill: false,
                            pointRadius: 0,
                        },
                    ],
                },
                options: {
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [
                            {
                                type: "linear",
                                gridLines: {
                                    display: false,
                                },
                                ticks: {
                                    display: false,
                                },
                            },
                        ],
                        yAxes: [
                            {
                                gridLines: {
                                    display: false,
                                },
                                ticks: {
                                    display: false,
                                },
                            },
                        ],
                    },
                },
            });
        }
    });

    useEffect(() => {
        const { current: chart } = chartRef;

        if (chart) {
            if (chart.data.datasets) {
                chart.data.datasets[0].data = fixedLengthDataset(data)
                    .map((value, i) => ({
                        x: i,
                        y: value,
                    }));

                chart.data.datasets[0].borderColor = data[data.length - 1] < initialValue
                    ? "rgb(255, 80, 0)"
                    : "rgb(0, 250, 5)";
            }

            chart.update();
        }
    }, [data]);

    return (
        <div>
            <canvas
                ref={ canvasRef }
            />
        </div>
    );
};
