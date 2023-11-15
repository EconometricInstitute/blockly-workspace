<template>
   <div class="blockly" :id="divId"></div>
</template>

<script>
import * as Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';
import {outputCode, envToJS, getSVG, getPNGUrl, getPNGBlob} from './blockly_utils.js';
import 'blockly/media/sprites.png';

import { useAppStore } from '@/store/app';
import { mapState, mapActions } from 'pinia';

const MAX_STEPS = 50000;

const STEP_INTERVAL = 150;

let WORKSPACE_ID = 0;

export default {
  name: 'BlocklyWorkspace',
  props: ['toolbox', 'maxSteps', 'input', 'focused', 'inputAnswer'],
  mounted() {
    // TODO: the media path is now provided by the backend - find a way to solve this issue in the frontend?
    this.workspace = Blockly.inject(this.divId, {
        toolbox: this.toolbox,
        sounds: false
    });
    if (this.workspaceJson) {
      Blockly.serialization.workspaces.load(JSON.parse(this.workspaceJson), this.workspace);
    }
    // if (this.inputAnswer && this.inputAnswer.xml) {
    //   const dom = Blockly.Xml.textToDom(this.inputAnswer.xml);
    //   Blockly.Xml.domToWorkspace(dom, this.workspace);
    // }
    this.workspace.addChangeListener(this.workspaceChanged);
    this.updateVarnames();
  },
  data: () => ({
    divId: 'blockly_workspace_div_'+(WORKSPACE_ID++),
    //workspace: null,
    workspaceXML: '',
    displayCode: '',
    testingCode: '',
    tracingCode: '',
    runningTrace: false,
    traceWorker: null
  }),
  methods: {
    clear() {
      if (this.workspace) {
        this.workspace.clear();
      }
    },
    workspaceChanged() {
      this.$nextTick(() => {
        const dom = Blockly.Xml.workspaceToDom(this.workspace);
        const xml = Blockly.Xml.domToText(dom);
        const json = JSON.stringify(Blockly.serialization.workspaces.save(this.workspace));
        // console.log(json);
        const code = {
          display: this.getDisplayCode(),
          trace: this.getTracingCode(),
          test: this.getTestingCode(),
          svg: this.getSVG(),
          xml,
          json
        };
        this.$emit('code', code)
      });
    },
    getTestingCode() {
        javascriptGenerator.STATEMENT_PREFIX = 'if ($step_count++ > '+(this.maxSteps || MAX_STEPS)+') throw "Too many steps. Check for infinite loops.";';
        let generated = javascriptGenerator.workspaceToCode(this.workspace);
        generated = 'var $step_count = 0;' + generated;
        javascriptGenerator.STATEMENT_PREFIX = '';
        return generated;
    },
    getDisplayCode() {
      let rawCode = javascriptGenerator.workspaceToCode(this.workspace);
      //rawCode = rawCode.substring(rawCode.indexOf("\n") + 1).trim() + '\n';
      return this.preCode + rawCode;
    },
    getTracingCode() {
      javascriptGenerator.STATEMENT_PREFIX = 'await sleep('+STEP_INTERVAL+');if ($step_count++ > '+(this.maxSteps || MAX_STEPS)+') throw "Too many steps. Check for infinite loops.";highlightBlock(%1);\n';
      let rawCodeHL = javascriptGenerator.workspaceToCode(this.workspace);
      rawCodeHL = rawCodeHL.substring(rawCodeHL.indexOf("\n") + 1).trim() + '\n';
      rawCodeHL = rawCodeHL.replace(/\s+function\s+/g, '\nasync function ');
      javascriptGenerator.STATEMENT_PREFIX = '';
      //console.log(rawCodeHL);
      return this.preCode
           + rawCodeHL
           + 'await sleep('+STEP_INTERVAL+');\n'
           + '\nhighlightBlock(\'\');\n'
           + outputCode(this.outputs, 'runFinished');
    },
    getSVG() {
      return getSVG(this.workspace);
    },
    getPNGUrl() {
      return getPNGUrl(this.workspace);
    },
    getPNGBlob() {
      return getPNGBlob(this.workspace);
    },
    highlight(blockId) {
      this.workspace.highlightBlock(blockId);
    },
    clearTrace() {
      this.workspace.highlightBlock('');
      // TODO enable/disable tracing mode?
    },
    updateVarnames() {
      if (this.workspace && this.varnames && this.workspace.getAllBlocks().length == 0) {
        const current = new Set(this.workspace.getAllVariableNames());
        const to_add = new Set();
        for (const varname of this.varnames) {
          if (!current.has(varname)) {
            to_add.add(varname);
            current.add(varname);
          }
        }
        if (to_add.size > 0) {
          const toolbox = this.workspace.toolbox_;
          // Clearing the selection is needed because of a weird glitch in Blockly
          toolbox.clearSelection();
          this.$nextTick(() => {
            for (const newVar of to_add) {
              this.workspace.createVariable(newVar);
            }
          });
        }
      }
    },
    getWorkspace() {
      return this.workspace;
    },
    setWorkspaceJson(json) {
      Blockly.serialization.workspaces.load(JSON.parse(json), this.workspace);
    }
  },
  computed: {
    ...mapState(useAppStore, ['inputs', 'outputs', 'workspaceJson']),
    preCode() {
      let result = '/* Defining input variables */\n';
      result += envToJS(this.inputs);
      result += '\n';
      result += '/* Code generated from blocks */\n';
      return result;
    },
    varnames() {
      return [...Object.keys(this.inputs), ...Object.keys(this.outputs)];
    }
  },
  watch: {
      focused() {
        this.$nextTick(() => {
            Blockly.svgResize(this.workspace);
            Blockly.resizeContents(this.workspace);
            this.workspace.resize();
            this.workspace.resizeContents();
        });          
      },
      varnames() {
        this.updateVarnames();
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.blockly {
  width: 100%;
  height: 100%;
}
</style>
