<template>
  <v-card>
    <v-card-title>
      <v-icon large left>
        mdi-calendar-month
      </v-icon>
      <span class="title headline mb-1">En el mes</span>
    </v-card-title>
    <v-card-text>
      <v-radio-group @change="resetMonthData" v-model="monthOption.key">
        <v-radio label="Cada mes" value="everyMonth"></v-radio>
        <v-radio value="everyMonthAt">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="everyAnyMonth"
                    @input="everyAnyMonthFn"
                    prefix="Cada"
                    suffix="mes(s)"
                    item-text="monthValue"
                    item-value="monthValue"
                    :items="monthsIndexList"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="startMonth"
                    @input="startMonthFn"
                    prefix="comenzando en el mes"
                    item-text="monthLabel"
                    item-value="monthValue"
                    :items="monthsIndexList"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </v-radio>
        <v-radio value="monthsSpecific">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="monthsSpecific"
                    @change="monthsSpecificFn"
                    prefix="Mese(s) "
                    suffix="especifico(s)"
                    item-text="monthLabel"
                    item-value="monthValue"
                    :items="monthsIndexList"
                    single-line
                    chips
                    multiple
                    deletable-chips
                  /> </v-col
              ></v-row></div
          ></template>
        </v-radio>
        <v-radio value="everyMonthBetween">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    @input="betweenMonthFn"
                    v-model="betweenMonth"
                    prefix="Cada mes entre"
                    suffix="mes(s)"
                    item-text="monthLabel"
                    item-value="monthValue"
                    :items="monthsIndexList"
                    item-disabled="disabledBetweenMonthItem"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    @input="andMonthFn"
                    v-model="andMonth"
                    prefix="y"
                    suffix="mes(s)"
                    item-text="monthLabel"
                    item-value="monthValue"
                    :items="monthsIndexList"
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
  name: "MonthsCron",
  props: {
    value: { type: String, default: "0" }
  },
  data: () => ({
    monthOption: {
      key: null,
      value: 1
    },
    everyAnyMonth: null,
    startMonth: null,
    monthsSpecific: [],
    betweenMonth: null,
    andMonth: null,
    monthsIndexList: [],
    reseting: false
  }),
  watch: {
    value() {
      if (this.value !== this.monthOption.value) {
        this.resetValues();
        this.monthOption.value = this.value;
        this.setValues();
      }
    },
    monthOption: {
      deep: true,
      handler(oldValue, newValue) {
        if (!this.reseting) {
          if (newValue.key === "everyMonth") {
            this.monthOption.value = "*";
          }
          if (newValue.key === "everyMonthAt") {
            if (!this.startMonth || this.startMonth === "") {
              this.startMonth = 1;
            }
            if (!this.everyAnyMonth || this.everyAnyMonth === "") {
              this.everyAnyMonth = 1;
            }
            this.monthOption.value =
              parseInt(this.startMonth) + "/" + parseInt(this.everyAnyMonth);
          }
          if (newValue.key === "monthsSpecific") {
            let valuesInt = [];
            if (this.monthsSpecific.length == 0) {
              this.monthsSpecific.push(1);
            }
            this.monthsSpecific.forEach((itemValue) => {
              valuesInt.push(parseInt(itemValue));
            });
            this.monthOption.value = valuesInt.toString();
          }
          if (newValue.key === "everyMonthBetween") {
            if (!this.betweenMonth || this.betweenMonth === "") {
              this.betweenMonth = 1;
            }
            if (!this.andMonth || this.andMonth === "") {
              this.andMonth = 1;
            }
            this.monthOption.value =
              parseInt(this.betweenMonth) + "-" + parseInt(this.andMonth);
          }
          this.updateValue();
        }
      }
    },
    andMonth(value) {
      this.monthsIndexList = this.monthsIndexList.map((item) => {
        item.disabledBetweenMonthItem = item.monthValue > value;
        return item;
      });
    }
  },
  methods: {
    resetValues() {
      this.reseting = true;
      this.monthOption.key = null;
      this.monthOption.value = 0;
      this.everyAnyMonths = null;
      this.startMonths = null;
      this.monthsSpecific = [];
      this.betweenMonths = null;
      this.andMonths = null;
      this.reseting = false;
    },
    updateValue() {
      this.$emit("input", this.monthOption.value + "@");
    },
    resetMonthData() {
      this.monthOption.value = null;
    },
    everyAnyMonthFn(e) {
      if (parseInt(e) < 0) {
        this.everyAnyMonth = 1;
      }
      if (!e || e === "") {
        e = 1;
      }
      if (!this.startMonth || this.startMonth === "") {
        this.startMonth = 1;
      }
      this.monthOption.value = parseInt(this.startMonth) + "/" + parseInt(e);
    },
    startMonthFn(e) {
      if (!e || e === "") {
        e = 1;
      }
      if (!this.everyAnyMonth || this.everyAnyMonth === "") {
        this.everyAnyMonth = 1;
      }
      this.monthOption.value = parseInt(e) + "/" + parseInt(this.everyAnyMonth);
    },
    betweenMonthFn(e) {
      if (!e || e === "") {
        e = 1;
      }
      if (!this.andMonth || this.andMonth === "") {
        this.andMonth = 1;
      }
      this.monthOption.value = parseInt(e) + "-" + parseInt(this.andMonth);
    },
    andMonthFn(e) {
      if (!e || e === "") {
        e = 1;
      }
      if (!this.betweenMonth || this.betweenMonth === "") {
        this.betweenMonth = 1;
      }
      this.monthOption.value = parseInt(this.betweenMonth) + "-" + parseInt(e);
    },
    monthsSpecificFn(value) {
      this.monthOption.key = "monthsSpecific";
      let valuesInt = [];
      value.forEach((itemValue) => {
        valuesInt.push(parseInt(itemValue));
      });
      this.monthOption.value = valuesInt.toString();
    },
    buildMonths() {
      for (let m = 0; m < 12; m++) {
        let indexMonthLabel = "" + m;
        if (m == 0) {
          indexMonthLabel = "Enero";
        } else if (m == 1) {
          indexMonthLabel = "Febrero";
        } else if (m == 2) {
          indexMonthLabel = "Marzo";
        } else if (m == 3) {
          indexMonthLabel = "Abril";
        } else if (m == 4) {
          indexMonthLabel = "Mayo";
        } else if (m == 5) {
          indexMonthLabel = "Junio";
        } else if (m == 6) {
          indexMonthLabel = "Julio";
        } else if (m == 7) {
          indexMonthLabel = "Agosto";
        } else if (m == 8) {
          indexMonthLabel = "Septiembre";
        } else if (m == 9) {
          indexMonthLabel = "Octubre";
        } else if (m == 10) {
          indexMonthLabel = "Noviembre";
        } else if (m == 11) {
          indexMonthLabel = "Diciembre";
        }
        let itemMonth = {
          monthLabel: indexMonthLabel,
          monthValue: m + 1
        };
        this.monthsIndexList.push(itemMonth);
      }
    },
    setValues() {
      if (this.value.includes("*")) {
        this.monthOption.key = "everyMonth";
        this.monthOption.value = this.value;
      }

      if (this.value.includes("/")) {
        this.monthOption.key = "everyMonthAt";
        this.monthOption.value = this.value;
        let inputValue = this.value.split("/");
        this.everyAnyMonth = parseInt(inputValue[1]);
        this.startMonth = parseInt(inputValue[0]);
      }

      if (
        this.value.includes(",") ||
        (parseInt(this.value) >= 0 && !isNaN(this.value))
      ) {
        this.monthOption.key = "monthsSpecific";
        this.monthOption.value = this.value;
        let inputValue = JSON.parse("[" + this.value + "]");
        this.monthsSpecific = inputValue;
      }

      if (this.value.includes("-")) {
        this.monthOption.key = "everyMonthBetween";
        this.monthOption.value = this.value;
        let inputValue = this.value.split("-");
        this.betweenMonth = parseInt(inputValue[0]);
        this.andMonth = parseInt(inputValue[1]);
      }
    }
  },
  created() {
    this.setValues();
    this.buildMonths();
  }
};
</script>
