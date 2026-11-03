<template>
  <div class="w-full min-w-max p-4">
    <HierarchyNode v-if="data" :node="data" :level="1" :expandable="false" />
  </div>
</template>

<script setup lang="ts">
import HierarchyNode from './HierarchyNode.vue'

import type { HierarchyData } from '@/models'

defineProps<{
  data: HierarchyData | null
}>()
</script>
