<template>
    <div class="outer-container">
        <SaveImageDialog ref="saveImageDialog" />
        <div class="question-container">
            <div class="question-main">
                <div class="flex-grow-1 workspace-wrapper">
                    <BlocklyWorkspace :toolbox="toolbox" ref="workspace" @code="setCode" />
                </div>
            </div>
            <div class="question-io">
                <v-tabs class="question-iotabs" bg-color="primary" dark v-model="ioTab">
                    <v-tab>Input</v-tab>
                    <v-tab>Output</v-tab>
                    <v-tab>Code</v-tab>
                </v-tabs>
                <div class="question-iocontent">
                    <div v-if="ioTab == 0" class="iotab">
                        <InputPanel />
                    </div>
                    <div v-if="ioTab == 1" class="iotab">
                        <OutputPanel />
                    </div>
                    <div v-if="ioTab == 2" class="iotab">
                        <h4>This is the generated JavaScript code of your program:</h4>
                        <pre class="code"><code class="code">{{ code.display }}</code></pre>
                    </div>
                </div>
            </div>
        </div>   
    </div>
</template>

<script>
import BlocklyWorkspace from './BlocklyWorkspace';
import InputPanel from './InputPanel';
import OutputPanel from './OutputPanel';
import toolboxes from './toolboxes';
import SaveImageDialog from './SaveImageDialog.vue';

import { useAppStore } from '@/store/app';
import { mapState, mapActions } from 'pinia';

import {evalInWorker} from './blockly_utils';
import { evalScripts } from './blockly_utils';

import { copyHtml, copyImg } from '@/util/clipboard';

export default {
    components: {
        BlocklyWorkspace,
        InputPanel,
        OutputPanel,
        SaveImageDialog,
    },
    data: () => ({
        ioTab: null,
        code: {},
        testOutput: [],
        dirty: true,
        worker: null,
        traceOutput: null,
        traceError: null
    }),
    computed: {
        ...mapState(useAppStore, ['inputs', 'outputs']),
        toolbox() {
            return toolboxes['default'];
        },
        outputCode() {
            let res = 'const $resultObj = {};\n';
            for (const key of Object.keys(this.outputs)) {
                res += '$resultObj.'+key+' = '+key+';\n';
            }
            res += 'return $resultObj;';
            return res;      
        },        
    },
    methods: {
        ...mapActions(useAppStore, ['setOutputs', 'setResult']),
        setCode(code) {
            this.code = code
        },
        save() {
            // this.$refs.workspace.getPNGUrl().then(
            //     pngUrl => {
            //       try {
            //           const link = document.createElement('a');
            //           // TODO: add some timestamp?
            //           link.download = 'blockly-program.png';
            //           link.href = pngUrl;
            //           document.body.appendChild(link);
            //           link.click();
            //           document.body.removeChild(link);
            //       }
            //       catch (err) {
            //         console.log(err);
            //       }
            // }).catch(err => console.log(err));

            const {xml, width, height } = this.$refs.workspace.getSVG();
            const svgURI = 'data:image/svg+xml,' + encodeURIComponent(xml);
            this.$refs.saveImageDialog.showDialog('Save image', svgURI, width, height);
        },
        copy() {
            // const svg = this.$refs.workspace.getSVG();
            // copyHtml(svg);
            this.$refs.workspace.getPNGUrl().then(
                pngURL => {
                    // const html = `<h3>Blockly Program</h3>\n<img src="${pngURL}" />\n<p>Hi!</p>`;
                    // copyHtml(html);
                    copyImg(pngURL);
            });            
        },
        run() {
            this.submitCode();
        },
        submitCode() {
            this.testOutput = [];
            //this.runTraceCode(true);
            this.dirty = true;
            const code = this.getTestCode();
            evalScripts([code])
            .then(resp => {
                const result = resp[0];
                this.setResult(result);
                if (!result.error) {
                    this.setOutputs(result.data);
                }
                this.ioTab = 1;
            });
            // evalInWorker(code)
            // .then(resp => console.log(code, resp));
        },
        getTestCode() {
            const generated = this.code.test || '';
            const solution = generated.substring(generated.indexOf("\n") + 1).trim() + '\n';
            const declr = generated.substring(0, generated.indexOf("\n")).trim() + '\n\n';
            let testCode = Object.entries(this.inputs).map(([k,v]) => k+'='+JSON.stringify(v)).join(';\n')+';\n';
            testCode = declr + testCode;
            testCode += solution;
            testCode += this.outputCode;
            return testCode;
        },        
        runTraceCode(fast) {
            if (!this.worker) { 
                this.traceOutput = null;
                this.traceError = null;
                this.ioTab = 2;

                const script = (fast ? this.getTestCode() : this.code.trace) || '';
                if (script) {
                if (fast) {
                    evalInWorker(script)
                    .then(res => {
                        const result = JSON.parse(res);
                        if (!result.error) {
                        this.traceOutput = result.data;
                        }
                        else {
                        this.traceError = result.data;
                        }
                    });            
                }
                else {
                    const highlight = this.$refs.workspace.highlight;
                    const finishTrace = this.finishTrace;
                    const errorTrace = this.errorTrace;
                    this.worker = evalInWorkerTrace(script, highlight, finishTrace, errorTrace);
                }
                }
                else {
                this.traceOutput = null;
                this.traceError = 'Can not run an empty program'; 
                this.ioTab = 1;
                }
            }
        },
    },
}
</script>


