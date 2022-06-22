<template>
  <div>
    <MobileMenu />
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
                    <ChevronDownIcon />
                  </div>
                </div>
              </SideMenuTooltip>
              <!-- BEGIN: Second Child -->
              <transition @enter="enter" @leave="leave">
                <ul v-if="menu.subMenu && menu.title === openMenuTitle">
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
                      class="side-menu"
                      :class="{ 'side-menu--active': subMenu.active }"
                      @click="linkTo(subMenu, router, $event)"
                    >
                      <div class="side-menu__icon">
                        <ActivityIcon />
                      </div>
                      <div class="side-menu__title">
                        {{ subMenu.title }}
                        <div
                          v-if="subMenu.subMenu"
                          class="side-menu__sub-icon"
                          :class="{
                            'transform rotate-180': subMenu.activeDropdown,
                          }"
                        >
                          <ChevronDownIcon />
                        </div>
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
import { useRoute, useRouter } from 'vue-router'
// @ts-ignore
import TopBar from './TopBar.vue'
import MobileMenu from './mobile-menu/Main.vue'
import SideMenuTooltip from './SideMenuTooltip.vue'
import dom from '@left4code/tw-starter/dist/js/dom'
import { menu } from './index'
import useNavigationShared from './shared'
import _ from 'lodash'

const toRaw = (obj) => JSON.parse(JSON.stringify(obj))

const { enter, leave, isActive } = useNavigationShared()

const route = useRoute()
const router = useRouter()
const formattedMenu = ref<Array<any>>([])

const sideMenu = ref(menu)

provide('forceActiveMenu', () => {
  formattedMenu.value = toRaw(sideMenu.value)
})

watch(
  computed(() => route.path),
  () => {
    formattedMenu.value = toRaw(sideMenu.value)
  }
)

const openMenuTitle = ref<string | null>(null)

onMounted(() => {
  dom('body').removeClass('error-page').removeClass('login').addClass('main')
  formattedMenu.value = toRaw(sideMenu.value)
  openMenuTitle.value = route.name as string
})

const getSideMenuItemHref = (menu) => {
  if (menu.url) return menu.url
  if (!menu.subMenu) return router.resolve({ name: menu.name }).path
  return 'javascript:;'
}

const linkTo = (menu, router, event) => {
  if (event.target.dataset?.role === 'toggle-menu') {
    openMenuTitle.value = openMenuTitle.value === menu.title ? null : menu.title
    return
  }
  if (menu.urlPort) {
    return window
      .open(`http://${window.location.hostname}:${menu.urlPort}`, '_blank')
      ?.focus()
  }
  if (menu.subMenu && menu.subMenu.length) {
    openMenuTitle.value = menu.title
    router.push({
      name: menu.subMenu[0].name,
      params: menu.subMenu[0].params,
    })
  } else {
    event.preventDefault()
    router.push({
      name: menu.name,
      params: menu.params,
    })
  }
}
</script>
