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
    setOutputs(outputs) {
      for (const key of Object.keys(this.outputs)) {
        this.outputs[key] = outputs[key];
      }
    },
    setResult(result) {
      this.result = result;
    },
    setOutputVariable(output) {
      this.outputs[output.name] = output.value;
    },
    deleteOutputVariable(name) {
      delete this.outputs[name];
    }
  }
})
