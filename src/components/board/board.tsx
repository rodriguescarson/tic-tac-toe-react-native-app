import { View } from "react-native";
import React, { ReactElement } from "react";
import Text from "../text/text";
import { TouchableOpacity } from "react-native-gesture-handler";

import { BoardState } from "@utils";

type BoardProps = {
    state: BoardState;
    size: number;
    onCellPressed?: (index: number) => void;
    disabled?: boolean;
};

export default function Board({ state, size, onCellPressed, disabled }: BoardProps): ReactElement {
    return (
        <View
            style={{
                width: size,
                height: size,
                backgroundColor: "green",
                flexDirection: "row",
                flexWrap: "wrap"
            }}
        >
            {state.map((cell, index) => {
                return (
                    <TouchableOpacity
                        disabled={cell != null || disabled}
                        onPress={() => onCellPressed && onCellPressed(index)}
                        style={{
                            width: size / 3,
                            height: size / 3,
                            backgroundColor: "#fff",
                            borderWidth: 1,
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                        key={index}
                    >
                        <Text style={{ fontSize: size / 8 }}>{cell}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}