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
        mapDetail: 'Map Detail',

        hiThere: 'Hi there,',
        welcomeToTastemate: 'Welcome to Tastemate! ',
        limitedContentExplanation: 'Unfortunately, you\'re not logged in, so we can only show you limited content and functionality. Once you\'re ready to explore more of the app, click the user icon button in the top left corner to log in or create a new account. In the meantime, ',
        haveFun: 'Have fun!',

        emptyFeed: 'Seems like your feed is empty. Why not follow some tastemates?',
        selectAction: 'Select an action',
        doWithPost: 'What would you like to do with the post \"{0}\" by {1}',
        share: 'Share',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        shareDialogTitle: 'Where do you want to share this post?',
        shareSubject: 'Cool Dish on Tastemate',
        shareMessage: 'Look at this awesome dish on Tastemate!',
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
        errorMessageEnterUsername: 'Please enter a username.',
        errorMessageEnterEmail: 'Please enter an email address.',
        errorMessageEnterPassword: 'Please enter a password.',
        errorMessageEnterLocation: 'Please enter a location.',
        errorMessageInvalidEmail: 'The email address you entered is invalid.',
        errorMessageUserDisabled: 'The account associated with this email address has been disabled.',
        errorMessageUserNotFound: 'There is no account associated with this email address.',
        errorMessageWrongPassword: 'The password you entered is incorrect.',
        errorMessageWeakPassword: 'The password you entered is too weak.',
        errorMessageEmailAlreadyInUse: 'This email address is already connected to a Tastemate account.',

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
        searchVocabulary: 'What was the taste, texture, and odor of the dish?',
        noLocationResults: 'No matching location found, please enter more information.',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        openSettings: 'Open Settings',
        accessCameraQuestion: 'May we access your camera?',
        accessCameraExplanation: 'We need access so you can take and share pictures of your food.',
        accessPhotoQuestion: 'May we access your photo roll?',
        accessPhotoExplanation: 'We need access so you can select and share pictures of your food.',
        enableCamera: 'Please enable the camera permission in the Tastemate settings of your phone to use this feature.',
        enablePhoto: 'Please enable the storage permission in the Tastemate settings of your phone to use this feature.',
        enableCameraAndPhoto: 'To upload a picture, we first need access to your camera and to the camera roll. Please click here to open the permission dialog! Alternatively, you can go to the Tastemate settings of your smartphone and grant the permissions there.',
        permissionDenied: 'Permission Denied',
        mypocExplanationTitle: 'The MyPoC Text Field',
        mypocExplanationText: 'This field displays a general dish name as predicted by our MyPoC system. Feel free to edit the name if the prediction is incorrect!',
        more: 'More',

        accessLocationQuestion: 'May we access your location?',
        accessLocationExplanation: 'We need access so you can see which saved observations are nearby.',
        enableLocation: 'Please enable the location permission in the Tastemate settings of your phone to use this feature.',
    },
    fr: {
    },
    ja: {

    }
});