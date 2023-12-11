<template>
  <div class="app-icon">
    <template v-for="nav in navs" :key="nav.title">
      <a target="_blank" :href="social.telegram" :title="nav.title">
        <component :is="nav.icon" />
      </a>
    </template>
  </div>
</template>

<script setup lang="ts">
import { social } from '@/const'
import { Telegram, Twitter, Discord, Reddit, CoinMarketCap, Github, CoinGeko } from '@/components/icons'

const navs = [
  {
    title: 'Telegram',
    link: social.telegram,
    icon: Telegram,
  },
  {
    title: 'Twitter',
    link: social.twitter,
    icon: Twitter,
  },
  {
    title: 'Discord',
    link: social.discord,
    icon: Discord,
  },
  {
    title: 'Reddit',
    link: social.reddit,
    icon: Reddit,
  },
  {
    title: 'Coin Market Cap',
    link: social.coinmarketcap,
    icon: CoinMarketCap,
  },
  {
    title: 'Github',
    link: social.github,
    icon: Github,
  },
  {
    title: 'CoinGeko',
    link: social.coingeko,
    icon: CoinGeko,
  },
]
</script>

<style scoped>
.app-icon {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.app-icon a {
  width: 2rem;
  text-decoration: none;
}

.app-icon a svg {
  width: 2rem;
}
</style>
