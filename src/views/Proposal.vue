<template>
  <div class="proposal view-main">
    <div class="page-title">
      <BackButton :text="'Governance'" />
      <h2 class="view-title">Proposal</h2>
      <span class="view-subtitle"> Proposal name </span>
      <router-link class="fx-sae" to="#" v-slot="{ href, navigate }">
        <button
          class="app-btn app-btn_small vote-btn vote-btn_top"
          :href="href"
          @click="navigate"
        >
          Vote
        </button>
      </router-link>
    </div>

    <div class="info-block">
      <div class="info-block__row">
        <span class="info-block__row-title">Proposer's account ID</span>
        <div class="info-block__row-value info-block__row-value_flex">
          <a class="info-block__row-link" :href="`${API_CONFIG.odinScan}/account/1`">
            0x34513b2dad6c9aae177f01839be7f44c6866df7f7ecc7110cf9d1349ce16d5d4
          </a>
          <CopyButton :text="'0x34513b2dad6c9aae177f'" />
        </div>
      </div>
      <div class="info-block__row">
        <span class="info-block__row-title">Description</span>
        <span class="info-block__row-value">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
          lectus ipsum, ultrices a libero ut, facilisis consectetur justo. Sed
          eget.
        </span>
      </div>
      <div class="info-block__row">
        <span class="info-block__row-title">Status</span>
        <StatusBlock :text="'Approved'" :status="'success'" />
      </div>
      <div class="info-block__row">
        <span class="info-block__row-title">"Support" votes</span>
        <span class="info-block__row-value">60%</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { API_CONFIG } from '@/api/api-config'
import BackButton from '@/components/BackButton.vue'
import StatusBlock from '@/components/StatusBlock.vue'
import CopyButton from '@/components/CopyButton.vue'

export default defineComponent({
  components: { BackButton, StatusBlock, CopyButton },
  setup: function () {
    return { API_CONFIG }
  }
})
</script>

<style lang="scss" scoped>
.view-title {
  margin: 0 1.6rem 0 2rem;
}

.info-block {
  &__row {
    display: flex;
    padding: 1.6rem;
    border-bottom: 1px solid var(--clr__table-border);

    &-title {
      display: inline-block;
      min-width: 18.4rem;
    }

    &-value {
      &_flex {
        display: flex;
        min-width: 0;
      }
    }

    &-link {
      @include ellipsis(inline-block);
      color: var(--clr__action);
      text-decoration: none;
    }
  }
}

@media screen and (max-width: 768px) {
  .view-title {
    margin: 0.8rem 0 0.4rem 0;
  }
}
</style>
