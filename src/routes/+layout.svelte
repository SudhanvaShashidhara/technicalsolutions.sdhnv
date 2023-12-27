<script>
	import '../app.css';
	import Navbar from '../lib/components/Navbar.svelte';
	import Footer from '../lib/components/Footer.svelte';
</script>

<!-- Header Start -->
<Navbar />
<!-- Header End -->
<slot />
<!-- Footer Start -->
<Footer />
<!-- Footer End -->
