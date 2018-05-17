import LocalizedStrings from 'react-native-localization';
import {_getLanguageCode} from './constants/Constants';
import moment from "moment";
import "moment/locale/ja";
import "moment/locale/fr";

moment.locale(_getLanguageCode());

// import strings from "../strings";

export default strings = new LocalizedStrings({
    en:{
        home: 'Home',
        explore: 'Explore',
        notifications: 'Notifications',
        eatingOutList: 'Eating Out List',
        profile: 'Profile',
        settings: 'Settings',
        observationDetail: 'Detail',
        createObservation: 'Create Observation',
        signUpLogIn: 'Sign Up Log In',

        emptyFeed: 'Seems like your feed is empty. Why not follow some tastemates?',
        selectAction: 'Select an action',
        doWithPost: 'What would you like to do with the post \"{0}\" by {1}',
        share: 'Share',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        shareQuestion: 'Where do you want to share this post?',
        likes: '{0} likes',
        shares: '{0} shares',
        cutleries: '{0} cutleries',
        likesSg: '{0} like',
        sharesSg: '{0} share',
        cutleriesSg: '{0} cutlery',
        thousand: '{0}k', // e.g., 1k
        million: '{0}m',
        writeComment: 'Write a comment...',

        likedPicture: '{0} liked your picture.', // e.g. Lukas liked your picture.
        sharedPicture: '{0} shared your picture.',
        addedToEatingOutPicture: '{0} added your picture to their Eating Out list.',
        startedFollowing: '{0} started following you.',
        userAndUser: '{0} and {1}', // e.g., Tom and Susie
        others: '{0} others', // e.g. 42 others

        photos: 'Photos',
        followers: 'Followers',
        following: 'Following',
        noPictures: 'This user has not added any pictures.',
        noUsers: 'No users to display.',

        close: 'Close',

        foodCraving: 'What food are you craving?',

        username: 'username',
        emailAddress: 'email address',
        location: 'location',
        oldPassword: 'old password',
        newPassword: 'new password',
        newPasswordRepeat: 'new password (repeat)',
        notifyMe: 'Notify me when...',
        likesPicture: 'someone likes my picture',
        addsToEatingOutPicture: 'someone adds my picture to their Eating Out list',
        sharesPicture: 'someone shares my picture',
        startsFollowing: 'someone starts following me',
        saveChanges: 'Save Changes',

        list: 'List',
        map: 'Map',
        noEatingOut: 'Seems like you have not added a dish to your list. Just click the cutlery icon to do so!',

        welcomeTo: 'Welcome to',
        tastemateDescription: 'the place to share your culinary experiences with others',
        getEating: 'Let\'s get eating!',
        signUp: 'Sign Up',
        logIn: 'Log In',
        password: 'password',
        noAccount: 'Don\'t have an account yet? Sign up here!',
        alreadyAccount: 'Already have an account? Log in here!',
        skip: 'Skip',

        next:'Next',
        previous: 'Previous',
        publish: 'Publish',
        description: 'description',
        dishname: 'dish name',
        price: 'price',
        rateExperience: 'How would you rate your overall experience?',
        currency: 'Currency',
        selectCurrency: 'Please select the currency of the price you stated.',
    },
    fr: {
    },
    ja: {

    }
});