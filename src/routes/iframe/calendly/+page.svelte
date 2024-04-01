<script>
    import { onMount, onDestroy } from "svelte";
    onMount(() => {
        if(document){
            const script = document?.createElement('script');
            script.src = "https://assets.calendly.com/assets/external/widget.js";
            script.id = "calendly-script";
            script.type = "text/javascript";
            // script.setAttribute("async", "true");
            document.head.appendChild(script);
        }   
	});

    onDestroy(() => {
        if(document){
            const calendly = document?.getElementById("calendly-script");
            calendly?.remove();
        }    
    });
</script>

<!-- Calendly inline widget begin -->
<div class="calendly-inline-widget" data-url="https://calendly.com/sudhanvashashidhara/30min" style="min-width:320px;height:700px;"></div>
<!-- Calendly inline widget end -->