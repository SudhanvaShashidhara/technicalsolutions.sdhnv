<script>
    import {onMount, onDestroy} from "svelte";
    onMount(() => {
        const script = document.createElement('script');
        script.src = "https://embed.typeform.com/next/embed.js";
        script.id = "typeform-script";
        document.head.appendChild(script);
	});

    onDestroy(() => {
        const typeform_script = document.getElementById("typeform-script");
        typeform_script?.remove();
    });
</script>

<svelte:head>
    <title>Iframe Demo - Typeform</title>
</svelte:head>
<main class="w-8/12 xl:w-7/12 mx-auto">
    <h1 class="text-xl">Iframe</h1>
    <section class="my-4 py-2">
        <div data-tf-live="01HT9JTWN98JDYTWBPD8F6E4V4"></div>
    </section>
</main>