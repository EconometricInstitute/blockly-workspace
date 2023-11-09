<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Blockly Workspace</v-app-bar-title>
      <v-btn @click="copy">Copy Image</v-btn>
      <v-btn @click="save">Save Image</v-btn>
    </v-app-bar>    
    <v-navigation-drawer temporary v-model="drawer">    
    </v-navigation-drawer>
    <v-main>
      <BlocklyWrapper ref="blockly" />
    </v-main>

  </v-app>
</template>

<script setup>
  import BlocklyWrapper from '@/components/BlocklyWrapper.vue'
</script>

<script>
export default {
  data: () => ({
    drawer: false
  }),
  methods: {
    save() {
      this.$refs.blockly.save()
    },
    copy() {
      this.$refs.blockly.copy()
    }
  }
}
</script>