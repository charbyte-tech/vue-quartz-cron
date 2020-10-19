<template>
  <v-card tile height="auto">
    <v-card-title class="primary white--text">
      <v-icon large left color="white">mdi-text-recognition</v-icon>
      <span class="title headline mb-1">{{ description }}</span>
    </v-card-title>
    <v-card-subtitle class="primary white--text">
      <v-icon small left color="white">mdi-regex</v-icon>
      <span class="title headline mb-1 text-decoration-underline">{{ value }}</span>
    </v-card-subtitle>
    <v-card-text class="cardText">
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <SecondsCron v-model="secondsCron" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <MinutesCron v-model="minutesCron" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
          <HoursCron v-model="hoursCron" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" md="12" lg="12" xl="12">
          <DaysCron v-model="daysCron" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <MonthsCron v-model="monthsCron" />
        </v-col>
        <v-col cols="12" sm="6" md="6" lg="6" xl="6">
          <YearsCron v-model="yearsCron" />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style scoped>
.cardText {
  overflow: auto;
  max-height: 400px;
  min-height: 400px;
}
</style>
<script>
import SecondsCron from "@/components/SecondsCron.vue";
import MinutesCron from "@/components/MinutesCron.vue";
import HoursCron from "@/components/HoursCron.vue";
import DaysCron from "@/components/DaysCron.vue";
import MonthsCron from "@/components/MonthsCron.vue";
import YearsCron from "@/components/YearsCron.vue";
import cronstrue from "cronstrue/i18n";
import cron from "cron-validate";
const presetCronValidate = {
  override: {
    useYears: true,
    useSeconds: true,
    allowOnlyOneBlankDayField: true,
    mustHaveBlankDayField: false,
    useBlankDay: true,
    useLastDayOfMonth: true,
    useLastDayOfWeek: true,
    useNearestWeekday: true,
    useNthWeekdayOfMonth: true
  }
};
export default {
  name: "CronQuartz",
  props: {
    value: { type: String }
  },
  components: {
    SecondsCron,
    MinutesCron,
    HoursCron,
    DaysCron,
    MonthsCron,
    YearsCron
  },
  data: () => ({
    description: null,
    cronExpresion: null,
    secondsCron: "*",
    minutesCron: "*",
    hoursCron: "*",
    daysCron: {
      dayOfWeek: "*",
      dayOfMonth: "?"
    },
    monthsCron: "*",
    yearsCron: "*"
  }),
  watch: {
    value() {
      if (this.cronExpression && this.value !== this.cronExpression) {
        const cronResult = cron(this.value, presetCronValidate);
        if (cronResult.isValid()) {
          this.secondsCron = cronResult.value.seconds;
          this.minutesCron = cronResult.value.minutes;
          this.hoursCron = cronResult.value.hours;
          this.daysCron.dayOfWeek = cronResult.value.daysOfWeek;
          this.daysCron.dayOfMonth = cronResult.value.daysOfMonth;
          this.monthsCron = cronResult.value.months;
          this.yearsCron = cronResult.value.years;
        }
      }
      this.__updateValue();
    },
    secondsCron() {
      this.__updateValue();
    },
    minutesCron() {
      this.__updateValue();
    },
    hoursCron() {
      this.__updateValue();
    },
    daysCron: {
      deep: true,
      handler() {
        this.__updateValue();
      }
    },
    monthsCron() {
      this.__updateValue();
    },
    yearsCron() {
      this.__updateValue();
    }
  },
  methods: {
    __updateValue() {
      this.monthsCron = this.monthsCron.replace("@", "");
      this.daysCron.dayOfWeek = this.daysCron.dayOfWeek.replace("@", "");
      this.yearsCron = this.yearsCron.replace("@", "");
      this.cronExpression =
        this.secondsCron +
        " " +
        this.minutesCron +
        " " +
        this.hoursCron +
        " " +
        this.daysCron.dayOfMonth +
        " " +
        this.monthsCron +
        " " +
        this.daysCron.dayOfWeek +
        " " +
        this.yearsCron;
      const cronResult = cron(this.cronExpression, presetCronValidate);
      if (cronResult.isValid()) {
        this.description = cronstrue.toString(this.cronExpression, {
          locale: "es",
          dayOfWeekStartIndexZero: false
        });
        this.$emit("input", this.cronExpression);
      } else {
        const errorValue = cronResult.getError();
        this.description = errorValue;
        this.$emit("input", this.cronExpression);
      }
    }
  },
  created() {
    const cronResult = cron(this.value, presetCronValidate);
    if (cronResult.isValid()) {
      const validValue = cronResult.getValue();
      this.secondsCron = validValue.seconds;
      this.minutesCron = validValue.minutes;
      this.hoursCron = validValue.hours;
      this.daysCron = {
        dayOfWeek: validValue.daysOfWeek,
        dayOfMonth: validValue.daysOfMonth
      };
      this.monthsCron = validValue.months;
      this.yearsCron = validValue.years;
    }
    this.__updateValue();
  }
};
</script>
