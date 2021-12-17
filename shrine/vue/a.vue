<template lang="pug">
	.a {{text}}
</template>

<script>
export default {
	name: 'index',
	data () {
		return {text:'vue'}
	},
	methods: {},
}
</script>

<style scoped lang="less">
.a {
	color: red;
}
</style>
