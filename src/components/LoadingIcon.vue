<template>
  <span>
    <svg
      class="h-full w-full"
      :stroke="color"
      viewBox="-2 -2 42 42"
      width="25"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="none" fill-rule="evenodd">
        <g stroke-width="4" transform="translate(1 1)">
          <circle cx="18" cy="18" r="18" stroke-opacity=".5" />
          <path d="M36 18c0-9.94-8.06-18-18-18">
            <animateTransform
              attributeName="transform"
              dur="1s"
              from="0 18 18"
              repeatCount="indefinite"
              to="360 18 18"
              type="rotate"
            />
          </path>
        </g>
      </g>
    </svg>
  </span>
</template>

<script setup lang="ts">
const { color = '#ffffff' } = defineProps<{ color?: string }>()
</script>
