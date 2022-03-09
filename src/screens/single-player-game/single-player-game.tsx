import { SafeAreaView, Dimensions, View } from "react-native";
import React, { ReactElement, useEffect, useState } from "react";
import styles from "./single-player-game.styles";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { StackNavigatorParams } from "@config/navigator";
import { GradientBackground, Board, Text, Button } from "@components";
import { BoardState, isEmpty, isTerminal, getBestMove, Cell, useSounds } from "@utils";
import { useSettings, difficulties } from "@contexts/settings-context";
const SCREEN_WIDTH = Dimensions.get("screen").width;
// type SinglePlayerGameProps = {
//     navigation: StackNavigationProp<StackNavigatorParams, "Home">;
// };
// { navigation }: SinglePlayerGameProps
export default function SinglePlayerGame(): ReactElement {
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
    const { settings } = useSettings();
    const [gameCount, setGameCount] = useState({
        wins: 0,
        losses: 0,
        draws: 0
    });
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
            alert(e);
        }
    };

    const getWinner = (winnerSymbol: Cell): "HUMAN" | "BOT" | "DRAW" => {
        if (winnerSymbol === "x") {
            return isHumanMaximizing ? "HUMAN" : "BOT";
        }
        if (winnerSymbol === "o") {
            return isHumanMaximizing ? "BOT" : "HUMAN";
        }
        return "DRAW";
    };

    useEffect(() => {
        if (gameResult) {
            //hanlde game finished
            const winner = getWinner(gameResult.winner);
            if (winner === "HUMAN") {
                playSound("win");
                setGameCount({ ...gameCount, wins: gameCount.wins + 1 });
            }
            if (winner === "BOT") {
                setGameCount({ ...gameCount, losses: gameCount.losses + 1 });
                playSound("loss");
            }
            if (winner === "DRAW") {
                setGameCount({ ...gameCount, draws: gameCount.draws + 1 });
                playSound("draw");
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
                const best = getBestMove(
                    state,
                    !isHumanMaximizing,
                    0,
                    parseInt(settings ? settings?.difficulty : "-1")
                );
                insertCell(best, isHumanMaximizing ? "o" : "x");
                setTurn("HUMAN");
            }
        }
    }, [state, turn]);

    const newGame = () => {
        setState([null, null, null, null, null, null, null, null, null]);
        setTurn(Math.random() < 0.5 ? "HUMAN" : "BOT");
    };
    return (
        <GradientBackground>
            <SafeAreaView style={styles.container}>
                <View>
                    <Text style={styles.difficulty}>
                        Difficulty:{settings ? difficulties[settings.difficulty] : "Impossible"}
                    </Text>
                    <View style={styles.results}>
                        <View style={styles.resultsBox}>
                            <Text style={styles.resultsTitle}>Wins</Text>
                            <Text style={styles.resultsCount}>{gameCount.wins}</Text>
                        </View>
                        <View style={styles.resultsBox}>
                            <Text style={styles.resultsTitle}>Draws</Text>
                            <Text style={styles.resultsCount}>{gameCount.draws}</Text>
                        </View>
                        <View style={styles.resultsBox}>
                            <Text style={styles.resultsTitle}>Losses</Text>
                            <Text style={styles.resultsCount}>{gameCount.losses}</Text>
                        </View>
                    </View>
                </View>
                <Board
                    disabled={Boolean(isTerminal(state) || turn != "HUMAN")}
                    onCellPressed={cell => {
                        handleOnCellPressed(cell);
                    }}
                    state={state}
                    size={SCREEN_WIDTH - 60}
                    gameResult={gameResult}
                />
                {gameResult && (
                    <View style={styles.modal}>
                        <Text style={styles.modalText}>
                            {getWinner(gameResult.winner) === "HUMAN" && "You Won"}
                            {getWinner(gameResult.winner) === "BOT" && "You Lost"}
                            {getWinner(gameResult.winner) === "DRAW" && "It's a Draw"}
                        </Text>
                        <Button onPress={newGame} title="Play Again" />
                    </View>
                )}
            </SafeAreaView>
        </GradientBackground>
    );
}
