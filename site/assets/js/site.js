{
/* Products: edit names and text here. Photos load from images/<img>.jpg */
const PRODUCTS=[
  {n:"Buffalo milk",img:"buffalo-milk",c:"#dfe8f7",s:"Thick, creamy, high in fat",d:"Rich buffalo milk with a thick layer of malai. The favourite for strong chai, kheer, basundi and every Maharashtrian sweet.",use:["Chai","Kheer","Sweets","Hotels"]},
  {n:"Cow milk",img:"cow-milk",c:"#d8ebfb",s:"Lighter, for everyday drinking",d:"Light and easy to digest. The daily glass for children and elders, and the base for homemade dahi.",use:["Children","Daily glass","Coffee"]},
  {n:"Dahi",img:"dahi",c:"#f4e4d7",s:"Set fresh every day",d:"Thick, mildly sour dahi set fresh each day, firm enough to hold a spoon. Sold loose or in cups.",use:["Meals","Raita","Kadhi"]},
  {n:"Taak and lassi",img:"taak-lassi",c:"#dcf0e3",s:"Cool buttermilk for hot afternoons",d:"Spiced taak and sweet lassi for Marathwada summers, by the glass or in bulk for functions.",use:["Summer","Functions","After meals"]},
  {n:"Paneer",img:"paneer",c:"#f0eee4",s:"Soft blocks, cut to weight",d:"Fresh, soft paneer made from our own milk and cut to weight for homes, restaurants and caterers.",use:["Curries","Tikka","Hotels"]},
  {n:"Pure ghee",img:"ghee",c:"#f8e6b6",s:"Rich aroma, slow cooked",d:"Granular, golden ghee with a rich aroma for dal, puran poli, sweets and pooja.",use:["Cooking","Puran poli","Pooja"]},
  {n:"Khava",img:"khava",c:"#efe2cc",s:"For pedha and gulab jamun",d:"Fresh khava (mawa) for pedha, gulab jamun, barfi and festival sweets. Bulk orders for halwais.",use:["Pedha","Gulab jamun","Halwais"]},
  {n:"Shrikhand",img:"shrikhand",c:"#fbdfb3",s:"Festival favourite, made to order",d:"Smooth, saffron and cardamom shrikhand made to order for Gudi Padwa, weddings and family functions.",use:["Gudi Padwa","Weddings","Functions"]}
];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const drop='<svg viewBox="0 0 60 70" aria-hidden="true"><path d="M30 3S8 30 8 45a22 22 0 0 0 44 0C52 30 30 3 30 3z" fill="currentColor" opacity=".9"/><path d="M19 46a11 11 0 0 0 11 11" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>';
const acc=document.getElementById("acc");
acc.innerHTML=PRODUCTS.map((p,i)=>`<details${i===0?' open class="on"':""} style="--c:${esc(p.c)};--img:url('${new URL(`images/${p.img}.jpg`,document.baseURI).href}')">
<summary><b>${esc(p.n)}</b><span>${esc(p.s)}</span><i aria-hidden="true"></i></summary>
<div class="pwrap"><div class="pbody">
<div class="ph"><img src="images/${esc(p.img)}.jpg" alt="Lokseva ${esc(p.n.toLowerCase())}" loading="lazy" width="600" height="600"><div class="fb"><svg></svg><em>Lokseva ${esc(p.n)}</em></div></div>
<div class="pinfo"><h3>${esc(p.n)}</h3><p>${esc(p.d)}</p><ul>${p.use.map(u=>`<li>${esc(u)}</li>`).join("")}</ul>
<a class="btn call" href="tel:+919518935481">Call to order</a></div>
</div></div></details>`).join("");
/* Smooth open and close: one product open at a time */
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const EASE="cubic-bezier(.22,1,.36,1)";
const running=new WeakMap();
const toggle=(d,opening)=>{
  const w=d.querySelector(".pwrap");
  const prev=running.get(d);
  const from=prev?getComputedStyle(w).height:null;
  if(prev)prev.cancel();
  if(opening){d.open=true;d.classList.add("on")}else d.classList.remove("on");
  if(reduce){if(!opening)d.open=false;return}
  const full=w.scrollHeight+"px";
  const a=w.animate([{height:from||(opening?"0px":full),opacity:opening?0:1},{height:opening?full:"0px",opacity:opening?1:0}],{duration:opening?560:440,easing:EASE});
  running.set(d,a);
  a.onfinish=()=>{running.delete(d);if(!opening)d.open=false};
};
acc.querySelectorAll("summary").forEach(s=>s.addEventListener("click",e=>{
  e.preventDefault();
  const d=s.parentElement,opening=!d.classList.contains("on");
  if(opening)acc.querySelectorAll("details.on").forEach(o=>{if(o!==d)toggle(o,false)});
  toggle(d,opening);
  if(opening)setTimeout(()=>{const t=d.getBoundingClientRect().top;if(t<90)scrollTo({top:scrollY+t-90,behavior:reduce?"auto":"smooth"})},reduce?0:460);
}));
document.querySelectorAll(".fb svg").forEach(s=>s.outerHTML=drop);
/* Show a clean fallback tile when a photo is missing */
const fail=img=>{const w=img.closest(".ph");if(w)w.classList.add("noimg");else{const h=img.closest(".photo");if(h)h.hidden=true}};
document.querySelectorAll(".ph img,.photo img").forEach(img=>{
  img.addEventListener("error",()=>fail(img));
  if(img.complete&&!img.naturalWidth&&img.currentSrc)fail(img);
});

/* Dark / light toggle, remembered on this device */
const root=document.documentElement,modeBtn=document.getElementById("mode");
const syncMode=()=>{const d=root.classList.contains("dark");modeBtn.setAttribute("aria-pressed",d);modeBtn.setAttribute("aria-label",d?"Switch to light mode":"Switch to dark mode")};
syncMode();
modeBtn.addEventListener("click",()=>{
  root.classList.add("theming");
  const d=root.classList.toggle("dark");
  try{localStorage.setItem("lokseva-theme",d?"dark":"light")}catch(e){}
  syncMode();
  setTimeout(()=>root.classList.remove("theming"),500);
});
/* Business hours: edit to your real timings. 24h, India time. */
const HOURS=[
  {d:"Monday to Saturday",o:"05:30",c:"22:30"},
  {d:"Sunday",o:"05:30",c:"22:30"}
];
const fmt=t=>{let[h,m]=t.split(":").map(Number);const ap=h>=12?"PM":"AM";h=h%12||12;return h+":"+String(m).padStart(2,"0")+" "+ap};
document.getElementById("hrs").innerHTML=HOURS.map(r=>`<tr><td>${r.d}</td><td>${fmt(r.o)} to ${fmt(r.c)}</td></tr>`).join("");
const openEl=document.getElementById("open");
try{
  const p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Kolkata",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:false}).formatToParts(new Date());
  const g=k=>p.find(x=>x.type===k).value;
  const mins=Number(g("hour"))%24*60+Number(g("minute"));
  const row=g("weekday")==="Sun"?HOURS[1]:HOURS[0];
  const toM=t=>{const[h,m]=t.split(":").map(Number);return h*60+m};
  const isOpen=mins>=toM(row.o)&&mins<toM(row.c);
  openEl.textContent=isOpen?"Open now, closes "+fmt(row.c):"Closed now, opens "+fmt(row.o);
  openEl.style.setProperty("--dot",isOpen?"#1fa85a":"#d2452f");
}catch(e){openEl.hidden=true}
document.getElementById("yr").textContent=new Date().getFullYear();

/* Live Google map on the real website; skipped inside sandboxed previews that block embeds */
if(!/claude|anthropic/i.test(location.hostname)){
  const f=document.createElement("iframe");
  f.title="Map to Lokseva Doodh Dairy, Gulmandi";f.loading="lazy";f.referrerPolicy="no-referrer-when-downgrade";
  f.src="https://www.google.com/maps?q="+encodeURIComponent("Roop Chand Complex, Gulmandi, Chhatrapati Sambhajinagar 431001")+"&output=embed";
  document.getElementById("map").prepend(f);
}
}
