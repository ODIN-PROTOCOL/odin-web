<template>
  <div class="data-sources view-main">
    <div class="page-title fx-row mg-b32">
      <h2 class="view-title">Data Sources</h2>
      <button
        class="app-btn create-data-source-btn create-data-source-btn--top fx-sae"
        type="button"
        @click="createDataSource()"
      >
        Create data source
      </button>
    </div>

    <template v-if="blocks?.length">
      <div class="fx-row mg-b32">
        <p>{{ blocks.length }} data sources found</p>
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
          <span class="app-table__sort__title"> Sort by </span>
          <VuePicker
            class="_vue-picker"
            placeholder="Sort by"
            v-model="sortBySelect"
          >
            <template #dropdownInner>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption value="latest" text="Latest Update">
                  Latest Update
                </VuePickerOption>
              </div>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption value="most" text="Most Requested">
                  Most Requested
                </VuePickerOption>
              </div>
            </template>
          </VuePicker>
        </div>
        <div class="app-table__sort-source">
          <span class="app-table__sort__title">Data Source</span>
          <VuePicker
            class="_vue-picker"
            placeholder="Sort by"
            v-model="dataSourcesSelect"
          >
            <template #dropdownInner>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption value="all" text="All">All</VuePickerOption>
              </div>
              <div class="_vue-picker__dropdown-custom">
                <VuePickerOption value="mine" text="Mine">Mine</VuePickerOption>
              </div>
            </template>
          </VuePicker>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead class="table__head">
          <tr>
            <th>Data Source</th>
            <th>Description</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody class="table__body">
          <template v-if="blocks?.length">
            <tr v-for="item in blocks" :key="item.id.toString()">
              <td aria-label="Data Source">
                <TitledLink class="table-link" :text="item.name" />
              </td>
              <td aria-label="Description">
                <TitledSpan :text="item.description" />
              </td>
              <td aria-label="Timestamp">
                <div class="table-time">
                  <span>14:50</span>
                  <span>02.06.2021</span>
                </div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td>No items yet</td>
            </tr>
          </template>
        </tbody>
      </table>

      <Pagination
        @changePageNumber="paginationHandler($event)"
        :blocksPerPage="blocksPerPage"
        :total-length="totalLength"
      />
    </div>

    <button
      class="app-btn create-data-source-btn create-data-source-btn--bottom fx-sae"
      type="button"
      @click="createDataSource()"
    >
      Create data source
    </button>
  </div>
</template>

<script lang="ts">
import { callers } from '@/api/callers'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { VuePicker, VuePickerOption } from '@invisiburu/vue-picker'
import { showDataSourceFormDialog } from '@/components/modals/DataSourceFormModal.vue'
import TitledSpan from '@/components/TitledSpan.vue'
import TitledLink from '@/components/TitledLink.vue'
import Input from '@/components/inputs/Input.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'
import Pagination from '@/components/pagination/pagination.vue'
import { defineComponent, ref } from 'vue'

const LIMIT = 20

export default defineComponent({
  components: {
    TitledSpan,
    TitledLink,
    Input,
    SearchIcon,
    Pagination,
    VuePicker,
    VuePickerOption,
  },
  setup: function () {
    let currPageNumber = ref(1)
    let totalLength = ref()
    const blocks = ref()
    const blocksPerPage = 4

    const loadDataSources = async () => {
      const { dataSources, pagination } = await callers.getDataSources(
        LIMIT,
        (currPageNumber.value - 1) * LIMIT
      )
      totalLength.value = pagination?.total
      blocks.value = [...dataSources]
    }
    loadDataSources()

    const createDataSource = async () => {
      await showDataSourceFormDialog({
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
      console.group('searchInput')
      console.log(
        '%c DataSources.vue',
        'color: white; background-color: #2274A5'
      )
      console.log(
        '%c TODO: BACKEND DAITE POISK',
        'color: white; background-color: #2274A5'
      )
      console.table('value:', searchInput.value)
      console.groupEnd()
    }

    const sortBySelect = ref('latest')
    const dataSourcesSelect = ref('all')

    // Pagination
    const paginationHandler = (num: number) => {
      filterBlocks(num)
    }

    const filterBlocks = async (newPage: number) => {
      currPageNumber.value = newPage
      await loadDataSources()
    }

    return {
      blocks,
      createDataSource,
      searchInput,
      searchSubmit,
      sortBySelect,
      dataSourcesSelect,
      paginationHandler,
      currPageNumber,
      filterBlocks,
      blocksPerPage,
      totalLength,
    }
  },
})
</script>

<style lang="scss" scoped>
.table-wrapper {
  .table {
    width: 100%;
    margin: 0;
    padding: 0;
    border-collapse: collapse;
    border-spacing: 0;
  }

  table tr {
    border-bottom: 0.1rem solid #ced4da;
  }

  table th,
  table td {
    text-align: left;
    padding: 3.6rem 0 2rem 0;
    .table-time {
      display: flex;
      flex-direction: column;
    }
    .table-link {
      text-decoration: none;
      color: var(--clr__action);
    }
  }

  table th {
    font-size: 1.4rem;
    font-weight: 400;
    line-height: 2.4rem;
    letter-spacing: 1px;
    border: none;
  }

  @media (max-width: 768px) {
    table {
      width: 100%;
      border: 0;
    }

    table thead {
      display: none;
    }

    table td:before {
      content: attr(aria-label);
      text-align: left;
      float: left;
      width: 50%;
    }

    table tr {
      display: block;
    }

    table td {
      display: block;
      text-align: right;
      font-size: 13px;
      border-bottom: 1px dotted #ccc;
      border-right: 1px solid transparent;
    }

    table td:last-child {
      border-bottom: 0;
    }
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
    align-items: center;
  }
  &__sort {
    gap: 2.4rem;
    &__title {
      margin-right: 1.6rem;
    }
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

.create-data-source-btn {
  &--bottom {
    display: none;
    width: 100%;
    @media (max-width: 768px) {
      display: block;
    }
  }
  &--top {
    display: block;
    @media (max-width: 768px) {
      display: none;
    }
  }
}
@media (max-width: 768px) {
  .page-title {
    margin-bottom: 1.6rem;
  }
  .app-table {
    &__controls {
      flex-wrap: wrap;
      margin-bottom: 0;
    }
    &__search {
      width: 100%;
      margin-bottom: 0.8rem;
    }
    &__search-input {
      width: 100%;
    }
    &__sort {
      align-items: flex-start;
      flex-direction: column;
      gap: 1.6rem;
      width: 100%;
    }
    &__sort-by,
    &__sort-source {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      .vue-picker {
        width: 100%;
      }
      .vue-picker__opener {
        padding: 10px 0;
      }
    }
  }
}
</style>
