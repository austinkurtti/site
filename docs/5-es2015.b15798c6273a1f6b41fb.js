(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{"ct+p":function(t,e,n){"use strict";n.r(e),n.d(e,"HomeModule",function(){return it});var i=n("ofXK"),o=n("tyNb"),s=n("fXoL");let r=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=s.Eb({type:t}),t.\u0275inj=s.Db({imports:[[i.b]]}),t})(),a=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=s.Eb({type:t}),t.\u0275inj=s.Db({imports:[[i.b]]}),t})(),c=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=s.Eb({type:t}),t.\u0275inj=s.Db({imports:[[i.b]]}),t})();class l{static getItem(t){return JSON.parse(localStorage.getItem(t))}static setItem(t,e){localStorage.setItem(t,JSON.stringify(e))}}var d=n("HDdC"),h=n("quSY");class b extends h.a{constructor(t,e){super()}schedule(t,e=0){return this}}class f extends b{constructor(t,e){super(t,e),this.scheduler=t,this.work=e,this.pending=!1}schedule(t,e=0){if(this.closed)return this;this.state=t;const n=this.id,i=this.scheduler;return null!=n&&(this.id=this.recycleAsyncId(i,n,e)),this.pending=!0,this.delay=e,this.id=this.id||this.requestAsyncId(i,this.id,e),this}requestAsyncId(t,e,n=0){return setInterval(t.flush.bind(t,this),n)}recycleAsyncId(t,e,n=0){if(null!==n&&this.delay===n&&!1===this.pending)return e;clearInterval(e)}execute(t,e){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;const n=this._execute(t,e);if(n)return n;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))}_execute(t,e){let n,i=!1;try{this.work(t)}catch(o){i=!0,n=!!o&&o||new Error(o)}if(i)return this.unsubscribe(),n}_unsubscribe(){const t=this.id,e=this.scheduler,n=e.actions,i=n.indexOf(this);this.work=null,this.state=null,this.pending=!1,this.scheduler=null,-1!==i&&n.splice(i,1),null!=t&&(this.id=this.recycleAsyncId(e,t,null)),this.delay=null}}let u=(()=>{class t{constructor(e,n=t.now){this.SchedulerAction=e,this.now=n}schedule(t,e=0,n){return new this.SchedulerAction(this,t).schedule(n,e)}}return t.now=()=>Date.now(),t})();class g extends u{constructor(t,e=u.now){super(t,()=>g.delegate&&g.delegate!==this?g.delegate.now():e()),this.actions=[],this.active=!1,this.scheduled=void 0}schedule(t,e=0,n){return g.delegate&&g.delegate!==this?g.delegate.schedule(t,e,n):super.schedule(t,e,n)}flush(t){const{actions:e}=this;if(this.active)return void e.push(t);let n;this.active=!0;do{if(n=t.execute(t.state,t.delay))break}while(t=e.shift());if(this.active=!1,n){for(;t=e.shift();)t.unsubscribe();throw n}}}const m=new g(f);var p=n("DH7j");function k(t){return!Object(p.a)(t)&&t-parseFloat(t)+1>=0}var _=n("z+Ro");function w(t=0,e,n){let i=-1;return k(e)?i=Number(e)<1?1:Number(e):Object(_.a)(e)&&(n=e),Object(_.a)(n)||(n=m),new d.a(e=>{const o=k(t)?t:+t-n.now();return n.schedule(C,o,{index:0,period:i,subscriber:e})})}function C(t){const{index:e,period:n,subscriber:i}=t;if(i.next(e),!i.closed){if(-1===n)return i.complete();t.index=e+1,this.schedule(t,n)}}class v{constructor(t){t&&Object.assign(this,t)}}const O=["navAnchor"];function y(t,e){if(1&t&&(s.Lb(0,"a",1,2),s.gc(2),s.Kb()),2&t){const t=e.$implicit,n=s.Ub();s.Xb("ngClass",n.horizontal?"d-inline-block":"d-block")("href","#"+t.id,s.dc),s.wb(2),s.ic(" ",t.text,"\n")}}let M=(()=>{class t{constructor(t){this._renderer=t,this.orientation="horizontal",this.navigationAnchors=[new v({id:"intro",text:"Intro"}),new v({id:"about",text:"About me"}),new v({id:"timeline",text:"Timeline"}),new v({id:"skills",text:"Skills"})],this._debounce=null,this._activeAnchor=null}get horizontal(){return"horizontal"===this.orientation}get vertical(){return"vertical"===this.orientation}windowScroll(){this._debounce||(this._debounce=w(100).subscribe(()=>{const t=document.documentElement.scrollTop,e=document.documentElement.clientHeight,n=Array.from(document.querySelectorAll("section")).map(n=>Math.round(100*(n.offsetTop<t?(n.offsetTop+n.offsetHeight-t)/e:(t+e-n.offsetTop)/e))),i=this.navAnchors.toArray()[n.indexOf(Math.max(...n))].nativeElement;this._activeAnchor!==i&&(this._activeAnchor&&this._renderer.removeClass(this._activeAnchor,"active"),this._renderer.addClass(i,"active"),this._activeAnchor=i),this._clearDebounce()}))}ngAfterViewInit(){this.windowScroll()}ngOnDestroy(){this._clearDebounce()}_clearDebounce(){this._debounce&&(this._debounce.unsubscribe(),this._debounce=null)}}return t.\u0275fac=function(e){return new(e||t)(s.Gb(s.E))},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-navigation"]],viewQuery:function(t,e){if(1&t&&s.kc(O,1),2&t){let t;s.ac(t=s.Tb())&&(e.navAnchors=t)}},hostVars:4,hostBindings:function(t,e){1&t&&s.Sb("scroll",function(){return e.windowScroll()},!1,s.bc),2&t&&s.yb("horizontal",e.horizontal)("vertical",e.vertical)},inputs:{orientation:"orientation"},decls:1,vars:1,consts:[[3,"ngClass","href",4,"ngFor","ngForOf"],[3,"ngClass","href"],["navAnchor",""]],template:function(t,e){1&t&&s.fc(0,y,3,3,"a",0),2&t&&s.Xb("ngForOf",e.navigationAnchors)},directives:[i.j,i.i],styles:[".horizontal[_nghost-%COMP%]{height:2rem}.horizontal[_nghost-%COMP%]   a[_ngcontent-%COMP%]:not(:last-child){margin-right:1rem}.vertical[_nghost-%COMP%]   a[_ngcontent-%COMP%]:not(:last-child){margin-bottom:1rem}[_nghost-%COMP%]   a[_ngcontent-%COMP%]{color:var(--theme-font-color);transition:color .1s ease-in}[_nghost-%COMP%]   a.active[_ngcontent-%COMP%]{color:#1dc690}[_nghost-%COMP%]   a[_ngcontent-%COMP%]:hover{color:#1dc690;text-decoration:none}"]}),t})(),P=(()=>{class t{constructor(t){this._changeDetectorRef=t,this.deferThreshold=.25,this.deferClass="invisible"}detectChangesSafely(){this._changeDetectorRef.destroyed||this._changeDetectorRef.detectChanges()}deferLoad(){this.deferClass="defer-load"}}return t.\u0275fac=function(e){return new(e||t)(s.Gb(s.h))},t.\u0275dir=s.Bb({type:t}),t})();var x=function(t){return t[t.top=0]="top",t[t.right=1]="right",t[t.bottom=2]="bottom",t[t.left=3]="left",t}({});let L=(()=>{class t{constructor(t,e){this._hostElement=t,this._renderer=e,this.tooltipDelay=500,this.tooltipPosition=x.top,this._tooltipEl=null,this._unlisteners=[],this._hideTooltip=()=>{var t;this._tooltipEl&&(this._renderer.removeChild(this._tooltipContainerEl,this._tooltipEl),this._tooltipEl=null),this._hideUnlisten(),null===(t=this._debounceSubscription)||void 0===t||t.unsubscribe(),this._debounceSubscription=null}}get _tooltipContainerEl(){return document.querySelector("#ak-tooltip-container")}mouseover(){this._showTooltip()}focus(){this._showTooltip()}ngOnDestroy(){this._hideTooltip()}_showTooltip(){this._debounceSubscription||(this._debounceSubscription=w(this.tooltipDelay).subscribe(()=>{this._tooltipEl=this._renderer.createElement("div"),this._tooltipEl.innerHTML=this.tooltipContent,this._renderer.addClass(this._tooltipEl,"ak-tooltip"),this._renderer.appendChild(this._tooltipContainerEl,this._tooltipEl);const t=this._hostElement.nativeElement.getBoundingClientRect();switch(this.tooltipPosition){case x.top:this._renderer.addClass(this._tooltipEl,"top"),this._renderer.setStyle(this._tooltipEl,"top",t.y-16-this._tooltipEl.clientHeight+"px"),this._renderer.setStyle(this._tooltipEl,"left",t.x+t.width/2-this._tooltipEl.clientWidth/2+"px");break;case x.right:this._renderer.addClass(this._tooltipEl,"right"),this._renderer.setStyle(this._tooltipEl,"top",t.y+t.height/2-this._tooltipEl.clientHeight/2+"px"),this._renderer.setStyle(this._tooltipEl,"left",`${t.x+t.width+16}px`);break;case x.bottom:this._renderer.addClass(this._tooltipEl,"bottom"),this._renderer.setStyle(this._tooltipEl,"top",`${t.y+t.height+16}px`),this._renderer.setStyle(this._tooltipEl,"left",t.x+t.width/2-this._tooltipEl.clientWidth/2+"px");break;case x.left:this._renderer.addClass(this._tooltipEl,"left"),this._renderer.setStyle(this._tooltipEl,"top",t.y+t.height/2-this._tooltipEl.clientHeight/2+"px"),this._renderer.setStyle(this._tooltipEl,"left",t.x-this._tooltipEl.clientWidth-16+"px")}this._hideListen()}),this.tooltipDelay>0&&this._hideListen())}_hideListen(){this._unlisteners.push(this._renderer.listen(this._hostElement.nativeElement,"mouseout",this._hideTooltip)),this._unlisteners.push(this._renderer.listen(this._hostElement.nativeElement,"blur",this._hideTooltip)),document.addEventListener("scroll",this._hideTooltip),window.addEventListener("resize",this._hideTooltip)}_hideUnlisten(){this._unlisteners.forEach(t=>t()),document.removeEventListener("scroll",this._hideTooltip),window.removeEventListener("resize",this._hideTooltip)}}return t.\u0275fac=function(e){return new(e||t)(s.Gb(s.l),s.Gb(s.E))},t.\u0275dir=s.Bb({type:t,selectors:[["","akTooltip",""]],hostBindings:function(t,e){1&t&&s.Sb("mouseover",function(){return e.mouseover()})("focus",function(){return e.focus()})},inputs:{tooltipContent:"tooltipContent",tooltipDelay:"tooltipDelay",tooltipPosition:"tooltipPosition"}}),t})(),K=(()=>{class t extends P{constructor(){super(...arguments),this.navigationId="intro"}}return t.\u0275fac=function(e){return E(e||t)},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-intro"]],features:[s.ub],decls:17,vars:2,consts:[[3,"id"],[1,"content","position-relative","p-0"],[1,"row","no-gutters","align-items-center","px-5","px-lg-0","pt-5","pt-md-0"],[1,"col-auto","offset-lg-2"],["id","hi"],["id","im"],["id","austin"],[1,"col","d-flex","justify-content-center"],["src","/assets/images/me.jpeg"],["akTooltip","","id","scroll-down",1,"position-absolute",3,"tooltipContent"],[1,"fas","fa-angle-double-down","fa-2x"]],template:function(t,e){1&t&&(s.Lb(0,"section",0),s.Lb(1,"div",1),s.Lb(2,"div",2),s.Lb(3,"div",3),s.Lb(4,"h1"),s.Lb(5,"span",4),s.gc(6,"Hi,"),s.Kb(),s.Hb(7,"br"),s.Lb(8,"span",5),s.gc(9,"I'm"),s.Kb(),s.gc(10,"\xa0"),s.Lb(11,"span",6),s.gc(12,"Austin"),s.Kb(),s.Kb(),s.Kb(),s.Lb(13,"div",7),s.Hb(14,"img",8),s.Kb(),s.Kb(),s.Lb(15,"div",9),s.Hb(16,"i",10),s.Kb(),s.Kb(),s.Kb()),2&t&&(s.Xb("id",e.navigationId),s.wb(15),s.Xb("tooltipContent","Keep scrolling!"))},directives:[L],styles:["@-webkit-keyframes kfOpacity{0%{opacity:0}to{opacity:1}}@keyframes kfOpacity{0%{opacity:0}to{opacity:1}}@-webkit-keyframes kfShrink{0%{transform:scale(1)}to{transform:scale(0)}}@keyframes kfShrink{0%{transform:scale(1)}to{transform:scale(0)}}@-webkit-keyframes kfGrow{0%{transform:scale(0)}to{transform:scale(1)}}@keyframes kfGrow{0%{transform:scale(0)}to{transform:scale(1)}}@-webkit-keyframes kfRotate{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes kfRotate{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@-webkit-keyframes kfBounce{0%{transform:translateY(-50%)}15%{transform:translateY(0)}35%{transform:translateY(-20%)}50%{transform:translateY(0)}to{transform:translateY(-50%)}}@keyframes kfBounce{0%{transform:translateY(-50%)}15%{transform:translateY(0)}35%{transform:translateY(-20%)}50%{transform:translateY(0)}to{transform:translateY(-50%)}}@-webkit-keyframes kfGradientChange{0%{background-position:0 0}to{background-position:-100% -100%}}@keyframes kfGradientChange{0%{background-position:0 0}to{background-position:-100% -100%}}@-webkit-keyframes kfColorPulse{0%{background-color:#eaeaea}50%{background-color:#888}to{background-color:#eaeaea}}@keyframes kfColorPulse{0%{background-color:#eaeaea}50%{background-color:#888}to{background-color:#eaeaea}}section[_ngcontent-%COMP%]{-webkit-animation:kfGradientChange 2s ease-in-out;animation:kfGradientChange 2s ease-in-out;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;background:linear-gradient(45deg,#1c4670,#278ab0,#1dc690);background-size:200% 200%}section[_ngcontent-%COMP%], section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%], section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{min-height:100vh}section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   #hi[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in;animation:kfOpacity .5s ease-in;-webkit-animation-delay:.75s;animation-delay:.75s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;color:#333;opacity:0}section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   #im[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in;animation:kfOpacity .5s ease-in;-webkit-animation-delay:1.5s;animation-delay:1.5s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;color:#333;opacity:0}section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]   #austin[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in;animation:kfOpacity .5s ease-in;-webkit-animation-delay:1.75s;animation-delay:1.75s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;color:#fff;opacity:0}section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in;animation:kfOpacity .5s ease-in;-webkit-animation-delay:2s;animation-delay:2s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;border-radius:1rem;box-shadow:0 2px 10px 0 rgba(0,0,0,.55);height:50vh;opacity:0}section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   #scroll-down[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in;animation:kfOpacity .5s ease-in;-webkit-animation-delay:2.25s;animation-delay:2.25s;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;bottom:0;color:#fff;left:50%;opacity:0;transform:translateX(-50%);-webkit-user-select:none;-moz-user-select:none;user-select:none}section[_ngcontent-%COMP%]   .content[_ngcontent-%COMP%]   #scroll-down[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{-webkit-animation:kfBounce 2s ease-in-out;animation:kfBounce 2s ease-in-out;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}"]}),t})();const E=s.Nb(K);let S=(()=>{class t{constructor(t){this._elementRef=t,this.threshold=0,this.deferLoad=new s.n,this._checkIfIntersecting=t=>t.isIntersecting&&t.target===this._elementRef.nativeElement}ngAfterViewInit(){this._intersectionObserver=new IntersectionObserver(t=>{this._checkForIntersection(t)},{threshold:this.threshold}),this._intersectionObserver.observe(this._elementRef.nativeElement)}_checkForIntersection(t){t.forEach(t=>{this._checkIfIntersecting(t)&&(this.deferLoad.emit(),this._intersectionObserver.unobserve(this._elementRef.nativeElement),this._intersectionObserver.disconnect())})}}return t.\u0275fac=function(e){return new(e||t)(s.Gb(s.l))},t.\u0275dir=s.Bb({type:t,selectors:[["","akDeferLoad",""]],inputs:{threshold:"threshold"},outputs:{deferLoad:"deferLoad"}}),t})(),I=(()=>{class t{constructor(){this.text="",this.colorClass=""}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-section-title"]],inputs:{text:"text",colorClass:"colorClass"},decls:5,vars:3,consts:[[1,"section-title-container","position-relative","mb-5"],[1,"position-absolute"],[1,"position-absolute",3,"ngClass"]],template:function(t,e){1&t&&(s.Lb(0,"div",0),s.Lb(1,"h2",1),s.gc(2),s.Kb(),s.Lb(3,"h2",2),s.gc(4),s.Kb(),s.Kb()),2&t&&(s.wb(2),s.hc(e.text),s.wb(1),s.Xb("ngClass",e.colorClass),s.wb(1),s.hc(e.text))},directives:[i.i],styles:[".section-title-container[_ngcontent-%COMP%]{height:3rem}.section-title-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:first-child{left:-.1rem;top:-.1rem;z-index:100}.section-title-container[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:last-child{left:.1rem;top:.1rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}"]}),t})(),H=(()=>{class t extends P{constructor(){super(...arguments),this.navigationId="about",this.title="About me",this.titleColor="color-app-accent-1"}}return t.\u0275fac=function(e){return X(e||t)},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-about"]],features:[s.ub],decls:35,vars:5,consts:[[3,"id"],["akDeferLoad","",1,"content",3,"ngClass","threshold","deferLoad"],[1,"row","no-gutters","px-5","px-lg-0"],[1,"col","offset-lg-2"],[3,"text","colorClass"],[1,"row","no-gutters","justify-content-center","px-5","px-lg-0"],[1,"col-12","col-lg-4","mb-5","mb-lg-0"],[1,"row","no-gutters"],[1,"col-12"],[1,"col-12","col-lg-4"],[1,"row","no-gutters","justify-content-center","align-items-center","mb-5"],[1,"col-4","d-flex","justify-content-end"],[1,"about-icon-container","text-center"],[1,"color-app-accent-2","fas","fa-suitcase","fa-3x"],[1,"col-8"],[1,"ml-3"],[1,"row","no-gutters","align-items-center","mb-5"],[1,"color-app-accent-2","fas","fa-building","fa-3x"],[1,"row","no-gutters","align-items-center"],[1,"color-app-accent-2","fas","fa-map-marker-alt","fa-3x"]],template:function(t,e){1&t&&(s.Lb(0,"section",0),s.Lb(1,"div",1),s.Sb("deferLoad",function(){return e.deferLoad()}),s.Lb(2,"div",2),s.Lb(3,"div",3),s.Hb(4,"ak-section-title",4),s.Kb(),s.Kb(),s.Lb(5,"div",5),s.Lb(6,"div",6),s.Lb(7,"div",7),s.Lb(8,"div",8),s.Lb(9,"p"),s.gc(10,"Over the last several years, I've had the opportunity to work with a variety of web technologies and talented people. While I mostly identify as a front-ender, I continue to find myself utilizing my skills on both ends of the tech stack."),s.Kb(),s.Lb(11,"p"),s.gc(12,"I strive to stay up-to-date on the latest programming principles and am continually looking for ways to improve my web development game."),s.Kb(),s.Kb(),s.Kb(),s.Kb(),s.Lb(13,"div",9),s.Lb(14,"div",10),s.Lb(15,"div",11),s.Lb(16,"div",12),s.Hb(17,"i",13),s.Kb(),s.Kb(),s.Lb(18,"div",14),s.Lb(19,"label",15),s.gc(20,"Staff Software Engineer"),s.Kb(),s.Kb(),s.Kb(),s.Lb(21,"div",16),s.Lb(22,"div",11),s.Lb(23,"div",12),s.Hb(24,"i",17),s.Kb(),s.Kb(),s.Lb(25,"div",14),s.Lb(26,"label",15),s.gc(27,"NAVEX (remote)"),s.Kb(),s.Kb(),s.Kb(),s.Lb(28,"div",18),s.Lb(29,"div",11),s.Lb(30,"div",12),s.Hb(31,"i",19),s.Kb(),s.Kb(),s.Lb(32,"div",14),s.Lb(33,"label",15),s.gc(34,"Minneapolis, Minnesota"),s.Kb(),s.Kb(),s.Kb(),s.Kb(),s.Kb(),s.Kb(),s.Kb()),2&t&&(s.Xb("id",e.navigationId),s.wb(1),s.Xb("ngClass",e.deferClass)("threshold",e.deferThreshold),s.wb(3),s.Xb("text",e.title)("colorClass",e.titleColor))},directives:[S,i.i,I],styles:[".about-icon-container[_ngcontent-%COMP%]{width:4rem}"]}),t})();const X=s.Nb(H);class A{constructor(t){t&&Object.assign(this,t)}}const D=[new A({expanded:!0,startDate:new Date(2012,7),endDate:new Date(2017,4),name:"University of Kansas",description:"Graduated from KU with a B.S. in Computer Science. Rock Chalk!"}),new A({startDate:new Date(2014,1),endDate:new Date(2017,2),name:"AllofE Solutions",description:"The first job I had in the web development space. I was hired as a part time web developer with AllofE in Lawrence, Kansas. My most notable projects concerned the design and implementation of features for eMedley, a brand new product suite. I also helped maintain legacy websites and contributed to upgrades of company intranet tools."}),new A({startDate:new Date(2017,5),endDate:new Date(2019,7),name:"Lockpath",description:"After graduating from KU in the summer of 2017, I began my full-time professional career as a Software Engineer with Lockpath in Overland Park, Kansas. I initially worked on back-end projects, but after several months was recruited to the front-end team to help with a crucial UI overhaul. During the overhaul, I started developing a deep understanding of Angular and established that I most enjoy front-end work."}),new A({startDate:new Date(2019,7),endDate:new Date,name:"NAVEX",description:"Lockpath was acquired in August 2019 by NAVEX Global, which rebranded to NAVEX at the beginning of 2022. My current position is Staff Software Engineer on the NAVEX IRM team. I am responsible for the overall architecture of the IRM Angular application, review pull requests from other engineers as a repository codeowner, and work with the product team to define acceptance criteria for upcoming projects."})];let T=(()=>{class t{constructor(t,e){this._context={akLet:void 0},t.createEmbeddedView(e,this._context)}set akLet(t){this._context.akLet=t}}return t.\u0275fac=function(e){return new(e||t)(s.Gb(s.P),s.Gb(s.L))},t.\u0275dir=s.Bb({type:t,selectors:[["","akLet",""]],inputs:{akLet:"akLet"}}),t})(),j=(()=>{class t{transform(t,e){const n=t.getTime();return Math.round((e.getTime()-n)/(Date.now()-n)*document.body.clientWidth)}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275pipe=s.Fb({name:"timeline",type:t,pure:!0}),t})();const Y=function(t){return{left:t}};function z(t,e){if(1&t&&(s.Jb(0),s.Hb(1,"div",8),s.Vb(2,"timeline"),s.Lb(3,"h3",9),s.Vb(4,"timeline"),s.gc(5),s.Vb(6,"date"),s.Kb(),s.Ib()),2&t){const t=e.$implicit,n=s.Ub();s.wb(1),s.Xb("ngStyle",s.Yb(12,Y,s.Wb(2,3,n.timelineStart,t)+"px")),s.wb(2),s.Xb("ngStyle",s.Yb(14,Y,s.Wb(4,6,n.timelineStart,t)+16+"px")),s.wb(2),s.ic(" ",s.Wb(6,9,t,"y")," ")}}function G(t,e){if(1&t&&(s.Lb(0,"div",14),s.Lb(1,"i"),s.gc(2),s.Vb(3,"date"),s.Vb(4,"date"),s.Kb(),s.Lb(5,"p"),s.gc(6),s.Kb(),s.Kb()),2&t){const t=s.Ub(2).$implicit;s.wb(2),s.jc("",s.Wb(3,3,t.startDate,"MMMM y")," - ",s.Wb(4,6,t.endDate,"MMMM y"),""),s.wb(4),s.hc(t.description)}}const V=function(t,e){return{left:t,width:e}},B=function(t){return{expandable:t}};function F(t,e){if(1&t){const t=s.Mb();s.Lb(0,"div",12),s.Sb("click",function(){s.cc(t);const e=s.Ub().$implicit;return s.Ub().eventClick(e)})("keyup.enter",function(){s.cc(t);const e=s.Ub().$implicit;return s.Ub().eventClick(e)}),s.Vb(1,"timeline"),s.Lb(2,"h4"),s.gc(3),s.Kb(),s.fc(4,G,7,9,"div",13),s.Kb()}if(2&t){const t=e.akLet,n=s.Ub().$implicit,i=s.Ub();s.Xb("tabindex",n.description?0:-1)("ngStyle",s.Zb(8,V,t+"px",s.Wb(1,5,i.timelineStart,n.endDate)-t+"px"))("ngClass",s.Yb(11,B,n.description)),s.wb(3),s.hc(n.name),s.wb(1),s.Xb("ngIf",n.expanded)}}function R(t,e){if(1&t&&(s.Lb(0,"div",10),s.fc(1,F,5,13,"div",11),s.Vb(2,"timeline"),s.Kb()),2&t){const t=e.$implicit,n=s.Ub();s.wb(1),s.Xb("akLet",s.Wb(2,1,n.timelineStart,t.startDate))}}let N=(()=>{class t extends P{constructor(){super(...arguments),this.navigationId="timeline",this.title="Timeline",this.titleColor="color-app-accent-2",this.timelineStart=new Date(2011,8),this.timelineYears=[],this.timelineEvents=D}ngOnInit(){const t=(new Date).getFullYear();let e=this.timelineStart.getFullYear()+1;for(;e<=t;)this.timelineYears.push(new Date(e,0)),e++}eventClick(t){t.expanded=!t.expanded}}return t.\u0275fac=function(e){return U(e||t)},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-timeline"]],features:[s.ub],decls:8,vars:7,consts:[[3,"id"],["akDeferLoad","",1,"content",3,"ngClass","threshold","deferLoad"],[1,"row","no-gutters","px-5","px-lg-0"],[1,"col","offset-lg-2"],[3,"text","colorClass"],["id","timeline-ribbon",1,"row","no-gutters","px-5","px-lg-0"],[4,"ngFor","ngForOf"],["class","timeline-event-container",4,"ngFor","ngForOf"],[1,"timeline-year-line",3,"ngStyle"],[1,"timeline-year-text",3,"ngStyle"],[1,"timeline-event-container"],["class","timeline-event dark-focus",3,"tabindex","ngStyle","ngClass","click","keyup.enter",4,"akLet"],[1,"timeline-event","dark-focus",3,"tabindex","ngStyle","ngClass","click","keyup.enter"],["class","timeline-event-description",4,"ngIf"],[1,"timeline-event-description"]],template:function(t,e){1&t&&(s.Lb(0,"section",0),s.Lb(1,"div",1),s.Sb("deferLoad",function(){return e.deferLoad()}),s.Lb(2,"div",2),s.Lb(3,"div",3),s.Hb(4,"ak-section-title",4),s.Kb(),s.Kb(),s.Lb(5,"div",5),s.fc(6,z,7,16,"ng-container",6),s.fc(7,R,3,4,"div",7),s.Kb(),s.Kb(),s.Kb()),2&t&&(s.Xb("id",e.navigationId),s.wb(1),s.Xb("ngClass",e.deferClass)("threshold",e.deferThreshold),s.wb(3),s.Xb("text",e.title)("colorClass",e.titleColor),s.wb(2),s.Xb("ngForOf",e.timelineYears),s.wb(1),s.Xb("ngForOf",e.timelineEvents))},directives:[S,i.i,I,i.j,i.l,T,i.k],pipes:[j,i.d],styles:["#timeline-ribbon[_ngcontent-%COMP%]{background:linear-gradient(45deg,#1c4670,#278ab0,#1dc690);padding:4rem 0 2rem;position:relative}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-year-line[_ngcontent-%COMP%]{border:1px solid hsla(0,0%,100%,.4);height:100%;position:absolute;top:0}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-year-text[_ngcontent-%COMP%]{color:hsla(0,0%,100%,.4);position:absolute;top:1rem}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-event-container[_ngcontent-%COMP%]{width:100%}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-event-container[_ngcontent-%COMP%]:not(:last-child){margin-bottom:2rem}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-event-container[_ngcontent-%COMP%]   .timeline-event[_ngcontent-%COMP%]{background-color:#fff;border-radius:.25rem;color:#333;display:inline-block;padding:.5rem;pointer-events:none;position:relative}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-event-container[_ngcontent-%COMP%]   .timeline-event.expandable[_ngcontent-%COMP%]{cursor:pointer;pointer-events:all;transition:background-color .1s ease-in}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-event-container[_ngcontent-%COMP%]   .timeline-event.expandable[_ngcontent-%COMP%]:hover{background-color:#eaeaea}#timeline-ribbon[_ngcontent-%COMP%]   .timeline-event-container[_ngcontent-%COMP%]   .timeline-event[_ngcontent-%COMP%]   .timeline-event-description[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{margin-bottom:.25rem}"],changeDetection:0}),t})();const U=s.Nb(N);let W=(()=>{class t{constructor(){this.tooltipPosition=x}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-skill"]],inputs:{name:"name",icon:"icon",level:"level"},decls:10,vars:4,consts:[[1,"row","no-gutters","justify-content-center","mb-2"],[1,"col-4",3,"ngClass"],[1,"skill-notch"],[1,"row","no-gutters","justify-content-center"],[1,"col-auto"],["akTooltip","","tabindex","0",1,"skill-icon",3,"ngClass","tooltipContent","tooltipPosition"]],template:function(t,e){1&t&&(s.Lb(0,"div",0),s.Lb(1,"div",1),s.Hb(2,"div",2),s.Hb(3,"div",2),s.Hb(4,"div",2),s.Hb(5,"div",2),s.Hb(6,"div",2),s.Kb(),s.Kb(),s.Lb(7,"div",3),s.Lb(8,"div",4),s.Hb(9,"i",5),s.Kb(),s.Kb()),2&t&&(s.wb(1),s.Xb("ngClass","skill-"+e.level),s.wb(8),s.Xb("ngClass",e.icon)("tooltipContent",e.name)("tooltipPosition",e.tooltipPosition.bottom))},directives:[i.i,L],styles:[".skill-notch[_ngcontent-%COMP%]{background-color:transparent;border-radius:.25rem;height:1rem;width:100%}.skill-notch[_ngcontent-%COMP%]:not(:last-child){margin-bottom:.5rem}.skill-5[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:first-child{background-color:#1dc690}.skill-3[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(3), .skill-4[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(2), .skill-4[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(3), .skill-5[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(2), .skill-5[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(3){background-color:#278ab0}.skill-1[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(5), .skill-2[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(4), .skill-2[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(5), .skill-3[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(4), .skill-3[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(5), .skill-4[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(4), .skill-4[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(5), .skill-5[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(4), .skill-5[_ngcontent-%COMP%]   .skill-notch[_ngcontent-%COMP%]:nth-child(5){background-color:#1c4670}.skill-icon[_ngcontent-%COMP%]{display:inline-block;transition:transform .1s ease-in}.skill-icon[_ngcontent-%COMP%]:hover{transform:scale(120%)}@media (min-width:0px){.skill-icon[_ngcontent-%COMP%]{font-size:2.5rem}}@media (min-width:768px){.skill-icon[_ngcontent-%COMP%]{font-size:3.25rem}}@media (min-width:992px){.skill-icon[_ngcontent-%COMP%]{font-size:4rem}}"],changeDetection:0}),t})(),$=(()=>{class t extends P{constructor(){super(...arguments),this.navigationId="skills",this.title="Skills",this.titleColor="color-app-accent-1"}}return t.\u0275fac=function(e){return q(e||t)},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-skills"]],features:[s.ub],decls:32,vars:53,consts:[[3,"id"],["akDeferLoad","",1,"content",3,"ngClass","threshold","deferLoad"],[1,"row","no-gutters","px-5","px-lg-0"],[1,"col","offset-lg-2"],[3,"text","colorClass"],[1,"row","no-gutters","mb-5","px-5","px-lg-0"],[1,"col-12","offset-lg-2","col-lg-4"],[1,"col-12","offset-lg-2","col-lg-8"],[1,"row","no-gutters","mb-5"],[1,"col-2",3,"name","icon","level"],[1,"row","no-gutters"]],template:function(t,e){1&t&&(s.Lb(0,"section",0),s.Lb(1,"div",1),s.Sb("deferLoad",function(){return e.deferLoad()}),s.Lb(2,"div",2),s.Lb(3,"div",3),s.Hb(4,"ak-section-title",4),s.Kb(),s.Kb(),s.Lb(5,"div",5),s.Lb(6,"div",6),s.Lb(7,"p"),s.gc(8,"Building web apps professionally in my job with NAVEX, as well as personally with various hobby projects, has helped me developed a strong proficiency with TypeScript and Angular. It is what I find myself working with most and is my biggest strength in web development. But expanding my knowledge with other tools is never far off my mind."),s.Kb(),s.Lb(9,"p"),s.gc(10,"Take a look below to see where my skills and experience with various tools stand."),s.Kb(),s.Kb(),s.Kb(),s.Lb(11,"div",2),s.Lb(12,"div",7),s.Lb(13,"div",8),s.Hb(14,"ak-skill",9),s.Hb(15,"ak-skill",9),s.Hb(16,"ak-skill",9),s.Hb(17,"ak-skill",9),s.Hb(18,"ak-skill",9),s.Hb(19,"ak-skill",9),s.Kb(),s.Lb(20,"div",8),s.Hb(21,"ak-skill",9),s.Hb(22,"ak-skill",9),s.Hb(23,"ak-skill",9),s.Hb(24,"ak-skill",9),s.Kb(),s.Lb(25,"div",10),s.Hb(26,"ak-skill",9),s.Hb(27,"ak-skill",9),s.Hb(28,"ak-skill",9),s.Hb(29,"ak-skill",9),s.Hb(30,"ak-skill",9),s.Hb(31,"ak-skill",9),s.Kb(),s.Kb(),s.Kb(),s.Kb(),s.Kb()),2&t&&(s.Xb("id",e.navigationId),s.wb(1),s.Xb("ngClass",e.deferClass)("threshold",e.deferThreshold),s.wb(3),s.Xb("text",e.title)("colorClass",e.titleColor),s.wb(10),s.Xb("name","HTML5")("icon","fab fa-html5")("level",5),s.wb(1),s.Xb("name","Angular")("icon","fab fa-angular")("level",5),s.wb(1),s.Xb("name","TypeScript")("icon","devicon-typescript-plain")("level",4),s.wb(1),s.Xb("name","CSS3")("icon","fab fa-css3-alt")("level",5),s.wb(1),s.Xb("name","Sass")("icon","fab fa-sass")("level",3),s.wb(1),s.Xb("name","Bootstrap")("icon","fab fa-bootstrap")("level",5),s.wb(2),s.Xb("name","C#")("icon","devicon-csharp-plain")("level",4),s.wb(1),s.Xb("name",".NET")("icon","devicon-dot-net-plain")("level",3),s.wb(1),s.Xb("name","SQL")("icon","fas fa-database")("level",3),s.wb(1),s.Xb("name","PHP")("icon","fab fa-php")("level",2),s.wb(2),s.Xb("name","Git")("icon","fab fa-git-alt")("level",5),s.wb(1),s.Xb("name","Visual Studio Code")("icon","devicon-vscode-plain")("level",5),s.wb(1),s.Xb("name","Visual Studio")("icon","devicon-visualstudio-plain")("level",4),s.wb(1),s.Xb("name","Windows")("icon","fab fa-windows")("level",5),s.wb(1),s.Xb("name","Jira")("icon","fab fa-jira")("level",4),s.wb(1),s.Xb("name","Confluence")("icon","fab fa-confluence")("level",4))},directives:[S,i.i,I,W],styles:[""]}),t})();const q=s.Nb($);class J{constructor(t){t&&Object.assign(this,t)}}function Q(t,e){if(1&t&&(s.Lb(0,"div",1),s.Lb(1,"a",2),s.Hb(2,"i",3),s.Kb(),s.Kb()),2&t){const t=e.$implicit;s.wb(1),s.Xb("href",t.href,s.dc),s.wb(1),s.Xb("ngClass",t.class)}}let Z=(()=>{class t{constructor(){this.icons=[new J({href:"https://www.linkedin.com/in/austinkurtti",class:"fab fa-linkedin"}),new J({href:"mailto:austin.kurtti@gmail.com",class:"fas fa-envelope-square"}),new J({href:"https://github.com/austinkurtti",class:"fab fa-github-square"})]}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-contact-icons"]],decls:1,vars:1,consts:[["class","contact-icon-wrapper",4,"ngFor","ngForOf"],[1,"contact-icon-wrapper"],[1,"contact-icon","d-flex","justify-content-center","align-items-center",3,"href"],[1,"fa-2x",3,"ngClass"]],template:function(t,e){1&t&&s.fc(0,Q,3,2,"div",0),2&t&&s.Xb("ngForOf",e.icons)},directives:[i.j,i.i],styles:["[_nghost-%COMP%]{height:2rem}[_nghost-%COMP%]   .contact-icon-wrapper[_ngcontent-%COMP%]{display:inline-block;margin-left:2rem}[_nghost-%COMP%]   .contact-icon-wrapper[_ngcontent-%COMP%]:first-child{margin-left:0}[_nghost-%COMP%]   .contact-icon-wrapper[_ngcontent-%COMP%]   .contact-icon[_ngcontent-%COMP%]{color:var(--theme-font-color);font-size:1rem;height:2rem;text-decoration:none;transition:color .1s ease-in;width:2rem}[_nghost-%COMP%]   .contact-icon-wrapper[_ngcontent-%COMP%]   .contact-icon[_ngcontent-%COMP%]:hover{color:#1dc690}"]}),t})();const tt=["header"],et=["headerMenuContent"];let nt=(()=>{class t{constructor(t){this._renderer=t,this.title="Austin Kurtti",this.menuOpen=!1,this._themeKey="theme"}windowResize(){this.menuOpen&&this.toggleMenu()}ngAfterViewInit(){this.currentThemeValue=!!l.getItem(this._themeKey),this._setTheme()}toggleMenu(){this.menuOpen=!this.menuOpen,this._updateMenu()}toggleTheme(){this.currentThemeValue=!l.getItem(this._themeKey),l.setItem(this._themeKey,this.currentThemeValue),this._setTheme()}_updateMenu(){this.menuOpen?(this._renderer.removeClass(this.headerMenuContent.nativeElement,"d-none"),this._renderer.setStyle(this.headerMenuContent.nativeElement,"top",`${this.header.nativeElement.offsetHeight+16}px`),this._renderer.setStyle(this.headerMenuContent.nativeElement,"left","16px")):this._renderer.addClass(this.headerMenuContent.nativeElement,"d-none")}_setTheme(){document.documentElement.setAttribute("data-theme",this.currentThemeValue?"dark":"light")}}return t.\u0275fac=function(e){return new(e||t)(s.Gb(s.E))},t.\u0275cmp=s.Ab({type:t,selectors:[["ak-home"]],viewQuery:function(t,e){if(1&t&&(s.kc(tt,1),s.kc(et,1)),2&t){let t;s.ac(t=s.Tb())&&(e.header=t.first),s.ac(t=s.Tb())&&(e.headerMenuContent=t.first)}},hostBindings:function(t,e){1&t&&s.Sb("resize",function(){return e.windowResize()},!1,s.bc)},decls:27,vars:5,consts:[[1,"position-fixed","w-100","row","no-gutters","align-items-center"],["header",""],["id","header-menu",1,"col-auto","d-flex","d-lg-none","text-center"],["tabindex","0",1,"fas","fa-bars","fa-2x",3,"click"],["id","header-title",1,"col","col-lg-3"],["id","header-nav",1,"col-lg-6","d-none","d-lg-flex","text-center"],[1,"d-block","w-100"],["id","header-icons",1,"col-lg-3","d-none","d-lg-flex","justify-content-end"],["tabindex","0",1,"theme-toggle","fas","fa-2x",3,"ngClass","click"],["id","header-menu-content",1,"position-fixed","d-none","p-3","text-center"],["headerMenuContent",""],["tabindex","0",1,"theme-toggle","fas","mb-3",3,"ngClass","click"],[1,"d-block",3,"orientation"],[1,"position-static"],["main",""],[1,"row","no-gutters","justify-content-center","align-items-center"],[1,"col-auto","footer-text"],[1,"far","fa-copyright"],[1,"col-auto"]],template:function(t,e){1&t&&(s.Lb(0,"header",0,1),s.Lb(2,"div",2),s.Lb(3,"i",3),s.Sb("click",function(){return e.toggleMenu()}),s.Kb(),s.Kb(),s.Lb(4,"div",4),s.Lb(5,"span"),s.gc(6),s.Kb(),s.Kb(),s.Lb(7,"div",5),s.Hb(8,"ak-navigation",6),s.Kb(),s.Lb(9,"div",7),s.Lb(10,"i",8),s.Sb("click",function(){return e.toggleTheme()}),s.Kb(),s.Kb(),s.Kb(),s.Lb(11,"div",9,10),s.Lb(13,"i",11),s.Sb("click",function(){return e.toggleTheme()}),s.Kb(),s.Hb(14,"ak-navigation",12),s.Kb(),s.Lb(15,"main",13,14),s.Hb(17,"ak-intro"),s.Hb(18,"ak-about"),s.Hb(19,"ak-timeline"),s.Hb(20,"ak-skills"),s.Lb(21,"footer",15),s.Lb(22,"div",16),s.Hb(23,"i",17),s.gc(24),s.Kb(),s.Lb(25,"div",18),s.Hb(26,"ak-contact-icons"),s.Kb(),s.Kb(),s.Kb()),2&t&&(s.wb(6),s.hc(e.title),s.wb(4),s.Xb("ngClass",e.currentThemeValue?"fa-sun":"fa-moon"),s.wb(3),s.Xb("ngClass",e.currentThemeValue?"fa-sun":"fa-moon"),s.wb(1),s.Xb("orientation","vertical"),s.wb(10),s.ic("\xa0",e.title," "))},directives:[M,i.i,K,H,N,$,Z],styles:["@-webkit-keyframes kfOpacity{0%{opacity:0}to{opacity:1}}@keyframes kfOpacity{0%{opacity:0}to{opacity:1}}@-webkit-keyframes kfShrink{0%{transform:scale(1)}to{transform:scale(0)}}@keyframes kfShrink{0%{transform:scale(1)}to{transform:scale(0)}}@-webkit-keyframes kfGrow{0%{transform:scale(0)}to{transform:scale(1)}}@keyframes kfGrow{0%{transform:scale(0)}to{transform:scale(1)}}@-webkit-keyframes kfRotate{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes kfRotate{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@-webkit-keyframes kfBounce{0%{transform:translateY(-50%)}15%{transform:translateY(0)}35%{transform:translateY(-20%)}50%{transform:translateY(0)}to{transform:translateY(-50%)}}@keyframes kfBounce{0%{transform:translateY(-50%)}15%{transform:translateY(0)}35%{transform:translateY(-20%)}50%{transform:translateY(0)}to{transform:translateY(-50%)}}@-webkit-keyframes kfGradientChange{0%{background-position:0 0}to{background-position:-100% -100%}}@keyframes kfGradientChange{0%{background-position:0 0}to{background-position:-100% -100%}}@-webkit-keyframes kfColorPulse{0%{background-color:#eaeaea}50%{background-color:#888}to{background-color:#eaeaea}}@keyframes kfColorPulse{0%{background-color:#eaeaea}50%{background-color:#888}to{background-color:#eaeaea}}[_nghost-%COMP%]{background-color:var(--theme-content-background);color:var(--theme-font-color);display:block}[_nghost-%COMP%]   header[_ngcontent-%COMP%]{background-color:var(--theme-primary-background);box-shadow:0 2px 10px 0 rgba(0,0,0,.15);height:6rem;padding-left:2rem;padding-right:2rem;z-index:1000}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-title[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in,kfGrow .25s ease-in;animation:kfOpacity .5s ease-in,kfGrow .25s ease-in;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]{background:linear-gradient(45deg,#1c4670,#278ab0,#1dc690);-webkit-background-clip:text;background-clip:text;color:transparent;font-family:Permanent Marker,Montserrat,sans-serif;font-size:2rem;line-height:2rem}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-nav[_ngcontent-%COMP%]{font-size:1.25rem;text-transform:uppercase}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-icons[_ngcontent-%COMP%], [_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-nav[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in,kfGrow .25s ease-in;animation:kfOpacity .5s ease-in,kfGrow .25s ease-in;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-icons[_ngcontent-%COMP%]{opacity:0}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-icons[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{cursor:pointer}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-menu[_ngcontent-%COMP%]{-webkit-animation:kfOpacity .5s ease-in,kfGrow .25s ease-in;animation:kfOpacity .5s ease-in,kfGrow .25s ease-in;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards;height:2rem;padding-right:2rem}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-menu[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{cursor:pointer;height:2rem;transition:color .1s ease-in;width:2rem}[_nghost-%COMP%]   header[_ngcontent-%COMP%]   #header-menu[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]:hover{color:#1dc690}[_nghost-%COMP%]   #header-menu-content[_ngcontent-%COMP%]{background:var(--theme-primary-background);border-radius:1rem;box-shadow:0 2px 10px 0 rgba(0,0,0,.15);font-size:1.25rem;text-transform:uppercase;width:12rem;z-index:1000}[_nghost-%COMP%]   #header-menu-content[_ngcontent-%COMP%]   i[_ngcontent-%COMP%]{cursor:pointer}[_nghost-%COMP%]   .theme-toggle[_ngcontent-%COMP%]{transition:color .1s ease-in}[_nghost-%COMP%]   .theme-toggle[_ngcontent-%COMP%]:hover{color:#1dc690}[_nghost-%COMP%]   main[_ngcontent-%COMP%]{overflow-x:hidden}[_nghost-%COMP%]   footer[_ngcontent-%COMP%]{background-color:var(--theme-primary-background);height:6rem}[_nghost-%COMP%]   footer[_ngcontent-%COMP%]   .footer-text[_ngcontent-%COMP%]{margin-right:2rem}"]}),t})(),it=(()=>{class t{}return t.\u0275fac=function(e){return new(e||t)},t.\u0275mod=s.Eb({type:t}),t.\u0275inj=s.Db({imports:[[i.b,r,a,c,o.b.forChild([{path:"",component:nt}])]]}),t})()}}]);