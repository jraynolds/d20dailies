import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'

Vue.use(Vuex)

const initialState = () => {
	return {
		user: null,
		activeCharacter: 0,
		error: null
	}
}

export default new Vuex.Store({
	state: initialState(),
	getters: {
		getUser(state) {
			return state.user;
		},
		isUserAuth(state) {
			return !!state.user;
		},
		getError(state) {
			return state.error;
		}
	},
  mutations: {
		setUser(state, payload) {
			state.user = payload;
		},
		setError(state, payload) {
			state.error = payload;
		}
  },
  actions: {
		signUp({ commit }, payload) {
			firebase
				.auth()
				.createUserWithEmailAndPassword(payload.email, payload.password)
				.then(response => {
					commit("setUser", response.user);
				})
				.catch(error => {
					commit("setError", error.message);
				});
		},
		signIn({ commit }, payload) {
			return firebase
				.auth()
				.signInWithEmailAndPassword(payload.email, payload.password)
				.then(response => {
					commit("setUser", response.user);
				})
				.catch(error => {
					commit("setError", error.message);
				});
		},
		signOut({ commit }, payload) {
			firebase
				.auth()
				.signOut()
				.then(() => {
					commit("setUser", null);
				})
				.catch(error => {
					commit("setError", error.message);
				});
		}
  },
  modules: {
  }
})
