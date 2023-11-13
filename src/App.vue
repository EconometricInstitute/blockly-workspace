<template>
  <v-app>
    <v-app-bar>
      <!-- <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon> -->
      <v-app-bar-title>Blockly Workspace</v-app-bar-title>
      <!-- <v-btn @click="copy">Copy Image</v-btn> -->
      <v-btn @click="save">Save Image</v-btn>
      <v-btn color="primary" @click="run"><v-icon>mdi-play</v-icon>&nbsp;Run</v-btn>
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
    </v-main>

  </v-app>
</template>

<script setup>
  import BlocklyWrapper from '@/components/BlocklyWrapper.vue'
</script>

<script>
export default {
  data: () => ({
    drawer: false,
    welcome: true
  }),
  methods: {
    save() {
      this.$refs.blockly.save()
    },
    copy() {
      this.$refs.blockly.copy()
    },
    run() {
      this.$refs.blockly.run();
    }
  }
}
</script>