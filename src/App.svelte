<script>
  import Link from "./router/Link.svelte";
  import Route from "./router/Route.svelte";
  export let name;
</script>

<style>

</style>

<!-- Navigation goes here -->
<Link page={{ path: '/', name: 'Home' }} />
<Link page={{ path: '/about', name: 'About' }} />

<!-- Main container goes here -->
<Route />
