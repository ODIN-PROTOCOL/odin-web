<template>
  <input
    class="input-field"
    :class="classString"
    :type="type"
    :min="min"
    :max="max"
    :maxlength="maxlength"
    :step="step"
    :name="name"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :readonly="readonly"
    :required="required"
    :disabled="disabled"
    :value="modelValue"
    @input="inputChange($event)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: { type: String },
    classString: { type: String },
    type: { type: String, default: 'text' },
    min: { type: Number },
    max: { type: Number },
    maxlength: { type: Number },
    step: { type: Number },
    name: { type: String },
    placeholder: { type: String, default: 'placeholder' },
    autocomplete: { type: String, default: 'off' },
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

<style scoped lang="scss">
.input-field {
  width: 22.8rem;
  height: 4.8rem;
  text-indent: 1.5rem;
  border: none;
  outline: none;
  &:focus::-webkit-input-placeholder {
    color: transparent;
  }
  &::-webkit-search-cancel-button {
    position: relative;
    right: 0.2rem;
  }
  &::placeholder {
    font-size: 16px;
    line-height: 2.4rem;
    font-weight: 400;
    color: var(--clr__text-muted);
  }
}
</style>
