<template>
  <div>
    <DataViewTable />
  </div>
</template>

<script setup>
// If DataViewTable is a separate component, import it
import DataViewTable from "@/components/DataViewTable.vue"; // Adjust path if needed

// If DataViewTable.vue handles its own data fetching using useRoute() and onMounted(),
// then this page component might be very simple.
// If DataViewTable.vue expects data as a prop, you'd fetch it here and pass it down.
</script>
