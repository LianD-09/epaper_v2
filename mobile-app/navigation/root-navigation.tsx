import {
    createNavigationContainerRef,
    StackActions,
    CommonActions
} from "@react-navigation/native";
import { RootStack } from "./param-types";
import { RootTab } from "../screens/Dashboard/dashboard";

export const navigationRef = createNavigationContainerRef();

export function navigate<T extends object | undefined, R extends RootStack>(name: keyof R, params?: T) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(name as string, params));
    }
}

export function replace<T extends object | undefined, R extends RootStack>(name: keyof R, params?: T) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(name as string, params));
    }
}

export function popToTop() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.popToTop());
    }
}

export function pop() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.pop());
    }
}

export function navigateThroughStack<T extends object | undefined, R extends RootStack>(nameTab: keyof RootTab, nameScreen: keyof R, params?: T) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(CommonActions.navigate({
            name: nameTab,
            params: {
                screen: nameScreen,
                params: params
            }
        }));
    }
}
