<template>
  <button class="back-button" @click.prevent="routerBack()">
    <back-icon />
  </button>
</template>

<script setup lang="ts">
import { Router, useRouter } from 'vue-router'
import { BackIcon } from '@/components/icons'
import { ROUTE_NAMES } from '@/enums'

withDefaults(
  defineProps<{
    text?: string
  }>(),
  { text: '' },
)

const router: Router = useRouter()

const routerBack = (): void => {
  if (router.options.history.state.back) {
    router.back()
  } else {
    router.push({ name: ROUTE_NAMES.app })
  }
}
</script>
