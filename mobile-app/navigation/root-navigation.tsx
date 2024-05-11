import {
    createNavigationContainerRef,
    StackActions,
    CommonActions
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate<T extends object | undefined>(name: string, params?: T) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(name, params));
    }
}

export function replace<T extends object | undefined>(name: string, params?: T) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(name, params));
    }
}

export function popToTop() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.popToTop());
    }
}
