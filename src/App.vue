<template>
  <v-app>
		<Appbar :title="'D and Dailies'" />
		<Sidebar v-if="$store.getters.isUserAuth" />

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
    Appbar: () => import("@/components/Appbar.vue"),
    Sidebar: () => import("@/components/Sidebar.vue")
  },
  data: () => ({
    drawerOpen: null,
		rDrawerOpen: true,
		player: {
			name: "Jasper Raynolds",
			tutorials: {
				speaking: false,
				description: false,
				accent: false,
				trolley: false
			}
		},
		character: {
			class: "Paladin",
			name: "Brent Crownguard",
			image: require("@/assets/dragon_empty.png"),
			level: 8,
			hp: 20,
			maxHp: 30,
			alignment: "Lawful Good",
			inspiration: false,
			experience: 1000,
			abilities: {
				intelligence: 14,
				wisdom: 14,
				charisma: 14
			},
			skills: {
				descriptiveness: 4,
				reasoning: 4,
				morality: 4,
				accents: 4,
				persuasiveness: 4,
				roleplaying: 4
			},
			stats: {
				attack: {
					amount: 40,
					maximum: 40
				},
				hp: {
					amount: 80,
					maximum: 80
				},
				xp: {
					amount: 100,
					maximum: 100
				}
			}
		},
  }),
};
</script>
