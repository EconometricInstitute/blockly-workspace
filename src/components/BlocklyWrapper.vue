<template>
    <div class="question-container">
    <div class="question-main">
      <div class="flex-grow-1">
        <BlocklyWorkspace :toolbox="toolbox" ref="workspace" @code="setCode" />
      </div>
    </div>
    <div class="question-io">
      <v-tabs class="question-iotabs" bg-color="primary" dark
        v-model="ioTab">
        <v-tab>Input</v-tab>
        <v-tab>Output</v-tab>
        <v-tab>Code</v-tab>
      </v-tabs>
      <div class="question-iocontent">
        <div v-if="ioTab == 0" class="iotab">
          <InputPanel />
        </div>
        <div v-if="ioTab == 1" class="iotab">
          <div v-if="traceOutput">
            <h4>Your program produced the following output:</h4>
            <div v-html="outputHTML"></div>
          </div>
          <div v-else-if="traceError">
            <h4>Error while running</h4>
            <v-alert type="error">
              The following error occurred while your program was executed:
              <br />
              {{traceError}}
            </v-alert>
          </div>
          <div v-else>
            <h4>This tab will contain the output of your program after you run it.</h4>
          </div> 
        </div>
        <div v-if="ioTab == 2" class="iotab">
            <h4>This is the generated JavaScript code of your program:</h4>
          <pre class="code"><code class="code">{{code.display}}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BlocklyWorkspace from './BlocklyWorkspace';
import InputPanel from './InputPanel';
import toolboxes from './toolboxes';

export default {
    components: {
        BlocklyWorkspace,
        InputPanel
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
        toolbox() {
            return toolboxes['default'];
        }
    },
    methods: {
        setCode(code) {
            this.code = code
        },
        save() {
            this.$refs.workspace.getPNGUrl().then(
                pngUrl => {
                    const link = document.createElement('a');
                    // TODO: add some timestamp?
                    link.download = 'blockly-program.png';
                    link.href = pngUrl;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
            });
        },
        copy() {
            this.$refs.workspace.getPNGUrl().then(
                pngUrl => {
                    const img = document.createElement('img');
                    document.body.appendChild(img);
                    img.onload = () => {
                        if (document.createRange) {
                            const range = document.createRange();
                            range.selectNode(img)
                            const select = window.getSelection();
                            select.removeAllRanges();
                            select.addRange(range);
                        } else {
                            const range = document.body.createTextRange();
                            range.moveToElementText(img);
                            range.select();
                        }
                        document.execCommand('copy');
                        document.body.removeChild(img);
                    };
                    img.src = pngUrl;
            });            
        }
    }
}
</script>


<style scoped>
.question-container {
  height: calc(100vh - 120px);
}

.question-main {
  height: 66.6%;
  display: flex;
  flex-direction: row;
}

.question-io {
  height: 33.3%;
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