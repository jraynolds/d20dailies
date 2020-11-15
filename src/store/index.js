import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
require('firebase/auth')
require('firebase/firestore')
require('firebase/storage')

Vue.use(Vuex)

const initialState = () => {
	return {
		user: null,
		player: null,
		activeCharacter: 0,
		activeCharacterImage: null,
		error: null
	}
}

export default new Vuex.Store({
	state: initialState(),
	getters: {
		getCharacter(state) {
			if (state.player) {
				return state.player.characters[state.activeCharacter];
			}
			return null;
		},
		getCharacterImage(state) {
			console.log("We're getting a character image.");
			return state.activeCharacterImage;
		},
		getUser(state) {
			return state.user;
		},
		getPlayer(state) {
			return state.player;
		},
		isUserAuth(state) {
			return !!state.user;
		},
		getError(state) {
			return state.error;
		}
	},
  mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setPlayer(state, player) {
			state.player = player;
		},
		setActiveCharacter(state, index) {
			state.activeCharacter = index;
		},
		setCharacterImage(state, imageURL) {
			state.activeCharacterImage = imageURL;
		},
		setError(state, error) {
			state.error = error;
		}
  },
  actions: {
		signUp({ commit }, payload) {
			console.log("We're signing up a user.");
			console.log(payload);
			return firebase
				.auth()
				.createUserWithEmailAndPassword(payload.email, payload.password)
				.then(response => {
					commit("setUser", response.user);
					// Create new user
					console.log(response.user);
					return true;
				})
				.catch(error => {
					commit("setError", error.message);
					console.log(error.message);
					return false;
				});
		},
		signIn({ commit, dispatch }, payload) {
			console.log("We're signing in a user.");
			console.log(payload);
			return firebase
				.auth()
				.signInWithEmailAndPassword(payload.email, payload.password)
				.then(response => {
					commit("setUser", response.user);
					dispatch("loadPlayer", { email: payload.email } );
					console.log(response.user);
					return true;
				})
				.catch(error => {
					commit("setError", error.message);
					console.log(error.message);
					return false;
				});
		},
		signOut({ commit }) {
			firebase
				.auth()
				.signOut()
				.then(() => {
					commit("setUser", null);
				})
				.catch(error => {
					commit("setError", error.message);
				});
		},
		loadPlayer({ commit, dispatch }, payload) {
			console.log("we're loading a user.");
			console.log(payload);
			firebase
				.firestore()
				.collection("users")
				.where("email", "==", payload.email)
				.get()
				.then(function(querySnapshot) {
					querySnapshot.forEach(function(doc) {
						let player = doc.data();
						player.id = doc.id;
						commit("setPlayer", player);
						dispatch("loadCharacterImage");
					});
				});
		},
		loadCharacterImage({ commit, getters }) {
			console.log("We're loading a character image.");
			let imageRef = getters.getCharacter.imageRef;
			console.log(imageRef);
			firebase
				.storage()
				.ref(imageRef)
				.getDownloadURL()
				.then(function(url) {
					commit("setCharacterImage", url);
				})
				.catch(function(error) {
					console.log(error.code);
				});
		}
  },
  modules: {
  }
})
