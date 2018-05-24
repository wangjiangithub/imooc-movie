/*
插件官网：https://www.fedrobots.com/?tool=plugin_array
开发者：安云大神
技术交流QQ群：601536121
BUG反馈QQ：237364436
版本：1.0.1
*/
!function(r){function t(r){this.init(r)}t.prototype={init:function(r){if(!r)return this.arr;var t="";if(Array.isArray(r))t=r;else{if("string"==typeof r)return"this type not Array";t=[r]}this.arr=t},stringify:function(r){return this.arr.length>1?JSON.stringify(this.arr):JSON.stringify(this.arr[0])},get:function(r){var t=this.arr;if(/\=/.test(r)){for(var i=[],n=r.split("==")[0],s=r.split("==")[1],o=0;o<t.length;o++)t[o][n]==s&&i.push(t[o]);return i}for(var i=[],o=0;o<t.length;o++){var e=t[o][r];i.push(e||"")}return i},each:function(r){for(var t=this.arr,i=0;i<t.length;i++)"function"==typeof r&&r(t[i],i)},sort:function(r,t){return r?"function"==typeof r?(this.arr.sort(r),this.arr):(this.arr.sort(function(i,n){return/^[\u4e00-\u9fa5]+$/.test(i[r])&&/^[\u4e00-\u9fa5]+$/.test(n[r])?(console.log(n[r].localeCompare(i[r])),n[r].localeCompare(i[r])):/(^-?[0-9]\d*$)/.test(i[r])?t&&"down"!=t?n[r]-i[r]:i[r]-n[r]:t&&"down"!=t?i[r]<n[r]:i[r]>n[r]}),this.arr):(this.arr.sort(),this.arr)}},r.fArray=t}(window);