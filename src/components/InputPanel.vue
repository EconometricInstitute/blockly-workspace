<template>
    <div>
        <v-btn color="primary" @click="addInput">Add input variable</v-btn>
        <VariableDialog title="Add new variable" :varname="newVarName" ref="varDialog" @newVariable="setVariable($event)" />
        <h3>The following inputs are used for your program</h3>
        <EnvironmentDisplay :data="inputs" :deleteVar="deleteVariable" />
    </div>
</template>

<script>
import { useAppStore } from '@/store/app';
import { mapState, mapActions } from 'pinia';
import EnvironmentDisplay from './EnvironmentDisplay';
import VariableDialog from './VariableDialog';

export default {
    components: {
        EnvironmentDisplay,
        VariableDialog
    },
    data: () => ({
        // inputs: {},
        types: ['text', 'number', 'boolean', 'list of text', 'list of numbers'],
        defaultValues: {
            text: 'some text',
            number: 0,
            boolean: false,
            'list of text': ['first element'],
            'list of numbers': [0]
        }
    }),
    methods: {
        addInput() {
            this.$refs.varDialog.showDialog();
        },
        setType(i, type) {
            if (type != i.prevType) {
                console.log(i, type);
                i.type = type;
                i.prevType = type;
                i.defaultValue = this.defaultValues[type];
            }
        },
        // deleteVariable(ev) {
        //     delete this.inputs[ev];
        // }
        ...mapActions(useAppStore, ['setVariable', 'deleteVariable']),
    },
    computed: {
        newVarName() {
            return 'var_'+(Object.keys(this.inputs).length + 1);
        },
        ...mapState(useAppStore, ['inputs']),
    },
};
</script>

<style scoped>
.inputCard {
    max-width: 40em;
}
</style>