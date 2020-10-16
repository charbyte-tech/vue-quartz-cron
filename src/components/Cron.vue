<template>
  <div>
    <CronQuartz v-model="cronExpression" />
  </div>
</template>
<script>
import CronQuartz from "@/components/CronQuartz.vue";
export default {
  name: "Cron",
  components: {
    CronQuartz
  },
  data: () => ({
    cronExpression: {
      value: "1,2 * * L-4 * ? *"
    }
  })
};
</script>
