<template>
  <router-view v-slot="{ Component }">
    <Transition mode="out-in">
      <component :is="Component" />
    </Transition>
  </router-view>
</template>
<script setup></script>
