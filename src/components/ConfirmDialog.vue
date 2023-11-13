<template>
    <v-dialog persistent width="800" v-model="active">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>
                <v-alert :type="type">
                    {{ question }}
                </v-alert>                
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="confirm">Confirm</v-btn>
                <v-btn color="secondary" @click="cancel">Cancel</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data: () => ({
        active: false,
        title: '',
        question: '',
        type: 'info',
        confirmAction: () => {},
        cancelAction: () => {}
    }),
    methods: {
        showDialog(title, question, type, confirm, cancel) {
            this.active = true;
            this.title = title;
            this.type = type;
            this.question = question;
            this.confirmAction = confirm;
            this.cancelAction = cancel;
        },
        confirm() {
            this.active = false;
            if (this.confirmAction) {
                this.confirmAction();
            }
        },
        cancel() {
            this.active = false;
            if (this.cancelAction) {
                this.cancelAction();
            }
        }
    }
}
</script>