<template>
  <div>
    <TopBar />
    <div class="flex overflow-hidden">
      <!-- BEGIN: Side Menu -->
      <nav class="side-nav">
        <ul>
          <!-- BEGIN: First Child -->
          <template v-for="(menu, menuKey) in formattedMenu">
            <li
              v-if="menu == 'devider'"
              :key="menu + menuKey"
              class="side-nav__devider my-6"
            ></li>
            <li v-else :key="menu + menuKey">
              <SideMenuTooltip
                tag="a"
                :content="menu.title"
                :href="getSideMenuItemHref(menu)"
                class="side-menu"
                :class="{
                  'side-menu--active': isActive(menu),
                  'side-menu--open': menu.title === openMenuTitle,
                }"
                @click="linkTo(menu, router, $event)"
              >
                <div class="side-menu__icon">
                  <component :is="menu.icon" />
                </div>
                <div class="side-menu__title">
                  {{ menu.title }}
                  <div
                    v-if="menu.subMenu"
                    class="side-menu__sub-icon"
                    :class="{
                      'transform rotate-180': menu.title === openMenuTitle,
                    }"
                  >
                    <ChevronDownIcon data-role="toggle-menu" />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul
                  v-if="menu.subMenu && menu.title === openMenuTitle"
                  class="ml-2 xl:ml-8"
                >
                  <li
                    v-for="(subMenu, subMenuKey) in menu.subMenu"
                    :key="subMenuKey"
                  >
                    <SideMenuTooltip
                      tag="a"
                      :content="subMenu.title"
                      :href="
                        subMenu.subMenu
                          ? 'javascript:;'
                          : router.resolve({ name: subMenu.name }).path
                      "
                      class="side-menu !pl-4 !xl:pl-8"
                      :class="{
                        'side-menu--active': subMenu.name === route.name,
                      }"
                      @click="linkTo(subMenu, router, $event)"
                    >
                      <div class="side-menu__icon">
                        <component :is="subMenu.icon" />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                      </div>
                    </SideMenuTooltip>
                  </li>
                </ul>
              </transition>
              <!-- END: Second Child -->
            </li>
          </template>
          <!-- END: First Child -->
        </ul>
      </nav>
      <!-- END: Side Menu -->
      <!-- BEGIN: Content -->
      <div class="content">
        <router-view />
      </div>
      <!-- END: Content -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, provide, ref, watch } from 'vue'
import { Router, RouteRecordName, useRoute, useRouter } from 'vue-router'
// @ts-ignore
import { helper as $h } from '../../utils/helper'
import TopBar from './TopBar.vue'
import SideMenuTooltip from './SideMenuTooltip.vue'
//@ts-ignore
import dom from '@left4code/tw-starter/dist/js/dom'
import useNavigationShared from './shared'
import { menu, MenuItem } from './index'

const { enter, leave, isActive } = useNavigationShared()

const route = useRoute()
const router = useRouter()
const formattedMenu = ref<any[]>([])

provide('forceActiveMenu', () => {
  formattedMenu.value = $h.toRaw(menu)
})

watch(
  computed(() => route.path),
  () => {
    formattedMenu.value = $h.toRaw(menu)
  }
)
const openMenuTitle = ref<string | null>(null)

onMounted(() => {
  dom('body').removeClass('error-page').removeClass('login').addClass('main')
  formattedMenu.value = $h.toRaw(menu)
})

const getSideMenuItemHref = (menu: MenuItem) => {
  if (!menu.subMenu)
    return router.resolve({ name: menu.name as RouteRecordName }).path
  return 'javascript:;'
}

const linkTo = (menu: MenuItem, router: Router, event: Event) => {
  if (
    (event?.target as HTMLElement | undefined)?.dataset?.role === 'toggle-menu'
  ) {
    openMenuTitle.value = openMenuTitle.value === menu.title ? null : menu.title
    return
  }
  if (menu.subMenu && menu.subMenu.length) {
    openMenuTitle.value = menu.title
    router.push({
      name: menu.subMenu[0].name as RouteRecordName,
    })
  } else {
    event.preventDefault()
    router.push({
      name: menu.name as RouteRecordName,
    })
  }
}
</script>
