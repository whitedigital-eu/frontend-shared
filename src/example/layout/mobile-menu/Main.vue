<template>
  <!-- BEGIN: Mobile Menu -->
  <div class="md:hidden mobile-menu">
    <div class="mobile-menu-bar">
      <a class="flex mr-auto" href="">
        <!--        <img-->
        <!--          alt="Enigma Tailwind HTML Admin Template"-->
        <!--          class="w-6"-->
        <!--          src="@/assets/images/logo.svg"-->
        <!--        />-->
      </a>
      <BarChart2Icon
        class="-rotate-90 h-8 text-white transform w-8"
        @click="toggleMobileMenu"
      />
    </div>
    <transition @enter="enter" @leave="leave">
      <ul
        v-if="activeMobileMenu"
        class="border-t border-white/[0.08] hidden py-5"
      >
        <!-- BEGIN: First Child -->
        <template v-for="(menu, menuKey) in formattedMenu">
          <li
            v-if="menu == 'devider'"
            :key="menu + menuKey"
            class="menu__devider my-6"
          ></li>
          <li v-else :key="menu + menuKey">
            <a
              class="menu"
              :class="{
                'menu--active': menu.active,
                'menu--open': menu.activeDropdown,
              }"
              href="javascript:;"
              @click="linkTo(menu, router)"
            >
              <div class="menu__icon">
                <component :is="menu.icon" />
              </div>
              <div class="menu__title">
                {{ menu.title }}
                <div
                  v-if="menu.subMenu"
                  class="menu__sub-icon"
                  :class="{ 'transform rotate-180': menu.activeDropdown }"
                >
                  <ChevronDownIcon />
                </div>
              </div>
            </a>
            <!-- BEGIN: Second Child -->
            <transition @enter="enter" @leave="leave">
              <ul v-if="menu.subMenu && menu.activeDropdown">
                <li
                  v-for="(subMenu, subMenuKey) in menu.subMenu"
                  :key="subMenuKey"
                >
                  <a
                    class="menu"
                    :class="{ 'menu--active': subMenu.active }"
                    href="javascript:;"
                    @click="linkTo(subMenu, router)"
                  >
                    <div class="menu__icon">
                      <ActivityIcon />
                    </div>
                    <div class="menu__title">
                      {{ subMenu.title }}
                      <div
                        v-if="subMenu.subMenu"
                        class="menu__sub-icon"
                        :class="{
                          'transform rotate-180': subMenu.activeDropdown,
                        }"
                      >
                        <ChevronDownIcon />
                      </div>
                    </div>
                  </a>
                  <!-- BEGIN: Third Child -->
                  <transition @enter="enter" @leave="leave">
                    <ul v-if="subMenu.subMenu && subMenu.activeDropdown">
                      <li
                        v-for="(lastSubMenu, lastSubMenuKey) in subMenu.subMenu"
                        :key="lastSubMenuKey"
                      >
                        <a
                          class="menu"
                          :class="{ 'menu--active': lastSubMenu.active }"
                          href="javascript:;"
                          @click="linkTo(lastSubMenu, router)"
                        >
                          <div class="menu__icon">
                            <ZapIcon />
                          </div>
                          <div class="menu__title">
                            {{ lastSubMenu.title }}
                          </div>
                        </a>
                      </li>
                    </ul>
                  </transition>
                  <!-- END: Third Child -->
                </li>
              </ul>
            </transition>
            <!-- END: Second Child -->
          </li>
        </template>
        <!-- END: First Child -->
      </ul>
    </transition>
  </div>
  <!-- END: Mobile Menu -->
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  activeMobileMenu,
  toggleMobileMenu,
  linkTo,
  enter,
  leave,
} from './index'
import { menu } from '../index'
import _ from 'lodash'

const route = useRoute()
const router = useRouter()
const formattedMenu = ref([])
const mobileMenu = ref(menu)

watch(
  computed(() => route.path),
  () => {
    formattedMenu.value = _.cloneDeep(mobileMenu.value)
  }
)

onMounted(() => {
  formattedMenu.value = _.cloneDeep(mobileMenu.value)
})
</script>
