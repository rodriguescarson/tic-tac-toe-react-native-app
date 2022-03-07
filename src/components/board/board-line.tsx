import { View, Text, StyleSheet, Animated } from "react-native";
import React, { ReactElement, useEffect, useRef } from "react";
import { BoardResult } from "@utils";

const style = StyleSheet.create({
    line: {
        position: "absolute",
        borderStartColor: "#f03"
    },
    vline: {
        width: 2
    },

    hline: { height: 2 },
    dline: { width: 2, height: "100%", top: 0, left: "50%" }
});

type BoardLineProps = {
    size: number;
    gameResult: BoardResult | false;
};
export default function BoardLine({ size, gameResult }: BoardLineProps): ReactElement {
    const diagonalHeight = Math.sqrt(Math.pow(size, 2) + Math.pow(size, 2));

    const animationRef = useRef<Animated.Value>(new Animated.Value(0));
    useEffect(() => {
        Animated.timing(animationRef.current, {
            toValue: 1,
            duration: 700,
            useNativeDriver: false
        }).start();
    }, []);

    return (
        <>
            {gameResult && gameResult.column && gameResult.direction === "V" && (
                <Animated.View
                    style={[
                        style.line,
                        style.vline,
                        {
                            left: `${33.3333 * gameResult.column - 16.6666}`,
                            height: animationRef.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "100%"]
                            })
                        }
                    ]}
                ></Animated.View>
            )}
            {gameResult && gameResult.row && gameResult.direction === "H" && (
                <Animated.View
                    style={[
                        style.line,
                        style.hline,
                        {
                            top: `${33.3333 * gameResult.row - 16.6666}`,
                            width: animationRef.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: ["0%", "100%"]
                            })
                        }
                    ]}
                ></Animated.View>
            )}
            {gameResult && gameResult.diagonal && gameResult.direction === "D" && (
                <Animated.View
                    style={[
                        style.line,
                        style.dline,
                        {
                            height: animationRef.current.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, diagonalHeight]
                            }),
                            transform: [
                                { rotateZ: gameResult.diagonal === "MAIN" ? "-45deg" : "45deg" },
                                {
                                    translateY: animationRef.current.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [size / 2, -(diagonalHeight - size) / 2]
                                    })
                                }
                            ]
                        }
                    ]}
                ></Animated.View>
            )}
        </>
    );
}