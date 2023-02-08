<template>
  <div>
    <div class="app-table">
      <div class="app-table__head">
        <span>Block</span>
        <span>Date and time</span>
        <span>Transactions</span>
      </div>
      <div class="app-table__body">
        <template v-if="blocks.length">
          <div
            v-for="item in blocks"
            :key="item.attributes.block_height"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">Block</span>
              <a
                class="app-table__cell-txt app-table__link"
                :href="`/blocks/${item.attributes.block_height}`"
              >
                {{ item.attributes.block_height }}
              </a>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Date and time</span>
              <span>{{
                $fDate(
                  new Date(item.attributes.block_time * 1000),
                  'HH:mm dd.MM.yy',
                )
              }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Transactions</span>
              <span>{{ item.attributes.tx_number }}</span>
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable v-if="isLoading" :header-titles="headerTitles" />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="blocksCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="getProposedBlocks"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const props = defineProps<{
  proposerAddress: string
}>()

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 5
const currentPage = ref(1)
const totalPages = ref(0)
const blocks = ref([])
const blocksCount = ref()
const headerTitles = [
  { title: 'Block' },
  { title: 'Date and time' },
  { title: 'Transactions' },
]
const getProposedBlocks = async () => {
  lockLoading()
  try {
    const response = await callers.getProposedBlocks(
      props.proposerAddress,
      currentPage.value,
      ITEMS_PER_PAGE,
    )
    const _blocks = await response.json()
    blocks.value = _blocks.data ? _blocks.data : []
    blocksCount.value = _blocks?.total_count
    totalPages.value = Math.ceil(blocksCount.value / ITEMS_PER_PAGE) - 1
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

onMounted(async () => {
  await getProposedBlocks()
})
</script>

<style lang="scss" scoped></style>
