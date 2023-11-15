<template>
    <v-container>
        <v-row v-if="type == 'text' || type == 'number' || type =='boolean'">
            <v-text-field density="compact" v-if="type == 'text'" label="Value" :model-value="value" @update:modelValue="updateValue($event)"/>
            <v-text-field density="compact" v-if="type == 'number'" label="Value" type="number" :model-value="value" @update:modelValue="updateValue($event)"/>
            <v-select density="compact" v-if="type == 'boolean'" label="Value" :items="boolItems" :model-value="value" @update:modelValue="updateValue($event)"/>
        </v-row>
        <template v-else>
            <v-row><h4>List Items</h4></v-row>
            <v-row v-for="(item,idx) of value">
                <v-text-field v-if="type == 'list of text'" density="compact" :label="'Item '+(idx+1)" :model-value="item" append-inner-icon="mdi-delete" @click:appendInner="removeItem(idx)" @update:modelValue="updateValue($event, idx)"/>
                <v-text-field v-if="type == 'list of numbers'" density="compact" :label="'Item '+(idx+1)" type="number" :model-value="item" append-inner-icon="mdi-delete" @click:appendInner="removeItem(idx)" @update:modelValue="updateValue($event, idx)"/>
                <v-select v-if="type == 'list of booleans'" density="compact" :label="'Item '+(idx+1)" :items="boolItems" :model-value="item" append-inner-icon="mdi-delete" @click:appendInner="removeItem(idx)" @update:modelValue="updateValue($event, idx)"/>
            </v-row>
            <v-row>
                <v-btn color="primary" label="Add item" @click="addItem">Add Item</v-btn>
            </v-row>
        </template>
    </v-container>
</template>

<script>
export default {
    props: ['type', 'value'],
    data: () => ({
        boolItems: [{title: 'false', value: false}, {title: 'true', value: true}],
    }),
    methods: {
        addItem() {
            if (this.type == 'list of numbers') {
                this.value.push(this.value.length+1);
            }
            else if (this.type == 'list of text') {
                this.value.push('element '+(this.value.length+1));
            }
            else if (this.type == 'list of booleans') {
                this.value.push(false);
            }
        },
        removeItem(idx){
            this.value.splice(idx,1);
        },
        updateValue(newVal, idx) {
            if (idx || idx === 0) {
                const newList = [...this.value];
                if (this.type === 'list of numbers') {
                    newList[idx] = Number.parseFloat(newVal);
                }
                else {
                    newList[idx] = newVal;
                }
                this.$emit('update:modelValue', newList);                
            }
            else {
                let val = newVal;
                if (this.type == 'number') {
                    val = Number.parseFloat(val);
                }
                this.$emit('update:modelValue', val);
            }
        }
    }
}
</script>

<style scoped>
.empty{
    margin: 1.5em;
}
</style>