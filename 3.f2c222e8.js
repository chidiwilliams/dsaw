var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},n={},e=t.parcelRequire40b1;null==e&&((e=function(t){if(t in o)return o[t].exports;if(t in n){var e=n[t];delete n[t];var i={id:t,exports:{}};return o[t]=i,e.call(i.exports,i,i.exports),i.exports}var r=new Error("Cannot find module '"+t+"'");throw r.code="MODULE_NOT_FOUND",r}).register=function(t,o){n[t]=o},t.parcelRequire40b1=e);var i=e("EQ8Ao");function r(t,o){return!!a(t.boundary,o)&&(t.points.length<4&&!t.topLeftChild?(t.points.push(o),!0):(t.topLeftChild||function(t){const{topLeft:o,bottomRight:n}=t.boundary,e={x:(o.x+n.x)/2,y:(o.y+n.y)/2};t.topLeftChild=h({x:o.x,y:o.y},{x:e.x,y:e.y}),t.bottomLeftChild=h({x:o.x,y:e.y},{x:e.x,y:n.y}),t.topRightChild=h({x:e.x,y:o.y},{x:n.x,y:e.y}),t.bottomRightChild=h({x:e.x,y:e.y},{x:n.x,y:n.y}),t.points.forEach((o=>{r(t.topLeftChild,o)||r(t.bottomLeftChild,o)||r(t.topRightChild,o)||r(t.bottomRightChild,o)})),t.points=[]}(t),!!r(t.topLeftChild,o)||(!!r(t.bottomLeftChild,o)||(!!r(t.topRightChild,o)||!!r(t.bottomRightChild,o)))))}function a(t,o){return o.x>=t.topLeft.x&&o.x<=t.bottomRight.x&&o.y>=t.topLeft.y&&o.y<=t.bottomRight.y}function d(t,o){return Math.sqrt(Math.pow(t.x-o.x,2)+Math.pow(t.y-o.y,2))}function h(t,o){return{boundary:{topLeft:t,bottomRight:o},points:[]}}var p={insert:r,search:function t(o,n){return e=o.boundary,i=n,e.topLeft.x<=i.bottomRight.x&&e.bottomRight.x>=i.topLeft.x&&e.topLeft.y<=i.bottomRight.y&&e.bottomRight.y>=i.topLeft.y?o.topLeftChild?t(o.topLeftChild,n).concat(t(o.bottomLeftChild,n)).concat(t(o.topRightChild,n)).concat(t(o.bottomRightChild,n)):o.points.filter((t=>a(n,t))):[];var e,i},nearest:function t(o,n,e={point:null,distance:d(o.boundary.topLeft,o.boundary.bottomRight)}){if(Math.abs(n.x-o.boundary.topLeft.x)>e.distance||Math.abs(n.x-o.boundary.bottomRight.x)>e.distance||Math.abs(n.y-o.boundary.topLeft.y)>e.distance||Math.abs(n.y-o.boundary.bottomRight.y)>e.distance)return e;if(!o.topLeftChild)return o.points.forEach((t=>{const o=d(t,n);o<e.distance&&(e.point=t,e.distance=o)})),e;const i=[o.topLeftChild,o.topRightChild,o.bottomLeftChild,o.bottomRightChild],r=n.y<(o.boundary.topLeft.y+o.boundary.bottomRight.y)/2,a=n.x<(o.boundary.topLeft.x+o.boundary.bottomRight.x)/2;return e=t(i[2*(1-r)+1*(1-a)],n,e),e=t(i[2*(1-r)+1*a],n,e),e=t(i[2*r+1*(1-a)],n,e),e=t(i[2*r+1*a],n,e)}}.insert;const f=i.select("body").append("svg").attr("width",750).attr("height",300),u={boundary:{topLeft:{x:0,y:0},bottomRight:{x:750,y:300}},points:[],depth:1},y=i.scaleLinear().domain([0,8]).range(["#efe","#060"]);function l(t){t.depth=0;const o=[];return c(t,(t=>{o.push(t)})),o}function b(t){return l(t).flatMap((t=>t.points))}function c(t,o){o(t),t.topLeftChild&&(t.topLeftChild.depth=t.depth+1,c(t.topLeftChild,o),t.topRightChild.depth=t.depth+1,c(t.topRightChild,o),t.bottomLeftChild.depth=t.depth+1,c(t.bottomLeftChild,o),t.bottomRightChild.depth=t.depth+1,c(t.bottomRightChild,o))}let x,s;s=f.selectAll(".node").data(l(u)).enter().append("rect").attr("class","node").attr("x",(function(t){return t.boundary.topLeft.x})).attr("y",(function(t){return t.boundary.topLeft.y})).attr("width",(function(t){return t.boundary.bottomRight.x-t.boundary.topLeft.x})).attr("height",(function(t){return t.boundary.bottomRight.y-t.boundary.topLeft.y})),x=f.selectAll(".point").data(b(u)).enter().append("circle").attr("class","point").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",3);for(let t=0;t<300;t++)p(u,{x:750*Math.random(),y:300*Math.random()});s=s.data(l(u)),s.exit().remove(),s.enter().append("rect").attr("class","node").attr("x",(function(t){return t.boundary.topLeft.x})).attr("y",(function(t){return t.boundary.topLeft.y})).attr("width",(function(t){return t.boundary.bottomRight.x-t.boundary.topLeft.x})).attr("height",(function(t){return t.boundary.bottomRight.y-t.boundary.topLeft.y})),x=x.data(b(u)),x.exit().remove(),x.enter().append("circle").attr("class","point").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",3),f.selectAll(".node").style("fill",(function(t){return y(t.depth)}));
//# sourceMappingURL=3.f2c222e8.js.map
