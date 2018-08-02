import strings, {appName} from '../strings';
import {currentUser} from '../App';
import firebase from 'react-native-firebase/lib/index';
import ImageResizer from 'react-native-image-resizer';
import {pathFollow} from '../Constants/Constants';

/**
 * Adds the picture at the specified imageUrl to the specified storage path and update the specified ref with the
 * url of the saved image. Calls the callback one it is done
 * @param path The Firebase Storage path to store the image at
 * @param imageUrl The local path at which the image is currently stored
 * @param refToUpdate The ref of the object to which the new url of the image will be saved to
 * @param callback The function to call when the image is uploaded and the new url of the image has been added at
 * refToUpdate
 * @param setActivityIndicatorText The function to update the text of the activity indicator
 * @param stopActivityIndicator The function to stop the activity indicator
 */
export function addPictureToStorage(path, imageUrl, refToUpdate, callback, setActivityIndicatorText, stopActivityIndicator) {
    setActivityIndicatorText(strings.uploadingPicture);
    console.log('Resizing picture...');

    ImageResizer.createResizedImage(imageUrl, 2000, 2000, 'JPEG', 80, 0)
        .then(reply => {
            console.log('Adding picture to storage...');
            const settableMetadata = {
                contentType: 'image/jpeg',
                customMetadata: {
                    userid: currentUser.uid
                }
            };

            const imageRef = firebase.storage().ref(path);
            imageRef.putFile(reply.uri, settableMetadata)
                .then((response) => {
                    console.log('Successfully added picture to storage');
                    console.log('Saving image url to item...');
                    const update = {imageUrl: response.downloadURL};
                    refToUpdate.update(update)
                        .then(() => {
                            console.log('Successfully updated item to include image url.');
                            stopActivityIndicator();
                            if (callback) {
                                callback(response.downloadURL);
                            }
                        }).catch((error) => {
                            console.log('Error during image url transmission.');
                            stopActivityIndicator();
                            console.log(error);
                            // TODO: display error message
                        }
                    );
                }).catch((error) => {
                stopActivityIndicator();
                console.log('Error while adding picture to storage');
                console.log(error);
            });
        }).catch((error) => {
            stopActivityIndicator();
            console.log('Error while resizing picture');
            console.log(error);
        }
    );
}

/**
 * Sorts a given array by the timestamp variable of each entry
 * @param array The array to be sorted
 * @param reverse Whether or not the array should be sorted in reverse
 */
export function sortArrayByTimestamp(array, reverse) {
    if (array) {
        array.sort(function (a, b) {
            if (a.timestamp < b.timestamp)
                return reverse ? -1 : 1;
            if (a.timestamp > b.timestamp)
                return reverse ? 1 : -1;
            return 0;
        });
    }
}

/**
 * Selects which message to show on an authentication error
 * @param error The authentication error
 * @returns {string} The correct error message that should be displayed
 */
export function handleAuthError(error) {
    let errorMessage = '';

    switch (error.code) {
        case 'auth/invalid-email':
            errorMessage = strings.errorMessageInvalidEmail;
            break;
        case 'auth/user-disabled':
            errorMessage = strings.errorMessageUserDisabled;
            break;
        case 'auth/user-not-found':
            errorMessage = strings.errorMessageUserNotFound;
            break;
        case 'auth/wrong-password':
            errorMessage = strings.errorMessageWrongPassword;
            break;
        case 'auth/weak-password':
            errorMessage = strings.errorMessageWeakPassword;
            break;
        case 'auth/email-already-in-use':
            errorMessage = strings.formatString(strings.errorMessageEmailAlreadyInUse, appName);
            break;
    }

    return errorMessage;
}
