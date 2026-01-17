<script>
  import { page } from '$app/stores';
</script>

<nav>
  <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
  <a href="/about" class:active={$page.url.pathname === '/about'}>About</a>
  <a href="/contact" class:active={$page.url.pathname === '/contact'}>Contact</a>
</nav>

<style>
  .active {
    background-color: #555;
  }
</style>
