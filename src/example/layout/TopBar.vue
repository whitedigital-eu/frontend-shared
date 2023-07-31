<template>
  <!-- BEGIN: Top Bar -->
  <div
    class="-mt-7 -mx-3 border-b border-white/[0.08] dark:md:from-darkmode-700 h-[70px] md:-mx-0 md:bg-gradient-to-b md:border-b-0 md:fixed md:from-slate-100 md:h-[65px] md:inset-x-0 md:mt-0 md:pt-10 md:px-10 md:to-transparent md:top-0 px-3 relative sm:-mx-8 sm:px-8 top-bar-boxed z-[51]"
  >
    <div class="flex h-full items-center">
      <!-- BEGIN: Logo -->
      <a class="-intro-x block hidden logo md:flex xl:w-[180px]" href="">
        <!--        <img alt="..." class="logo__image w-6" src="@/assets/images/logo.svg" />-->
        <span class="logo__text ml-3 text-lg text-white">WD</span>
      </a>
      <!-- END: Logo -->
      <!-- BEGIN: Breadcrumb -->
      <nav aria-label="breadcrumb" class="-intro-x h-[45px]">
        <ol class="breadcrumb breadcrumb-light">
          <li class="breadcrumb-item"><a href="#">Application</a></li>
          <li aria-current="page" class="active breadcrumb-item">Dashboard</li>
        </ol>
      </nav>
      <!-- END: Breadcrumb -->
      <!-- BEGIN: Account Menu -->
      <Dropdown class="h-8 intro-x w-8">
        <DropdownToggle
          ref="dropdownToggle"
          class="h-8 image-fit overflow-hidden rounded-full scale-110 shadow-lg w-8 zoom-in"
          role="button"
          tag="div"
        >
          <img alt="..." />
        </DropdownToggle>
        <DropdownMenu class="w-56">
          <DropdownContent
            class="before:absolute before:bg-black before:block before:inset-0 before:rounded-md before:z-[-1] bg-primary/80 text-white"
          >
            <DropdownHeader class="!font-normal" tag="div">
              <div class="font-medium">Jānis Bērziņš</div>
              <div class="dark:text-slate-500 mt-0.5 text-white/60 text-xs">
                Galvenais izmeklētājs
              </div>
            </DropdownHeader>
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <LockIcon class="h-4 mr-2 w-4" />
              Mainīt paroli
            </DropdownItem>
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <HelpCircleIcon class="h-4 mr-2 w-4" />
              KiberKuba lietotāja instrukcija
            </DropdownItem>
            <DropdownItem class="dropdown-item hover:bg-white/5">
              <FolderIcon class="h-4 mr-2 w-4" />
              Dokumentu paraugi
            </DropdownItem>
            <DropdownDivider class="border-white/[0.08]" />
            <DropdownItem
              class="dropdown-item hover:bg-white/5"
              @click="handleLogOff"
            >
              <ToggleRightIcon class="h-4 mr-2 w-4" />
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
</script>
