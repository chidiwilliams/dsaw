var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},e={},n=t.parcelRequire40b1;null==n&&((n=function(t){if(t in o)return o[t].exports;if(t in e){var n=e[t];delete e[t];var r={id:t,exports:{}};return o[t]=r,n.call(r.exports,r,r.exports),r.exports}var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(t,o){e[t]=o},t.parcelRequire40b1=n);var r=n("EQ8Ao");function i(t,o,e=4){return!!a(t.boundary,o)&&(t.points.length<e&&!t.topLeftChild?(t.points.push(o),!0):(t.topLeftChild||function(t,o){const{topLeft:e,bottomRight:n}=t.boundary,r={x:(e.x+n.x)/2,y:(e.y+n.y)/2};t.topLeftChild=h({x:e.x,y:e.y},{x:r.x,y:r.y}),t.bottomLeftChild=h({x:e.x,y:r.y},{x:r.x,y:n.y}),t.topRightChild=h({x:r.x,y:e.y},{x:n.x,y:r.y}),t.bottomRightChild=h({x:r.x,y:r.y},{x:n.x,y:n.y}),t.points.forEach((e=>{i(t.topLeftChild,e,o)||i(t.bottomLeftChild,e,o)||i(t.topRightChild,e,o)||i(t.bottomRightChild,e,o)})),t.points=[]}(t,e),!!i(t.topLeftChild,o,e)||(!!i(t.bottomLeftChild,o,e)||(!!i(t.topRightChild,o,e)||!!i(t.bottomRightChild,o,e)))))}function a(t,o){return o.x>=t.topLeft.x&&o.x<=t.bottomRight.x&&o.y>=t.topLeft.y&&o.y<=t.bottomRight.y}function d(t,o){return Math.sqrt(Math.pow(t.x-o.x,2)+Math.pow(t.y-o.y,2))}function h(t,o){return{boundary:{topLeft:t,bottomRight:o},points:[]}}var p={insert:i,search:function t(o,e){return n=o.boundary,r=e,n.topLeft.x<=r.bottomRight.x&&n.bottomRight.x>=r.topLeft.x&&n.topLeft.y<=r.bottomRight.y&&n.bottomRight.y>=r.topLeft.y?o.topLeftChild?t(o.topLeftChild,e).concat(t(o.bottomLeftChild,e)).concat(t(o.topRightChild,e)).concat(t(o.bottomRightChild,e)):o.points.filter((t=>a(e,t))):[];var n,r},nearest:function t(o,e,n={point:null,distance:d(o.boundary.topLeft,o.boundary.bottomRight)}){if(e.x<o.boundary.topLeft.x-n.distance||e.x>o.boundary.bottomRight.x+n.distance||e.y<o.boundary.topLeft.y-n.distance||e.y>o.boundary.bottomRight.y+n.distance)return n;if(!o.topLeftChild)return o.points.forEach((t=>{const o=d(t,e);o<n.distance&&(n.point=t,n.distance=o)})),n;const r=[o.topLeftChild,o.topRightChild,o.bottomLeftChild,o.bottomRightChild],i=e.y<(o.boundary.topLeft.y+o.boundary.bottomRight.y)/2,a=e.x<(o.boundary.topLeft.x+o.boundary.bottomRight.x)/2;return n=t(r[2*(1-i)+1*(1-a)],e,n),n=t(r[2*(1-i)+1*a],e,n),n=t(r[2*i+1*(1-a)],e,n),n=t(r[2*i+1*a],e,n)},contains:a,distance:d}.insert;const u=r.select("#target").append("svg").attr("width",750).attr("height",300);let f={boundary:{topLeft:{x:0,y:0},bottomRight:{x:750,y:300}},points:[],depth:1};const y=r.scaleLinear().domain([0,8]).range(["#efe","#060"]);function l(t){t.depth=0;const o=[];return b(t,(t=>{o.push(t)})),o}function c(t){return l(t).flatMap((t=>t.points))}function b(t,o){o(t),t.topLeftChild&&(t.topLeftChild.depth=t.depth+1,b(t.topLeftChild,o),t.topRightChild.depth=t.depth+1,b(t.topRightChild,o),t.bottomLeftChild.depth=t.depth+1,b(t.bottomLeftChild,o),t.bottomRightChild.depth=t.depth+1,b(t.bottomRightChild,o))}let x,s,g;function L(){s=s.data(l(f)),s.exit().remove(),s.enter().append("rect").attr("class","node").attr("x",(function(t){return t.boundary.topLeft.x})).attr("y",(function(t){return t.boundary.topLeft.y})).attr("width",(function(t){return t.boundary.bottomRight.x-t.boundary.topLeft.x})).attr("height",(function(t){return t.boundary.bottomRight.y-t.boundary.topLeft.y})),x=x.data(c(f)),x.exit().remove(),x.enter().append("circle").attr("class","point").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",3),u.selectAll(".node").style("fill",(function(t){return y(t.depth)}))}s=u.selectAll(".node").data(l(f)).enter().append("rect").attr("class","node").attr("x",(function(t){return t.boundary.topLeft.x})).attr("y",(function(t){return t.boundary.topLeft.y})).attr("width",(function(t){return t.boundary.bottomRight.x-t.boundary.topLeft.x})).attr("height",(function(t){return t.boundary.bottomRight.y-t.boundary.topLeft.y})),x=u.selectAll(".point").data(c(f)).enter().append("circle").attr("class","point").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",3);for(let t=0;t<150;t++)p(f,{x:750*Math.random(),y:300*Math.random()});L(),document.querySelector("button").addEventListener("click",(()=>{g&&clearInterval(g),f={boundary:{topLeft:{x:0,y:0},bottomRight:{x:750,y:300}},points:[],depth:1};let t=0;g=setInterval((()=>{p(f,{x:750*Math.random(),y:300*Math.random()}),L(),150==t++&&clearInterval(g)}),50)}));
//# sourceMappingURL=3.f18da5b4.js.map