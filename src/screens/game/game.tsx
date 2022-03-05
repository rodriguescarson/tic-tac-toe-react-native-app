import { View, Text } from "react-native";
import React, { ReactElement } from "react";
import styles from "./game.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
type GameProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};
export default function Game({ navigation }: GameProps): ReactElement {
    return (
        <View style={styles.container}>
            <Text>Game</Text>
        </View>
    );
}
