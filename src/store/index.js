import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
require('firebase/auth')
require('firebase/firestore')
require('firebase/storage')

Vue.use(Vuex)

const newPlayer = {
	email: "",
	tutorials: {
		accent: true,
		description: true,
		roleplay: true,
		morality: true,
		persuasion: true,
		tactics: true
	},
	characters: [
		{
			name: "",
			level: 0,
			class: "",
			alignment: "",
			inspiration: false,
			imageRef: "",
			abilities: {
				charisma: 0,
				intelligence: 0,
				wisdom: 0
			},
			skills: {
				accent: 0,
				description: 0,
				morality: 0,
				persuasion: 0,
				tactics: 0,
				roleplaying: 0
			},
			stats: {
				attack: {
					value: 1,
					max: 1
				},
				hp: {
					value: 1,
					max: 1
				},
				xp: {
					value: 1,
					max: 1
				}
			}
		}
	]
}

const newDungeon = {
	rooms: [
		{ 
			height: 5,
			width: 5,
			isLit: true,
			isShown: true,
			loc: [18, 31], 
			doors: [ 
				{ loc: [18, 33], isShown: true },
				{ loc: [21, 31], isShown: true },
				{ loc: [22, 34], isShown: true },
				{ loc: [], isShown: false }
			],
			quadrant: "BOTTOM",
			pathTo: [],
			pathsFrom: []
		},
		{ 
			height: 8,
			width: 4,
			isLit: false, 
			isShown: true,
			loc: [8, 20], 
			doors: [ 
				{ loc: [], isShown: false },
				{ loc: [], isShown: false },
				{ loc: [], isShown: false },
				{ loc: [9, 27], isShown: true }
			],
			quadrant: "LEFT",
			pathTo: [ {0:17,1:33}, {0:16,1:33}, {0:15,1:33}, {0:14,1:33}, {0:13,1:33}, {0:12,1:33}, {0:12,1:33}, {0:11,1:33}, {0:10,1:33}, {0:9,1:33}, {0:9,1:32}, {0:9,1:31}, {0:9,1:30}, {0:9,1:29}, {0:9,1:28} ],
			pathsFrom: []
		},
		{ 
			height: 4,
			width: 7,
			isLit: false, 
			isShown: true,
			loc: [8, 2], 
			doors: [ 
				{ loc: [], isShown: false },
				{ loc: [], isShown: false },
				{ loc: [14, 4], isShown: true },
				{ loc: [], isShown: false }
			],
			quadrant: "TOP",
			pathTo: [ {0:21,1:30}, {0:21,1:29}, {0:21,1:28}, {0:21,1:27}, {0:21,1:26}, {0:21,1:25}, {0:21,1:24}, {0:21,1:23}, {0:21,1:22}, {0:21,1:21}, {0:21,1:20}, {0:21,1:19}, {0:21,1:18}, {0:21,1:17}, {0:21,1:16}, {0:21,1:15}, {0:21,1:14}, {0:21,1:13}, {0:20,1:13}, {0:19,1:13}, {0:18,1:13}, {0:18,1:12}, {0:18,1:11}, {0:18,1:10}, {0:18,1:9}, {0:18,1:8}, {0:17,1:8}, {0:16,1:8}, {0:16,1:7}, {0:16,1:6}, {0:16,1:5}, {0:16,1:4}, {0:15,1:4} ],
			pathsFrom: []
		},
		{ 
			height: 4,
			width: 4,
			isLit: false, 
			isShown: true,
			loc: [33, 25], 
			doors: [ 
				{ loc: [33, 27], isShown: true },
				{ loc: [], isShown: false },
				{ loc: [], isShown: false },
				{ loc: [], isShown: false }
			],
			quadrant: "RIGHT",
			pathTo: [ {0:22,1:34}, {0:23,1:34}, {0:24,1:34}, {0:25,1:34}, {0:26,1:34}, {0:27,1:34}, {0:28,1:34}, {0:29,1:34}, {0:30,1:34}, {0:30,1:33}, {0:30,1:32}, {0:30,1:31}, {0:30,1:30}, {0:30,1:29}, {0:30,1:28}, {0:30,1:27}, {0:31,1:27}, {0:32,1:27} ],
			pathsFrom: []
		}
	]
}

