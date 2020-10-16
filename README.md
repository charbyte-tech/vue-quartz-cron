# vue-quartz-cron

CronQuartz is a component library built with Vue allowing for easier editing of cron expressions.

CronEditor is a component library built with Vue and Vuetify-Vue allowing for easier editing of cron expressions. Inspired by https://www.freeformatter.com/cron-expression-generator-quartz.html

# Demo

https://github.com/caehprogrammer/vue-quartz-cron

# Requirements

- Vue ^2.0

# Installation

- vue-quartz-cron

```
npm i @charbytex/vue-quartz-cron
```

# Usage Global Option

```
./src/FileComponent.vue

<template>
  <v-app>
    <v-main>
      <CronQuartz v-model="cronExpression" />
    </v-main>
  </v-app>
</template>

./src/main.js

import Vue from 'vue'
import App from './App.vue'
import '@charbytex/vue-quartz-cron/vue-quartz-cron.css';
import * as CronQuartz from '@charbytex/vue-quartz-cron';

Vue.config.productionTip = false

Vue.use({install: CronQuartz.install});

new Vue({
  render: h => h(App)
}).$mount('#app')

```

# Usage Local Option

```
<template>
  <v-app>
    <v-main>
      <CronQuartz v-model="cronExpression" />
    </v-main>
  </v-app>
</template>

<script>
import {CronQuartz} from '@charbytex/vue-quartz-cron';

export default {
  name: 'app',
  components: {
    CronQuartz
  },
  data: () => ({
    cronExpression: {
      value: "1,2 * * L-4 * ? *"
    }
  })
}
</script>

```
