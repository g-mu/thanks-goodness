import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
    projectId: "thanks-goodness",
    apiKey: "AIzaSyD49j7FT7dsrh8hvtor2WcGH6n8d16HKmQ",
    authDomain: "thanks-goodness.firebaseapp.com",
    databaseURL: "https://thanks-goodness.firebaseio.com",
    storageBucket: "thanks-goodness.appspot.com"
};

// const firebaseConfig = {
//     projectId: "merit-seeker",
//     apiKey: "AIzaSyBIpeTrzIjLRHEjSVSkiX4ZnKhzYaYCYOg",
//     authDomain: "merit-seeker.firebaseapp.com",
//     databaseURL: "https://merit-seeker.firebaseio.com",
//     storageBucket: "merit-seeker.appspot.com"
// };

export const firebaseApp = firebase.initializeApp(firebaseConfig);
export const profileData = firebaseApp.database().ref('profiles');
export const meritData = firebaseApp.database().ref('merits');
export const categoryData = firebaseApp.database().ref('categories');
export const webStorage = firebase.storage().ref();


