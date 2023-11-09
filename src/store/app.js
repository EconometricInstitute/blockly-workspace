// Utilities
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    inputs: {}
  }),
  actions: {
    setVariable(input) {
      this.inputs[input.name] = input.value;
    },
    deleteVariable(name) {
      delete this.inputs[name];
    }
  }
})
