// Utilities
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY = 'blockly_state';

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
    },
    loadLocalStorage() {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const obj = JSON.parse(stored);
        if (obj.inputs) {
          this.inputs = obj.inputs;
        }
        if (obj.outputs) {
          this.outputs = obj.outputs;
        }
        if (obj.result) {
          this.result = obj.result;
        }
      }
    }
  }
})

export function localStoragePlugin({ store }) {
  store.$subscribe((mutation, state) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      inputs: state.inputs,
      outputs: state.outputs,
      result: state.result,
    }))
  })
}