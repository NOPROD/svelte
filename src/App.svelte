<style>

</style>

<script>
  import Link from "./router/Link.svelte";
  import Route from "./router/Route.svelte";
  import TopBar from "./components/TopBar.svelte";
  import { isLoading } from "svelte-i18n";
</script>

<!-- Navigation goes here -->
<Link page="{{ path: '/', name: 'Home' }}" />
<Link page="{{ path: '/about', name: 'About' }}" />

{#if $isLoading}
  Please wait...
{:else}
  <Route />
{/if}
