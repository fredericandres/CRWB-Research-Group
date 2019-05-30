import strings, {appName} from '../strings';
import {currentUser} from '../App';
import firebase from 'react-native-firebase/lib/index';
import ImageResizer from 'react-native-image-resizer';
import {
    ActivityEnum,
    FollowerFolloweeEnum,
    pathActions,
    pathComments,
    pathCutleries,
    pathFollow,
    pathLikes,
    pathNotifications,
    pathObservations,
    pathShares,
    pathUsers,
    StoragePathEnum
} from '../Constants/Constants';

const functions = {
    getXMostRecentFeedObsForUsers: 'getXMostRecentFeedObsForUsers',
    getXMostRecentObsForUserWithId: 'getXMostRecentObsForUserWithId',
    getXMostRecentObs: 'getXMostRecentObs'
}

/************* USER *************/

/**
 * Gets the user information of the user with the specified id
 * @param userid The unique identifier of the user whose information will be retrieved
 * @returns {Promise<any>} A promise that returns the user information, null if the user doesn't exist, or an error
 */
export function getUser(userid) {
    console.log('Loading user...');
    return new Promise(function(resolve, reject) {
        firebase.database().ref(pathUsers).child(userid).once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded user');
                const user = dataSnapshot ? dataSnapshot.toJSON() : null;
                resolve(user);
            }).catch((error) => {
                console.log('Error while loading user with id ' + userid);
                reject(error);
            }
        );
    });
}

/**
 * Sorts an array of users by the number of followers
 * @param users The users that shall be sorted
 * @private
 */
function _sortUsersByFollowers(users) {
    if (users) {
        users.sort(function (a, b) {
            if (!a.followers)
                return 1;
            if (!b.followers)
                return -1;
            if (a.followers < b.followers)
                return 1;
            if (a.followers > b.followers)
                return -1;
            return 0;
        });
    }
}

/**
 * Gets the n most popular users (based on how many followers they have), sorted by their popularity
 * @param n The number of users that shall be retrieved
 * @returns {Promise<any>} A promise that returns the users, or an error
 */
export function getMostPopularUsers(n) {
    console.log('Loading empty feed popular users...');
    const refUsers = firebase.database().ref(pathUsers).orderByChild(FollowerFolloweeEnum.FOLLOWER).limitToLast(n);
    return new Promise(function(resolve, reject) {
        refUsers.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded empty feed popular users');
                const usersJson = dataSnapshot.toJSON();
                const users = usersJson && Object.values(usersJson);
                _sortUsersByFollowers(users);
                resolve(users);
            }).catch((error) => {
                console.log('Error while loading most popular users');
                reject(error);
            }
        );
    });
}

/**
 * Updates the user's information
 * @param userid The unique identifier of the user
 * @param userInfo The information that shall be updated
 * @returns {Promise<any>} A promise that returns nothing if the update was successful, or an error
 */
export function updateUserInformation(userid, userInfo) {
    console.log('Updating user information...');
    userInfo.timestamp = userInfo.timestamp==null? firebase.database().getServerTime(): userInfo.timestamp;
    console.log('firebase update userinfo', userInfo);
    return new Promise(function(resolve, reject) {
        firebase.database().ref(pathUsers).child(userid).update(userInfo)
            .then(() => {
                console.log('Successfully updated user information');
                resolve();
            }).catch((error) => {
                console.log('Error while updating user information');
                reject(error);
            }
        );
    });
}

/**
 * Creates a new account with the given email and password
 * @param email The email address to be used
 * @param password The password to be used
 * @returns {Promise<any>} A promise that returns the user credentials if successful, or an error
 */
export function createNewAccount(email, password) {
    console.log('Creating new account...');
    return new Promise(function(resolve, reject) {
        firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(email, password).then(
            (credentials) => {
                console.log('Successfully created new account');
                resolve(credentials);
            }).catch((error) => {
                console.log('Error while creating new account');
                reject(error);
            }
        );
    });
}

/**
 * Logs in user with the given email and password
 * @param email The email address to be used
 * @param password The password to be used
 * @returns {Promise<any>} A promise that returns nothing if successful, or an error
 */
export function logInUser(email, password) {
    console.log('Logging in...');
    return new Promise(function(resolve, reject) {
        firebase.auth().signInAndRetrieveDataWithEmailAndPassword(email, password)
            .then(() => {
                console.log('Successfully logged in');
                resolve();
            }).catch((error) => {
                console.log('Error during login');
                reject(error);
            }
        );
    });
}

