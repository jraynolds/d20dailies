import firebase from "firebase/app";
import "firebase/auth"
import "firebase/firestore"
import "firebase/storage"

const config = {
	apiKey: "AIzaSyAifnPzIFvT-uS5Jsq7y09FWQHUrPX4_Q4",
	authDomain: "dandailies.firebaseapp.com",
	databaseURL: "https://dandailies.firebaseio.com",
	projectId: "dandailies",
	storageBucket: "dandailies.appspot.com",
	messagingSenderId: "367018355061",
	appId: "1:367018355061:web:f4c9f84d0f96e0adb18b3c",
	measurementId: "G-149HW258D1"
}
firebase.initializeApp(config);

const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

const playersCollection = db.collection("players");
const charactersCollection = db.collection("characters");
const dungeonsCollection = db.collection("dungeons");

export {
	db, 
	auth,
	storage,
	playersCollection,
	charactersCollection,
	dungeonsCollection
};