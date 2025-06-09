<template>
  <div class="c-upload">
    <div
      class="c-upload__droppable"
      :class="{ dragging: isDragging }"
      @dragenter.prevent="onDragEnter"
      @drop.prevent="onDrop"
    >
      <article>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 19V12M12 12L14.5 14.5M12 12L9.5 14.5M8 19H7C4.23858 19 2 16.7614 2 14C2 11.4673 3.88316 9.37436 6.32568 9.04508C7.13649 6.69118 9.37075 5 12 5C15.3137 5 18 7.68629 18 11C20.2091 11 22 12.7909 22 15C22 17.2091 20.2091 19 18 19H16"
            stroke="currentColor"
            stroke-width="1"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <p v-if="!files.length">Drag & drop your files here or click to select.</p>
        <button type="button" class="btn btn-box btn-primary" @click="triggerFileInput">Select Files</button>
        <button type="button" v-if="files && files.length > 0" class="btn btn-box" @click="reset">Reset</button>
      </article>

      <input type="file" ref="fileInput" multiple :accept="acceptedFormats" @change="onFileSelect" hidden />

      <div v-if="files.length" class="c-upload__droppable__grid">
        <div v-for="(file, index) in files" :key="index" class="c-upload__item">
          <section>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 3.5V7C13 8.10457 13.8954 9 15 9H18.5M7 3H12.1716C12.702 3 13.2107 3.21071 13.5858 3.58579L18.4142 8.41421C18.7893 8.78929 19 9.29799 19 9.82843V19C19 20.1046 18.1046 21 17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3Z"
                stroke="currentColor"
                stroke-width="1"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span>
              {{ getFileType(file.type) }}
            </span>
          </section>
          <article>
            <!-- <img v-if="isImage(file)" :src="file.preview" alt="File Preview" class="c-upload__image" />
						<video v-if="isVideo(file)" :src="file.preview" controls class="c-upload__video"></video> -->
            <span>{{ file.name }}</span>
          </article>
        </div>
      </div>
    </div>
    <!-- <div class="c-upload__footer">
			<button
				type="button"
				v-if="files && files.length > 0"
				:disabled="files.length === 0 ? true : false"
				class="btn btn-lg btn-primary btn-box"
				@click="onUpload"
			>
				<span v-if="processing" class="c-spinner"> </span>
				<span>Upload files </span>
			</button>
		</div>
		<div class="c-upload__progress">
			<span :style="progressStyle"></span>
		</div> -->
  </div>
</template>

<script>
import { Field, Form, ErrorMessage } from "vee-validate";