<style scoped>
.outer-container {
    justify-content: center;
}
.question-container {
  height: calc(100vh - 64px);
  margin: 0 auto;
  max-width: 1440px;
}

.question-main {
  height: 62.5%;
  display: flex;
  flex-direction: row;
}

.workspace-wrapper {
    margin: 0 auto;
}

.question-io {
  height: 37%;
  width: 100%;
}

.question-iotabs {
  width: 100%;
  height: 48px;
}

.question-iocontent {
  height: calc(100% - 48px);
  overflow-y: scroll;
}

.iotab {
  padding: 0.5em;
}

.instructions {
  min-width: 25em;
  max-width: 40em;
  width: 25%;
  height: calc(100% - 48px);
}

.instruction-div {
  height: 100%;
  overflow-y: scroll;
}

.instruction-text {
  display: inline-block;
}

.run-bar {
  margin-bottom: 5px;
  height: 5em;
}

.scroll {
  overflow: scroll;
}

.code {
  color: black;
  width: 100%;
}

.code::after {
  content: none !important;
}

.adjust-md code::before {
  content: "" !important
}

.adjust-md code::after {
  display: none;
}

.adjust-md code {
  box-shadow: none !important;
  color: black !important;
}

.adjust-md pre {
  margin-bottom: 16px;
}

.answercode {
  font-family: monospace;
  font-size: 105%;
}

.scroll-y {
  overflow-y: scroll;
}



.running-indicator {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.run-toolbar-el {
  margin-left: 1em;
}
</style>

<style>
.blockly-varname {
	font-family: monospace;
	font-weight: bold;
	font-size: 130%;
	background-color: whitesmoke;
}

.blockly-string {
	font-family: monospace;
	color: darkgreen;
	font-size: 110%;
}

.blockly-number {
	font-family: monospace;
	color: royalblue;
	font-size: 120%;
}

.blockly-boolean {
	font-family: monospace;
	font-weight: bold;
	color: darkmagenta;
	font-size: 120%;	
}

.blockly-inputs, .blockly-outputs {
  border-style: dotted;
  border-width: 1px;
  padding-left: 5px;
  padding-right: 5px;
}

.blockly-inputvalue, .blockly-outputvalue {
  font-family: monospace;
  font-size: 105%;
}

.blockly-outputerror {
  margin-left: 0.8em;
  font-family: monospace;
  font-size: 105%;
  color: red;
}

table.blockly-table {
  border-collapse: collapse;
	margin: 8px;
}

table.blockly-table, tr.blockly-table, td.blockly-table {
	border: 1px solid black;
}

td.blockly-table-index {
  text-align: center;
}

td.blockly-table-value {
  padding: 0 0.2em 0 0.2em;
}

</style>