'use strict';
exports.install = function (Vue, options) {
    if(!options){
        options = {}
    }

    var init = {
        loading: options.loading || '',
        error: options.error || '',
        hasbind: false,
        isInChild: false,
        childEl: null,
        try: options.try || 1
    }

    var listeners = []

    var lazyLoadHandler = function(listener){
        for (var i = 0; i < listeners.length; ++i) {
            var listener = listeners[i]
            var winH = undefined
            var top = undefined
            if (listener.parentEl) {
                winH = listener.parentEl.offsetHeight
                top = listener.parentEl.scrollTop
            } else {
                winH = window.screen.availHeight
                top = document.documentElement.scrollTop || document.body.scrollTop
            }

            var maxheight = (top + winH) * window.devicePixelRatio * 1.3
            if (listener.y < maxheight) {
                render(listener)
            }
        }
    }

    var loadImageAsync = function (item, success, error){
        var img = new Image()
        img.src = item.src
        img.onload = function(){
            success(item)
        }
        img.onerror = function(){
            error(item)
        }
    }

    var render = function render(item) {
        if (item.try >= init.try) {
            return false
        }
        item.try++;
        loadImageAsync(item, function(item){
            var index = listeners.indexOf(item)
            if (index !== -1) {
                listeners.splice(index, 1)
            }
            if (!item.bindType) {
                item.el.setAttribute('src', item.src)
            }else{
                item.el.setAttribute('style', item.bindType + ': url(' + item.src + ')');
            }
            item.el.setAttribute('lazy', 'loaded')
        }, function(){
            item.el.setAttribute('src', init.error)
            item.el.setAttribute('lazy', 'error')
            if(item.try >= init.try){
                var index = listeners.indexOf(item)
                if (index !== -1) {
                    listeners.splice(index, 1)
                }
            }
        })
    }

    var getPosition = function getPosition(el) {
        var t = el.offsetTop
        var elHeight = el.offsetHeight
        for (t; el = el.offsetParent;) {
            t += el.offsetTop
        }
        return {
            y: (t + elHeight) * window.devicePixelRatio
        };
    };

    // 注册lazyload指令
    Vue.directive('lazyload', {
        bind: function() {
            if (!init.hasbind) {
                if (document.getElementById(Object.keys(this.modifiers)[0])) {
                    init.isInChild = true;
                    init.childEl = document.getElementById(Object.keys(this.modifiers)[0]);
                }
                init.hasbind = true;
                if (init.isInChild) {
                    init.childEl.addEventListener('scroll', lazyLoadHandler);
                }
                window.addEventListener('scroll', lazyLoadHandler);
                window.addEventListener('wheel', lazyLoadHandler);
                window.addEventListener('mousewheel', lazyLoadHandler);
                window.addEventListener('resize', lazyLoadHandler);
                lazyLoadHandler();
            }
        },
        update: function(newValue, oldValue) {
            var _this2 = this
            var src = newValue && newValue.src ? newValue.src : newValue
            var error = newValue && newValue.error ? newValue.error : init.error
            var loading = newValue && newValue.loading ? newValue.loading : init.loading
            this.el.setAttribute('lazy', 'loading')
            if (!this.arg) {
                this.el.setAttribute('src', loading)
            }else{
                this.el.setAttribute('style', this.arg + ': url(' + loading + ')');
            }
            var parentEl = null
            if (document.getElementById(Object.keys(this.modifiers)[0])) {
                parentEl = document.getElementById(Object.keys(this.modifiers)[0])
            }
            // DOM updated then call callback
            this.vm.$nextTick(function () {
                var pos = getPosition(_this2.el)
                listeners.push({
                    bindType: _this2.arg,
                    try: 0,
                    parentEl: parentEl,
                    el: _this2.el,
                    src: src,
                    y: pos.y,
                    error: error
                })
                //默认触发一次
                lazyLoadHandler()
            });
        },
        unbind: function(src) {
            var i = undefined
            var len = listeners.length
            for (i = 0; i < len; i++) {
                if (listeners[i].src == src) {
                    listeners.splice(i, 1)
                }
            }

            if (listeners.length == 0) {
                init.hasbind = false
                window.removeEventListener('scroll', lazyLoadHandler)
                window.removeEventListener('wheel', lazyLoadHandler)
                window.removeEventListener('mousewheel', lazyLoadHandler)
                window.removeEventListener('resize', lazyLoadHandler)
            }
        }
    });
}