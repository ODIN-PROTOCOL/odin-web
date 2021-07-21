<template>
  <input
    class="input"
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
    @change="inputChange($event)"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
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
.input {
  width: 228px;
  height: 48px;
  border: 1px solid #ced4da;
  border-radius: 8px 0 0 8px;
  text-indent: 15px;
  &:hover,
  &:focus {
    border: 1px solid var(--clr__action);
  }
}
</style>
