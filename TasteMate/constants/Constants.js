import {StackActions} from "react-navigation";

export const brandMain = '#ffcc66';
export const brandContrast = '#333333';
export const brandLight = '#999999';
export const brandBackground = '#f2f2f2';

export function _formatNumber(number) {
    if (number < 1000) {
        return number;
    } else if (number < 1000000) {
        return Math.floor(number/1000) + 'k';
    } else {
        return Math.floor(number/1000000) + 'm';
    }
};

export function _navigateToScreen(screen, navigation, user, myProfile) {
    const pushAction = StackActions.push({
        routeName: screen,
        params: {
            myProfile: myProfile,
            user: user,
        },
    });
    navigation.dispatch(pushAction);
}