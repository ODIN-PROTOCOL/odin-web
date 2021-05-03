<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import { API_CONFIG } from '@/api/api-config'
import { initTendermintClient } from '@/api/client/tendermintClient'
import { initWallet } from '@/api/client/wallet'
import { initSigningStargateClient } from '@/api/client/signingStargateClient'
import {
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupIbcExtension,
  setupStakingExtension,
} from '@cosmjs/stargate'

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup() {
    const test = async () => {
      const tendermint = await initTendermintClient()
      const [wallet] = await initWallet(API_CONFIG.mnemonic)
      const signingStargate = await initSigningStargateClient(wallet)

      const client = QueryClient.withExtensions(
        tendermint,
        setupAuthExtension,
        setupBankExtension,
        setupDistributionExtension,
        setupStakingExtension,
        setupIbcExtension
      )

      // Supply
      console.log('Total supply:', await client.bank.unverified.totalSupply())
      console.log(
        'Fee pool:',
        await client.distribution.unverified.communityPool()
      )
      // Params
      console.log(
        'Distribution params: ',
        await client.distribution.unverified.params()
      )
      console.log('Staking params: ', await client.staking.unverified.params())
    }

    test()
  },
})
</script>
