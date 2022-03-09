import { View } from "react-native";
import React, { ReactElement } from "react";
import Text from "../text/text";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BoardState, BoardResult } from "@utils";
import BoardLine from "./board-line";
import styles from "./board.styles";

type BoardProps = {
    state: BoardState;
    size: number;
    onCellPressed?: (index: number) => void;
    disabled?: boolean;
    gameResult?: BoardResult | false;
};

export default function Board({
    state,
    size,
    onCellPressed,
    disabled,
    gameResult
}: BoardProps): ReactElement {
    return (
        <View
            style={[
                styles.board,
                {
                    width: size,
                    height: size
                }
            ]}
        >
            {state.map((cell, index) => {
                return (
                    <TouchableOpacity
                        disabled={cell != null || disabled}
                        onPress={() => onCellPressed && onCellPressed(index)}
                        style={[
                            styles.cell,
                            styles[`cell${index}` as "cell"],
                            { width: size / 3, height: size / 3 }
                        ]}
                        key={index}
                    >
                        <Text style={[styles.cellText, { fontSize: size / 7 }]}>{cell}</Text>
                    </TouchableOpacity>
                );
            })}
            {gameResult && <BoardLine size={size} gameResult={gameResult} />}
        </View>
    );
}