/**
 * Creates an anonymous account
 * @returns {Promise<any>} A promise that returns nothing if successful, or an error
 */
export function createAnonymousAccount() {
    console.log('Creating anonymous account...');
    return new Promise(function(resolve, reject) {
        firebase.auth().signInAnonymouslyAndRetrieveData()
            .then(() => {
                console.log('Successfully created anonymous account');
                resolve();
            }).catch((error) => {
                console.log('Error while creating anonymous account');
                reject(error);
            }
        );
    });
}

/************* STORAGE *************/

/**
 * Adds the picture at the specified imageUrl to the specified storage path and update the specified ref with the
 * url of the saved image. Calls the callback one it is done
 * @param type The type of storage item (see StoragePathEnum)
 * @param userid The unique identifier of the user
 * @param observationid The unique identifier of the observation, or null
 * @param imageUrl The local path at which the image is currently stored
 * @param setActivityIndicatorText The function to update the text of the activity indicator
 * @param stopActivityIndicator The function to stop the activity indicator
 * @returns {Promise<any>} A promise that returns the new image url, or an error
 */
export function addPictureToStorage(type, userid, observationid, imageUrl, setActivityIndicatorText, stopActivityIndicator) {
    let path = null;
    let id = null;
    let refToUpdate = null;
    if (type === StoragePathEnum.USER) {
        path = pathUsers;
        id = userid;
        refToUpdate = firebase.database().ref(path).child(userid);
    } else {
        path = pathObservations;
        id = observationid;
        refToUpdate = firebase.database().ref(path).child(userid).child(observationid);
    }

    const storagePath = '/' + path + '/' + id + '.jpg';

    setActivityIndicatorText(strings.uploadingPicture);
    console.log('Resizing picture...');
    return new Promise(function(resolve, reject) {
        ImageResizer.createResizedImage(imageUrl, 2000, 2000, 'JPEG', 80, 0)
            .then(reply => {
                console.log('Adding picture to storage...');
                const settableMetadata = {
                    contentType: 'image/jpeg',
                    customMetadata: {
                        userid: currentUser.uid
                    }
                };

                const imageRef = firebase.storage().ref(storagePath);
                imageRef.putFile(reply.uri, settableMetadata)
                    .then((response) => {
                        console.log('Successfully added picture to storage');
                        console.log('Saving image url to item...');
                        const update = {imageUrl: response.downloadURL};


                        refToUpdate.update(update)
                            .then(() => {
                                console.log('Successfully updated item to include image url');
                                stopActivityIndicator();
                                resolve(response.downloadURL);
                            }).catch((error) => {
                                console.log('Error during image url transmission');
                                stopActivityIndicator();
                                reject(error);
                            }
                        );
                    }).catch((error) => {
                        stopActivityIndicator();
                        console.log('Error while adding picture to storage');
                        reject(error);
                    }
                );
            }).catch((error) => {
                stopActivityIndicator();
                console.log('Error while resizing picture');
                reject(error);
            }
        );
    });
}

/************* OBSERVATION *************/

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
 * Gets most recent observations that match the specified search text
 * @param searchText The text that has to match with the returned observations
 * @param from Starting at which observation shall be returned
 * @param to Until which observation shall be returned
 * @returns {Promise<any>} A promise that returns the requested observations, or null
 */
export function getXMostRecentObs(searchText, from, to) {
    console.log('Loading ' + searchText + ' observations... Starting at ' + from + ' to ' + to);
    const httpsCallable = firebase.functions().httpsCallable(functions.getXMostRecentObs);
    return new Promise(function(resolve, reject) {
        httpsCallable({
            from: from,
            to: to,
            searchText: searchText
        }).then(({data}) => {
            console.log('Observations successfully loaded');
            resolve(data.observations);
        }).catch(httpsError => {
            console.log('Error while loading observations');
            console.log(httpsError.code);
            console.log(httpsError.message);
            reject(httpsError);
        })
    });
}

/**
 * Gets the most recent observations of the user with the specified user id
 * @param userid The unique identifier of the user
 * @param from Starting at which observation shall be returned
 * @param to Until which observation shall be returned
 * @returns {Promise<any>} A promise that returns the requested observations, or an error
 */
