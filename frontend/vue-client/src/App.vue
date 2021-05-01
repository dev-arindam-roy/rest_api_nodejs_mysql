<template>
  <div id="app-temp">
    <pageLoader :is-Page-Loading="$store.state.isPageLoadingActive"></pageLoader>
    <appHeader></appHeader>
    <div class="app-container">
      <router-view></router-view>
    </div>
    <appFooter></appFooter>
  </div>
</template>

<script>
import appHeader from './components/layout/header'
import appFooter from './components/layout/footer'
import pageLoader from './components/layout/pageloading'

export default {
  name: 'mainApp',
  props: {

  },
  components: {
    appHeader,
    appFooter,
    pageLoader
  },
  data() {
    return {
      
    }
  },
  computed: {

  },
  watch: {

  },
  methods: {

  },
  mounted() {
    
  }
}
</script>
