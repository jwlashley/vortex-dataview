<template>
  <v-app>
    <v-container>
      <v-data-table :items="items"></v-data-table>
    </v-container>
  </v-app>
</template>

<script setup>
const items = [
  {
    Category: "BlockRightClick",
    ModID: "createframed",
    Count: 2,
  },
  {
    Category: "BlockRightClick",
    ModID: "pfm",
    Count: 7,
  },
  {
    Category: "BlockRightClick",
    ModID: "adorn",
    Count: 12,
  },
  {
    Category: "BlockRightClick",
    ModID: "thingamajigs",
    Count: 3,
  },
  {
    Category: "ItemRightClick",
    ModID: "createframed",
    Count: 1,
  },
  {
    Category: "ItemRightClick",
    ModID: "gravestone",
    Count: 1,
  },
  {
    Category: "CraftingOutput",
    ModID: "createframed",
    Count: 2,
  },
  {
    Category: "CraftingOutput",
    ModID: "pfm",
    Count: 1,
  },
  {
    Category: "CraftingOutput",
    ModID: "adorn",
    Count: 11,
  },
  {
    Category: "CraftingOutput",
    ModID: "thingamajigs",
    Count: 5,
  },
];
</script>
