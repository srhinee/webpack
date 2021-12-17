<template lang="pug">
	.b {{text}}
</template>

<script>
export default {
	name: 'child',
    data(){
		return {text:'child'}
    },
    methods:{},
}
</script>

<style scoped lang="less">
.b{
	color: #f93516
}
</style>
