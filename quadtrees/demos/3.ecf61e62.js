var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n={},e={},o=t.parcelRequirefde0;null==o&&((o=function(t){if(t in n)return n[t].exports;if(t in e){var o=e[t];delete e[t];var r={id:t,exports:{}};return n[t]=r,o.call(r.exports,r,r.exports),r.exports}var i=new Error("Cannot find module '"+t+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(t,n){e[t]=n},t.parcelRequirefde0=o);var r,i=o("h36xl"),d=o("cNEHL").select;function a(t,n,e=4){return!!u(t.boundary,n)&&(t.points.length<e&&!t.topLeftChild?(t.points.push(n),!0):(t.topLeftChild||function(t,n){const{x1:e,x2:o,y1:r,y2:i}=t.boundary,d=(e+o)/2,u=(r+i)/2;t.topLeftChild=c({x1:e,y1:r,x2:d,y2:u}),t.bottomLeftChild=c({x1:e,y1:u,x2:d,y2:i}),t.topRightChild=c({x1:d,y1:r,x2:o,y2:u}),t.bottomRightChild=c({x1:d,y1:u,x2:o,y2:i}),t.points.forEach((e=>{a(t.topLeftChild,e,n)||a(t.bottomLeftChild,e,n)||a(t.topRightChild,e,n)||a(t.bottomRightChild,e,n)})),t.points=[]}(t,e),!!a(t.topLeftChild,n,e)||(!!a(t.bottomLeftChild,n,e)||(!!a(t.topRightChild,n,e)||!!a(t.bottomRightChild,n,e)))))}function u(t,n){return n.x>=t.x1&&n.x<=t.x2&&n.y>=t.y1&&n.y<=t.y2}function l(t,n){return Math.sqrt(Math.pow(t.x-n.x,2)+Math.pow(t.y-n.y,2))}function c(t){return{boundary:t,points:[]}}r={insert:a,search:function t(n,e){return o=n.boundary,r=e,o.x1<=r.x2&&o.x2>=r.x1&&o.y1<=r.y2&&o.y2>=r.y1?n.topLeftChild?t(n.topLeftChild,e).concat(t(n.bottomLeftChild,e)).concat(t(n.topRightChild,e)).concat(t(n.bottomRightChild,e)):n.points.filter((t=>u(e,t))):[];var o,r},nearest:function t(n,e,o={point:null,distance:Number.MAX_VALUE}){if(e.x<n.boundary.x1-o.distance||e.x>n.boundary.x2+o.distance||e.y<n.boundary.y1-o.distance||e.y>n.boundary.y2+o.distance)return o;if(!n.topLeftChild)return n.points.forEach((t=>{const n=l(t,e);n<o.distance&&(o.point=t,o.distance=n)})),o;const r=[n.topLeftChild,n.topRightChild,n.bottomLeftChild,n.bottomRightChild],i=e.y<(n.boundary.y1+n.boundary.y2)/2,d=e.x<(n.boundary.x1+n.boundary.x2)/2;return o=t(r[2*(1-i)+1*(1-d)],e,o),o=t(r[2*(1-i)+1*d],e,o),o=t(r[2*i+1*(1-d)],e,o),o=t(r[2*i+1*d],e,o)},contains:u,distance:l,distanceToBoundary:function(t,n){return Math.max(n.x1-t.x,t.x-n.x2,n.y1-t.y,t.y-n.y2)}};var y=r.insert;const h=Math.min(window.innerWidth,750);document.querySelector("#target").style.width=`${h}px`;const p=d("#target").append("svg").attr("width",h).attr("height",300);let f={boundary:{x1:0,y1:0,x2:h,y2:300},points:[],depth:1};const s=i.scaleLinear().domain([0,8]).range(["#efe","#060"]);function x(t){t.depth=0;const n=[];return C(t,(t=>{n.push(t)})),n}function b(t){return x(t).flatMap((t=>t.points))}function C(t,n){n(t),t.topLeftChild&&(t.topLeftChild.depth=t.depth+1,C(t.topLeftChild,n),t.topRightChild.depth=t.depth+1,C(t.topRightChild,n),t.bottomLeftChild.depth=t.depth+1,C(t.bottomLeftChild,n),t.bottomRightChild.depth=t.depth+1,C(t.bottomRightChild,n))}let g,m;function L(){m=p.selectAll(".node").data(x(f),(t=>t.boundary)),m.exit().remove(),m.enter().append("rect").attr("class","node").attr("x",(function(t){return t.boundary.x1})).attr("y",(function(t){return t.boundary.y1})).attr("width",(function(t){return t.boundary.x2-t.boundary.x1})).attr("height",(function(t){return t.boundary.y2-t.boundary.y1})),p.selectAll(".node").style("fill",(function(t){return s(t.depth)})),g=p.selectAll(".point").data(b(f),(t=>t.x)),g.exit().remove(),g.enter().append("circle").attr("class","point").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",3).transition().duration(2e3).styleTween("fill",(function(){return i.interpolate("red","#999")})),p.selectAll(".point").raise()}m=p.selectAll(".node").data(x(f),(t=>t.boundary)).enter().append("rect").attr("class","node").attr("x",(function(t){return t.boundary.x1})).attr("y",(function(t){return t.boundary.y1})).attr("width",(function(t){return t.boundary.x2-t.boundary.x1})).attr("height",(function(t){return t.boundary.y2-t.boundary.y1})),g=p.selectAll(".point").data(b(f)).enter().append("circle").attr("class","point").attr("cx",(function(t){return t.x})).attr("cy",(function(t){return t.y})).attr("r",3),f={boundary:{x1:0,y1:0,x2:h,y2:300},points:[],depth:1},L();const R=document.querySelector("button#restart");document.querySelector("button#add").addEventListener("click",(()=>{y(f,{x:Math.random()*h,y:300*Math.random()}),L()})),R.addEventListener("click",(()=>{f={boundary:{x1:0,y1:0,x2:h,y2:300},points:[],depth:1},L()}));
//# sourceMappingURL=3.ecf61e62.js.map
