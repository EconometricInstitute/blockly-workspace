<template>
    <div>
        <v-btn color="primary" @click="addInput">Add input variable</v-btn>
        <VariableDialog ref="varDialog" @newVariable="setInputVariable($event)" />
        <template v-if="inputs && Object.keys(inputs).length > 0">
            <h3 class="top-margin">The following inputs are used for your program</h3>
            <EnvironmentDisplay :data="inputs" :deleteVar="deleteVariable" :editVar="editVariable" />
        </template>
        <ConfirmDialog ref="confirmDialog" />
    </div>
</template>

<script>
import { useAppStore } from '@/store/app';
import { mapState, mapActions } from 'pinia';
import EnvironmentDisplay from './EnvironmentDisplay';
import VariableDialog from './VariableDialog';
import ConfirmDialog from './ConfirmDialog';

export default {
    components: {
        EnvironmentDisplay,
        VariableDialog,
        ConfirmDialog
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
            this.$refs.varDialog.showDialog('Add new input variable', this.newVarName);
        },
        setType(i, type) {
            if (type != i.prevType) {
                console.log(i, type);
                i.type = type;
                i.prevType = type;
                i.defaultValue = this.defaultValues[type];
            }
        },
        editVariable(name) {
            this.$refs.varDialog.showDialog('Edit input variable', name, 'Update variable', false, true, this.inputTypes[name], this.inputs[name]);
        },
        deleteVariable(name) {
            this.$refs.confirmDialog.showDialog(
                'Delete input variable?',
                `Are you sure you want to delete the input variable '${name}'?`,
                'warning',
                () => this.deleteInputVariable(name)
            );
        },
        ...mapActions(useAppStore, ['setInputVariable', 'deleteInputVariable']),
    },
    computed: {
        newVarName() {
            return 'var_'+(Object.keys(this.inputs).length + 1);
        },
        ...mapState(useAppStore, ['inputs', 'inputTypes']),
    },
};
</script>

<style scoped>
.inputCard {
    max-width: 40em;
}

.top-margin {
    margin-top: 0.75em;
}
</style>