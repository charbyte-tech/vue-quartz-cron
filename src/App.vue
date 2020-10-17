<template>
  <v-app>
    <v-main>
      <v-row justify="center">
        <v-dialog
          v-model="dialog"
          fullscreen
          hide-overlay
          transition="dialog-bottom-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark v-bind="attrs" v-on="on">
              Open component
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="primary">
              <v-btn icon dark @click="dialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
              <v-toolbar-title>Settings</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn dark text @click="dialog = false">
                  Close
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text>
              <CronQuartz v-model="cronExpression" />
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
    cronExpression: "5 * * ? * * *"
  })
};
</script>
