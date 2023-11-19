// Utilities
import { defineStore } from 'pinia'

const LOCAL_STORAGE_KEY = 'blockly_state';

export const useAppStore = defineStore('app', {
  state: () => ({
    inputs: {},
    inputTypes: {},
    outputs: {},
    result: null,
    worker: null,
    workspaceJson: null,
    loading: true
  }),
  actions: {
    setInputVariable(input) {
      this.inputs[input.name] = input.value;
      this.inputTypes[input.name] = input.type;
      this.clearRun();
    },
    deleteInputVariable(name) {
      delete this.inputs[name];
      delete this.inputTypes[name];
      this.clearRun();
    },
    setOutputs(outputs) {
      for (const key of Object.keys(this.outputs)) {
        this.outputs[key] = outputs[key];
      }
    },
    setResult(result) {
      this.result = result;
    },
    clearRun() {
      this.result = null;
      for (const key of Object.keys(this.outputs)) {
        this.outputs[key] = null;
      }
      if (this.worker) {
        this.worker.terminate();
        this.worker = null;
      }
    },
    clearWorkspace() {
      this.clearRun();
      this.inputs = {};
      this.inputTypes = {};
      this.outputs = {};
      this.result = null;
      this.workspaceJson = null;
    },
    setWorker(worker) {
      this.worker = worker;
    },
    setPrintOutput(printOutput) {
      this.print = printOutput;
    },
    setOutputVariable(output) {
      this.outputs[output.name] = output.value;
      this.clearRun();
    },
    deleteOutputVariable(name) {
      delete this.outputs[name];
      this.clearRun();
    },
    setWorkspaceJson(json) {
      this.workspaceJson = json;
    },
    loadLocalStorage() {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const obj = JSON.parse(stored);
        if (obj.inputs) {
          this.inputs = obj.inputs;
        }
        if (obj.inputTypes) {
          this.inputTypes = obj.inputTypes;
        }
        if (obj.outputs) {
          this.outputs = obj.outputs;
        }
        if (obj.result) {
          this.result = obj.result;
        }
        if (obj.json) {
          this.workspaceJson = obj.json;
        }
      }
      this.loading = false;
    }
  }
})

export function localStoragePlugin({ store }) {
  store.$subscribe((mutation, state) => {
    if (!state.loading) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
        inputs: state.inputs,
        inputTypes: state.inputTypes,
        outputs: state.outputs,
        result: state.result,
        json: state.workspaceJson
      }))
    }
  })
}