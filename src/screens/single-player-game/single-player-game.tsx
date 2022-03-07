import { SafeAreaView } from "react-native";
import React, { ReactElement, useEffect, useState, useRef } from "react";
import styles from "./single-player-game.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
import { GradientBackground, Board } from "@components";
import { BoardState, isEmpty, isTerminal, getBestMove, Cell, useSounds } from "@utils";

type SinglePlayerGameProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};
export default function SinglePlayerGame({ navigation }: SinglePlayerGameProps): ReactElement {
    //prettier-ignore
    const [state, setState] = useState<BoardState>([
        null,null,null,
        null,null,null,
        null,null,null
    ]);
    const [turn, setTurn] = useState<"HUMAN" | "BOT">(Math.random() < 0.5 ? "HUMAN" : "BOT");
    const [isHumanMaximizing, setIsHumanMaximizing] = useState<boolean>(true);
    const gameResult = isTerminal(state);
    const playSound = useSounds();

    // //prettier-ignore
    // const b: BoardState = ["o", "o", "o", "o", "o", null, "x", "x", "o"];

    const handleOnCellPressed = (cell: number): void => {
        if (turn != "HUMAN") return;

        insertCell(cell, isHumanMaximizing ? "x" : "o");
        setTurn("BOT");
    };

    const insertCell = (cell: number, symbol: "x" | "o"): void => {
        const stateCopy: BoardState = [...state];
        if (stateCopy[cell] || isTerminal(stateCopy)) return;
        stateCopy[cell] = symbol;
        setState(stateCopy);
        try {
            symbol === "x" ? playSound("pop1") : playSound("pop2");
        } catch (e) {
            console.log(e);
        }
    };

    const getWinner = (winnerSymbol: Cell): "HUMAN" | "BOT" | "DRAW" => {
        if (winnerSymbol === "x") {
            return isHumanMaximizing ? "HUMAN" : "BOT";
        }
        if (winnerSymbol === "o") {
            return isHumanMaximizing ? "HUMAN" : "BOT";
        }
        return "DRAW";
    };

    useEffect(() => {
        if (gameResult) {
            //hanlde game finished
            const winner = getWinner(gameResult.winner);
            if (winner === "HUMAN") {
                playSound("win");
                alert("You Won");
            }
            if (winner === "BOT") {
                playSound("loss");

                alert("You Lost!");
            }
            if (winner === "DRAW") {
                playSound("draw");
                alert("It is a Draw!");
            }
        }
        if (turn === "BOT") {
            if (isEmpty(state)) {
                const centerAndCorners = [0, 2, 6, 8, 4];
                const firstMove =
                    centerAndCorners[Math.floor(Math.random() * centerAndCorners.length)];
                insertCell(firstMove, "x");
                setIsHumanMaximizing(false);
                setTurn("HUMAN");
            } else {
                const best = getBestMove(state, !isHumanMaximizing, 0, -1);
                insertCell(best, isHumanMaximizing ? "o" : "x");
                setTurn("HUMAN");
            }
        }
    }, [state, turn]);
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <Board
                    disabled={Boolean(isTerminal(state) || turn != "HUMAN")}
                    onCellPressed={cell => {
                        handleOnCellPressed(cell);
                    }}
                    state={state}
                    size={300}
                />
            </SafeAreaView>
        </GradientBackground>
    );
}
