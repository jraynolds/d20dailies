import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import Cookies from "js-cookie"
import router from "@/router/index"
import {
	storage, 
	auth,
	playersCollection,
	charactersCollection,
	dungeonsCollection
} from "@/plugins/firebase"

Vue.use(Vuex)

const newPlayer = {
	user: "",
	avatar: "",
	tutorials: {
		accent: true,
		description: true,
		roleplay: true,
		morality: true,
		persuasion: true,
		tactics: true
	},
}

const newCharacter = {
	name: "New Character",
	user: "",
	bio: "",
	level: 0,
	class: "",
	alignment: "",
	inspiration: false,
	avatar: "",
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

const newDungeon = {
	user: "",
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
		playerDocRef: null,
		dungeon: null,
		characters: [],
		activeCharacter: 0,
		error: null,
		loginDialog: false
	}
}

export default new Vuex.Store({
	plugins: [createPersistedState({
		storage: {
			getItem: (key) => Cookies.get(key),
			setItem: (key, value) => Cookies.set(
				key, value, { expires: 7, secure: true }
			),
			removeItem: (key) => Cookies.remove(key)
		}
	})],
	state: initialState(),
	getters: {
		getCharacters(state) {
			return state.characters;
		},
		getActiveCharacter(state) {
			return state.characters[state.activeCharacter];
		},
		getPlayerAvatar(state) {
			if (!state.player) return null;
			return state.player.avatar;
		},
		getUser(state) {
			return state.user;
		},
		getUserID(state) {
			if (!state.user) return null;
			return state.user.uid;
		},
		getPlayerDocRef(state) {
			return state.playerDocRef;
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
		resetState(state) {
			state = initialState;
		},
		setUser(state, user) {
			state.user = user;
		},
		setPlayer(state, player) {
			state.player = player;
		},
		setPlayerDocRef(state, playerDocRef) {
			state.playerDocRef = playerDocRef;
		},
		setCharacters(state, characters) {
			state.characters = characters;
		},
		setActiveCharacter(state, index) {
			state.activeCharacter = index;
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
		/* eslint-disable no-empty-pattern */
		// signUp({ commit, dispatch }, payload) {
		// 	console.log("We're signing up a user.");
		// 	console.log(payload);

		// 	return dispatch("createNewUser", payload).then(response => {
		// 		if (response.successful) {
		// 			commit("setUser", response.user);
		// 			return dispatch("createNewPlayer", response.user.uid).then(response => {
		// 				commit("setPlayer", response.player);
		// 				commit("setPlayerDocRef", response.id);
		// 				return { successful: true };
		// 			}).catch(error => {
		// 				console.log("We've failed!");
		// 				console.log(error);
		// 				return { successful: false, error: error };
		// 			});
		// 		} else {
		// 			console.log("We've failed!");
		// 			console.log(response.error);
		// 			return { successful: false, error: response.error };
		// 		}
		// 	}).catch(error => {
		// 		console.log("We've failed!");
		// 		console.log(error);
		// 		return { successful: false, error: error };
		// 	});
		// },
		// signIn({ commit, dispatch }, payload) {
		// 	console.log("We're signing in a user.");
		// 	console.log(payload);

		// 	return auth
		// 		.signInWithEmailAndPassword(payload.email, payload.password)
		// 		.then(response => {
		// 			console.log("We've signed in a user.");
		// 			commit("setUser", response.user);
		// 			return dispatch("getPlayerByUser", response.user.uid).then(querySnapshot => {
		// 				commit("setPlayer", querySnapshot.docs[0].data());
		// 				commit("setPlayerDocRef", querySnapshot.docs[0].id);
						
		// 				// THESE ARE NOT WAITED ON
		// 				let characters = [];
		// 				dispatch("getCharacters")
		// 					.then(querySnapshot => {
		// 						querySnapshot.forEach(doc => {
		// 							characters.push(doc.data());
		// 						})
		// 						console.log(`Got ${characters.length} characters for this player.`);
		// 						commit("setCharacters", characters)
		// 					}).catch(error => {
		// 						console.log("Couldn't get characters!")
		// 						console.log(error);
		// 						return { successful: false, error: error };
		// 					}); 
		// 				dispatch("getDungeon").then(querySnapshot => {
		// 					if (!querySnapshot.empty) {
		// 						console.log("Got a dungeon for this player.");
		// 						commit("setDungeon", querySnapshot.docs[0].data());
		// 					}
		// 				}); 
		// 				// THESE ARE NOT WAITED ON
						
		// 				return { successful: true };
		// 			}).catch(error => {
		// 				console.log("We've failed!");
		// 				console.log(error);
		// 				return { successful: false, error: error };
		// 			});
		// 		}).catch(error => {
		// 			console.log("We've failed!");
		// 			console.log(error);
		// 			return { successful: false, error: error };
		// 		});
		// },
		// signOut({ commit }) {
		// 	firebase
		// 		.auth()
		// 		.signOut()
		// 		.then(() => {
		// 			commit("setUser", null);
		// 		})
		// 		.catch(error => {
		// 			commit("setError", error.message);
		// 		});
		// },

		// GETTING OPERATIONS

		async signUp({ dispatch, commit }, payload) {
			let user;
			try {
				let response = await auth
					.createUserWithEmailAndPassword(payload.email, payload.password);
				user = response.user;
				commit("setUser", user);
			} catch (error) {
				return { successful: false, error: error };
			}

			try {
				let response = await dispatch("createNewPlayer", user.uid);
				commit("setPlayer", response.player);
				commit("setPlayerDocRef", response.id);
			} catch (error) {
				return { successful: false, error: error };
			}

			return { successful: true };
		},

		async signIn({ dispatch }, payload) {
			let user;
			try {
				let response = await auth.signInWithEmailAndPassword(payload.email, payload.password);
				user = response.user;
			} catch (error) {
				return { successful: false, error: error };
			}

			dispatch('loadAll', user);
			return { successful: true };
		},
		
		async signOut({ commit }) {
			await auth.signOut();
			commit("setUser", null);
			router.push("/");
		},
		
		async loadAll({ commit }, user) {
			commit("setUser", user);

			let playerDoc = await playersCollection
				.where("user", "==", user.uid)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) return querySnapshot.docs[0];
					return null;
				});
			if (playerDoc) {
				commit("setPlayer", playerDoc.data());
				commit("setPlayerDocRef", playerDoc.id);
			}

			let characters = [];
			await charactersCollection
				.where("user", "==", user.uid)
				// .orderBy("name")
				.get()
				.then(querySnapshot => {
					querySnapshot.forEach(doc => {
						characters.push(doc.data());
					})
				});
			commit("setCharacters", characters);
			
			let dungeon = await dungeonsCollection
				.where("user", "==", user.uid)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) return querySnapshot.docs[0].data();
					return null;
				});
			commit("setDungeon", dungeon);
		},

		async loadCharacters({ commit, getters }, id) {
			if (!id) id = getters.getUserID;

			let characters = [];
			await charactersCollection
				.where("user", "==", id)
				// .orderBy("name")
				.get()
				.then(querySnapshot => {
					querySnapshot.forEach(doc => {
						characters.push(doc.data());
					})
				});
			commit("setCharacters", characters);
		},

		// getPlayerByDocRef({ getters }, docRef) {
		// 	if (docRef == null) docRef = getters.getPlayerDocRef;
		// 	console.log("Getting player by doc ref " + docRef);
		// 	return firebase.firestore().collection("players").doc(docRef);
		// },
		// getPlayerByUser({ }, userID) {
		// 	console.log("Getting player by user id " + userID);
		// 	return firebase
		// 		.firestore()
		// 		.collection("players")
		// 		.where("user", "==", userID)
		// 		.limit(1)
		// 		.get();
		// },
		// getCharacters({ getters }, player) {
		// 	if (player == null) player = getters.getPlayer;
		// 	console.log("Getting characters for player with user " + player.user);
		// 	return firebase
		// 		.firestore()
		// 		.collection("characters")
		// 		.where("user", "==", player.user)
		// 		.get();
		// },
		// getCharacter({ }, characterID) {
		// 	console.log("Getting character from ID: " + characterID);
		// 	return firebase.firestore().collection("characters").doc(characterID);
		// },
		// getDungeon({ getters }, userID) {
		// 	if (userID == null) userID = getters.getUserID;
		// 	console.log("Getting dungeon from user ID: " + userID);
		// 	return firebase
		// 		.firestore()
		// 		.collection("dungeons")
		// 		.where("user", "==", userID)
		// 		.limit(1)
		// 		.get();
		// },

		// // PLAYER OPERATIONS
		// refreshPlayer({ commit, dispatch, getters }) {
		// 	console.log("we're refreshing our player with id " + getters.getUserID);
		// 	dispatch("getPlayerByID", getters.getUserID).then(docRef => {
		// 		console.log("Player refreshed.");
		// 		commit("setPlayer", docRef.data());
		// 	}).catch(error => {
		// 		console.log("We've failed!");
		// 		console.log(error);
		// 		return { successful: false }
		// 	})
		// },
		// createNewUser({ }, payload) {
		// 	console.log("Creating a new user.");
		// 	return firebase
		// 		.auth()
		// 		.createUserWithEmailAndPassword(payload.email, payload.password)
		// 		.then(response => {
		// 			console.log("We've signed up a user.");
		// 			return { successful: true, user: response.user };
		// 		})
		// 		.catch(error => {
		// 			console.log("Couldn't sign up that user!");
		// 			return { successful: false, error: error };
		// 		});
		// },
		async createNewPlayer({ }, id) {
			console.log("Creating a new player for user id " + id);
			let player = newPlayer;
			player.user = id;

			return playersCollection
				.add(player)
				.then(docRef => {
					console.log("We've made a new player with id " + docRef.id);
					return { successful: true, player: player, id: docRef.id };
				})
				.catch(error => {
					console.error("Error adding document: " + error);
					return { successful: false, error: error };
				});
		},
		// loadCharacters({ commit, dispatch }) {
		// 	dispatch("getCharacters").then(response => {
		// 		if (response.successful) {
		// 			commit("setCharacters", response.characters);
		// 		} else {
		// 			console.log("We failed!");
		// 			console.log(response.error);
		// 			return { successful: false }
		// 		}
		// 	}).catch(error => {
		// 		console.log("We failed!");
		// 		console.log(error);
		// 		return { successful: false }
		// 	})
		// },
		async createNewCharacter({ dispatch, getters }, characterFields) {
			console.log("We're adding a character.");
			let character = newCharacter;
			for (let field in characterFields) character[field] = characterFields[field];
			character.user = getters.getUserID;
			console.log(character);

			try {
				await charactersCollection.add(character);
				await dispatch("loadCharacters");
				return { successful: true };
			} catch (error) {
				return { successful: false, error: error };
			}
		},

		// // DUNGEONS
		// createNewDungeon({ getters }) {
		// 	console.log("Creating a new dungeon.");
		// 	let dungeon = newDungeon;
		// 	dungeon.user = getters.getUserID;
		// 	return firebase
		// 		.firestore()
		// 		.collection("dungeons")
		// 		.add(dungeon)
		// 		.then(docRef => {
		// 			console.log("We've written a new document with id " + docRef.id);
		// 			return { successful: true, dungeon: dungeon };
		// 		})
		// 		.catch(error => {
		// 			console.error("Error adding document: " + error);
		// 			return { successful: false, error: error };
		// 		});
		// },
		// updateDungeon({ commit, getters }, dungeon) {
		// 	return firebase
		// 		.firestore()
		// 		.collection("dungeons")
		// 		.set(getters.getDungeon.id)
		// 		.then(function() {
		// 			console.log("We've overwritten the dungeon.");
		// 			commit("setDungeon", dungeon);
		// 			return { successful: true };
		// 		})
		// 		.catch(function(error) {
		// 			console.error("Error overwriting document: " + error);
		// 			return { successful: false, error: error };
		// 		});
		// },
		/* eslint-enable no-empty-pattern */

		// IMAGES
		// uploadPlayerAvatar({ dispatch, getters }, avatar) {
		// 	console.log("We're uploading a player avatar.");
		// 	let fileLoc = `playerAvatars/${avatar.name}`;
		// 	return firebase
		// 		.storage()
		// 		.ref()
		// 		.child(fileLoc)
		// 		.put(avatar)
		// 		.then(function() {
		// 			let oldImage = getters.getPlayerAvatar;
		// 			dispatch("deleteSavedImage", oldImage);
		// 			return dispatch("updatePlayerAvatar", fileLoc);
		// 		})
		// 		.catch(function(error) {
		// 			return { successful: false, error: error };
		// 		})
		// },
		async uploadCharacterAvatar({ getters }, payload) {
			console.log("We're uploading a character avatar.");
			let fileLoc = "characterAvatars/"
			fileLoc += getters.getUserID;
			fileLoc += new Date().getTime();
			fileLoc += ".";
			fileLoc += payload.file.name.split(".").pop();

			try {
				await storage.ref().child(fileLoc).put(payload.file);
			} catch (error) {
				console.log(error);
				return { successful: false, error: error };
			}

			try {
				let url = await storage.ref().child(fileLoc).getDownloadURL();
				await charactersCollection.where("user" "==", "")
				return { successful: true, location: url };
			} catch (error) {
				console.log(error);
				return { successful: false, error: error };
			}
		},
		async changeCharacterAvatar({ getters }, payload) {
			console.log("We're changing a character avatar.");
			let fileLoc = "characterAvatars/"
			fileLoc += getters.getUserID;
			fileLoc += new Date().getTime();
			fileLoc += ".";
			fileLoc += file.name.split(".").pop();
			if (!payload.user) payload.user = getters.getUser;

			try {
				await storage.ref().child(fileLoc).put(file);
			} catch (error) {
				console.log(error);
				return { successful: false, error: error };
			}

			let url;
			try {
				url = await storage.ref().child(fileLoc).getDownloadURL();
			} catch (error) {
				console.log(error);
				return { successful: false, error: error };
			}

			let originalURLSplit = payload.character.avatar.split("/");
			let originalAvatarLoc = originalURLSplit.pop();
			try {
				await charactersCollection
					.where("user", "==", payload.user.id)
					.where("name", "==", payload.character.name)
					.get()
					.then(querySnapshot => {
						if (!querySnapshot.empty) querySnapshot.docs[0].update({
							avatar: url
						});
					}).catch(error => {
						console.log(error);
						return { successful: false, error: error };
					})
			} catch (error) {
				return { successful: false, error: error };
			}

			try {
				await storage.child()
			} catch (error) {
				return { successful: false, error: error };
			}
		},
		// updatePlayerAvatar({ dispatch, getters }, avatarLoc) {
		// 	console.log("We're updating a player's reference to their avatar: " + avatarLoc);
		// 	return firebase
		// 		.firestore()
		// 		.collection("players")
		// 		.doc(getters.getUserID)
		// 		.update( { "avatar": avatarLoc } )
		// 		.then(function() {
		// 			console.log("Reference successfully updated.");
		// 			return dispatch("refreshPlayer");
		// 		})
		// 		.catch(function(error) {
		// 			return { successful: false, error: error };
		// 		})
		// },
		// updateCharacterAvatar({ dispatch, getters }, payload) {
		// 	console.log(
		// 		`We're updating the player's #${payload.index} reference to their avatar: ${payload.location}`
		// 	);
		// 	return firebase
		// 		.firestore()
		// 		.collection("players")
		// 		.doc(getters.getUserID)
		// 		.update( { "avatar": avatarLoc } )
		// 		.then(function() {
		// 			console.log("Reference succesfully updated.");
		// 			return dispatch("refreshPlayer");
		// 		})
		// 		.catch(function(error) {
		// 			return { successful: false, error: error };
		// 		})
		// },
		// eslint-disable-next-line
		// deleteSavedImage({ }, imageLocation) {
		// 	console.log("We're deleting a stored image at " + imageLocation);
		// 	if (!imageLocation) return { successful: true };
		// 	return firebase
		// 		.storage()
		// 		.ref()
		// 		.child(imageLocation)
		// 		.delete()
		// 		.then(function() {
		// 			return { successful: true }
		// 		})
		// 		.catch(function(error) {
		// 			return { successful: false, error: error }
		// 		})
		// },


		async signUp({ dispatch, commit }, loginInfo) {
			console.log("We're signing up a user.");
			console.log(loginInfo);

			let response = await dispatch("createNewUser", loginInfo);
			if (!response.successful) return;
			commit("setUser", response.user);

			response = await dispatch("createNewPlayer", response.user.uid);
			if (!response.successful) return;
			commit("setPlayer", response.player);
			commit("setPlayerDocRef", response.id);

			return { successful: true };
		},
		async signIn({ dispatch, commit }, loginInfo) {
			console.log("We're signing in a user.");
			console.log(loginInfo);

			let user;
			try {
				let response = await auth
					.createUserWithEmailAndPassword(loginInfo.email, loginInfo.password);
				user = response.user;
				commit("setUser", user);
			} catch (error) {
				return { successful: false, error: error };
			}

			let loadResponse = await dispatch("loadAll", user.uid);
			return loadResponse;
		},
		async signOut({}) {
			auth()
				.signOut()
				.then(() => {
					commit("resetState");
					return { successful: true } 
				})
				.catch(error => {
					console.log("Couldn't sign out!");
					return { successful: false, error: error }
				});
		},

		async createPlayer({}, userID) {
			console.log("Creating a new player for user id " + id);
			let player = newPlayer;
			player.user = userID;

			return await playersCollection
				.add(player)
				.then(docRef => {
					console.log("We've made a new player with id " + docRef.id);
					return { successful: true, player: player, id: docRef.id };
				})
				.catch(error => {
					console.error("Error adding document: " + error);
					return { successful: false, error: error };
				});
		},
		async createCharacter({}, character) {
			console.log("Creating a new character for user id " + id);
			if (!character) character = newCharacter;
			character.user = userID;

			return await charactersCollection
				.add(character)
				.then(docRef => {
					console.log("We've made a new character with id " + docRef.id);
					return { successful: true, character: character, id: docRef.id };
				})
				.catch(error => {
					console.error("Error adding document: " + error);
					return { successful: false, error: error };
				});
		},
		async createDungeon({}, dungeon) {
			console.log("Creating a new dungeon for user id " + id);
			if (!dungeon) dungeon = newDungeon;
			dungeon.user = userID;

			return await dungeonsCollection
				.add(dungeon)
				.then(docRef => {
					console.log("We've made a new dungeon with id " + docRef.id);
					return { successful: true, dungeon: dungeon, id: docRef.id };
				})
				.catch(error => {
					console.error("Error adding document: " + error);
					return { successful: false, error: error };
				});
		},

		async loadAll({ dispatch, commit, getters }, userID) {
			if (!userID) userID = getters.getUserID;

			let playerResponse = await dispatch("getPlayer", userID);
			if (!playerResponse.successful) return playerResponse;
			commit("setPlayer", playerResponse.player);
			commit("setPlayerDocRef", playerResponse.id);

			let charactersResponse = await dispatch("getCharacters", userID);
			if (!charactersResponse.successful) return charactersResponse;
			if (charactersResponse.characters) {
				commit("setCharacters", charactersResponse.characters);
			}

			let dungeonResponse = await dispatch("getDungeon", userID);
			if (!dungeonResponse.successful) return dungeonResponse;
			if (dungeonResponse.dungeon) {
				commit("setDungeon", dungeonResponse.dungeon);
			}

			return { successful: true }
		},
		async getPlayer({ getters }, userID) {
			if (!userID) userID = getters.getUserID;

			return await playersCollection
				.where("user", "==", userID)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) {
						return { 
							successful: true, 
							player: querySnapshot.docs[0].data(), 
							id: querySnapshot.docs[0].id 
						}; 
					}
					return { successful: false, error: "No player found for this ID." };
				}).catch(error => {
					return { successful: false, error: error };
				});
		},
		async getCharacters({}, userID) {
			if (!userID) userID = getters.getUserID;

			return await charactersCollection
				.where("user", "==", userID)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) {
						let characters = [];
						for (let doc of querySnapshot.docs) {
							characters.push(doc);
						}
						return { 
							successful: true,
							characters: characters
						}; 
					}
					return { 
						successful: true, 
						characters: null, 
						error: "No characters found for this ID." 
					};
				}).catch(error => {
					return { successful: false, error: error };
				});
		},
		async getCharacter({}, searchInfo) {
			// searchInfo.name;
			// searchInfo.player;

			return await charactersCollection
				.where("user", "==", searchInfo.userID)
				.where("name", "==", searchInfo.name)
				.limit(1)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) {
						return { 
							successful: true, 
							character: querySnapshot.docs[0].data(), 
							id: querySnapshot.docs[0].id 
						}; 
					}
					return { 
						successful: true, 
						character: null, 
						error: "No character found for these search terms." 
					};
				}).catch(error => {
					return { successful: false, error: error };
				});
		},
		async getDungeon({}, userID) {
			if (!userID) userID = getters.getUserID;

			return await dungeonsCollection
				.where("user", "==", userID)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) {
						return { 
							successful: true, 
							dungeon: querySnapshot.docs[0].data(), 
							id: querySnapshot.docs[0].id 
						}; 
					}
					return { successful: true, dungeon: null, error: "No dungeon found for this ID." };
				}).catch(error => {
					return { successful: false, error: error };
				});
		},

		async updatePlayer({ getters }, payload) {
			let userID = payload.userID || getters.getUserID;
			let player = payload.player;

			return await playersCollection
				.where("user", "==", userID)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) {
						querySnapshot.docs[0].update(player).then(() => {
							return {
								successful: true
							}; 
						}).catch((error) => {
							return { successful: false, error: error };
						})
					}
					return { successful: false, error: "No player found for this ID." };
				}).catch(error => {
					return { successful: false, error: error };
				});
		},
		async updateCharacter({ getters }, payload) {
			let userID = payload.userID || getters.getUserID;
			let character = payload.character;
			let name = payload.name;

			return await playersCollection
				.where("user", "==", userID)
				.where("name", "==", name)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) {
						querySnapshot.docs[0].update(character).then(() => {
							return {
								successful: true
							}; 
						}).catch((error) => {
							return { successful: false, error: error };
						})
					}
					return { successful: false, error: "No character found in this search." };
				}).catch(error => {
					return { successful: false, error: error };
				});
		},
		async updateDungeon({}, payload) {
			let userID = payload.userID || getters.getUserID;
			let dungeon = payload.dungeon;

			return await playersCollection
				.where("user", "==", userID)
				.get()
				.then(querySnapshot => {
					if (!querySnapshot.empty) {
						querySnapshot.docs[0].update(dungeon).then(() => {
							return {
								successful: true
							}; 
						}).catch((error) => {
							return { successful: false, error: error };
						})
					}
					return { successful: false, error: "No dungeon found for this ID." };
				}).catch(error => {
					return { successful: false, error: error };
				});
		},
		async uploadAvatar({}, payload) {
			payload.image;
			payload.folder;
		},

		async deleteCharacter({}, character) {
		},

  },
  modules: {
  }
})
