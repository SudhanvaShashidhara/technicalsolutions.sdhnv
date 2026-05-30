<script>
	import '../app.css';
	import Navbar from '../lib/components/Navbar.svelte';
	import Footer from '../lib/components/Footer.svelte';
</script>

<!-- Header Start -->
<Navbar />
<!-- Header End -->
<main class="min-h-screen bg-slate-50 transition-colors dark:bg-googlegreyG900">
	<slot />
</main>
<!-- Footer Start -->
<Footer />
<!-- Footer End -->
