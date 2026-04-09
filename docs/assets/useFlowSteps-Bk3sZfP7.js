import{G as L,j as G,_ as M,o as i,c as l,F as A,r as z,z as H,a as c,H as B,I as R,t as m,f as b,e as E,A as j,B as F,b as w,w as h,g as K,J as q,m as k,K as _,s as U,k as Y}from"./index-VlxLJEhe.js";const O=L("campaign",()=>{const e=new Date,a=t=>String(t).padStart(2,"0"),n=`${e.getMonth()+1}/${e.getDate()}/${e.getFullYear()} ${a(e.getHours())}:${a(e.getMinutes())}:${a(e.getSeconds())}`,s=`${e.getFullYear()}-${a(e.getMonth()+1)}-${a(e.getDate())}`,d=G({siteType:"amazon_and_beyond",campaignName:`Campaign-${n}`,dailyBudget:20,scheduleType:"continuous",startTime:s,endTime:"",portfolio:"",bidMode:"fixed",bidTop:0,bidRest:0,bidProduct:0,audienceMode:"don_t_increase",targeting:"auto",adGroupName:`Ad group-${n}`,adGroupBid:7.5,products:[],autoTargetBidMode:"by_group",autoGroups:{closeMatch:{enabled:!0,bid:0},looseMatch:{enabled:!0,bid:0},substitutes:{enabled:!0,bid:0},complements:{enabled:!0,bid:0}},autoDefaultBid:0,manualTargetType:"keyword",keywordTargetTab:"amazon",keywordTargetingDefaultBid:.07,keywordTargetingMatchTypes:{exact:!0,broad:!1,phrase:!1},keywordSelectedCampaignId:"",keywordSelectedAdGroupId:"",negativeKeywords:[],excludedProducts:[],excludedBrands:[],keywords:[],libraryKeywords:[{id:"lib-1",text:"ceramic space heater",subtitle:"Ceramic heater",is:"12.1%",ir:3,matchType:"Exact",suggestBid:"$1.04",suggestRange:"$0.80–$1.35"},{id:"lib-2",text:"portable electric heater",subtitle:"Portable heater",is:"11.4%",ir:4,matchType:"Exact",suggestBid:"$0.92",suggestRange:"$0.70–$1.12"}],productTargetMode:"category",productCategoryTab:"suggested",productProductTab:"suggested",productTargetingDefaultBid:.02,productDeliveryType:{exact:!0,expanded:!1},productAsinTheme:"similar",productSelectedCampaignId:"",productSelectedAdGroupId:"",productTargets:[],libraryProductAsins:[{id:"lp1",asin:"B0C5CV8CTW",title:"Dreo Ceramic Heater",image:"https://m.media-amazon.com/images/I/81G+4gzszVL._AC_SY879_.jpg",suggestBid:"$0.89",suggestRange:"$0.65–$1.05"},{id:"lp2",asin:"B09XK2DTVP",title:"Vornado MVH Vortex Heater",image:"https://m.media-amazon.com/images/I/71pB9RvWyRL._AC_SL1500_.jpg",suggestBid:"$0.76",suggestRange:"$0.55–$0.94"}]});function u(){d.value.siteType="amazon_and_beyond",d.value.bidMode="fixed",d.value.targeting="auto",d.value.scheduleType="continuous",d.value.autoTargetBidMode="by_group",d.value.manualTargetType="keyword"}return{form:d,reset:u}}),Z={class:"stepper"},J={class:"stepper-row"},X={class:"stepper-track"},Q=["data-state"],W={key:0,width:"14",height:"14",viewBox:"0 0 14 14",fill:"none"},ee={key:2},te=["data-state"],ae={class:"stepper-body"},oe=["data-state","onClick"],ne=["data-state"],se={key:2,class:"stepper-subitems"},re=["onClick"],ie={key:3,class:"stepper-gap"},de={__name:"Stepper",props:{steps:{type:Array,required:!0},currentStep:{type:Number,default:1},activeSubItem:{type:String,default:""}},setup(e){const a=e,n=H();function s(t){return t<a.currentStep?"completed":t===a.currentStep?"active":"inactive"}function d(t){const r=document.getElementById(t);r&&r.scrollIntoView({behavior:"smooth",block:"start"})}function u(t){t&&n.push(t)}return(t,r)=>(i(),l("aside",Z,[(i(!0),l(A,null,z(e.steps,(o,g)=>(i(),l("div",{key:g,class:"stepper-item"},[c("div",J,[c("div",X,[c("div",{class:"stepper-indicator","data-state":s(o.step)},[o.step<e.currentStep?(i(),l("svg",W,[...r[0]||(r[0]=[c("path",{d:"M2.5 7l3 3 6-6",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"},null,-1)])])):o.icon?(i(),B(R(o.icon),{key:1,size:15,"stroke-width":2.2})):(i(),l("span",ee,m(o.step),1))],8,Q),g<e.steps.length-1?(i(),l("div",{key:0,class:"stepper-separator","data-state":s(o.step)},null,8,te)):b("",!0)]),c("div",ae,[o.step<e.currentStep?(i(),l("button",{key:0,class:"stepper-title stepper-title--clickable","data-state":s(o.step),onClick:p=>u(o.path)},m(o.label),9,oe)):(i(),l("div",{key:1,class:"stepper-title","data-state":s(o.step)},m(o.label),9,ne)),o.subItems&&(o.step===e.currentStep||o.step<e.currentStep)?(i(),l("div",se,[(i(!0),l(A,null,z(o.subItems,(p,P)=>(i(),l("button",{key:P,class:E(["stepper-sub",{active:p.label===e.activeSubItem}]),onClick:Se=>d(p.anchorId)},m(p.label),11,re))),128))])):b("",!0),g<e.steps.length-1?(i(),l("div",ie)):b("",!0)])])]))),128))]))}},_e=M(de,[["__scopeId","data-v-e71afbe1"]]),le=["disabled"],ce={__name:"Button",props:{variant:{type:String,default:"default"},size:{type:String,default:"default"},disabled:Boolean},setup(e){return(a,n)=>(i(),l("button",F({class:["ui-btn",[`ui-btn--${e.variant}`,`ui-btn--size-${e.size}`]],disabled:e.disabled},a.$attrs),[j(a.$slots,"default",{},void 0)],16,le))}},v=M(ce,[["__scopeId","data-v-e02e1910"]]),ue={class:"bottom-bar"},ge={class:"bar-inner"},pe={class:"left-group"},me={class:"right-group"},be={key:0,class:"spinner"},ye={class:"dialog-box",role:"dialog","aria-modal":"true"},he={class:"dialog-actions"},ke={__name:"BottomBar",props:{nextLabel:{type:String,default:"下一步"},backLabel:{type:String,default:"上一步"},showBack:{type:Boolean,default:!1},loading:{type:Boolean,default:!1}},emits:["cancel","back","next"],setup(e,{emit:a}){const n=a,s=G(!1);function d(){s.value=!1,n("cancel")}return(u,t)=>(i(),l("footer",ue,[c("div",ge,[c("div",pe,[w(v,{variant:"outline",onClick:t[0]||(t[0]=r=>s.value=!0)},{default:h(()=>[...t[5]||(t[5]=[k("退出",-1)])]),_:1})]),c("div",me,[e.showBack?(i(),B(v,{key:0,variant:"outline",onClick:t[1]||(t[1]=r=>n("back"))},{default:h(()=>[k(m(e.backLabel),1)]),_:1})):b("",!0),w(v,{variant:"default",disabled:e.loading,onClick:t[2]||(t[2]=r=>n("next"))},{default:h(()=>[e.loading?(i(),l("span",be)):b("",!0),k(" "+m(e.nextLabel),1)]),_:1},8,["disabled"])])]),(i(),B(q,{to:"body"},[s.value?(i(),l("div",{key:0,class:"dialog-mask",onClick:t[4]||(t[4]=K(r=>s.value=!1,["self"]))},[c("div",ye,[t[8]||(t[8]=c("h3",{class:"dialog-title"},"确认退出？",-1)),t[9]||(t[9]=c("p",{class:"dialog-body"},"退出后当前广告活动的所有配置将会丢失，无法恢复。",-1)),c("div",he,[w(v,{variant:"outline",onClick:t[3]||(t[3]=r=>s.value=!1)},{default:h(()=>[...t[6]||(t[6]=[k("继续编辑",-1)])]),_:1}),w(v,{variant:"destructive",onClick:d},{default:h(()=>[...t[7]||(t[7]=[k("确认退出",-1)])]),_:1})])])])):b("",!0)]))]))}},Me=M(ke,[["__scopeId","data-v-8266746c"]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ve=e=>{for(const a in e)if(a.startsWith("aria-")||a==="role"||a==="title")return!0;return!1};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=e=>e==="";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const fe=(...e)=>e.filter((a,n,s)=>!!a&&a.trim()!==""&&s.indexOf(a)===n).join(" ").trim();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const we=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(a,n,s)=>s?s.toUpperCase():n.toLowerCase());/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ie=e=>{const a=we(e);return a.charAt(0).toUpperCase()+a.slice(1)};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var f={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const xe=({name:e,iconNode:a,absoluteStrokeWidth:n,"absolute-stroke-width":s,strokeWidth:d,"stroke-width":u,size:t=f.width,color:r=f.stroke,...o},{slots:g})=>_("svg",{...f,...o,width:t,height:t,stroke:r,"stroke-width":V(n)||V(s)||n===!0||s===!0?Number(d||u||f["stroke-width"])*24/Number(t):d||u||f["stroke-width"],class:fe("lucide",o.class,...e?[`lucide-${D(Ie(e))}-icon`,`lucide-${D(e)}`]:["lucide-icon"]),...!g.default&&!ve(o)&&{"aria-hidden":"true"}},[...a.map(p=>_(...p)),...g.default?[g.default()]:[]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const y=(e,a)=>(n,{slots:s,attrs:d})=>_(xe,{...d,...n,iconNode:a,name:e},s);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=y("calendar-days",[["path",{d:"M8 2v4",key:"1cmpym"}],["path",{d:"M16 2v4",key:"4m81vk"}],["rect",{width:"18",height:"18",x:"3",y:"4",rx:"2",key:"1hopcy"}],["path",{d:"M3 10h18",key:"8toen8"}],["path",{d:"M8 14h.01",key:"6423bh"}],["path",{d:"M12 14h.01",key:"1etili"}],["path",{d:"M16 14h.01",key:"1gbofw"}],["path",{d:"M8 18h.01",key:"lrp35t"}],["path",{d:"M12 18h.01",key:"mhygvu"}],["path",{d:"M16 18h.01",key:"kzsmim"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const x=y("circle-minus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=y("crosshair",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"22",x2:"18",y1:"12",y2:"12",key:"l9bcsi"}],["line",{x1:"6",x2:"2",y1:"12",y2:"12",key:"13hhkx"}],["line",{x1:"12",x2:"12",y1:"6",y2:"2",key:"10w3f3"}],["line",{x1:"12",x2:"12",y1:"22",y2:"18",key:"15g9kq"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=y("folder-open",[["path",{d:"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",key:"usdka0"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $e=y("package",[["path",{d:"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",key:"1a0edw"}],["path",{d:"M12 22V12",key:"d0xqtd"}],["polyline",{points:"3.29 7 12 12 20.71 7",key:"ousv84"}],["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Ce=y("tag",[["path",{d:"M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",key:"vktsd0"}],["circle",{cx:"7.5",cy:"7.5",r:".5",fill:"currentColor",key:"kqv944"}]]),T=[{label:"Campaign settings",anchorId:"section-campaign-settings"},{label:"Sites",anchorId:"section-sites"},{label:"Bidding strategy",anchorId:"section-bidding-strategy"},{label:"Targeting",anchorId:"section-targeting"}],Te=[{label:"Ad group name",anchorId:"section-ad-group-name"},{label:"Product",anchorId:"section-product"},{label:"Ad group bid",anchorId:"section-ad-group-bid"},{label:"Set bid pricing",anchorId:"section-auto-targeting"}],N=[{label:"Ad group name",anchorId:"section-ad-group-name"},{label:"Ad group bid",anchorId:"section-ad-group-bid"},{label:"Product",anchorId:"section-product"},{label:"Manual Targeting",anchorId:"section-manual-targeting"}],S=[{label:"Negative keyword",anchorId:"section-negative-keyword"},{label:"Exclude products",anchorId:"section-negative-product"},{label:"Exclude brands",anchorId:"section-negative-brand"}];function Ae(){const e=O(),{form:a}=U(e),n=Y(()=>{const t=a.value.targeting==="auto",r=a.value.manualTargetType==="keyword";return t?[{step:1,label:"Campaign Plan",path:"/campaign",icon:I,subItems:T},{step:2,label:"Ad Group",path:"/ad-group/auto",icon:C,subItems:Te},{step:3,label:"Negative targeting",path:"/negative-targeting",icon:x,subItems:S},{step:4,label:"Targeting",path:"/ad",icon:$}]:r?[{step:1,label:"Campaign Plan",path:"/campaign",icon:I,subItems:T},{step:2,label:"Ad Group",path:"/ad-group/manual",icon:C,subItems:N},{step:3,label:"Keyword targeting",path:"/keyword-targeting",icon:Ce},{step:4,label:"Negative targeting",path:"/negative-targeting",icon:x,subItems:S},{step:5,label:"Targeting",path:"/ad",icon:$}]:[{step:1,label:"Campaign Plan",path:"/campaign",icon:I,subItems:T},{step:2,label:"Ad Group",path:"/ad-group/manual",icon:C,subItems:N},{step:3,label:"Product targeting",path:"/product-targeting",icon:$e},{step:4,label:"Negative targeting",path:"/negative-targeting",icon:x,subItems:S},{step:5,label:"Targeting",path:"/ad",icon:$}]});function s(t){const r=n.value.find(o=>o.path===t);return r?r.step:1}function d(t){const r=n.value.findIndex(o=>o.path===t);return r>=0&&r<n.value.length-1?n.value[r+1].path:t}function u(t){const r=n.value,o=r.findIndex(g=>g.path===t);if(o>0)return r[o-1].path;if(o<0){if(t==="/keyword-targeting"||t==="/product-targeting")return"/ad-group/manual";if(t==="/negative-targeting")return a.value.targeting==="auto"?"/ad-group/auto":a.value.manualTargetType==="keyword"?"/keyword-targeting":"/product-targeting";if(t==="/ad")return"/negative-targeting"}return t}return{steps:n,getStepNumber:s,getNextPath:d,getBackPath:u}}export{Me as B,_e as S,v as U,Ae as a,O as u};
