<template>
    <div class="theme-switch-wrapper">
      <label class="theme-switch" for="checkbox">
            <input v-if="data.status" type="checkbox" id="checkbox" @change="toggle($event)" checked />
            <input v-else type="checkbox" id="checkbox" @change="toggle($event)" />
            <div class="slider round"></div>
      </label>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'

interface Data {
  status: boolean;
}

export default defineComponent({
  props: {
    action: Function,
    initialState: {
      type: Boolean,
      default: false
    }
  },
  setup: function (props) {
    const data = reactive<Data>({status: props.initialState || false});
    const toggle = (event: Event | MouseEvent) => {
      event.preventDefault();
      data.status = !data.status;
      if (props.action) props.action(data.status);
      console.log("DEBUG: Switch Toggled.");
      return;
    }
    return { toggle, data }
  },
});
</script>


<style scoped>
.theme-switch-wrapper {
  display: flex;
  align-items: center;
  margin: 0 5px;
}
.theme-switch {
  display: inline-block;
  height: 24px;
  position: relative;
  width: 50px;
}

.theme-switch input {
  display:none;
}

.slider {
  background-color: #ccc;
  bottom: 0;
  cursor: pointer;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  transition: .4s;
}

.slider:before {
  background-color: #fff;
  bottom: 4px;
  content: "";
  height: 16px;
  left: 4px;
  position: absolute;
  transition: .4s;
  width: 16px;
}

input:checked + .slider {
  background-color: #66bb6a;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>