<template>
  <v-card>
    <v-card-title>
      <v-icon large left>mdi-clock-outline</v-icon>
      <span class="title headline mb-1">Al segundo</span>
    </v-card-title>
    <v-card-text>
      <v-radio-group @change="resetSecondData" v-model="secondOption.key">
        <v-radio label="Cada segundo" value="everySecond"></v-radio>
        <v-radio value="everySecondAt">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="everyAnySecond"
                    @input="everyAnySecondFn"
                    prefix="Cada"
                    suffix="segundo(s)"
                    item-text="secondLabel"
                    item-value="secondValue"
                    :items="secondsList"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="startSecond"
                    @input="startSecondFn"
                    prefix="comenzando en el segundo"
                    item-text="secondLabel"
                    item-value="secondValue"
                    :items="secondsIndexList"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </v-radio>
        <v-radio value="secondsSpecific">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    v-model="secondsSpecific"
                    @change="secondsSpecificFn"
                    prefix="Segundo(s) "
                    suffix="especifico(s)"
                    item-text="secondLabel"
                    item-value="secondValue"
                    :items="secondsIndexList"
                    single-line
                    chips
                    multiple
                    deletable-chips
                  />
                </v-col>
              </v-row>
            </div>
          </template>
        </v-radio>
        <v-radio value="everySecondBetween">
          <template v-slot:label>
            <div>
              <v-row>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    @input="betweenSecondFn"
                    v-model="betweenSecond"
                    prefix="Cada segundo entre"
                    suffix="segundo(s)"
                    item-text="secondLabel"
                    item-value="secondValue"
                    :items="secondsIndexList"
                    item-disabled="disabledBetweenSecondItem"
                    single-line
                    chips
                    deletable-chips
                  />
                </v-col>
                <v-col class="pt-0 pb-0">
                  <v-select
                    class="pt-0 pb-0 mt-0"
                    @input="andSecondFn"
                    v-model="andSecond"
                    prefix="y"
                    suffix="segundo(s)"
                    item-text="secondLabel"
                    item-value="secondValue"
                    :items="secondsIndexList"
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
  name: "SecondsCron",
  props: {
    value: { type: String, default: "0" }
  },
  data: () => ({
    reseting: false,
    secondOption: {
      key: null,
      value: 0
    },
    everyAnySecond: null,
    startSecond: null,
    secondsSpecific: [],
    betweenSecond: null,
    andSecond: null,
    secondsIndexList: [],
    secondsList: []
  }),
  watch: {
    value() {
      if (this.value !== this.secondOption.value) {
        this.resetValues();
        this.secondOption.value = this.value;
        this.setValues();
      }
    },
    secondOption: {
      deep: true,
      handler(oldValue, newValue) {
        if (!this.reseting) {
          if (newValue.key === "everySecond") {
            this.secondOption.value = "*";
          }
          if (newValue.key === "everySecondAt") {
            if (!this.startSecond || this.startSecond === "") {
              this.startSecond = 0;
            }
            if (!this.everyAnySecond || this.everyAnySecond === "") {
              this.everyAnySecond = 1;
            }
            this.secondOption.value =
              parseInt(this.startSecond) + "/" + parseInt(this.everyAnySecond);
          }
          if (newValue.key === "secondsSpecific") {
            let valuesInt = [];
            if (this.secondsSpecific.length == 0) {
              this.secondsSpecific.push(0);
            }
            this.secondsSpecific.forEach((itemValue) => {
              valuesInt.push(parseInt(itemValue));
            });
            this.secondOption.value = valuesInt.toString();
          }
          if (newValue.key === "everySecondBetween") {
            if (!this.betweenSecond || this.betweenSecond === "") {
              this.betweenSecond = 0;
            }
            if (!this.andSecond || this.andSecond === "") {
              this.andSecond = 0;
            }
            this.secondOption.value =
              parseInt(this.betweenSecond) + "-" + parseInt(this.andSecond);
          }
          this.updateValue();
        }
      }
    },
    andSecond(value) {
      this.secondsIndexList = this.secondsIndexList.map((item) => {
        item.disabledBetweenSecondItem = item.secondValue > value;
        return item;
      });
    }
  },
  methods: {
    resetValues() {
      this.reseting = true;
      this.secondOption.key = null;
      this.secondOption.value = 0;
      this.everyAnySecond = null;
      this.startSecond = null;
      this.secondsSpecific = [];
      this.betweenSecond = null;
      this.andSecond = null;
      this.reseting = false;
    },
    updateValue() {
      this.$emit("input", this.secondOption.value);
    },
    resetSecondData() {
      this.secondOption.value = null;
    },
    everyAnySecondFn(e) {
      if (!e || e === "") {
        e = 0;
      }
      if (!this.startSecond || this.startSecond === "") {
        this.startSecond = 0;
      }
      this.secondOption.value = parseInt(this.startSecond) + "/" + parseInt(e);
    },
    startSecondFn(e) {
      if (!e || e === "") {
        e = 0;
      }
      if (!this.everyAnySecond || this.everyAnySecond === "") {
        this.everyAnySecond = 1;
      }
      this.secondOption.value =
        parseInt(e) + "/" + parseInt(this.everyAnySecond);
    },
    betweenSecondFn(e) {
      if (!e || e === "") {
        e = 0;
      }
      if (!this.andSecond || this.andSecond === "") {
        this.andSecond = 0;
      }
      this.secondOption.value = parseInt(e) + "-" + parseInt(this.andSecond);
    },
    andSecondFn(e) {
      if (!e || e === "") {
        e = 0;
      }
      if (!this.betweenSecond || this.betweenSecond === "") {
        this.betweenSecond = 0;
      }
      this.secondOption.value =
        parseInt(this.betweenSecond) + "-" + parseInt(e);
    },
    secondsSpecificFn(value) {
      this.secondOption.key = "secondsSpecific";
      let valuesInt = [];
      value.forEach((itemValue) => {
        valuesInt.push(parseInt(itemValue));
      });
      this.secondOption.value = valuesInt.toString();
    },
    buildSeconds() {
      for (let s = 0; s < 60; s++) {
        let indexSecondLabel = "" + s;
        if (s < 10) {
          indexSecondLabel = "0" + indexSecondLabel;
        }
        let itemSecond = {
          secondLabel: indexSecondLabel,
          secondValue: s
        };
        this.secondsIndexList.push(itemSecond);

        let secondLabel = "" + (s + 1);
        if (s < 10) {
          secondLabel = "0" + secondLabel;
        }
        itemSecond = {
          secondLabel: secondLabel,
          secondValue: s + 1
        };
        this.secondsList.push(itemSecond);
      }
    },
    setValues() {
      if (this.value.includes("*")) {
        this.secondOption.key = "everySecond";
        this.secondOption.value = this.value;
      }

      if (this.value.includes("/")) {
        this.secondOption.key = "everySecondAt";
        this.secondOption.value = this.value;
        let inputValue = this.value.split("/");
        this.everyAnySecond = parseInt(inputValue[1]);
        this.startSecond = parseInt(inputValue[0]);
      }
      if (
        this.value.includes(",") ||
        (parseInt(this.value) >= 0 && !isNaN(this.value))
      ) {
        this.secondOption.key = "secondsSpecific";
        this.secondOption.value = this.value;
        let inputValue = JSON.parse("[" + this.value + "]");
        this.secondsSpecific = inputValue;
      }

      if (this.value.includes("-")) {
        this.secondOption.key = "everySecondBetween";
        this.secondOption.value = this.value;
        let inputValue = this.value.split("-");
        this.betweenSecond = parseInt(inputValue[0]);
        this.andSecond = parseInt(inputValue[1]);
      }
    }
  },
  created() {
    this.setValues();
    this.buildSeconds();
  }
};
</script>
