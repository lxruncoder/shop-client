<template>
  <div>
    search
    {{this.$route.params.keyword}}
    {{this.$route.query.keywordUpper}}
  </div>
</template>

<script>
export default {
  name:'Search'
}
</script>

<style>

</style>