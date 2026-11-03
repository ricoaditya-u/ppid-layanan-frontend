<template>
  <div class="flex flex-col items-center">
    <!-- Node Card -->
    <div
      ref="nodeCard"
      class="shrink-0 border rounded-lg shadow-sm min-w-[200px] max-w-[280px] transition-all duration-200 hover:shadow-md overflow-hidden"
      :class="levelClass"
    >
      <div class="flex flex-row">
        <div class="flex flex-col flex-1">
          <div class="flex items-center gap-2">
            <span
              class="font-semibold text-sm text-center w-full px-2 py-1"
              :class="levelBadgeClass"
            >
              {{ node.title }}
            </span>
          </div>
          <p class="p-3 text-sm text-gray-700 text-center">{{ node.body }}</p>
          <!-- Toggle hierarchy button -->
          <button
            v-if="expandable && hasChildren"
            @click="toggleExpanded"
            class="mt-2 text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            <span v-if="expanded">▼</span>
            <span v-else>▶</span>
            <span class="cursor-pointer">
              {{ expanded ? 'Tutup Detail' : 'Buka Detail' }} ({{ node.hierarchy?.length }})
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Children Container -->
    <div v-if="hasChildren && expanded" class="flex flex-col items-center">
      <!-- Vertical line from parent (not for level 4, handled separately) -->
      <!-- Height is 48px if sibling has multiple hierarchy and this node has only 1 child -->
      <div v-if="level !== 4" class="w-px bg-gray-300" :class="connectorHeightClass"></div>

      <!-- Level 5 hierarchy (Output) - vertical stacked layout -->
      <template v-if="level === 4">
        <div class="relative w-full">
          <!-- 1. Vertical line from parent center down (24px) -->
          <div class="absolute left-1/2 top-0 w-px h-6 bg-gray-300 -translate-x-1/2"></div>
          <!-- 2. Horizontal line from center going left to vertical line position -->
          <div class="absolute left-6 top-6 h-px bg-gray-300" style="width: calc(50% - 24px)"></div>
          <!-- 3. Vertical line connecting all outputs (on the left) - starts at top-6, goes down 24px more, then to center of last item -->
          <div
            class="absolute left-6 top-6 w-px bg-gray-300"
            :style="outputVerticalLineStyle"
          ></div>
          <!-- Outputs container - pt-12 = 48px (24px for connector + 24px spacing) -->
          <div ref="outputContainer" class="flex flex-col gap-2 pt-12 pl-12">
            <div
              v-for="(child, index) in node.hierarchy"
              :key="`${level}-${index}`"
              class="relative flex items-center pb-4"
            >
              <!-- 4. Horizontal line from vertical line to each output -->
              <div class="absolute -left-6 top-1/2 w-6 h-px bg-gray-300 -translate-y-1/2"></div>
              <HierarchyNode :node="child" :level="level + 1" :expandable="expandable" />
            </div>
          </div>
        </div>
      </template>

      <!-- Other levels - horizontal layout -->
      <template v-else>
        <!-- Children nodes container with pt-6 for spacing (or no padding if only 1 child and no sibling has multiple) -->
        <div
          ref="hierarchyContainer"
          class="relative flex items-start gap-4"
          :class="hierarchyContainerPaddingClass"
        >
          <!-- Horizontal line spanning from first to last child center -->
          <div
            v-if="childCount > 1"
            class="absolute top-0 h-px bg-gray-300"
            :style="horizontalLineStyle"
          ></div>
          <div
            v-for="(child, index) in node.hierarchy"
            :key="`${level}-${index}`"
            class="flex flex-col items-center"
          >
            <!-- Vertical line from horizontal line to each child -->
            <!-- Height depends on whether this child has multiple hierarchy (not grandhierarchy) -->
            <div v-if="childCount > 1" class="w-px h-6 bg-gray-300 -mt-6"></div>
            <HierarchyNode
              :node="child"
              :level="level + 1"
              :expandable="expandable"
              @update-width="updateChildWidth"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import type { HierarchyData } from '@/models'

const props = defineProps<{
  node: HierarchyData
  level: number
  expandable: boolean
}>()

const emit = defineEmits<{
  (e: 'update-width'): void
}>()

const expanded = ref(true)
const hierarchyContainer = ref<HTMLElement | null>(null)
const nodeCard = ref<HTMLElement | null>(null)
const outputContainer = ref<HTMLElement | null>(null)
const horizontalLineStyle = ref({ left: '0px', width: '0px' })
const outputVerticalLineHeight = ref('0px')

const hasChildren = computed(() => props.node.hierarchy && props.node.hierarchy.length > 0)
const childCount = computed(() => props.node.hierarchy?.length ?? 0)

// Get padding class for hierarchy container
// If this node has multiple hierarchy, add pt-6 for horizontal line spacing
const hierarchyContainerPaddingClass = computed(() => {
  if (childCount.value > 1) {
    return 'pt-6'
  }
  return ''
})

// Get connector height class
const connectorHeightClass = computed(() => {
  return 'h-6'
})

