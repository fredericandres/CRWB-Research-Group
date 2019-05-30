import { AsyncStorage } from 'react-native';

/** Stores data in a persistent storage. Returns promise */
export const storeDataAsync = async (key, data) => {
    try {
        value = typeof data === 'string' ? data: JSON.stringify(data);
        return AsyncStorage.setItem(key, value);
    } catch(error) {
        console.error('Error saving data...', error);
    }
}

/** Gets data from the persistent storage for given key. Returns promise */
export const getDataAsync = (key) => {
    try {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key).then(
                (value) => {
                    return resolve(JSON.parse(value));
                }
            ).catch(error => {
                return reject(error);
            });
        });
    } catch (error) {
        console.error(error);
    }
}
