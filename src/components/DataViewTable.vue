<template>
  <v-app>
    <v-container>
      <div v-if="loading">Loading report data...</div>
      <div v-if="error">{{ error }}</div>
      <v-data-table
        v-if="!loading && !error && items.length > 0"
        :headers="tableHeaders"
        :items="items"
      />
      <div v-if="!loading && !error && items.length === 0">
        No data found for this report, or the report has expired.
      </div>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';

  // Reactive variable to hold the items for the table
  const items = ref([]);
  // Reactive variable for loading state
  const loading = ref(true);
  // Reactive variable for error messages
  const error = ref(null);

  // Define headers for the v-data-table (Vuetify 3 syntax)
  // The 'key' should match the property names in your 'items' objects
  const tableHeaders = [
    { title: 'ModID', align: 'start', sortable: true, key: 'ModID' },
    { title: 'Category', key: 'Category' },
    { title: 'Count', key: 'Count' },
  ];

  // Function to fetch data from your Vercel API
  async function fetchReportData () {
    loading.value = true;
    error.value = null;
    try {
      // 1. Get the reportId from the URL query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const reportId = urlParams.get('id');

      if (!reportId) {
        error.value = 'No report ID found in the URL.';
        loading.value = false;
        return;
      }

      // 2. Fetch data from your Vercel API endpoint
      const response = await fetch(
        `https://vortex-dataview.vercel.app/api/getReport?id=${reportId}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Error fetching report: ${response.status}`,
        );
      }

      const fetchedData = await response.json();

      // 3. Transform the fetched "mod-first" data into the flat array structure
      //    that your v-data-table currently expects.
      const transformedItems = [];
      if (fetchedData && typeof fetchedData === 'object') {
        for (const modId in fetchedData) {
          const modDetails = fetchedData[modId];
          if (modDetails && modDetails.interactionBreakdown) {
            for (const category in modDetails.interactionBreakdown) {
              transformedItems.push({
                ModID: modId,
                Category: category,
                Count: modDetails.interactionBreakdown[category],
              });
            }
          }
        }
      }

      items.value = transformedItems;
    } catch (e) {
      console.error('Failed to fetch or process report data:', e);
      error.value = e.message || 'An unknown error occurred.';
    } finally {
      loading.value = false;
    }
  }

  // Fetch the data when the component is mounted (created and inserted into the DOM)
  onMounted(() => {
    fetchReportData();
  });
</script>
