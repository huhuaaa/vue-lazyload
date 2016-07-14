# Vue-Image-Lazyload

Rewrite (Vue-Lazyload)[https://github.com/hilongjw/vue-lazyload].

## 改变

为了与原插件进行一个区分，修改指令v-lazy为v-lazyload。指令绑定对象可以为字符串，也可以为一个JSON对象。当绑定字符串时，字符串为指定加载的图片地址；当绑定JSON对象时，那么指定src属性为加载的图片地址，loading、error为当前lazyload加载中和加载出错的图片。

## 安装

```
npm install vue-image-lazyload
```

## 例子

使用前端vue编译插件的.vue脚本编写组件举例。使用vue解析器更加方便组件的模版编写，代码看上去更加清晰分明。推荐使用！！！

```
<template>
	<!-- 使用字符串 -->
	<img v-lazyload="img.src" />
	<!-- 使用字符串，填充背景 -->
	<img v-lazyload:background-image="img.src" />
	<!-- 使用JSON对象，并使用全局的loading和error -->
	<img v-lazyload="{src: img.src}" />
	<!-- 使用JSON对象，并指定全局的loading和error -->
	<img v-lazyload="{src: img.src, loading: lazyload.loading, error: lazyload.error}" />
</template>

<script type="text/javascript" lang="es6">
	import Vue from 'vue'
	import VueImageLazyload from 'vue-image-lazyload'
	// 此处设定全局参数
	Vue.use(VueImageLazyload, {
		loading: 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',
		error: 'data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXs7Oxc9QatAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==',
		try: 1
	})
	export default {
		data: {
			lazyload: {
				loading: '',
				error: ''
			},
			img: {
				src: 'http://...'
			}
		}
	}
</script>
```