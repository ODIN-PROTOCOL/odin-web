<template>
  <div class="oracle-scripts view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Oracle Scripts</h2>
      <button
        v-if="accountAddress"
        class="oracle-scripts__title-btn app-btn app-btn--medium"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>

    <div>
      <h3 class="view-main__subtitle mg-b24">Most requested</h3>
      <TopOracleScripts
        :top-oracle-scripts="mostRequestedOracleScripts"
        :is-loading="isLoading"
      />
    </div>

    <div class="view-main__count-info requests__count-info">
      <h3 class="view-main__subtitle mg-b24">All oracle scripts</h3>
      <skeleton-loader v-if="isLoading" height="24" width="150" shimmer pill />
      <div v-else class="view-main__count-info oracle-scripts__count-info">
        <p>{{ oracleScriptsCount }} Oracle Scripts found</p>
      </div>
    </div>

    <SortLine
      :is-loading="isLoading"
      :title="'Oracle Scripts'"
      v-model:oracleScriptsName="oracleScriptsName"
      v-model:sortingOwnersValue="sortingOwnersValue"
      v-model:sortingActivitiesValue="sortingActivitiesValue"
    />

    <div class="app-table">
      <div class="app-table__head oracle-scripts__table-head">
        <span>ID</span>
        <span>Oracle Script</span>
        <span>Description</span>
        <span>Timestamp</span>
      </div>
      <div class="app-table__body">
        <template v-if="oracleScripts?.length">
          <div
            v-for="item in oracleScripts"
            :key="item.attributes.id.toString()"
            class="app-table__row oracle-scripts__table-row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span>#{{ item.attributes.id }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.attributes.name"
                :to="{
                  name: $routes.oracleScriptDetails,
                  params: { id: item.attributes.id },
                }"
              />
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Description</span>
              <span>
                {{ item.attributes.description || 'No description' }}
              </span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Timestamp</span>
              <span>
                {{ $fDate(new Date(item.attributes.timestamp * 1000)) || '-' }}
              </span>
            </div>
            <div class="app-table__cell">
              <div
                class="app-table__activities oracle-scripts__table-activities"
              >
                <div
                  class="app-table__activities-item oracle-scripts__table-activities-item"
                >
                  <button
                    v-if="accountAddress === item.attributes.owner"
                    class="app-btn app-btn--edit"
                    type="button"
                    @click="editOracleScript(item.attributes)"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <SkeletonTable
            v-if="isLoading"
            :header-titles="headerTitles"
            class-string="oracle-scripts__table-row"
          />
          <div v-else class="app-table__empty-stub">
            <p class="empty mg-t32">No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="oracleScriptsCount > ITEMS_PER_PAGE">
      <AppPagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div v-if="accountAddress" class="view-main__mobile-activities">
      <button
        class="app-btn w-full app-btn--medium"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'
import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleNotificationInfo, TYPE_NOTIFICATION } from '@/helpers/errors'
import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'
import { ACTIVITIES_SORT, OWNERS_SORT } from '@/helpers/sortingHelpers'
import { OracleScriptFormModal } from '@/components/modals'
import TitledLink from '@/components/TitledLink.vue'
import AppPagination from '@/components/AppPagination/AppPagination.vue'
import TopOracleScripts from '@/components/TopOracleScripts.vue'
import SortLine from '@/components/SortLine.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
const ITEMS_PER_PAGE = 50
const currentPage = ref(1)
const totalPages = ref()
const oracleScriptsCount = ref(0)
const oracleScripts = ref()
const accountAddress = wallet.isEmpty ? '' : wallet.account.address
const mostRequestedOracleScripts = ref()
const oracleScriptsName = ref('')
const sortingActivitiesValue = ref(ACTIVITIES_SORT.latest)
const sortingOwnersValue = ref(OWNERS_SORT.all)
const headerTitles = [
  { title: 'ID' },
  { title: 'Oracle Script' },
  { title: 'Description' },
  { title: 'Timestamp' },
]

const getOracleScripts = async () => {
  lockLoading()
  try {
    const { data, total_count } = await callers
      .getSortedOracleScripts(
        currentPage.value - 1,
        ITEMS_PER_PAGE,
        sortingActivitiesValue.value,
        sortingOwnersValue.value,
        oracleScriptsName.value,
      )
      .then(response => response.json())
    oracleScripts.value = data
    oracleScriptsCount.value = total_count
    totalPages.value = Math.ceil(oracleScriptsCount.value / ITEMS_PER_PAGE)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

const getMostRequestedOracleScripts = async () => {
  lockLoading()
  try {
    mostRequestedOracleScripts.value = await callers
      .getSortedOracleScripts(0, 6, 'most_requested', 'null', '')
      .then(response => response.json())
      .then(data => data.data)
  } catch (error) {
    handleNotificationInfo(error as Error, TYPE_NOTIFICATION.failed)
  }
  releaseLoading()
}

watch(
  [sortingActivitiesValue, sortingOwnersValue, oracleScriptsName],
  async () => {
    currentPage.value = 1
    await getOracleScripts()
  },
)

const paginationHandler = async (num: number) => {
  currentPage.value = num
  await getOracleScripts()
}

const createOracleScript = async () => {
  await showDialogHandler(OracleScriptFormModal, {
    onSubmit: async d => {
      await getOracleScripts()
      await getMostRequestedOracleScripts()
      d.kill()
    },
  })
}

const editOracleScript = async (oracleScript: OracleScript) => {
  await showDialogHandler(
    OracleScriptFormModal,
    {
      onSubmit: async d => {
        await getOracleScripts()
        await getMostRequestedOracleScripts()
        d.kill()
      },
    },
    { oracleScript },
  )
}

onMounted(async () => {
  await getOracleScripts()
  await getMostRequestedOracleScripts()
})
</script>

<style lang="scss" scoped>
.oracle-scripts__count-info {
  margin-bottom: 3.2rem;
}

.oracle-scripts__table-head {
  padding-bottom: 0;
}
.oracle-scripts__table-row {
  align-items: center;
}
.oracle-scripts__table-head--center {
  text-align: center;
}

.oracle-scripts__table-activities {
  width: 100%;

  & > *:not(:last-child) {
    margin-bottom: 2.4rem;
  }
}

.oracle-scripts__table-activities-item {
  display: flex;
  justify-content: flex-end;
  gap: 2.4rem;
}

@include respond-to(tablet) {
  .oracle-scripts {
    padding-bottom: 10rem;
  }
  .oracle-scripts__title-btn {
    display: none;
  }
  .oracle-scripts__count-info {
    margin-bottom: 2.4rem;
  }
  .oracle-scripts__table-row {
    grid: none;
  }
  .oracle-scripts__table-activities {
    width: 100%;
  }
  .oracle-scripts__table-activities-item {
    & > * {
      flex: 1;
    }
  }
}
</style>
