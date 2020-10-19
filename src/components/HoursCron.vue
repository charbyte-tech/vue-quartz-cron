<template>
  <v-card>
    <v-card-title>
      <v-icon large left>
        mdi-calendar-clock
      </v-icon>
      <span class="title headline mb-1">En la hora</span>
    </v-card-title>
    <v-card-text>
      <v-radio-group @change="resetHourData" v-model="hourOption.key">
        <v-radio label="Cada hora" value="everyHour"></v-radio>
        <v-radio value="everyHourAt">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="everyAnyHour"
                    @input="everyAnyHourFn"
                    prefix="Cada"
                    suffix="hora(s)"
                    item-text="hourLabel"
                    item-value="hourValue"
                    :items="hoursList"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="startHour"
                    @input="startHourFn"
                    prefix="comenzando en la hora"
                    item-text="hourLabel"
                    item-value="hourValue"
                    :items="hoursIndexList"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </v-radio>
        <v-radio value="hoursSpecific">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="hoursSpecific"
                    @change="hoursSpecificFn"
                    prefix="Horas(s) "
                    suffix="especifica(s)"
                    item-text="hourLabel"
                    item-value="hourValue"
                    :items="hoursIndexList"
                    single-line
                    chips
                    multiple
                    deletable-chips
                  /> </v-col
              ></v-row></div
          ></template>
        </v-radio>
        <v-radio value="everyHourBetween">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    @input="betweenHourFn"
                    v-model="betweenHour"
                    prefix="Cada hora entre"
                    suffix="hora(s)"
                    item-text="hourLabel"
                    item-value="hourValue"
                    :items="hoursIndexList"
                    item-disabled="disabledBetweenHourItem"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    @input="andHourFn"
                    v-model="andHour"
                    prefix="y"
                    suffix="hora(s)"
                    item-text="hourLabel"
                    item-value="hourValue"
                    :items="hoursIndexList"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </v-radio>
      </v-radio-group>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: "HoursCron",
  props: {
    value: { type: String, default: "0" }
  },
  data: () => ({
    hourOption: {
      key: null,
      value: 0
    },
    everyAnyHour: null,
    startHour: null,
    hoursSpecific: [],
    betweenHour: null,
    andHour: null,
    hoursIndexList: [],
    hoursList: [],
    reseting: false
  }),
  watch: {
    value() {
      if (this.value !== this.hourOption.value) {
        this.resetValues();
        this.hourOption.value = this.value;
        this.setValues();
      }
    },
    hourOption: {
      deep: true,
      handler(oldValue, newValue) {
        if (!this.reseting) {
          if (newValue.key === "everyHour") {
            this.hourOption.value = "*";
          }
          if (newValue.key === "everyHourAt") {
            if (!this.startHour || this.startHour === "") {
              this.startHour = 0;
            }
            if (!this.everyAnyHour || this.everyAnyHour === "") {
              this.everyAnyHour = 1;
            }
            this.hourOption.value =
              parseInt(this.startHour) + "/" + parseInt(this.everyAnyHour);
          }
          if (newValue.key === "hoursSpecific") {
            let valuesInt = [];
            if (this.hoursSpecific.length == 0) {
              this.hoursSpecific.push(0);
            }
            this.hoursSpecific.forEach((itemValue) => {
              valuesInt.push(parseInt(itemValue));
            });
            this.hourOption.value = valuesInt.toString();
          }
          if (newValue.key === "everyHourBetween") {
            if (!this.betweenHour || this.betweenHour === "") {
              this.betweenHour = 0;
            }
            if (!this.andHour || this.andHour === "") {
              this.andHour = 0;
            }
            this.hourOption.value =
              parseInt(this.betweenHour) + "-" + parseInt(this.andHour);
          }
          this.updateValue();
        }
      }
    },
    andHour(value) {
      this.hoursIndexList = this.hoursIndexList.map((item) => {
        item.disabledBetweenHourItem = item.hourValue > value;
        return item;
      });
    }
  },
  methods: {
    resetValues() {
      this.reseting = true;
      this.hourOption.key = null;
      this.hourOption.value = 0;
      this.everyAnyHours = null;
      this.startHours = null;
      this.hoursSpecific = [];
      this.betweenHours = null;
      this.andHours = null;
      this.reseting = false;
    },
    updateValue() {
      this.$emit("input", this.hourOption.value);
    },
    resetHourData() {
      this.hourOption.value = null;
    },
    everyAnyHourFn(e) {
      if (!e || e === "") {
        e = 1;
      }
      if (!this.startHour || this.startHour === "") {
        this.startHour = 0;
      }
      this.hourOption.value = parseInt(this.startHour) + "/" + parseInt(e);
    },
    startHourFn(e) {
      if (!e || e === "") {
        e = 0;
      }
      if (!this.everyAnyHour || this.everyAnyHour === "") {
        this.everyAnyHour = 1;
      }
      this.hourOption.value = parseInt(e) + "/" + parseInt(this.everyAnyHour);
    },
    betweenHourFn(e) {
      if (!e || e === "") {
        e = 0;
      }
      if (!this.andHour || this.andHour === "") {
        this.andHour = 0;
      }
      this.hourOption.value = parseInt(e) + "-" + parseInt(this.andHour);
    },
    andHourFn(e) {
      if (!e || e === "") {
        e = 0;
      }
      if (!this.betweenHour || this.betweenHour === "") {
        this.betweenHour = 0;
      }
      this.hourOption.value = parseInt(this.betweenHour) + "-" + parseInt(e);
    },
    hoursSpecificFn(value) {
      this.hourOption.key = "hoursSpecific";
      let valuesInt = [];
      value.forEach((itemValue) => {
        valuesInt.push(parseInt(itemValue));
      });
      this.hourOption.value = valuesInt.toString();
    },
    buildHours() {
      for (let h = 0; h < 24; h++) {
        let indexHourLabel = "" + h;
        if (h < 10) {
          indexHourLabel = "0" + indexHourLabel;
        }
        let itemHour = {
          hourLabel: indexHourLabel,
          hourValue: h
        };
        this.hoursIndexList.push(itemHour);

        let hourLabel = "" + (h + 1);
        if (h < 10) {
          hourLabel = "0" + hourLabel;
        }
        itemHour = {
          hourLabel: hourLabel,
          hourValue: h + 1
        };

        this.hoursList.push(itemHour);
      }
    },
    setValues() {
      if (this.value.includes("*")) {
        this.hourOption.key = "everyHour";
        this.hourOption.value = this.value;
      }

      if (this.value.includes("/")) {
        this.hourOption.key = "everyHourAt";
        this.hourOption.value = this.value;
        let inputValue = this.value.split("/");
        this.everyAnyHour = parseInt(inputValue[1]);
        this.startHour = parseInt(inputValue[0]);
      }

      if (
        this.value.includes(",") ||
        (parseInt(this.value) >= 0 && !isNaN(this.value))
      ) {
        this.hourOption.key = "hoursSpecific";
        this.hourOption.value = this.value;
        let inputValue = JSON.parse("[" + this.value + "]");
        this.hoursSpecific = inputValue;
      }

      if (this.value.includes("-")) {
        this.hourOption.key = "everyHourBetween";
        this.hourOption.value = this.value;
        let inputValue = this.value.split("-");
        this.betweenHour = parseInt(inputValue[0]);
        this.andHour = parseInt(inputValue[1]);
      }
    }
  },
  created() {
    this.setValues();
    this.buildHours();
  }
};
</script>
