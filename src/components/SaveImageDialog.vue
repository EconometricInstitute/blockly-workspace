<template>
    <v-dialog persistent width="600" v-model="active">
        <v-card>
            <v-card-title>{{ title }}</v-card-title>
            <v-card-text>
                <v-container>
                    <v-row>
                        <img :style="imgStyle" :src="imgSrc" ref="image" />
                        <canvas :width="canvasWidth" :height="canvasHeight" style="display: none;" ref="canvas"></canvas>
                    </v-row>
                    <v-row>
                        <p>An image file was generated. Click the button below to download it.</p>
                        <v-btn color="primary" @click="save"><v-icon>mdi-download</v-icon> Download image file</v-btn>
                    </v-row>
                </v-container>                
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="primary" @click="hide">Done</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { copyElement } from '@/util/clipboard';

const IMAGE_MARGIN = 5;

export default {
    data: () => ({
        active: false,
        title: '',
        imgSrc: null,
        width: 1440,
        height: 900

    }),
    methods: {
        showDialog(title, imgSrc, width, height) {
            this.title = title;
            this.imgSrc = imgSrc;
            this.width = width;
            this.height = height;

            this.active = true;
        },
        hide() {
            this.active = false;
        },
        getPNGUrl() {
            const img = this.$refs.image;
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext("2d");
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
            ctx.drawImage(img, IMAGE_MARGIN, IMAGE_MARGIN);
            return canvas.toDataURL('image/png');
        },
        copy() {
            this.getPNGUrl();
            copyElement(this.$refs.canvas);
        },
        save() {
            const pngURL = this.getPNGUrl();
            const el = document.createElement('a');
            el.download = 'blockly_program.png';
            el.href = pngURL;
            document.body.appendChild(el);
            el.click();
            document.body.removeChild(el);

            copyElement(this.$refs.image);
        }
    },
    computed: {
        imgStyle() {
            return ({
                display: 'none',
                width: this.width,
                height: this.height
            })
        },
        canvasWidth() {
            return this.width + 2*IMAGE_MARGIN;
        },
        canvasHeight() {
            return this.height + 2*IMAGE_MARGIN;
        }
    }
}
</script>