<template>
  <v-app>
    <v-app-bar>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-app-bar-title>Blockly Workspace</v-app-bar-title>
      <!-- <v-btn @click="copy">Copy Image</v-btn> -->
      <v-btn color="error" @click="clear"><v-icon>mdi-delete</v-icon>&nbsp;Clear</v-btn>
      <v-btn color="primary" @click="reload"><v-icon>mdi-refresh</v-icon>&nbsp;Reload</v-btn>
      <v-btn color="primary" @click="save"><v-icon>mdi-image-move</v-icon>&nbsp;Save Image</v-btn>
      <v-btn color="primary" v-if="worker" @click="stop"><v-icon>mdi-bug-stop</v-icon>&nbsp;Stop</v-btn>
      <v-btn color="primary" v-else @click="trace"><v-icon>mdi-bug-play</v-icon>&nbsp;Test</v-btn>
      <v-btn color="primary" :disabled="worker != null" @click="run"><v-icon>mdi-play</v-icon>&nbsp;Run</v-btn>
    </v-app-bar>    
    <v-navigation-drawer temporary v-model="drawer">    
    </v-navigation-drawer>
    <v-main>
      <BlocklyWrapper ref="blockly" />
      <v-dialog width="800" v-model="welcome">
        <v-card>
            <v-card-title>Work in Progress</v-card-title>
            <v-card-text>
                <v-alert type="info">
                    This Blockly Workspace is still being finalized.
                    Some easy-of-use features may still be added before the assignment is finalized.
                </v-alert>                
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="welcome = false">OK</v-btn>
            </v-card-actions>
        </v-card>
      </v-dialog>
      <ConfirmDialog ref="confirmDialog" />
    </v-main>

  </v-app>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useAppStore } from '@/store/app';

import BlocklyWrapper from '@/components/BlocklyWrapper.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';

export default {
  components: {
    BlocklyWrapper,
    ConfirmDialog
  },
  data: () => ({
    drawer: false,
    welcome: true
  }),
  computed: {
    ...mapState(useAppStore, ['worker'])
  },
  methods: {
    ...mapActions(useAppStore, ['clearWorkspace']),
    save() {
      this.$refs.blockly.save()
    },
    copy() {
      this.$refs.blockly.copy()
    },
    trace() {
      this.$refs.blockly.trace();
    },
    stop() {
      this.$refs.blockly.stop();
    },
    run() {
      this.$refs.blockly.run();
    },
    reload() {
      this.$refs.confirmDialog.showDialog(
                'Reload',
                'Are you sure you want to reload the page? Use this to recover from bugs or glitches. Your data will be saved and reloaded.',
                'warning',
                () => {
                  window.location.reload();
                }
            );
    },
    clear() {
      this.$refs.confirmDialog.showDialog(
                'Clear Workspace',
                'Are you sure you want to clear your program and start over?',
                'warning',
                () => {
                  this.clearWorkspace();
                  this.$refs.blockly.clear();
                }
            );
    }
  }
}
</script>