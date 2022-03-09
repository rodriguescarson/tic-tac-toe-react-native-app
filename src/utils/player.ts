import { BoardState } from "./types";
import { isTerminal, getAvailableMoves } from "./board";
export const getBestMove = (
    state: BoardState,
    maximizing: boolean,
    depth = 0,
    maxDepth = -1
): number => {
    const childValues: { [key: string]: string } = {};

    const getBestMoveRecursive = (
        state: BoardState,
        maximizing: boolean,
        depth = 0,
        maxDepth = -1
    ): number => {
        const terminalObject = isTerminal(state);
        if (terminalObject || depth === maxDepth) {
            if (terminalObject && terminalObject.winner === "x") {
                return 100 - depth;
            } else if (terminalObject && terminalObject.winner === "o") {
                return -100 + depth;
            } else {
                return 0;
            }
        }
        if (maximizing) {
            let best = -100;
            getAvailableMoves(state).forEach(index => {
                const child: BoardState = [...state];
                child[index] = "x";
                //                console.log(`child board (x turn) (depth:${depth}) `);
                //printFormattedBoard(child);
                const childValue = getBestMoveRecursive(child, false, depth + 1, maxDepth);
                //              console.log("Childvalue", childValue);
                best = Math.max(best, childValue);
                if (depth === 0) {
                    childValues[childValue] = childValues[childValue]
                        ? `${childValues[childValue]},${index} `
                        : `${index}`;
                }
            });
            // console.log("Best", best);
            // console.log("Childvalues", childValues);
            if (depth === 0) {
                const arr = childValues[best].split(",");
                const rand = Math.floor(Math.random() * arr.length);
                return parseInt(arr[rand]);
            }
            return best;
        } else {
            let best = 100;
            getAvailableMoves(state).forEach(index => {
                const child: BoardState = [...state];
                child[index] = "o";
                //                console.log(`child board (o turn) (depth:${depth}) `);
                //printFormattedBoard(child);
                const childValue = getBestMoveRecursive(child, true, depth + 1, maxDepth);
                if (depth === 0) {
                    childValues[childValue] = childValues[childValue]
                        ? `${childValues[childValue]},${index} `
                        : `${index}`;
                }
                //              console.log("Childvalue", childValue);
                best = Math.min(best, childValue);
            });
            //        console.log("Best", best);
            //      console.log("Childvalues", childValues);
            if (depth === 0) {
                const arr = childValues[best].split(",");
                const rand = Math.floor(Math.random() * arr.length);
                return parseInt(arr[rand]);
            }
            return best;
        }
    };
    return getBestMoveRecursive(state, maximizing, depth, maxDepth);
};
