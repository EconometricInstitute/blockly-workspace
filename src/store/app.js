// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    inputs: {},
    outputs: {},
    result: null,
  }),
  actions: {
    setInputVariable(input) {
      this.inputs[input.name] = input.value;
    },
    deleteInputVariable(name) {
      delete this.inputs[name];
    },
    setOutputVariable(output) {
      this.outputs[output.name] = output.value;
    },
    deleteOutputVariable(name) {
      delete this.outputs[name];
    }
  }
})
