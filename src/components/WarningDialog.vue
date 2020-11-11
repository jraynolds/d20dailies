<template>
	<v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on }">
        <v-btn
					v-if="buttonLabel && !icon"
          :color="buttonColor"
          v-bind="buttonSize"
          v-on="on"
					text
        >
          {{ buttonLabel }}
        </v-btn>
        <v-btn
					v-else
          :color="buttonColor"
					icon
          v-bind="buttonSize"
          v-on="on"
        >
					<v-icon>{{ icon }}</v-icon>
          {{ buttonLabel }}
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ title }}
        </v-card-title>

        <v-card-text class="pt-6">
          {{ warning }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false; $emit('acceptclicked')"
          >
            {{ acceptLabel }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
export default {
	props: [
		"icon",
		"buttonLabel",
		"size",
		"color",
		"title",
		"warning",
		"acceptLabel"
	],
	data: () => ({
		dialog: false,
		secsUntilUnfocus: 1
	}),
	computed: {
		buttonColor() {
			if (this.color) return this.color;
			return "error";
		},
		buttonSize() {
			if (this.size) return { [this.size] : true };
			return "";
		}
	},
	watch: {
		dialog: (val) => {
			if (!val) {
				let delay = function(){return this;}.secsUntilUnfocus * 1000;
				setTimeout(() => {
					document.activeElement.blur();
				}, delay);
			}
		}
	}
}
</script>

<style>

</style>