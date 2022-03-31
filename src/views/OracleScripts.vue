<template>
  <div class="view-main">
    <div class="view-main__title-wrapper">
      <h2 class="view-main__title">Oracle Scripts</h2>
      <button
        class="view-main__title-btn app-btn app-btn_small fx-sae"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>

    <template v-if="oracleScriptsCount">
      <div class="view-main__count-info">
        <p>{{ oracleScriptsCount }} oracle scripts found</p>
      </div>
    </template>

    <div class="app-table">
      <div class="app-table__head">
        <span>ID</span>
        <span>Oracle Script</span>
        <span class="app-table__head_item">Description</span>
      </div>
      <div class="app-table__body">
        <template v-if="oracleScripts?.length">
          <div
            v-for="item in oracleScripts"
            :key="item.id.toString()"
            class="app-table__row"
          >
            <div class="app-table__cell">
              <span class="app-table__title">ID</span>
              <span>{{ item.id.toNumber() }}</span>
            </div>
            <div class="app-table__cell">
              <span class="app-table__title">Oracle Script</span>
              <TitledLink
                class="app-table__cell-txt app-table__link"
                :text="item.name"
                :to="`/oracle-scripts/${item.id.toNumber()}`"
              />
            </div>
            <div class="app-table__cell oracle-scripts__table-cell_center">
              <span class="app-table__title">Description</span>
              <span>
                {{ item.description || '-' }}
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
                    v-if="accountAddress === item.owner"
                    class="app-btn app-btn_small w-min150"
                    type="button"
                    @click="editOracleScript(item)"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="app-table__empty-stub">
            <p v-if="isLoading">Loading…</p>
            <p v-else>No items yet</p>
          </div>
        </template>
      </div>
    </div>

    <template v-if="oracleScriptsCount > ITEMS_PER_PAGE">
      <Pagination
        class="mg-t32 mg-b32"
        v-model="currentPage"
        :pages="totalPages"
        @update:modelValue="paginationHandler"
      />
    </template>

    <div class="view-main__mobile-activities">
      <button
        class="app-btn w-full"
        type="button"
        @click="createOracleScript()"
      >
        Create oracle script
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { callers } from '@/api/callers'
import { wallet } from '@/api/wallet'

import { useBooleanSemaphore } from '@/composables/useBooleanSemaphore'
import { handleError } from '@/helpers/errors'
import TitledLink from '@/components/TitledLink.vue'
import Pagination from '@/components/Pagination/Pagination.vue'

import { showDialogHandler } from '@/components/modals/handlers/dialogHandler'
import OracleScriptFormModal from '@/components/modals/OracleScriptFormModal.vue'
import { OracleScript } from '@provider/codec/oracle/v1/oracle'

export default defineComponent({
  components: { TitledLink, Pagination },
  setup() {
    const [isLoading, lockLoading, releaseLoading] = useBooleanSemaphore()
    const ITEMS_PER_PAGE = 4
    const currentPage = ref(1)
    const totalPages = ref()
    const oracleScriptsCount = ref(0)
    const oracleScripts = ref()
    const accountAddress = wallet.account.address

    const loadOracleScripts = async () => {
      lockLoading()
      try {
        const response = await callers.getOracleScripts(
          ITEMS_PER_PAGE,
          (currentPage.value - 1) * ITEMS_PER_PAGE
        )

        oracleScripts.value = response.oracleScripts
        await getOracleScriptsCount()
      } catch (error) {
        handleError(error as Error)
      }
      releaseLoading()
    }

    const getOracleScriptsCount = async () => {
      const res = await callers.getCounts()
      oracleScriptsCount.value = res.oracleScriptCount.toNumber()
      totalPages.value = Math.ceil(oracleScriptsCount.value / ITEMS_PER_PAGE)
    }

    const createOracleScript = async () => {
      await showDialogHandler(OracleScriptFormModal, {
        onSubmit: async (d) => {
          d.kill()
          await loadOracleScripts()
        },
      })
    }

    const paginationHandler = (num: number) => {
      currentPage.value = num
      loadOracleScripts()
    }
    const editOracleScript = async (oracleScript: OracleScript) => {
      await showDialogHandler(
        OracleScriptFormModal,
        {
          onSubmit: async (d) => {
            d.kill()
            await loadOracleScripts()
          },
        },
        { oracleScript }
      )
    }
    onMounted(async () => {
      await loadOracleScripts()
    })

    return {
      ITEMS_PER_PAGE,
      currentPage,
      isLoading,
      oracleScriptsCount,
      oracleScripts,
      createOracleScript,
      paginationHandler,
      totalPages,
      editOracleScript,
      accountAddress,
    }
  },
})
</script>

<style lang="scss" scoped>
.view-main {
  &__count-info {
    margin-bottom: 3.2rem;
  }
}

.app-table__head,
.app-table__row {
  grid:
    auto /
    minmax(2rem, 0.5fr)
    minmax(4rem, 4fr)
    minmax(8rem, 6fr)
    minmax(8rem, 4fr);
}
.app-table__head_item {
  text-align: center;
}
.oracle-scripts {
  &__table-activities {
    width: 100%;

    & > *:not(:last-child) {
      margin-bottom: 2.4rem;
    }
  }

  &__table-activities-item {
    display: flex;
    justify-content: flex-end;
    gap: 2.4rem;
  }
  &__table-cell {
    &_center {
      justify-content: center;
    }
    &_end {
      justify-content: flex-end;
    }
  }
}
@include respond-to(tablet) {
  .view-main {
    padding-bottom: 10rem;

    &__count-info {
      margin-bottom: 0;
    }

    &__title-btn {
      display: none;
    }
  }

  .app-table__row {
    grid: none;
  }

  .oracle-scripts {
    &__table-activities {
      width: 100%;
    }

    &__table-activities-item {
      & > * {
        flex: 1;
      }
    }
    &__table-cell {
      &_center {
        justify-content: flex-start;
      }
      &_end {
        justify-content: flex-start;
      }
    }
  }
}
</style>
