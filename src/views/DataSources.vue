<template>
  <div class="data-sources view-main">
    <div class="fx-row mg-b32">
      <h2 class="view-title">Data Sources</h2>
      <button class="app-btn fx-sae" type="button" @click="createDataSource()">
        Create data source
      </button>
    </div>

    <template v-if="dataSources?.length">
      <div class="fx-row mg-b32">
        <p>{{ dataSources.length }} data sources found</p>
      </div>
    </template>

    <div class="app-table__controls mg-b32">
      <div class="app-table__search">
        <Input
          classString="app-table__search-input"
          v-model="searchInput"
          placeholder="Search"
          @keypress.enter="searchSubmit($event)"
        />
        <button @click="searchSubmit($event)" class="app-table__search-submit">
          <SearchIcon />
        </button>
      </div>
      <div class="app-table__sort">
        <div class="app-table__sort-by">

        </div>
        <div class="app-table__sort-source">Data Source</div>
      </div>
    </div>

    <div class="app-table">
      <div class="data-sources__table-head app-table__head">
        <div class="app-table__cell mg-b20">
          <span class="app-table__cell-txt"> Data Source </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Description </span>
        </div>
        <div class="app-table__cell">
          <span class="app-table__cell-txt"> Timestamp </span>
        </div>
      </div>
      <template v-if="dataSources?.length">
        <div
          v-for="item in dataSources"
          :key="item.id.toString()"
          class="data-sources__table-row app-table__row"
        >
          <div class="app-table__cell">
            <TitledSpan class="app-table__cell-txt" :text="item.name" />
          </div>
          <div class="app-table__cell">
            <TitledSpan class="app-table__cell-txt" :text="item.description" />
          </div>
          <div class="app-table__cell">
            <TitledSpan
              class="app-table__cell-txt"
              :text="$cropAddress(item.owner)"
              :title="item.owner"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="app-table__row">
          <p class="app-table__empty-stub">No items yet</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
import { showDataSourceFormDialog } from '@/components/modals/DataSourceFormModal.vue'
import TitledSpan from '@/components/TitledSpan.vue'
import Input from '@/components/inputs/Input.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: { TitledSpan, Input, SearchIcon },
  setup: function () {
    const dataSources = ref()
    const loadDataSources = async () => {
      const response = await callers.getDataSources(100)
      console.debug('DataSources:', response)
      dataSources.value = response.dataSources
    }
    loadDataSources()

    const createDataSource = async () => {
      showDataSourceFormDialog({
        onSubmit: (d) => {
          d.kill()
          loadDataSources()
        },
      })
    }

    // search field
    const searchInput = ref()
    const searchSubmit = (event: Event | InputEvent | MouseEvent) => {
      event.preventDefault()
      console.log(searchInput.value)
    }

    return {
      dataSources,
      createDataSource,
      searchInput,
      searchSubmit,
    }
  },
})
</script>

<style lang="scss" scoped>
.data-sources {
  &__table-head,
  &__table-row {
    grid: auto / minmax(2rem, 1fr) minmax(8rem, 2fr) minmax(1rem, 0.2fr);
  }
}
.app-table {
  &__controls {
    font-size: 14px;
    font-weight: 300;
    line-height: 2rem;
  }
  &__controls,
  &__sort {
    display: flex;
    justify-content: space-between;
  }
  &__sort {
    gap: 2.4rem;
  }
  &__search {
    display: flex;
    align-items: center;
    border-bottom: 0.1rem solid transparent;
    &-submit {
      width: 4.8rem;
      height: 4.8rem;
      border-bottom: 0.1rem solid #ced4da;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: 0.5s ease;
      svg {
        fill: #212529;
      }
      &:hover {
        background: var(--clr__action);
        svg {
          fill: #fff;
        }
      }
    }
    &-input {
      border: none;
      border-radius: 0;
      border-bottom: 0.1rem solid #ced4da;
      &:focus {
        border: none;
        border-bottom: 0.1rem solid var(--clr__action);
      }
    }
    &:hover {
      border-bottom: 0.1rem solid var(--clr__action);
      .app-table__search-submit,
      .app-table__search-input {
        border: none;
        border-bottom: 0.1rem solid var(--clr__action);
      }
    }
  }
}
</style>
