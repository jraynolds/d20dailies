<template>
    <v-app-bar
      app
      color="primary"
      dark
    >
			<v-app-bar-nav-icon @click="$emit('drawerclicked')" />

			<v-toolbar-title>{{ title }}</v-toolbar-title>
    </v-app-bar>
</template>

<script>
export default {
	props: [ "title" ],
	data: () => ({
	}),
}
</script>

<style>
</style>