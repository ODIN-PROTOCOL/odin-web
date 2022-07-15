<template>
  <textarea
    class="textarea"
    :class="classString"
    :name="name"
    :cols="cols"
    :rows="rows"
    :placeholder="placeholder"
    :readonly="readonly"
    :required="required"
    :disabled="disabled"
    :value="modelValue"
    @input="inputChange($event)"
  ></textarea>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: String },
    classString: { type: String },
    name: { type: String },
    cols: { type: Number },
    rows: { type: Number },
    placeholder: { type: String, default: 'placeholder' },
    readonly: { type: Boolean, default: false },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
  },
  setup(props, { emit }) {
    const inputChange = (event: { target: { value: string | null } }) => {
      emit('update:modelValue', event.target.value)
    }
    return { inputChange }
  },
})
</script>

<style lang="scss" scoped>
.textarea {
  resize: none;
  display: block;
  width: 100%;
  color: var(--clr__text);
  padding: 0.8rem 1.2rem;
  text-overflow: ellipsis;
  border: 0.1rem solid var(--clr__input-border);
  border-radius: 0.4rem;

  &::-webkit-input-placeholder {
    color: var(--clr__text-muted);
  }

  &::-moz-placeholder {
    color: var(--clr__text-muted);
  }

  &:-moz-placeholder {
    color: var(--clr__text-muted);
  }

  &:-ms-input-placeholder {
    color: var(--clr__text-muted);
  }

  &::placeholder {
    color: var(--clr__text-muted);
  }
}
</style>