export function getXMostRecentObsForUserWithId(userid, from, to) {
    console.log('Loading observations... Starting at ' + from + ' to ' + to);
    const httpsCallable = firebase.functions().httpsCallable(functions.getXMostRecentObsForUserWithId);
    return new Promise(function(resolve, reject) {
        httpsCallable({
            userid: userid,
            from: from,
            to: to
        }).then(({data}) => {
            console.log('Successfully loaded observations');
            resolve(data.observations);
        }).catch(httpsError => {
            console.log(httpsError.code);
            console.log(httpsError.message);
            reject(httpsError);
        })
    });
}

/**
 * Gets the most recent observations of the users with the specified user ids
 * @param users The users whose observations shall be returned
 * @param from Starting at which observation shall be returned
 * @param to Until which observation shall be returned
 * @returns {Promise<any>}
 */
export function getXMostRecentFeedObsForUsers(users, from, to) {
    console.log('Loading observations... Starting at ' + from + ' to ' + to);
    const httpsCallable = firebase.functions().httpsCallable(functions.getXMostRecentFeedObsForUsers);
    return new Promise(function(resolve, reject) {
        httpsCallable({
            users: users,
            from: from,
            to: to
        }).then(({data}) => {
            console.log('Successfully loaded observations');
            resolve(data.observations);
        }).catch(httpsError => {
            console.log(httpsError.code);
            console.log(httpsError.message);
            reject(httpsError);
        })
    });
}

/**
 * Gets the n most recent observations of the specified user
 * @param userid The unique identifier of the user
 * @param n The number of observations that shall be retrieved
 * @returns {Promise<any>} A promise that returns the observations, or an error
 */
export function getMostRecentObsForUser(userid, n) {
    console.log('Loading ' + n + ' most recent observations...');
    const refObs = firebase.database().ref(pathObservations).child(userid).orderByChild('timestamp').limitToLast(n);
    return new Promise(function(resolve, reject) {
        refObs.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded popular observations ');
                const observations = dataSnapshot.toJSON();
                resolve(observations);
            }).catch((error) => {
                console.log('Error while loading observation of popular user with id ' + userid);
                reject(error);
            }
        );

    });
}

/**
 * Updates the observation with the specified id of the user with the specified id with the specified observation object
 * @param userid The unique identifier of the user
 * @param observationid The unique identifier of the observation
 * @param observation The observation object that shall be updated to the DB
 * @returns {Promise<any>} A promise that returns nothing if the update operation was successful, or an error
 */
export function updateObservation(userid, observationid, observation) {
    console.log('Updating observation...');
    return new Promise(function(resolve, reject) {
        firebase.database().ref(pathObservations).child(userid).child(observationid).update(observation)
            .then(() => {
                console.log('Successfully updated observation');
                resolve();
            }).catch((error) => {
                console.log('Error while updating observation');
                reject(error);
            }
        );
    });
}

/**
 * Generates a new key for an observation
 * @param userid The unique identifier of the creator user
 * @returns {*} The new key
 */
export function generateObservationKey(userid) {
    let ref = firebase.database().ref(pathObservations).child(userid);
    return ref.push().key;
}

/**
 * Adds a new observation to the DB
 * @param userid The unique identifier of the creator user
 * @param observation The observation object that shall be added
 * @param _setActivityIndicatorText The function to set the text on the activity indicator
 * @param _stopActivityIndicator The function to stop the activity indicator
 * @returns {Promise<any>} A promise that returns the imageurl, or an error
 */
export function addObservation(userid, observation, _setActivityIndicatorText, _stopActivityIndicator) {
    observation.timestamp = firebase.database().getServerTime();
    observation.userid = userid;
    observation.observationid = observation.observationid || generateObservationKey(userid);

    const imageUrl = observation.image;
    delete observation.image;

    return new Promise(function(resolve, reject) {
        console.log('Adding observation...');
        const observationRef = firebase.database().ref(pathObservations).child(userid).child(observation.observationid);
        observationRef.set(observation)
            .then(() => {
                console.log('Successfully added observation');
                resolve(addPictureToStorage(StoragePathEnum.OBSERVATION, userid, observation.observationid, imageUrl, _setActivityIndicatorText, _stopActivityIndicator));
            }).catch((error) => {
                console.log('Error during observation transmission');
                reject(error);
            }
        );
    });
}

/**
 * Gets the observation with the specified creator
 * @param userid The unique identifier of the creator
 * @param observationid The unique identifier of the observation
 * @returns {Promise<any>} A promise that returns the observation, or an error
 */
