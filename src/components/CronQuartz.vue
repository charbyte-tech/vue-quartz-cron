<template>
  <div>
    <v-row>
      <v-col cols="12" xl="6">
        <v-card tile height="auto">
          <v-card-title class="primary white--text">
            <v-icon large left color="white">
              mdi-text-recognition
            </v-icon>
            <span class="title headline mb-1">{{ value.description }}</span>
          </v-card-title>
          <v-card-subtitle class="primary white--text">
            <v-icon small left color="white">
              mdi-regex
            </v-icon>
            <span class="title headline mb-1 text-decoration-underline">{{
              value.value
            }}</span>
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
      </v-col>
    </v-row>
  </div>
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
    value: { type: Object }
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
    secondsCron() {
      this.updateValue();
    },
    minutesCron() {
      this.updateValue();
    },
    hoursCron() {
      this.updateValue();
    },
    daysCron: {
      deep: true,
      handler() {
        this.updateValue();
      }
    },
    monthsCron() {
      this.updateValue();
    },
    yearsCron() {
      this.updateValue();
    }
  },
  methods: {
    updateValue() {
      this.monthsCron = this.monthsCron.replace("@", "");
      this.daysCron.dayOfWeek = this.daysCron.dayOfWeek.replace("@", "");
      this.yearsCron = this.yearsCron.replace("@", "");
      let cronExpression =
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
      const cronResult = cron(cronExpression, presetCronValidate);
      if (cronResult.isValid()) {
        let expresionData = {
          value: cronExpression,
          description: cronstrue.toString(cronExpression, {
            locale: "es",
            dayOfWeekStartIndexZero: false
          })
        };
        this.$emit("input", expresionData);
      } else {
        const errorValue = cronResult.getError();
        console.log(errorValue);
        let expresionData = {
          error: errorValue
        };
        this.$emit("input", expresionData);
      }
    }
  },
  created() {
    const cronResult = cron(this.value.value, presetCronValidate);
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
    this.updateValue();
  }
};
</script>
