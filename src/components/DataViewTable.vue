<template>
  <v-app>
    <v-container>
      <v-card
        title="Vortex Mod Usage Data"
        subtitle="This table displays your server's mod usage based on our detection parameters. Some mods may not be detected by Vortex."
        variant="outlined"
      >
        <v-card v-if="loading" loading>Loading report data...</v-card>
        <div v-if="error">{{ error }}</div>
        <v-data-table
          v-if="!loading && !error && items.length > 0"
          :headers="tableHeaders"
          :items="items"
        />
        <div v-if="!loading && !error && items.length === 0">
          No data found for this report, or the report has expired.
        </div>
      </v-card>
      <v-container class="d-flex justify-end">
        <v-btn ripple class="mx-3" @click="exportAsCSV">Export as CSV</v-btn>
        <v-btn ripple @click="exportAsJSON">Export as JSON</v-btn>
      </v-container>
    </v-container>
  </v-app>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

// Reactive variable to hold the items for the table
const items = ref([]);
// Reactive variable for loading state
const loading = ref(true);
// Reactive variable for error messages
const error = ref(null);

// Define headers for the v-data-table (Vuetify 3 syntax)
// The 'key' should match the property names in your 'items' objects
const tableHeaders = [
  { title: "ModID", align: "start", sortable: true, key: "ModID" },
  { title: "Category", key: "Category" },
  { title: "Count", key: "Count" },
];

// Function to fetch data from Vercel API
async function fetchReportData() {
  loading.value = true;
  error.value = null;

  //   items.value = [
  //     { ModID: "vortex", Category: "SomeCategory", Count: 10 },
  //     { ModID: "vortex", Category: "SomeCategory1", Count: 101 },
  //     { ModID: "vortex", Category: "SomeCategory2", Count: 9 },
  //     { ModID: "ars", Category: "SomeCategory", Count: 11 },
  //     { ModID: "create", Category: "SomeCategory", Count: 101 },
  //     { ModID: "hexerei", Category: "SomeCategory", Count: 9 },
  //     { ModID: "planes", Category: "SomeCategory", Count: 87 },
  //     { ModID: "waystones", Category: "SomeCategory", Count: 14 },
  //     { ModID: "minecolonies", Category: "SomeCategory", Count: 10 },
  //     { ModID: "testmod", Category: "SomeCategory", Count: 9 },
  //     { ModID: "neoforge", Category: "SomeCategory", Count: 11 },
  //     { ModID: "mod3", Category: "SomeCategory", Count: 11 },
  //     { ModID: "mod2", Category: "SomeCategory", Count: 13 },
  //     { ModID: "mod1", Category: "SomeCategory", Count: 27 },
  //   ];

  //   loading.value = false;
  // }

  try {
    // 1. Get the reportId from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const reportId = urlParams.get("id");

    if (!reportId) {
      error.value = "No report ID found in the URL.";
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
    if (fetchedData && typeof fetchedData === "object") {
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
    console.error("Failed to fetch or process report data:", e);
    error.value = e.message || "An unknown error occurred.";
  } finally {
    loading.value = false;
  }
}

//Fetch the data when the component is mounted (created and inserted into the DOM)

function triggerDownload(content: string, fileName: string, mimeType: string) {
  const a = document.createElement("a");
  const blob = new Blob([content], { type: mimeType });
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

function exportAsJSON() {
  if (!items.value || items.value.length === 0) {
    alert("No data to export.");
    return;
  }
  const jsonString = JSON.stringify(items.value, null, 2);
  triggerDownload(
    jsonString,
    "vortex-report.json",
    "application/json;charset=utf-8;",
  );
}

function exportAsCSV() {
  if (!items.value || items.value.length === 0) {
    alert("No data to export.");
    return;
  }

  const headers = ["ModID", "Category", "Count"];
  const csvHeader = headers.join(",") + "\n";

  const csvRows = items.value.map((item) => {
    // Ensure order matches headers
    const row = [item.ModID, item.Category, item.Count];
    return row
      .map((value) => {
        const stringValue = String(value);
        // Basic CSV escaping: quote if it contains comma, quote, or newline. Double internal quotes.
        if (
          stringValue.includes(",") ||
          stringValue.includes('"') ||
          stringValue.includes("\n")
        ) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      })
      .join(",");
  });

  const csvString = csvHeader + csvRows.join("\n");
  triggerDownload(csvString, "vortex-report.csv", "text/csv;charset=utf-8;");
}

onMounted(() => {
  fetchReportData();
});
</script>