export function getObservation(userid, observationid) {
    console.log('Loading observation...');
    return new Promise(function(resolve, reject) {
        firebase.database().ref(pathObservations).child(userid).child(observationid).once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded observation');
                resolve(dataSnapshot.toJSON());
            }).catch((error) => {
                console.log('Error while loading observation');
                reject(error);
            }
        );
    });
}

/**
 * Removes the observation with the specified id of the user with the specified id
 * @param userid The unique identifier of the creator user
 * @param observationid The unique identifier of the observation
 * @returns {Promise<any>} A promise that returns nothing if successful, or an error
 */
export function removeObservation(userid, observationid) {
    console.log('Removing observation...');
    const ref = firebase.database().ref(pathObservations).child(userid).child(observationid);
    return new Promise(function(resolve, reject) {
        ref.remove()
            .then(() => {
                console.log('Successfully removed observation');
                resolve();
            }).catch(() => {
                console.log('Error while removing observation');
                reject(error);
            }
        );
    });
}

/************* AUTHENTICATION *************/

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

/**
 * Checks whether a specified username is already in use
 * @param username The username that shall be checked
 * @returns {Promise<any>} A promise that returns a boolean for whether or not the username exists, or an error
 */
export function checkIfUsernameExists(username) {
    console.log('Checking if username already exists...');
    const refUsername = firebase.database().ref(pathUsers).orderByChild('username').equalTo(username);
    return new Promise(function(resolve, reject) {
        refUsername.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully checked username');
                resolve(dataSnapshot.toJSON() !== null);
            }).catch((error) => {
                console.log('Error while checking whether username exists');
                reject(error);
            }
        );
    });
}

/************* FOLLOW *************/

/**
 * Gets the followers or followees of a specified user at a specified load depth
 * @param type The relationship of the user with specified userid to the users to be loaded (of type
 * FollowerFolloweeEnum)
 * @param userid The id of the user for whom the followers of followees should be loaded
 * @param loadDepth The depth of the query, if unlimited depth, put null
 * @returns {Promise<any>} A promise that returns the followers or followees or an error
 */
export function getFollowers(type, userid, loadDepth) {
    console.log('Loading people the current user follows...');
    const refFollowees = firebase.database().ref(pathFollow).orderByChild(type).equalTo(userid);
    if (loadDepth) {
        refFollowees.limitToFirst(loadDepth);
    }
    return new Promise(function(resolve, reject) {
        refFollowees.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded ' + type + 's');

                let followeers = [];
                dataSnapshot.forEach(function (childSnapshot) {
                    followeers.push(type === FollowerFolloweeEnum.FOLLOWER ? childSnapshot.toJSON().followee : childSnapshot.toJSON().follower);
                });

                resolve(followeers);
            }).catch((error) => {
                console.log('Error while loading followees');
                reject(error);
            }
        );
    });
}

/**
 * Generates a combined DB key
 * @param follower The userid of the user who follows
 * @param followee The userid of the user who is being followed
 * @returns {string} A string of the combined key
 */
export function generateCombinedKey(follower, followee) {
    return follower + '_' + followee;
}

/**
 * Checks whether the follower is following the followee
 * @param follower The userid of the user who follows
 * @param followee The userid of the user who is being followed
 * @returns {Promise<any>} A promise that returns a boolean for whether or not the follower is following the
 * following, or an error
 */
export function isFollowing(follower, followee) {
    console.log('Loading follower status...');
    const ref = firebase.database().ref(pathFollow).child(generateCombinedKey(follower, followee));
    return new Promise(function(resolve, reject) {
        ref.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded follower status');
                resolve(dataSnapshot.toJSON() !== null);
            }).catch(
            (error) => {
                console.log('Error while loading follower status');
                reject(error);
            }
        );
    });
}

/**
 * Removes the relationship of follower following followee
 * @param follower The userid of the user who follows
 * @param followee The userid of the user who is being followed
 * @returns {Promise<any>} A promise that returns nothing if the relationship was successfully removed, or an error
 */
export function removeFollowRelationship(follower, followee) {
    console.log('Removing relationship of ' + follower + ' following ' + followee + '...');
    const ref = firebase.database().ref(pathFollow).child(generateCombinedKey(follower, followee));
    return new Promise(function(resolve, reject) {
        ref.remove(
            (error) => {
                if (error) {
                    console.log('Error while removing follow relationship of ' + follower + ' following ' + followee);
                    reject(error);
                } else {
                    console.log('Successfully removed relationship of ' + follower + ' following ' + followee);
                    resolve();
                }
            }
        );
    });
}

