<template>
    <div class="vld-parent">
        <loading 
            color="#0a71b9"
            background-color="#000"
            :active="isPageLoading"
            :can-cancel="false"
            :is-full-page="true"></loading>
    </div>
</template>


<script>
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    props: [
        'is-Page-Loading'
    ],
    components: {
        Loading
    }
}
</script> 