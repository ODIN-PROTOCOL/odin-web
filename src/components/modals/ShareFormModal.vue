<template>
  <ModalBase @close="onClose()">
    <template #title>
      <h3 class="app-form__title">Share</h3>
    </template>

    <template #main>
      <div class="receive-modal">
        <div class="receive-modal__main">
          <div class="receive-modal__social-icon-wrapper">
            <div class="receive-modal__social-icon-link">
              <a
                class="receive-modal__social-icon-link"
                :href="twitterLink"
                target="_blank"
                rel="noopener"
                aria-label="Share on Twitter"
              >
                <TwitterIcon />
                <span class="receive-modal__social-icon-text">Twitter</span>
              </a>
            </div>

            <div class="receive-modal__social-icon">
              <a
                class="receive-modal__social-icon-link"
                :href="telegramLink"
                target="_blank"
                rel="noopener"
                aria-label="Telegram"
              >
                <TelegramIcon />
                <span class="receive-modal__social-icon-text">Telegram</span>
              </a>
            </div>

            <div class="receive-modal__social-icon">
              <a
                class="receive-modal__social-icon-link"
                :href="whatsAppLink"
                target="_blank"
                rel="noopener"
                aria-label="Share on WhatsApp"
              >
                <WhatsAppIcon />
                <span class="receive-modal__social-icon-text">WhatsApp</span>
              </a>
            </div>

            <div class="receive-modal__social-icon">
              <a
                class="receive-modal__social-icon-link"
                :href="mailLink"
                target="_self"
                rel="noopener"
                aria-label="Share by E-Mail"
              >
                <MailIcon />
                <span class="receive-modal__social-icon-text">Email</span>
              </a>
            </div>
          </div>
          <QrcodeVue
            class="mg-b8"
            :value="addressLink"
            :size="136"
            render-as="svg"
          />
          <div class="receive-modal__info">
            <span class="receive-modal__info-title">Link</span>
            <div class="receive-modal__info-address">
              <span class="receive-modal__info-address-text">{{
                addressLink
              }}</span>
              <CopyButton :text="addressLink" scheme="black" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </ModalBase>
</template>

<script setup lang="ts">
import { dialogs } from '@/helpers/dialogs'
import { wallet } from '@/api/wallet'
import { ModalBase } from '@/components/modals'
import {
  MailIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsAppIcon,
} from '@/components/icons'
import QrcodeVue from 'qrcode.vue'
import CopyButton from '@/components/CopyButton.vue'

const addressLink = `/accounts/${wallet.account.address}`
const textMessage = 'MY ODIN ACCOUNT:'
const mailLink = encodeURI(`mailto:?subject=${textMessage}&body=${addressLink}`)
const telegramLink = encodeURI(
  `https://telegram.me/share/url?text=${textMessage}&url=${addressLink}`,
)
const whatsAppLink = encodeURI(
  `https://api.whatsapp.com/send/?text=${textMessage}\n${addressLink}`,
)
const twitterLink = encodeURI(
  `https://twitter.com/intent/tweet/?text=${textMessage}\n${addressLink}`,
)
const onClose = dialogs.getHandler('onClose')
</script>

<style lang="scss" scoped>
.receive-modal__main {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.receive-modal__social-icon-wrapper {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 2.4rem;
}
.receive-modal__social-icon-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
}
.receive-modal__social-icon-text {
  padding-top: 0.4rem;
  font-weight: 400;
  font-size: 1.2rem;
  line-height: 1.6rem;
  color: var(--clr__text);
}
.receive-modal__info-title {
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 2.4rem;
}
.receive-modal__info-address {
  margin-top: 0.4rem;
  display: flex;
  border-radius: 0.8rem;
  padding: 1rem 0.8rem;
  gap: 0.4rem;
}
.receive-modal__info-address-text {
  font-weight: 300;
  font-size: 1.4rem;
  line-height: 2rem;
  display: inline-block;
  @include ellipsis();
}
.receive-modal__info {
  position: relative;
  width: 100%;
}
</style>