/**
 * Adds the relationship of follower following followee
 * @param follower The userid of the user who follows
 * @param followee The userid of the user who is being followed
 * @returns {Promise<any>} A promise that returns nothing if the relationship was successfully added, or an error
 */
export function addFollowRelationship(follower, followee) {
    console.log('Removing relationship of ' + follower + ' following ' + followee + '...');
    const timestamp = firebase.database().getServerTime();
    return new Promise(function(resolve, reject) {
        firebase.database().ref(pathFollow).child(generateCombinedKey(follower, followee)).set({
            follower: follower,
            followee: followee,
            timestamp: timestamp
        }, (error) => {
            if (error) {
                console.log('Error while adding follow relationship of ' + follower + ' following ' + followee);
                reject(error);
            } else {
                console.log('Successfully added ' + follower + ' to follow ' + followee);
                resolve();
            }
        });
    });
}

/************* COMMENTS *************/

/**
 * Gets the n most recent comments of an observation with a specified id of a user with a specified id
 * @param userid The unique identifier of the creator of the observation
 * @param observationid The unique identified of the observation
 * @param n The number of comments that shall be retrieved
 * @returns {Promise<any>} A promise that returns the comments, or null
 */
export function getXMostRecentComments(userid, observationid, n) {
    console.log('Loading comments...');
    const refComments = firebase.database().ref(pathComments).child(userid).child(observationid).orderByChild('timestamp').limitToLast(n);
    return new Promise(function(resolve, reject) {
        refComments.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded comments');
                const commentsJson = dataSnapshot.toJSON();
                let comments = [];
                if (commentsJson) {
                    Object.keys(commentsJson).map((commentid) => {
                        let comment = commentsJson[commentid];
                        comment.id = commentid;
                        comments.push(comment);
                    });
                }
                resolve(comments);
            }).catch((error) => {
                console.log('Error while loading comments');
                reject(error);
            }
        );
    });
}

/**
 * Removes comment from the observation with the specified id
 * @param userid The unique identifier of the sending user
 * @param observationid The unique identifier of the observation
 * @param commentid The unique identifier of the comment
 * @returns {Promise<any>} A promise that returns nothing if successful, or an error
 */
export function removeComment(userid, observationid, commentid) {
    console.log('Removing comment...');
    const ref = firebase.database().ref(pathComments).child(userid).child(observationid).child(commentid);
    return new Promise(function(resolve, reject) {
        ref.remove(
            (error) => {
                if (error) {
                    console.log('Error while removing comment');
                    reject(error);
                } else {
                    console.log('Successfully removed comment');
                    resolve();
                }
            }
        );
    });
}

/**
 * Adds a comment to the observation with the specified id
 * @param userid The unique identifier of the sending user
 * @param observationid The unique identifier of the observation
 * @param comment The comment that shal be added
 * @returns {Promise<any>} A promise that returns the new comment id if successful, or an error
 */
export function addComment(userid, observationid, comment) {
    console.log('Adding comment...');
    comment.timestamp = firebase.database().getServerTime();
    const ref = firebase.database().ref(pathComments).child(userid).child(observationid);
    const id = ref.push().key;
    return new Promise(function(resolve, reject) {
        ref.child(id).set(comment)
            .then(() => {
                console.log('Successfully added comment');
                resolve(id);
            }).catch((error) => {
                console.log('Error while adding comment');
                reject(error);
            }
        );
    });
}

/************* NOTIFICATIONS *************/

/**
 * Get the n most recent notifications for a user
 * @param userid The unique identifier of the user
 * @param n The number of notifications that shall be retrieved
 * @returns {Promise<any>} A promise that returns an object with the dataSnapshot and the notifications
 */
export function getXMostRecentNotifications(userid, n) {
    console.log('Loading notifications...');
    const refNotifications = firebase.database().ref(pathNotifications).child(userid).orderByChild('timestamp').limitToLast(n);
    return new Promise(function(resolve, reject) {
        refNotifications.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded notifications');
                const notifications = dataSnapshot.toJSON() ? Object.values(dataSnapshot.toJSON()) : [];
                resolve({
                    dataSnapshot: dataSnapshot,
                    notifications: notifications
                });
            }).catch((error) => {
                console.log('Error while loading notifications');
                reject(error);
            }
        );
    });
}

