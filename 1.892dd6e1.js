var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},e={},r={},n=t.parcelRequire40b1;null==n&&((n=function(t){if(t in e)return e[t].exports;if(t in r){var n=r[t];delete r[t];var a={id:t,exports:{}};return e[t]=a,n.call(a.exports,a,a.exports),a.exports}var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}).register=function(t,e){r[t]=e},t.parcelRequire40b1=n);var a=n("EQ8Ao");const c=a.range(300).map((function(){return[750*Math.random(),300*Math.random()]}));let l;const o=a.select("body").append("svg").attr("width",750).attr("height",300).on("click",(function(t){const[e,r]=a.pointer(t,a.selectAll("svg").node());l.attr("cx",e).attr("cy",r),s()}));let i=o.selectAll(".rect").data([{}]).enter().append("rect").attr("class","rect").attr("width",100).attr("height",100);const d=o.selectAll(".point").data(c).enter().append("circle").attr("class","point").attr("cx",(function(t){return t[0]})).attr("cy",(function(t){return t[1]})).attr("r",3);function s(){const t=+l.attr("cx"),e=+l.attr("cy");i.attr("x",t-50).attr("y",e-50);const r=+i.attr("x"),n=+i.attr("y"),a=+i.attr("width"),c=+i.attr("height");d.each((t=>{const[e,l]=t;t.selected=e>=r&&e<=r+a&&l>=n&&l<=n+c})),d.classed("selected",(t=>t.selected))}l=o.append("circle").attr("id","pt").attr("r",3).attr("cx",375).attr("cy",150).style("fill","yellow"),s();
//# sourceMappingURL=1.892dd6e1.js.map
