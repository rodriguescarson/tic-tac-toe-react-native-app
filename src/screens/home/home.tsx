import { View, Text, Button } from "react-native";
import React, { ReactElement } from "react";
import styles from "./home.styles";
import { StackNavigationProp } from "@react-navigation/stack";
import { StackNavigatorParams } from "@config/navigator";
type HomeProps = {
    navigation: StackNavigationProp<StackNavigatorParams, "Home">;
};
export default function Home({ navigation }: HomeProps): ReactElement {
    return (
        <View style={styles.container}>
            <Text>home</Text>
            <Button
                title="Game"
                onPress={() => {
                    navigation.navigate("Game", { gameId: "3" });
                }}
            />
        </View>
    );
}
