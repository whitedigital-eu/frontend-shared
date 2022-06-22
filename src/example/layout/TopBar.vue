<template>
  <!-- BEGIN: Top Bar -->
  <div
    class="top-bar-boxed h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] -mt-7 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700"
  >
    <div class="h-full flex items-center">
      <!-- BEGIN: Logo -->
      <a href="" class="logo -intro-x hidden md:flex xl:w-[180px] block">
        <!--        <img alt="..." class="logo__image w-6" src="@/assets/images/logo.svg" />-->
        <span class="logo__text text-white text-lg ml-3">WD</span>
      </a>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <nav aria-label="breadcrumb" class="-intro-x h-[45px]">
        <ol class="breadcrumb breadcrumb-light">
          <li class="breadcrumb-item"><a href="#">Application</a></li>
          <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
        </ol>
      </nav>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: Account Menu -->
      <Dropdown class="intro-x w-8 h-8">
        <DropdownToggle
          tag="div"
          role="button"
          class="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
          ref="dropdownToggle"
        >
          <img alt="..." />
        </DropdownToggle>
        <DropdownMenu class="w-56">
          <DropdownContent
            class="bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white"
          >
            <DropdownHeader tag="div" class="!font-normal">
              <div class="font-medium">Jānis Bērziņš</div>
              <div class="text-xs text-white/60 mt-0.5 dark:text-slate-500">
                Galvenais izmeklētājs
              </div>
            </DropdownHeader>
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <LockIcon class="w-4 h-4 mr-2" />
              Mainīt paroli
            </DropdownItem>
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <HelpCircleIcon class="w-4 h-4 mr-2" />
              KiberKuba lietotāja instrukcija
            </DropdownItem>
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <FolderIcon class="w-4 h-4 mr-2" />
              Dokumentu paraugi
            </DropdownItem>
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem
              class="dropdown-item hover:bg-white/5"
              @click="handleLogOff"
            >
              <ToggleRightIcon class="w-4 h-4 mr-2" />
              Atteikties
            </DropdownItem>
          </DropdownContent>
        </DropdownMenu>
      </Dropdown>
      <!-- END: Account Menu -->
    </div>
  </div>
  <!-- END: Top Bar -->
</template>

<script setup>
import { ref } from 'vue'

const dropdownToggle = ref()

const handleLogOff = () => {
  dropdownToggle.value.$el.click()
}

const reloadPage = () => window.location.reload()
</script>
