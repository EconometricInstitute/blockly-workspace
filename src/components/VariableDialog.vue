<template>
    <v-dialog persistent width="500" v-model="active">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <v-text-field density="compact" label="Variable name" :disabled="fixedname" :readonly="fixedname" v-model="name" />
                        &nbsp;
                        <v-select density="compact" label="Type" v-model="type" @update:modelValue="setType(type)" :items="types" />
                        &nbsp;
                        <ValueEdit v-if="!novalue" :type="type" :value="value" @update:modelValue="setValue($event)"/>
                    </v-row>
                </v-container>                
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="save">{{ okLabel }}</v-btn>
                <v-btn color="danger" @click="hide">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import ValueEdit from './ValueEdit';

export default {
    components: { ValueEdit },
    data: () => ({
        title: '',
        novalue: false,
        fixedname: false,
        active: false,
        name: '',
        okLabel: 'Add Variable',
        type: 'text',
        prevType: 'text',
        value: 'some text',
        types: ['text', 'number', 'boolean', 'list of text', 'list of numbers'],
        defaultValues: {
            text: 'some text',
            number: 0,
            boolean: false,
            'list of text': ['element 1'],
            'list of numbers': [0]
        }

    }),
    methods: {
        showDialog(title, varname, okLabel='Add Variable', novalue=false, fixedname=false) {
            this.title = title;
            this.name = varname;
            this.novalue = novalue;
            this.fixedname = fixedname;
            this.okLabel = okLabel;

            this.type = 'text';
            this.prevType = 'text';
            this.value = 'some text';

            this.active = true;
        },
        hide() {
            this.active = false;
        },
        save() {
            const result = {name: this.name || this.varname, value: this.novalue ? null : this.value};
            this.$emit('newVariable', result);
            this.active = false;
        },
        setType(type) {
            if (this.type != this.prevType) {
                this.type = type;
                this.prevType = type;
                this.value = this.defaultValues[type];
            }
        },
        setValue(newVal) {
            this.value = newVal;
        }
    }
}
</script>