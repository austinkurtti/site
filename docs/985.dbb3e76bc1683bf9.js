(()=>{"use strict";var u=function(e){return e[e.easy=1]="easy",e[e.medium=10]="medium",e[e.hard=30]="hard",e}(u||{});class v{constructor(){this.valid=null,this.numConflicts=0,this.value=null,this.candidates=0}}const w=[1,2,3,4,5,6,7,8,9];let m=0,s=[];addEventListener("message",({data:e})=>{s=[...new Array(9)].map(()=>[...new Array(9)].map(()=>new v)),i();const r=[...new Array(9)].map(()=>[...new Array(9)].map(()=>new v));r.forEach((l,a)=>{l.forEach((o,n)=>o.value=s[a][n].value)}),b(e),postMessage({solution:r,cells:s})});const i=()=>{let e,r;for(let l=0;l<81;l++)if(e=Math.floor(l/9),r=l%9,null===s[e][r].value){const a=_();for(const o of a)if(M(s,e,o)&&V(s,r,o)&&g(s,e,r,o)){if(s[e][r].value=o,E(s))return!0;if(i())return!0}break}s[e][r].value=null},b=e=>{let r;const l=x(e),a=[...new Array(9)].map(()=>[...new Array(9)].map(()=>new v));s.forEach((o,n)=>{o.forEach((t,f)=>{a[n][f].value=t.value})});do{let o=e;for(r=0,a.forEach((n,t)=>{n.forEach((f,c)=>{s[t][c].value=f.value})});o>0;){let n=Math.floor(9*Math.random()),t=Math.floor(9*Math.random());for(;null===s[n][t].value;)n=Math.floor(9*Math.random()),t=Math.floor(9*Math.random());const f=s[n][t].value;s[n][t].value=null;const c=[...new Array(9)].map(()=>[...new Array(9)].map(()=>new v));c.forEach((A,h)=>{A.forEach((z,B)=>{z.value=s[h][B].value})}),m=0,p(c),1!==m&&(s[n][t].value=f,o--)}s.forEach(n=>{n.forEach(t=>{r+=null===t.value?1:0})})}while(r<l[0]||r>l[1]);return s.forEach(o=>{o.forEach(n=>{n.given=null!==n.value})}),s},p=e=>{let r,l;for(let a=0;a<81;a++)if(r=Math.floor(a/9),l=a%9,null===e[r][l].value){for(const o of w)if(M(e,r,o)&&V(e,l,o)&&g(e,r,l,o)){if(e[r][l].value=o,E(e)){m++;break}if(p(e))return!0}break}e[r][l].value=null},_=()=>{const e=[...w];for(let r=e.length-1;r>0;r--){const l=Math.floor(Math.random()*(r+1));[e[r],e[l]]=[e[l],e[r]]}return e},E=e=>{for(const r of e)for(const l of r)if(null===l.value)return!1;return!0},M=(e,r,l)=>!e[r].map(o=>o.value).includes(l),V=(e,r,l)=>!e.map(o=>o[r].value).includes(l),g=(e,r,l,a)=>{const o=3*Math.floor(r/3),n=o+3,t=3*Math.floor(l/3),f=t+3,c=e.slice(o,n).map(h=>h.slice(t,f));return![...c[0],...c[1],...c[2]].map(h=>h.value).includes(a)},x=e=>e===u.easy?[25,35]:e===u.medium?[40,50]:[55,65]})();