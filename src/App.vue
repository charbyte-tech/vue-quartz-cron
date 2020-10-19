<template>
  <v-app>
    <v-main>
      <v-row justify="center">
        <v-btn color="primary" dark @click="openDialog">Open component</v-btn>
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Settings</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="dialog = false">Close</v-btn>
              </v-toolbar-items>
            </v-toolbar>

            <v-card-text>
              <CronQuartz
                v-model="cronExpression"
                @descripcion-value="descripcionValue"
              />
              {{ description }}
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
    </v-main>
  </v-app>
</template>
<script>
import CronQuartz from "@/components/CronQuartz.vue";
export default {
  name: "App",
  components: {
    CronQuartz
  },
  data: () => ({
    dialog: false,
    cronExpression: "5 * * ? * * *",
    description: null,
    incremental: 0
  }),
  methods: {
    descripcionValue(value) {
      this.description = value;
    },
    openDialog() {
      this.dialog = true;
      this.incremental++;
      this.cronExpression = "0-3 0-0 1-4 ? 1-1 1#1 2016,2019";
    }
  }
};
</script>