/**
 * Marks a notification as read
 * @param userid The unique identifier of the user
 * @param notificationid The unique identifier of the notification
 * @returns {Promise<any>} A promise that returns nothing if successful, or an error
 */
export function markNotificationAsRead(userid, notificationid) {
    console.log('Marking notification as read...');
    return new Promise(function(resolve, reject) {
        firebase.database().ref(pathNotifications).child(userid).child(notificationid).update({
            read: true,
        }).then(() => {
            console.log('Successfully marked notification as read');
            resolve();
        }).catch((error) => {
            console.log('Error while marking notification as read');
            reject(error);
        });
    });
}

/************* ACTIONS *************/

/**
 * Gets all actions
 * @returns {Promise<any>} A promise that returns the data snapshot, or an error
 */
export function getActions() {
    console.log('Loading actions...');
    const refEatingOut = firebase.database().ref(pathActions);
    return new Promise(function(resolve, reject) {
        refEatingOut.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded actions');
                resolve(dataSnapshot);
            }).catch((error) => {
                console.log('Error while loading actions');
                reject(error);
            }
        );
    });
}

/**
 * Get a user's actions on the observation with the specified id of a creator with the specified id
 * @param creatorid The unique identifier of the creator of the observation
 * @param observationid The unique identifier of the observation
 * @param userid The unique identifier of the user
 * @returns {Promise<any>} A promise that returns the actions object, or an error
 */
export function getUserActions(creatorid, observationid, userid) {
    console.log('Loading user\'s actions...');
    const refActions = firebase.database().ref(pathActions).child(creatorid).child(observationid).orderByChild(userid).equalTo(true);
    return new Promise(function(resolve, reject) {
        refActions.once('value')
            .then((dataSnapshot) => {
                console.log('Successfully loaded user\s actions');
                resolve(dataSnapshot.toJSON());
            }).catch((error) => {
                console.log('Error while loading user\'s actions');
                resolve(error);
            }
        );
    });
}

/**
 * Gets the DB path for an activity of the specified type
 * @param type The type of the activity
 * @returns {*} The DB path of the activity
 * @private
 */
function _getPathForActivity(type) {
    let path = null;
    if (type === ActivityEnum.LIKE) {
        path = pathLikes;
    } else if (type === ActivityEnum.SHARE) {
        path = pathShares;
    } else if (type === ActivityEnum.CUTLERY) {
        path = pathCutleries;
    }
    return path;
}

/**
 * Adds a user action of the specified type by the user with the specified id to the observation with the specified id
 * by the user with the specified id
 * @param creatorid The unique identifier of the observation creator
 * @param observationid The unique identifier of the observation
 * @param type The type of action that shall be added
 * @param userid The unique identifier of the current user
 * @returns {Promise<any>} A promise that returns nothing if successful, or an error
 */
export function addUserAction(creatorid, observationid, type, userid) {
    console.log('Adding user ' + type + ' action...');
    let path = _getPathForActivity(type);
    let content = {};
    content[currentUser.uid] = true;
    return new Promise(function(resolve, reject) {
        if (!path) {
            reject('Wrong type');
        }

        firebase.database().ref(pathActions).child(creatorid).child(observationid).child(path).update(content)
            .then(() => {
                console.log('Successfully added user ' + path + ' action');
                resolve();
            }).catch((error) => {
                console.log('Error while adding user ' + path + ' action');
                reject(error);
            }
        );
    });
}

/**
 * Removes a user action of the specified type by the user with the specified id from the observation with the
 * specified id by the user with the specified id
 * @param creatorid The unique identifier of the observation creator
 * @param observationid The unique identifier of the observation
 * @param type The type of action that shall be removed
 * @param userid The unique identifier of the current user
 * @returns {Promise<any>} A promise that returns nothing if successful, or an error
 */
export function removeUserAction(creatorid, observationid, type, userid) {
    console.log('Removing user ' + type + ' action...');
    let path = _getPathForActivity(type);
    return new Promise(function(resolve, reject) {
        if (!path) {
            reject('Wrong type');
        }

        firebase.database().ref(pathActions).child(creatorid).child(observationid).child(path).child(userid).remove()
            .then(() => {
                console.log('Successfully removed user ' + path + ' action');
                resolve();
            }).catch((error) => {
                console.log('Error while removing user ' + path + ' action');
                reject(error);
            }
        );
    });
}
