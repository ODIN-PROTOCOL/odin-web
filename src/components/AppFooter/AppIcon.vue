<template>
  <div class="app-icon">
    <a target="_blank" :href="social.telegram" title="Telegram">
      <img src="~@/assets/icons/telegram.svg" />
    </a>
    <a target="_blank" :href="social.twitter" title="Twitter">
      <img src="~@/assets/icons/twitter.svg" />
    </a>
    <a target="_blank" :href="social.discord" title="Discord">
      <img src="~@/assets/icons/discord.svg" />
    </a>
    <a target="_blank" :href="social.reddit" title="Reddit">
      <img src="~@/assets/icons/reddit.svg" />
    </a>
    <a target="_blank" :href="social.coinmarketcap" title="Coin Market Cap">
      <img src="~@/assets/icons/coinmarketcap.svg" />
    </a>
    <a target="_blank" :href="social.github" title="Github">
      <img src="~@/assets/icons/github.svg" />
    </a>
    <a target="_blank" :href="social.coingeko" title="CoinGeko">
      <img src="~@/assets/icons/coingeko.svg" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { social } from '@/const'
</script>

<style scoped>
.app-icon {
  display: flex;
  gap: 3rem;
}

.app-icon a {
  width: 2rem;
  color: var(--clr__white);
  text-decoration: none;
}
</style>