const scrollToCenter = () => {
  if (!nodeCard.value) return

  // Find the scroll container (the overflow-auto div)
  const scrollContainer = nodeCard.value.closest('.overflow-auto')
  if (!scrollContainer) return

  const containerRect = scrollContainer.getBoundingClientRect()
  const nodeRect = nodeCard.value.getBoundingClientRect()

  // Calculate the target scroll position to center the node
  const targetScrollLeft =
    scrollContainer.scrollLeft +
    (nodeRect.left - containerRect.left) -
    (containerRect.width / 2 - nodeRect.width / 2)

  const targetScrollTop =
    scrollContainer.scrollTop +
    (nodeRect.top - containerRect.top) -
    (containerRect.height / 2 - nodeRect.height / 2)

  // Clamp values to valid scroll range
  const maxScrollLeft = scrollContainer.scrollWidth - containerRect.width
  const maxScrollTop = scrollContainer.scrollHeight - containerRect.height

  scrollContainer.scrollTo({
    left: Math.max(0, Math.min(targetScrollLeft, maxScrollLeft)),
    top: Math.max(0, Math.min(targetScrollTop, maxScrollTop)),
    behavior: 'smooth'
  })
}

const toggleExpanded = () => {
  const wasExpanded = expanded.value
  expanded.value = !expanded.value
  nextTick(() => {
    updateHorizontalLine()
    updateOutputVerticalLine()
    emit('update-width')
    // Only scroll to center when expanding (Buka Detail)
    if (!wasExpanded) {
      // Wait for DOM to update with hierarchy before scrolling
      setTimeout(() => scrollToCenter(), 300)
    }
  })
}

const updateChildWidth = () => {
  nextTick(() => {
    updateHorizontalLine()
    updateOutputVerticalLine()
    emit('update-width')
  })
}

const updateHorizontalLine = () => {
  if (!hierarchyContainer.value || childCount.value <= 1) return

  const hierarchy = hierarchyContainer.value.children
  // Find first and last child elements (skip the horizontal line div)
  const childElements = Array.from(hierarchy).filter(
    (el) => el.classList.contains('flex') && el.classList.contains('flex-col')
  )

  if (childElements.length < 2) return

  const firstChild = childElements[0] as HTMLElement
  const lastChild = childElements[childElements.length - 1] as HTMLElement

  const containerRect = hierarchyContainer.value.getBoundingClientRect()
  const firstRect = firstChild.getBoundingClientRect()
  const lastRect = lastChild.getBoundingClientRect()

  // Calculate center of first and last child relative to container
  const firstCenter = firstRect.left + firstRect.width / 2 - containerRect.left
  const lastCenter = lastRect.left + lastRect.width / 2 - containerRect.left

  horizontalLineStyle.value = {
    left: `${firstCenter}px`,
    width: `${lastCenter - firstCenter}px`
  }
}

// ResizeObserver for output container to handle dynamic content
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  nextTick(() => {
    updateHorizontalLine()
    // Delay output line calculation to ensure children are rendered
    setTimeout(() => updateOutputVerticalLine(), 100)
  })

  // Set up ResizeObserver for output container
  if (props.level === 4) {
    resizeObserver = new ResizeObserver(() => {
      updateOutputVerticalLine()
    })
  }
})

watch(expanded, (newVal) => {
  nextTick(() => {
    updateHorizontalLine()
    if (newVal && props.level === 4) {
      // Delay to ensure children are rendered
      setTimeout(() => {
        updateOutputVerticalLine()
        // Observe the output container for size changes
        if (outputContainer.value && resizeObserver) {
          resizeObserver.observe(outputContainer.value)
        }
      }, 100)
    }
  })
})

// Watch for outputContainer changes to attach ResizeObserver
watch(outputContainer, (newContainer) => {
  if (newContainer && resizeObserver) {
    resizeObserver.observe(newContainer)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
})

// Calculate vertical line height for level 5 outputs dynamically
const updateOutputVerticalLine = () => {
  if (!outputContainer.value || props.level !== 4) return

  const children = outputContainer.value.querySelectorAll(':scope > div')
  if (children.length === 0) return

  const lastChild = children[children.length - 1] as HTMLElement
  const containerRect = outputContainer.value.getBoundingClientRect()
  const lastChildRect = lastChild.getBoundingClientRect()

  // Calculate height from top of container to center of last child
  // The vertical line starts at top-6 (24px from container top)
  // We need it to reach the vertical center of the last child
  const lastChildCenter = lastChildRect.top + lastChildRect.height / 2 - containerRect.top
  // Subtract the 48px padding-top of the container (pt-12)
  const lineHeight = lastChildCenter - 48 + 24 // +24 to account for the starting position at top-6
  outputVerticalLineHeight.value = `${Math.max(0, lineHeight)}px`
}

const outputVerticalLineStyle = computed(() => {
  return { height: outputVerticalLineHeight.value }
})

const levelClass = computed(() => {
  return 'bg-white border-primary-300'
})

const levelBadgeClass = computed(() => {
  return 'bg-primary-500 text-white'
})
</script>
