<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
			<Appbar />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Appbar from './components/Appbar';

export default {
  name: 'App',

  components: {
    Appbar
  },

  data: () => ({
    //
  }),
};
</script>
