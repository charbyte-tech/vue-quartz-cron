/* eslint-disable */
import CronQuartz from "@/components/CronQuartz.vue";

import CommonsQuartz from "@/commons";

// Exportación de los componentes individualmente
export { CronQuartz, CommonsQuartz}

// Instalación de la librería como un plugin
export function install(Vue) {
  Vue.component('CronQuartz', CronQuartz);
}

if (typeof window !== 'undefined' && window.Vue) {
  Vue.use({ install });
}

// Exportación de la librería como plugin
export default { install: install }