export default {
  data() {
    return {
      isDragging: false,
      acceptedFormats: ".ttf,.otf,.woff2",
      files: [],
      progress: 0,
      processing: false
    };
  },

  computed: {
    progressStyle: function () {
      let obj = {
        width: `${this.progress * 100}%`
      };

      return obj;
    }
  },

  props: {
    handleChange: {}
  },

  methods: {
    onDragOver(event) {
      this.isDragging = true;
    },
    onDragEnter(event) {
      event.dataTransfer.dropEffect = "copy";
      this.isDragging = true;
    },
    onDragLeave() {
      this.isDragging = false;
    },
    onDrop(event) {
      event.preventDefault();
      this.isDragging = false;

      const droppedFiles = Array.from(event.dataTransfer.files).filter((file) => this.validateFile(file));
      this.sendData(droppedFiles || null);
      // if (droppedFiles.length) {
      // 	this.prepareFiles(droppedFiles);
      // }
    },
    onFileSelect(event) {
      const selectedFiles = Array.from(event.target.files).filter((file) => this.validateFile(file));

      if (selectedFiles.length) {
        this.sendData(selectedFiles || null);
        this.prepareFiles(selectedFiles);
      }
    },
    validateFile(file) {
      const validFormats = this.acceptedFormats.split(",");
      return validFormats.includes(`.${file.type.split("/")[1]}`);
    },
    prepareFiles(fileList) {
      const preparedFiles = fileList.map((file) => {
        const filePreview = URL.createObjectURL(file);
        return { name: file.name, preview: filePreview, type: file.type, raw: file };
      });
      this.files.push(...preparedFiles);
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    isImage(file) {
      return file.type.startsWith("image/");
    },
    isVideo(file) {
      return file.type.startsWith("video/");
    },
    async onUpload() {
      this.processing = true;

      this.$store.dispatch("message/onUploadStart");

      const formData = new FormData();

      for (let i = 0; i < this.files.length; i++) {
        let condition = await this.uploadFile(this.files[i]);

        this.progress = i / this.files.length;
      }

      this.progress = 1;

      this.processing = false;

      this.files = [];

      this.$store.dispatch("message/onUploadComplete");
    },
    async uploadFile(file) {
      const formData = new FormData();
      formData.append("file", file.raw);
      let success = false;

      try {
        // Send POST request to upload the images
        const response = await api.ads.upload(formData);
        success = true;
        //this.sent = true;
      } catch (err) {
        console.log(err);
        //this.error = true;
      }

      return success;
    },
    reset: function () {
      this.files = [];
    },
    setupEventListeners: function () {
      window.addEventListener("dragover", this.onDragOver);
      window.addEventListener("dragleave", this.onDragLeave);
    },
    removeEventListeners: function () {
      window.removeEventListener("dragover", this.onDragOver);
      window.removeEventListener("dragleave", this.onDragLeave);
    },
    getFileType: function (type) {
      let str = type.split("/")[1];
      str = `.${str}`;
      return str;
    },
    sendData: function (e) {
      if (this.handleChange) {
        this.handleChange(e);
      } else {
        this.$emit("update:value", e);
      }
    }
  },
  mounted: function () {
    this.setupEventListeners();
  },
  beforeDestroy() {
    this.removeEventListeners();
    // Revoke object URLs to avoid memory leaks
    this.files.forEach((file) => URL.revokeObjectURL(file.preview));
  }
};
</script>

<style lang="scss" scoped>
.c-upload {
  &__droppable {
    border: 2px dashed var(--color-bg-4);
    padding: 20px;
    text-align: center;
    transition: background-color 0.3s ease;
    border-radius: var(--border-radius-lg);
    //height: 400px;
    overflow-y: auto;
    background-color: var(--color-bg-1);
    transition: all 100ms linear;

    &.dragging {
      background-color: hsl(var(--hue-p), 50%, 10%);
      border-color: var(--color-bg-5);
    }

    &__grid {
    }

    > article {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      svg {
        width: 64px;
        height: 64px;
      }

      .btn {
        &:not(:first-child) {
          margin-left: var(--margin);
        }
      }
    }
  }

  &__item {
    display: grid;
    grid-template-columns: 64px 1fr;
    border: var(--color-bg-5) solid 2px;
    border-radius: var(--border-radius);
    padding: var(--margin-lg);

    &:not(:last-child) {
      margin-bottom: var(--margin-lg);
    }

    > section {
      position: relative;

      svg {
        width: 64px;
        height: 64px;
      }

      span {
        display: block;
        padding: 0 0.25rem;
        position: absolute;
        top: 30px;
        background-color: var(--color-bg-5);
        color: var(--color-button-font);
        font-size: var(--font-size-xs);
        font-family: var(--font-family-monospace);
        line-height: 1.2;
        border-radius: var(--border-radius-sm);
      }
    }

    > article {
      text-align: left;
      display: flex;
      align-items: center;
      width: calc(100% - 150px);

      span {
        width: 100%;
        display: block;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }

  &__image,
  &__video {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
  }

  &__footer {
    padding: var(--margin-lg);
    display: flex;
    justify-content: center;

    .c-spinner {
      margin-right: var(--margin);
    }
  }

  &__progress {
    width: 100%;
    height: 4px;
    border-radius: 4px;
    background-color: var(--color-bg-1);
    overflow: hidden;
    transition: all 100ms linear;

    > span {
      display: block;
      height: 100%;
      background-color: var(--color-primary);
    }
  }
}
</style>
