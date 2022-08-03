<template>
  <svg
    :class="className"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.66732 0.666672H1.66732C0.933984 0.666672 0.333984 1.26667 0.333984 2.00001V11.3333H1.66732V2.00001H9.66732V0.666672ZM11.6673 3.33334H4.33398C3.60065 3.33334 3.00065 3.93334 3.00065 4.66667V14C3.00065 14.7333 3.60065 15.3333 4.33398 15.3333H11.6673C12.4007 15.3333 13.0007 14.7333 13.0007 14V4.66667C13.0007 3.93334 12.4007 3.33334 11.6673 3.33334ZM11.6673 14H4.33398V4.66667H11.6673V14Z"
      fill="currentColor"
    />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    className?: string
    width?: number | string
    height?: number | string
  }>(),
  {
    className: '',
    width: 13,
    height: 16,
  },
)
</script>
