import {
    createNavigationContainerRef,
    StackActions,
    CommonActions
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(name: string, params?: object) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.push(name, params));
    }
}

export function replace(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.replace(name, params));
    }
}

export function popToTop() {
    if (navigationRef.isReady()) {
        navigationRef.dispatch(StackActions.popToTop());
    }
}