const initialState = () => {
	return {
		user: null,
		player: null,
		dungeon: null,
		activeCharacter: 0,
		activeCharacterImage: null,
		error: null,
		loginDialog: false
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
			return state.activeCharacterImage;
		},
		getUser(state) {
			return state.user;
		},
		getUserID(state) {
			return state.player.id;
		},
		getPlayer(state) {
			return state.player;
		},
		isUserAuth(state) {
			return !!state.user;
		},
		getError(state) {
			return state.error;
		},
		getLoginDialogOpen(state) {
			return state.loginDialog;
		},
		getDungeon(state) {
			return state.dungeon;
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
		},
		setLoginDialogOpen(state, isOpen) {
			state.loginDialog = isOpen;
		},
		setDungeon(state, dungeon) {
			state.dungeon = dungeon;
		}
  },
  actions: {
		signUp({ commit, dispatch }, payload) {
			console.log("We're signing up a user.");
			console.log(payload);
			return firebase
				.auth()
				.createUserWithEmailAndPassword(payload.email, payload.password)
				.then(response => {
					commit("setUser", response.user);
					// Create new user
					console.log(response.user);
					dispatch("loadPlayer", payload.email);
					return { successful: true };
				})
				.catch(error => {
					commit("setError", error.message);
					console.log(error.message);
					return { successful: false, error: error.message };
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
					console.log(response.user);
					return dispatch("loadPlayer", payload.email );
				})
				.catch(error => {
					commit("setError", error.message);
					console.log(error.message);
					return { successful: false, error: error.message };
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
		loadPlayer({ commit, dispatch }, email) {
			console.log("we're loading a user.");
			console.log(email);
			return firebase
				.firestore()
				.collection("users")
				.where("email", "==", email)
				.limit(1)
				.get()
				.then(function(querySnapshot) {
					if (!querySnapshot.empty) {
						console.log("There's a player with that email already.");
						let doc = querySnapshot.docs[0];
						let player = doc.data();
						player.id = doc.id;
						commit("setPlayer", player);
						return dispatch("loadCharacterImage");
					} else {
						console.log("We've got to create a new player!");
						return dispatch("createNewPlayer");
					}
				});
		},
		loadCharacterImage({ commit, dispatch, getters }) {
			console.log("We're loading a character image.");
			let imageRef = getters.getCharacter.imageRef;
			console.log(imageRef);
			return firebase
				.storage()
				.ref(imageRef)
				.getDownloadURL()
				.then(function(url) {
					commit("setCharacterImage", url);
					return dispatch("loadDungeon");
				})
				.catch(function(error) {
					console.log(error.code);
					return { successful: false, error: error.code };
				});
		},
		loadDungeon({ commit, dispatch, getters }) {
			console.log("We're loading a dungeon.");
			let id = getters.getUserID;
			console.log(id);
			return firebase
				.firestore()
				.collection("dungeons")
				.where("player", "==", id)
				.limit(1)
				.get()
				.then(function(querySnapshot) {
					if (!querySnapshot.empty) {
						console.log("This user has a dungeon.");
						let doc = querySnapshot.docs[0];
						let dungeon = doc.data();
						dungeon.id = doc.id;
						commit("setDungeon", dungeon);
						return { successful: true };
					} else {
						console.log("We've got to create a new dungeon!");
						return dispatch("createNewDungeon");
					}
				});
		},
		createNewPlayer({ commit }) {
			console.log("Creating a new player.");
			return firebase
				.firestore()
				.collection("users")
				.add(newPlayer)
				.then(function(docRef) {
					console.log("We've written a new document with id " + docRef.id);
					let player = newPlayer;
					player.id = docRef.id;
					commit("setPlayer", player);
					return { successful: true };
				})
				.catch(function(error) {
					console.error("Error adding document: " + error);
					return { successful: false, error: error };
				});
		},
		createNewDungeon({ commit, getters }) {
			console.log("Creating a new dungeon.");
			let dungeon = newDungeon;
			console.log(dungeon);
			dungeon.player = getters.getUserID;
			console.log(dungeon);
			return firebase
				.firestore()
				.collection("dungeons")
				.add(dungeon)
				.then(function(docRef) {
					console.log("We've written a new document with id " + docRef.id);
					dungeon.id = docRef.id;
					commit("setDungeon", dungeon);
					return { successful: true };
				})
				.catch(function(error) {
					console.error("Error adding document: " + error);
					return { successful: false, error: error };
				});
		},
		updateDungeon({ commit, getters }, dungeon) {
			return firebase
				.firestore()
				.collection("dungeons")
				.set(getters.getDungeon.id)
				.then(function() {
					console.log("We've overwritten the dungeon.");
					commit("setDungeon", dungeon);
					return { successful: true };
				})
				.catch(function(error) {
					console.error("Error overwriting document: " + error);
					return { successful: false, error: error };
				});
		}
  },
  modules: {
  }
})
