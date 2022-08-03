<template>
  <template v-if="!$attrs.readonly && $attrs.readonly !== 'readonly'">
    <template v-if="!fileName">
      <div class="drag" v-if="drag" @dragover.prevent @drop.prevent>
        <div class="drag__wrapper" @drop="parseFile($event)">
          <div class="drag__icon">
            <FileIcon />
          </div>
          <div class="drag__title">
            <span>
              Drag and drop a file with the script code ({{ accept }})
            </span>
          </div>
          <span class="drag__text">or</span>
          <button class="drag__button">
            <span>Browse</span>
            <input id="drag__file" type="file" @change="parseFile($event)" />
          </button>
          <span class="drag__text drag__text--gray">up to 10 MB</span>
        </div>
      </div>
      <input
        v-else
        class="input-file"
        accept=""
        type="file"
        @change="parseFile($event)"
      />
    </template>
    <template v-else>
      <div class="drag">
        <div class="drag__wrapper">
          <div class="drag__icon">
            <FileIcon />
          </div>
          <div class="drag__title">
            <span>Name: {{ fileName.name }}</span>
            <span>Size: {{ fileName.size }} bytes</span>
          </div>
          <button class="drag__button mg-t8" @click="removeFile">
            Remove file
          </button>
        </div>
      </div>
    </template>
  </template>
  <template v-else>
    <p class="input-file__stub fs-cut">{{ modelValue }}</p>
  </template>
</template>

<script lang="ts">
import { getEventFile } from '@/helpers/files'
import { defineComponent, ref } from 'vue'
import { FileIcon } from '@/components/icons'

export default defineComponent({
  components: { FileIcon },
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: [File, String] },
    drag: { type: Boolean, default: false },
    accept: { type: String, default: '' },
  },
  setup(props, { emit }) {
    let fileName = ref()
    const parseFile = (event: Event | DragEvent) => {
      const file = getEventFile(event)
      if (!file) return
      emit('update:modelValue', file)
      fileName.value = { name: file.name, size: file.size }
    }

    const removeFile = () => {
      emit('update:modelValue', null)
      fileName.value = null
    }

    return { parseFile, removeFile, fileName }
  },
})
</script>

<style lang="scss" scoped>
.drag {
  border: 1px dashed var(--clr__action);
  box-sizing: border-box;
  border-radius: 8px;
  &__wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 3.5rem 2.5rem;
  }
  &__title {
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 900;
    margin: 2.4rem 0 0 0;
    color: var(--clr__action);
    display: flex;
    flex-direction: column;
    gap: 10px;
    text-align: center;
  }
  &__text {
    font-size: 1.2rem;
    color: #212529;
    padding: 0.8rem 0;
    &--gray {
      color: #6c757d;
    }
  }
  &__button {
    width: 98px;
    height: 36px;
    border: 0.1rem solid var(--clr__action);
    color: var(--clr__action);
    position: relative;
    cursor: pointer;
    border-radius: 0.4rem;
    span {
      cursor: pointer;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
    }
    input {
      cursor: pointer;
      opacity: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
