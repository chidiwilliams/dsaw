var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},o={},e={},n=t.parcelRequire40b1;null==n&&((n=function(t){if(t in o)return o[t].exports;if(t in e){var n=e[t];delete e[t];var i={id:t,exports:{}};return o[t]=i,n.call(i.exports,i,i.exports),i.exports}var d=new Error("Cannot find module '"+t+"'");throw d.code="MODULE_NOT_FOUND",d}).register=function(t,o){e[t]=o},t.parcelRequire40b1=n);var i,d=n("EQ8Ao");function r(t,o,e=4){return!!a(t.boundary,o)&&(t.points.length<e&&!t.topLeftChild?(t.points.push(o),!0):(t.topLeftChild||function(t,o){const{topLeft:e,bottomRight:n}=t.boundary,i={x:(e.x+n.x)/2,y:(e.y+n.y)/2};t.topLeftChild=p({x:e.x,y:e.y},{x:i.x,y:i.y}),t.bottomLeftChild=p({x:e.x,y:i.y},{x:i.x,y:n.y}),t.topRightChild=p({x:i.x,y:e.y},{x:n.x,y:i.y}),t.bottomRightChild=p({x:i.x,y:i.y},{x:n.x,y:n.y}),t.points.forEach((e=>{r(t.topLeftChild,e,o)||r(t.bottomLeftChild,e,o)||r(t.topRightChild,e,o)||r(t.bottomRightChild,e,o)})),t.points=[]}(t,e),!!r(t.topLeftChild,o,e)||(!!r(t.bottomLeftChild,o,e)||(!!r(t.topRightChild,o,e)||!!r(t.bottomRightChild,o,e)))))}function a(t,o){return o.x>=t.topLeft.x&&o.x<=t.bottomRight.x&&o.y>=t.topLeft.y&&o.y<=t.bottomRight.y}function h(t,o){return Math.sqrt(Math.pow(t.x-o.x,2)+Math.pow(t.y-o.y,2))}function p(t,o){return{boundary:{topLeft:t,bottomRight:o},points:[]}}var l=(i={insert:r,search:function t(o,e){return n=o.boundary,i=e,n.topLeft.x<=i.bottomRight.x&&n.bottomRight.x>=i.topLeft.x&&n.topLeft.y<=i.bottomRight.y&&n.bottomRight.y>=i.topLeft.y?o.topLeftChild?t(o.topLeftChild,e).concat(t(o.bottomLeftChild,e)).concat(t(o.topRightChild,e)).concat(t(o.bottomRightChild,e)):o.points.filter((t=>a(e,t))):[];var n,i},nearest:function t(o,e,n={point:null,distance:h(o.boundary.topLeft,o.boundary.bottomRight)}){if(e.x<o.boundary.topLeft.x-n.distance||e.x>o.boundary.bottomRight.x+n.distance||e.y<o.boundary.topLeft.y-n.distance||e.y>o.boundary.bottomRight.y+n.distance)return n;if(!o.topLeftChild)return o.points.forEach((t=>{const o=h(t,e);o<n.distance&&(n.point=t,n.distance=o)})),n;const i=[o.topLeftChild,o.topRightChild,o.bottomLeftChild,o.bottomRightChild],d=e.y<(o.boundary.topLeft.y+o.boundary.bottomRight.y)/2,r=e.x<(o.boundary.topLeft.x+o.boundary.bottomRight.x)/2;return n=t(i[2*(1-d)+1*(1-r)],e,n),n=t(i[2*(1-d)+1*r],e,n),n=t(i[2*d+1*(1-r)],e,n),n=t(i[2*d+1*r],e,n)},contains:a,distance:h}).insert,c=i.distance;const y=d.range(500).map((()=>[750*Math.random(),300*Math.random()])),f={boundary:{topLeft:{x:0,y:0},bottomRight:{x:750,y:300}},points:[],depth:1};y.forEach((([t,o])=>{l(f,{x:t,y:o})}));const s=d.select("body").append("svg").attr("width",750).attr("height",300).on("click",(function(t){const[o,e]=d.pointer(t,d.selectAll("svg").node());s.selectAll("#pt").attr("cx",o).attr("cy",e),R()}));let u=s.selectAll(".node").data(m(f)).enter().append("rect").attr("class","node").attr("x",(function(t){return t.boundary.topLeft.x})).attr("y",(function(t){return t.boundary.topLeft.y})).attr("width",(function(t){return t.boundary.bottomRight.x-t.boundary.topLeft.x})).attr("height",(function(t){return t.boundary.bottomRight.y-t.boundary.topLeft.y})),b=s.selectAll(".point").data((x=f,m(x).flatMap((t=>t.points)))).enter().append("circle").attr("class","point").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",3);var x;let g=s.append("circle").attr("id","pt").attr("r",3).attr("cx",375).attr("cy",150).style("fill","yellow");const L=d.scaleLinear().domain([0,8]).range(["#efe","#060"]);function m(t){t.depth=0;const o=[];return C(t,(t=>{o.push(t)})),o}function C(t,o){o(t),t.topLeftChild&&(t.topLeftChild.depth=t.depth+1,C(t.topLeftChild,o),t.topRightChild.depth=t.depth+1,C(t.topRightChild,o),t.bottomLeftChild.depth=t.depth+1,C(t.bottomLeftChild,o),t.bottomRightChild.depth=t.depth+1,C(t.bottomRightChild,o))}function R(){g=d.selectAll("#pt");const t=+g.attr("cx"),o=+g.attr("cy");b.each((t=>{t.scanned=t.selected=!1})),u.each((t=>{t.visited=!1}));v(f,{x:t,y:o}).point.selected=!0,b.classed("scanned",(t=>t.scanned)),b.classed("selected",(t=>t.selected)),u.style("fill",(t=>t.visited?L(t.depth):"none"))}function v(t,o,e={point:null,distance:c(t.boundary.topLeft,t.boundary.bottomRight)}){if(t.visited=!0,o.x<t.boundary.topLeft.x-e.distance||o.x>t.boundary.bottomRight.x+e.distance||o.y<t.boundary.topLeft.y-e.distance||o.y>t.boundary.bottomRight.y+e.distance)return e;if(!t.topLeftChild)return t.points.forEach((t=>{t.scanned=!0;const n=c(t,o);n<e.distance&&(e.point=t,e.distance=n)})),e;const n=[t.topLeftChild,t.topRightChild,t.bottomLeftChild,t.bottomRightChild],i=o.y<(t.boundary.topLeft.y+t.boundary.bottomRight.y)/2,d=o.x<(t.boundary.topLeft.x+t.boundary.bottomRight.x)/2;return e=v(n[2*(1-i)+1*(1-d)],o,e),e=v(n[2*(1-i)+1*d],o,e),e=v(n[2*i+1*(1-d)],o,e),e=v(n[2*i+1*d],o,e)}R();
//# sourceMappingURL=5.edaff8c1.js.map