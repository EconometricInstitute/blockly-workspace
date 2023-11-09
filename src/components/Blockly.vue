<template>
    <div class="blockly" :id="divId"></div>
</template>

<script setup>
import * as Blockly from 'blockly';
</script>

<script>
let ID_COUNTER = 0;

export default {
    data: () => ({
        divId: 'blockly-div-'+(ID_COUNTER++),
        workspace: null,
    }),
    mounted() {
    // TODO: the media path is now provided by the backend - find a way to solve this issue in the frontend?
    this.workspace = Blockly.inject(this.divId); /*, {
        toolbox: this.question.toolbox,
        sounds: false,
        media: '/webjars/blockly/media/'
    });*/
    // if (this.inputAnswer && this.inputAnswer.xml) {
    //   const dom = Blockly.Xml.textToDom(this.inputAnswer.xml);
    //   Blockly.Xml.domToWorkspace(dom, this.workspace);
    // }
    this.workspace.addChangeListener(this.workspaceChanged);
  },
  methods: {
    workspaceChanged(ev) {
        console.log(ev);
    }
  }
}
</script>

<style scoped>
.blockly {
  width: 100%;
  height: 100%;
}
</style>

