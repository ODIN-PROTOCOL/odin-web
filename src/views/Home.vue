<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <button type="button" @click="openDialog()">OPEN DIALOG</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src
import { getTendermintClient } from '@/api/client/tendermintClient'
import {
  QueryClient,
  setupAuthExtension,
  setupBankExtension,
  setupDistributionExtension,
  setupIbcExtension,
  setupStakingExtension,
} from '@cosmjs/stargate'
import { showTestDialog } from '@/components/modals/TestModal.vue'
import Long from 'long'
import { setupOracleExtension } from '@/api/query-client-ext/oracleExtension'

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
  setup() {
    const test = async () => {
      const client = QueryClient.withExtensions(
        getTendermintClient(),
        setupAuthExtension,
        setupBankExtension,
        setupDistributionExtension,
        setupStakingExtension,
        setupIbcExtension,
        setupOracleExtension
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

      // console.log(
      //   'Data source: ',
      //   await client.oracle.unverified.dataSource(new Long(1))
      // )
      console.log(
        'Data sources: ',
        await client.oracle.unverified.dataSources(new Long(2), new Long(0))
      )
      // console.log(
      //   'Oracle script: ',
      //   await client.oracle.unverified.oracleScript(new Long(1))
      // )
      console.log(
        'Oracle scripts: ',
        await client.oracle.unverified.oracleScripts(new Long(2), new Long(0))
      )
    }

    test()

    return {
      openDialog: async () => {
        const res = await showTestDialog('Boy')
        console.log('RESULT:', res)
      },
    }
  },
})
</script>
