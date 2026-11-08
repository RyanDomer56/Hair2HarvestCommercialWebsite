"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

/* ------------------------------------------------------------------ *
 * Hair2Harvest i18n
 *
 * Tagalog (tl) is the DEFAULT language. English (en) is the toggle.
 * The dictionary maps a stable key to { en, tl } so the same source
 * code renders either language. Any key missing from the dictionary
 * falls back to its English text (the key itself) so the UI never breaks.
 * ------------------------------------------------------------------ */

export type Lang = "tl" | "en";

export type TranslationEntry = { en: string; tl: string };

export const dict: Record<string, TranslationEntry> = {
  /* ----------------------------------------------------------- nav / shared */
  "nav.introduction": { en: "Introduction", tl: "Panimula" },
  "nav.about": { en: "About", tl: "Tungkol" },
  "nav.about.story": { en: "Our story", tl: "Ang aming kwento" },
  "nav.about.team": { en: "Our team", tl: "Ang aming koponan" },
  "nav.about.values": { en: "What we believe", tl: "Ang aming paniniwala" },
  "nav.how": { en: "How it works", tl: "Paano ito gumagana" },
  "nav.how.steps": { en: "The five steps", tl: "Ang limang hakbang" },
  "nav.how.grading": { en: "Checking the hair", tl: "Pagsusuri sa buhok" },
  "nav.how.machine": { en: "The machine", tl: "Ang makina" },
  "nav.network": { en: "Shop Partners", tl: "Mga Tindahang Partner" },
  "nav.network.directory": { en: "Directory", tl: "Talaan" },
  "nav.network.rules": { en: "Pickups & privacy", tl: "Pagkolekta at Privasiya" },
  "nav.network.join": { en: "Join a shop", tl: "Maging partner" },
  "nav.impact": { en: "Our impact", tl: "Mga Resulta ng Pagkolekta" },
  "nav.impact.collection": { en: "Collection", tl: "Pagkolekta" },
  "nav.impact.lab": { en: "Laboratory", tl: "Laboratoryo" },
  "nav.impact.trials": { en: "Planting trials", tl: "Mga pagsubok sa paghatanim" },
  "cta.partner": { en: "Partner a shop", tl: "Maging partner" },
  "cta.joinShops": { en: "Join the shops", tl: "Sumali sa mga tindahan" },
  "cta.seeShops": { en: "See the shops", tl: "Tingnan ang mga tindahan" },
  "cta.seeAllShops": { en: "See all shops", tl: "Tingnan lahat ng tindahan" },
  "cta.seeFullProcess": { en: "See the full process", tl: "Tingnan ang buong proseso" },
  "cta.yesCountMeIn": { en: "Yes, count me in", tl: "Oo, isama ako" },
  "aria.openMenu": { en: "Open menu", tl: "Buksan ang menu" },
  "aria.closeMenu": { en: "Close menu", tl: "Isara ang menu" },
  "aria.home": { en: "Home", tl: "Tahanan" },
  "common.open": { en: "Open", tl: "Buksan" },
  "common.free": { en: "Free", tl: "Libre" },
  "common.showing": { en: "SHOWING", tl: "IPINAPAKITA" },
  "common.of": { en: "OF", tl: "NG" },
  "common.home": { en: "HOME", tl: "TAHANAN" },

  /* --------------------------------------------------------------- footer */
  "footer.learn": { en: "Learn", tl: "Matuto" },
  "footer.shops": { en: "Shops", tl: "Mga Tindahan" },
  "footer.company": { en: "Company", tl: "Kumpanya" },
  "footer.shopList": { en: "Shop list", tl: "Talaan ng mga tindahan" },
  "footer.joinUs": { en: "Join us", tl: "Sumali sa amin" },
  "footer.contactUs": { en: "Contact us", tl: "Makipag-ugnayan" },
  "footer.tagline": {
    en: "A free service for barbershops. We collect hair clippings and turn them into compost for planting beds nearby. We come to you.",
    tl: "Isang libreng serbisyo para sa mga barbero. Kinokolekta namin ang mga gupit na buhok at ginagawang kompost para sa mga taniman malapit dito. Kami ang pupunta sa inyo.",
  },
  "footer.soilFromBarbers": { en: "SOIL FROM BARBERS", tl: "LUPA MULA SA MGA BARBERO" },
  "footer.barangay": {
    en: "BARANGAY NOVALICHES PROPER · PHILIPPINES",
    tl: "BARANGAY NOVALICHES PROPER · PILIPINAS",
  },
  "footer.barangayShort": {
    en: "Barangay Novaliches Proper · Philippines",
    tl: "Barangay Novaliches Proper · Pilipinas",
  },
  "footer.copyright": {
    en: "© 2026 HAIR2HARVEST · A COLLECTION & COMPOSTING SERVICE FOR BARBERSHOPS",
    tl: "© 2026 HAIR2HARVEST · SERBISYO NG PAGKOLEKTA AT PAGKOMPOSTA PARA SA MGA BARBERO",
  },
  "footer.capstone": {
    en: "CAPSTONE: AN IoT-BASED BARBERSHOP HAIR WASTE COLLECTION & AUTOMATED COMPOSTING SYSTEM WITH WEB-BASED PROCESS CONTROL FOR BARANGAY NOVALICHES PROPER",
    tl: "CAPSTONE: ISANG IoT NA PAGKOLEKTA NG BASURANG BUHOK MULA SA BARBERO AT AWTMATIKONG PAGKOMPOSTA NA MAY WEB-BASED NA KONTROL PARA SA BARANGAY NOVALICHES PROPER",
  },
  "footer.mascot": {
    en: "Chat mascot: Snip, the Hair2Harvest scissor (3D model supplied by the project)",
    tl: "Maskot sa chat: si Snip, ang gunting ng Hair2Harvest (3D model mula sa proyekto)",
  },
  "footer.nowCollecting": { en: "NOW COLLECTING", tl: "KUMUKULEKTA NA" },

  /* -------------------------------------------------------------- homepage */
  "home.hero.eyebrow": {
    en: "Now collecting · Barangay Novaliches Proper",
    tl: "Kumukulekta na · Barangay Novaliches Proper",
  },
  "home.hero.title1": { en: "Hair clippings", tl: "Mga gupit na buhok" },
  "home.hero.title2": { en: "become", tl: "ay nagiging" },
  "home.hero.title3": { en: "soil", tl: "lupa" },
  "home.hero.title4": { en: "for your barangay.", tl: "para sa inyong barangay." },
  "home.hero.para1a": {
    en: "Hair2Harvest is a free collection service for barbershops.",
    tl: "Ang Hair2Harvest ay isang libreng serbisyo ng pagkolekta para sa mga barbero.",
  },
  "home.hero.para1b": {
    en: "We pick up the hair you sweep up and turn it into compost for planting beds nearby. We come to you — there is no app, no login and no extra work for your shop.",
    tl: "Kinokolekta namin ang buhok na walisin ninyo at ginagawang kompost para sa mga taniman malapit dito. Kami ang pupunta sa inyo — walang app, walang login, at walang dagdag na trabaho sa inyong tindahan.",
  },
  "home.hero.capstone1": {
    en: "A capstone project with Barangay Novaliches Proper.",
    tl: "Isang capstone project kasama ang Barangay Novaliches Proper.",
  },
  "home.hero.capstone2": {
    en: "We turn salon and barbershop hair waste into compost for local planting beds.",
    tl: "Ginagawa namin ang basurang buhok mula sa salon at barbero bilang kompost para sa mga lokal na taniman.",
  },
  "home.hero.free1": { en: "FREE TO JOIN · NO APP · NO LOGIN", tl: "LIBRE MAKISALI · WALANG APP · WALANG LOGIN" },
  "home.hero.free2": { en: "WE COME TO YOUR SHOP", tl: "KAMI ANG PUPUNTA SA INYONG TINDAHAN" },
  "home.stat.shops": { en: "Shops with us", tl: "Mga tindahang kasama" },
  "home.stat.hair": { en: "Hair collected", tl: "Buhok na nakolekta" },
  "home.stat.hairNote": { en: "Weighed, not guessed", tl: "Timbang, hindi hula" },
  "home.stat.passwords": { en: "Passwords to remember", tl: "Password na tatandaan" },
  "home.stat.passwordsNote": { en: "No account needed", tl: "Walang account na kailangan" },

  "home.section.how.label": { en: "How it works", tl: "Paano ito gumagana" },
  "home.section.how.title1": { en: "The drum that turns", tl: "Ang tambol na nagpapaging" },
  "home.section.how.title2": { en: "hair into", tl: "ng buhok sa" },
  "home.section.how.title3": { en: "soil.", tl: "lupa." },
  "home.section.how.lede": {
    en: "One machine, five simple steps. We bring a sack to your shop, collect the hair, and let it rest into compost. Drag the drum to look around — then tap through for the full process.",
    tl: "Isang makina, limang simpleng hakbang. Nagdadala kami ng sako sa inyong tindahan, kinokolekta ang buhok, at pinatatagal ito hanggang maging kompost. Ihila ang tambol para tumingin — tapos pindutin para sa buong proseso.",
  },

  "home.drumSteps.collect.title": { en: "We collect", tl: "Kumokolekta kami" },
  "home.drumSteps.collect.body": {
    en: "A labelled sack at your shop. We come to you.",
    tl: "Isang may tatak na sako sa inyong tindahan. Kami ang pupunta sa inyo.",
  },
  "home.drumSteps.check.title": { en: "We check", tl: "Sinusuri namin" },
  "home.drumSteps.check.body": {
    en: "Hair only is best; a little tissue is still fine.",
    tl: "Mas mainam kung puro buhok; kaunting tisyu ay ayos lang.",
  },
  "home.drumSteps.mix.title": { en: "We mix", tl: "Hinahalo namin" },
  "home.drumSteps.mix.body": {
    en: "Hair + dry leaves, weighed and logged as one batch.",
    tl: "Buhok + tuyong dahon, tinimbang at isinulat bilang isang batch.",
  },
  "home.drumSteps.cure.title": { en: "We cure", tl: "Pinatatagal namin" },
  "home.drumSteps.cure.body": {
    en: "About six weeks of resting, turning and checking.",
    tl: "Mga anim na linggo ng pagpapahinga, paghahalo, at pagsusuri.",
  },
  "home.drumSteps.lab.title": { en: "Lab checks", tl: "Sinusuri ng lab" },
  "home.drumSteps.lab.body": {
    en: "A laboratory approves it before we call it compost.",
    tl: "Sinusuri ng laboratoryo bago namin tawaging kompost.",
  },

  "home.section.where.label": { en: "Where to next", tl: "Saan na tayo?" },
  "home.section.where.title": { en: "Find what you need.", tl: "Hanapin ang kailangan mo." },
  "home.section.where.lede": {
    en: "Everything is one tap away. You do not have to read the whole page.",
    tl: "Lahat ay nasa isang pindot lang. Hindi ninyo kailangang basahin ang buong pahina.",
  },

  "home.navCards.howWork.label": { en: "How does it work?", tl: "Paano ito gumagana?" },
  "home.navCards.howWork.desc": { en: "See the five simple steps.", tl: "Tingnan ang limang simpleng hakbang." },
  "home.navCards.whyPartner.label": { en: "Why become a partner?", tl: "Bakit maging partner?" },
  "home.navCards.whyPartner.desc": { en: "What your shop gets back.", tl: "Kung ano ang babalik sa inyong tindahan." },
  "home.navCards.shopPartners.label": { en: "Shop Partners", tl: "Mga Tindahang Partner" },
  "home.navCards.shopPartners.desc": { en: "See the shops already with us.", tl: "Tingnan ang mga tindahang kasama na namin." },
  "home.navCards.collection.label": { en: "Collection process", tl: "Proseso ng pagkolekta" },
  "home.navCards.collection.desc": { en: "From the chair to the soil.", tl: "Mula sa upuan hanggang sa lupa." },
  "home.navCards.register.label": { en: "Register your shop", tl: "Rehistro ang inyong tindahan" },
  "home.navCards.register.desc": { en: "Ask for a free visit.", tl: "Humiling ng libreng bisita." },

  "home.join.label": { en: "What happens when you join?", tl: "Ano ang mangyayari kapag sumali ka?" },
  "home.join.title": {
    en: "You become one of the shops making soil for your own town.",
    tl: "Nagiging isa ka sa mga tindahang gumagawa ng lupa para sa inyong sariling bayan.",
  },
  "home.join.lede": {
    en: "Joining is simple. There is no long form to fill in, no app and no account. Here is everything that happens, in five easy steps.",
    tl: "Madali lang sumali. Walang mahabang form na dapat punan, walang app, at walang account. Narito ang lahat ng mangyayari, sa limang madaling hakbang.",
  },
  "home.join.step1.title": { en: "We visit your shop", tl: "Bibisita kami sa inyong tindahan" },
  "home.join.step1.body": {
    en: "A collection team member comes at a quiet hour, asks a few questions and leaves you a labelled sack. It takes almost none of your time.",
    tl: "Darating ang miyembro ng collection team sa tahimik na oras, magtatanong ng ilang bagay, at iiwan ang may tatak na sako. Halos wala itong ginugugol na oras ninyo.",
  },
  "home.join.step2.title": { en: "You keep cutting hair", tl: "Tuloy lang ang paggupit ninyo" },
  "home.join.step2.body": {
    en: "Put the hair clippings into the sack. Nothing else in your day changes. No app, no login, no new habit.",
    tl: "Ilagay ang mga gupit na buhok sa sako. Wala nang ibang magbabago sa inyong araw. Walang app, walang login, walang bagong gawain.",
  },
  "home.join.step3.title": { en: "We pick it up", tl: "Kukunin namin ito" },
  "home.join.step3.body": {
    en: "We come back on the days that suit you. You never need to travel anywhere or wait at a counter.",
    tl: "Babalik kami sa araw na bagay sa inyo. Hindi ninyo kailangang pumunta kahit saan o maghintay sa counter.",
  },
  "home.join.step4.title": { en: "We make compost", tl: "Gagawin namin ang kompost" },
  "home.join.step4.body": {
    en: "We weigh the hair, mix it with dry leaves and other plant material, and let it rest. A laboratory checks every batch.",
    tl: "Tinimbang namin ang buhok, hinalo sa tuyong dahon at iba pang halaman, at pinatagal. Sinusuri ng laboratoryo ang bawat batch.",
  },
  "home.join.step5.title": { en: "Your town gets the soil", tl: "Ang inyong bayan ang makakakuha ng lupa" },
  "home.join.step5.body": {
    en: "You get a receipt and the lab result. The compost goes to planting beds in your barangay.",
    tl: "Makakakuha kayo ng resibo at resulta ng lab. Ang kompost ay mapupunta sa mga taniman sa inyong barangay.",
  },
  "home.join.note": {
    en: "Your shop's name is listed in our network as a contributor. You keep cutting hair — we do the rest.",
    tl: "Ang pangalan ng inyong tindahan ay nasa aming network bilang isang kontribyutor. Tuloy lang ang paggupit ninyo — kami na ang bahala sa iba.",
  },

  "home.faq.label": { en: "Four quick answers", tl: "Apat na mabilis na sagot" },
  "home.faq.title": { en: "Before you decide.", tl: "Bago ka magpasya." },
  "home.faq.lede": { en: "Short, plain answers. No technical words.", tl: "Maikli at simpleng sagot. Walang teknikal na salita." },
  "home.faq.q1": { en: "What is Hair2Harvest?", tl: "Ano ang Hair2Harvest?" },
  "home.faq.a1": {
    en: "A free collection service for barbershops in Barangay Novaliches Proper. We pick up the hair clippings you set aside and turn them into compost for planting beds in your own barangay.",
    tl: "Isang libreng serbisyo ng pagkolekta para sa mga barbero sa Barangay Novaliches Proper. Kinokolekta namin ang mga gupit na buhok na inyong itabi at ginagawang kompost para sa mga taniman sa inyong sariling barangay.",
  },
  "home.faq.q2": { en: "What do I need to do?", tl: "Ano ang kailangan kong gawin?" },
  "home.faq.a2": {
    en: "Almost nothing. Put the hair clippings in the sack we give you. We visit, we collect, we do the paperwork. There is no app and no account.",
    tl: "Halos wala. Ilagay ang mga gupit na buhok sa sako na ibinigay namin. Kami ang bibisita, kukolekta, at aayos ng papeles. Walang app at walang account.",
  },
  "home.faq.q3": { en: "What will happen to my hair clippings?", tl: "Ano ang mangyayari sa aking mga gupit na buhok?" },
  "home.faq.a3": {
    en: "We weigh them, mix them with dry leaves and other plant material, and let them rest for about six weeks. A laboratory checks the compost before it is used.",
    tl: "Tinimbang namin ito, hinalo sa tuyong dahon at iba pang halaman, at pinatagal ng mga anim na linggo. Sinusuri ng laboratoryo ang kompost bago ito gamitin.",
  },
  "home.faq.q4": { en: "What do I get from participating?", tl: "Ano ang makukuha ko sa paglahok?" },
  "home.faq.a4": {
    en: "A receipt for every pickup, the lab result, and compost for your barangay's planting beds. Your shop is also named in our network as a contributor.",
    tl: "Resibo sa bawat pagkolekta, ang resulta ng lab, at kompost para sa mga taniman ng inyong barangay. Ang inyong tindahan ay makikilala rin sa aming network bilang isang kontribyutor.",
  },

  "home.network.label": { en: "Shop Partners", tl: "Mga Tindahang Partner" },
  "home.network.title": { en: "Shops already with us.", tl: "Mga tindahang kasama na namin." },
  "home.network.seeAll": { en: "See all shops", tl: "Tingnan lahat ng tindahan" },
  "home.network.lede": {
    en: "These are real barbershops in Barangay Novaliches Proper. We show only the shop name, barangay and partnership status — contact and pickup details stay private.",
    tl: "Ito ay tunay na mga barbero sa Barangay Novaliches Proper. Ipinapakita lang namin ang pangalan ng tindahan, barangay, at katayuan ng partnership — ang contact at detalye ng pagkolekta ay mananatiling pribado.",
  },
  "home.network.header.shop": { en: "Shop", tl: "Tindahan" },
  "home.network.header.barangay": { en: "Barangay", tl: "Barangay" },
  "home.network.header.status": { en: "Status", tl: "Katayuan" },
  "home.network.enrolled": { en: "ENROLLED", tl: "KASALI" },

  "home.cta.label": { en: "Ready when you are", tl: "Handa na kami" },
  "home.cta.title1": { en: "Give us your hair.", tl: "Bigyan ninyo kami ng inyong buhok." },
  "home.cta.title2": { en: "We'll give you", tl: "Bibigyan namin kayo ng" },
  "home.cta.title3": { en: "the receipt.", tl: "resibo." },
  "home.cta.para": {
    en: "A collection team member visits your shop, asks a few questions and leaves a labelled sack. It takes almost none of your time. No password, no dashboard, no new habit.",
    tl: "Ang miyembro ng collection team ay bibisita sa inyong tindahan, magtatanong ng ilang bagay, at iiwan ang may tatak na sako. Halos wala itong ginugugol na oras ninyo. Walang password, walang dashboard, walang bagong gawain.",
  },
  "home.cta.questions": {
    en: "QUESTIONS? CALL OR MESSAGE US — A REAL PERSON ANSWERS.",
    tl: "May TANONG? TUMAWAG O MAG-TEXT SA AMIN — MAY TOTOONG TAONG SASAGOT.",
  },

  /* --------------------------------------------------------------- system */
  "sys.meta.label": { en: "How it works", tl: "Paano ito gumagana" },
  "sys.meta.steps": { en: "Steps", tl: "Mga hakbang" },
  "sys.meta.shops": { en: "Shops with us", tl: "Mga tindahang kasama" },
  "sys.meta.hair": { en: "Hair collected", tl: "Buhok na nakolekta" },
  "sys.meta.cost": { en: "Cost to join", tl: "Halaga para sumali" },
  "sys.hero.title1": { en: "From the chair", tl: "Mula sa upuan" },
  "sys.hero.title2": { en: "to the", tl: "hanggang sa" },
  "sys.hero.title3": { en: "soil.", tl: "lupa." },
  "sys.hero.lede": {
    en: "Five easy steps. We come to your shop, pick up the hair and turn it into compost for your barangay. Nothing here needs an app, an account or any extra work from you.",
    tl: "Limang madaling hakbang. Kami ang pupunta sa inyong tindahan, kukunin ang buhok, at gagawin itong kompost para sa inyong barangay. Walang kailangang app, account, o dagdag na trabaho mula sa inyo.",
  },
  "sys.steps.label": { en: "The five steps", tl: "Ang limang hakbang" },
  "sys.steps.title1": { en: "One sack,", tl: "Isang sako," },
  "sys.steps.title2": { en: "five", tl: "lima" },
  "sys.steps.title3": { en: "stops.", tl: "na hinto." },
  "sys.steps.lede": {
    en: "First, the easy explanation. If you work in research or you are reviewing the project, the small note under each step gives the technical version.",
    tl: "Una, ang simpleng paliwanag. Kung kayo ay nasa research o nire-review ang proyekto, ang maliit na nota sa ilalim ng bawat hakbang ay nagbibigay ng teknikal na bersyon.",
  },
  "sys.step1.name": { en: "We pick up the sack", tl: "Kinokolekta namin ang sako" },
  "sys.step1.simple": {
    en: "We come to your shop, open the sack in front of you and count the sacks. We take a photo and you tap once on our phone to confirm. There is nothing to sign in to.",
    tl: "Kami ang pupunta sa inyong tindahan, bubuksan ang sako sa harap ninyo, at bibilang ang mga sako. Kukuha kami ng larawan at isang pindot lang sa aming phone para kumpirmahin. Walang kailangang sign-in.",
  },
  "sys.step2.name": { en: "We check the hair", tl: "Sinusuri namin ang buhok" },
  "sys.step2.simple": {
    en: "We look at what is in the sack. Hair only is best. A little tissue is fine. If there is plastic or wet waste, we still take it — we simply keep it aside and never mix it into compost.",
    tl: "Titingnan namin ang laman ng sako. Mas mainam kung puro buhok. Kaunting tisyu ay ayos lang. Kung may plastic o basang basura, kinokolekta pa rin namin — inilalayo lang namin ito at hindi ito hinahalo sa kompost.",
  },
  "sys.step3.name": { en: "We mix a batch", tl: "Hinahalo namin ang batch" },
  "sys.step3.simple": {
    en: "After collection, the hair is weighed and combined with other organic materials following the approved composting mixture. Each batch is recorded so the team can monitor its progress.",
    tl: "Pagkatapos ng pagkolekta, tinimbang at hinalo ang buhok sa ibang organic na materyal ayon sa aprubadong kompost. Isinasulat ang bawat batch para mabantayan ng team ang progreso nito.",
  },
  "sys.step4.name": { en: "We let it rest", tl: "Pinatatagal namin ito" },
  "sys.step4.simple": {
    en: "The pile warms up, then slowly cools down. We turn it and check heat and moisture until it is stable. We cannot rush this wait — good compost needs time.",
    tl: "Umiinit ang bunton, pagkatapos ay dahan-dahang lumalamig. Inihahalo namin at sinusuri ang init at halumigmig hanggang ito ay matatag. Hindi namin pwedeng madaliin ito — ang mabuting kompost ay nangangailangan ng oras.",
  },
  "sys.step5.name": { en: "A laboratory checks it", tl: "Sinusuri ito ng laboratoryo" },
  "sys.step5.simple": {
    en: "We send a sample to a laboratory. It checks the nutrients, the acidity and that the compost is safe. Only when the result is good do we call it compost and use it.",
    tl: "Nagsesend kami ng sample sa laboratoryo. Sine-scheck nito ang sustansya, acidity, at kung ligtas ang kompost. Kapag mabuti ang resulta saka lamang namin ito tatawaging kompost at gagamitin.",
  },
  "sys.forResearchers": { en: "For researchers", tl: "Para sa mga researcher" },
  "research.01": {
    en: "Intake: sack count, photo log and acknowledgement recorded against the shop code. No account or login is needed.",
    tl: "Intake: bilang ng sako, photo log, at acknowledgement na itinala sa shop code. Walang account o login na kailangan.",
  },
  "research.02": {
    en: "Grading: Clean / Minor / Mixed, decided at the door. A mixed sack gets a coaching note and is held; the shop is never penalised.",
    tl: "Grading: Malinis / Bahagya / Halo, itinakda sa pintuan. Ang halo na sako ay nakakakuha ng coaching note at inilalayo; hindi kailanman pinapatawan ng penalty ang tindahan.",
  },
  "research.03": {
    en: "Batching: weighed input against a versioned recipe (hair / carbon / greens), given a batch ID and logged as a stock movement.",
    tl: "Batching: timbang na input ayon sa versioned na recipe (buhok / carbon / greens), binigyan ng batch ID at itinala bilang stock movement.",
  },
  "research.04": {
    en: "Curing: 35–45 days. Temperature and moisture are logged on each turning day; a pile that reheats is not mature yet.",
    tl: "Curing: 35–45 araw. Ang temperatura at halumigmig ay itinala sa bawat araw ng paghahalo; ang bunton na umiinit muli ay hindi pa matured.",
  },
  "research.05": {
    en: "Lab: N-P-K, pH, moisture, maturity and pathogens. A batch is approved only after a passing, reviewed report.",
    tl: "Lab: N-P-K, pH, halumigmig, maturity, at pathogen. Ang batch ay ina-aprubahan lang pagkatapos ng pumasa at na-review na ulat.",
  },

  "sys.grading.label": { en: "Checking the hair", tl: "Pagsusuri sa buhok" },
  "sys.grading.title1": { en: "No one gets", tl: "Walang sinumang" },
  "sys.grading.title2": { en: "in", tl: "ay" },
  "sys.grading.title3": { en: "trouble.", tl: "mapapahamak." },
  "sys.grading.lede": {
    en: "We look at every sack at the door. A sack with a little tissue is still collected. We only keep material out of the compost — we never refuse a shop or charge a penalty.",
    tl: "Tiningnan namin ang bawat sako sa pintuan. Ang sako na may kaunting tisyu ay kinokolekta pa rin. Inilalayo lang namin ang materyal mula sa kompost — hindi namin tinatanggihan ang tindahan o sinisingil ng penalty.",
  },
  "sys.grade.clean.name": { en: "Clean", tl: "Malinis" },
  "sys.grade.clean.def": { en: "Hair only. No tissue, no plastic, no packaging.", tl: "Puro buhok lang. Walang tisyu, plastic, o balot." },
  "sys.grade.clean.action": { en: "Goes straight into compost.", tl: "Diretsong mapupunta sa kompost." },
  "sys.grade.minor.name": { en: "A little mixed", tl: "Bahagyang halo" },
  "sys.grade.minor.def": { en: "Mostly hair, with a little tissue or a wrapper.", tl: "Halos puro buhok, may kaunting tisyu o balot." },
  "sys.grade.minor.action": { en: "Still fine — we just add a note.", tl: "Ayos lang — nagdadagdag lang kami ng nota." },
  "sys.grade.notusable.name": { en: "Not usable", tl: "Hindi magamit" },
  "sys.grade.notusable.def": { en: "Plastic sachets, wet waste or a chemical smell.", tl: "Plastic na sachet, basang basura, o amoy kemikal." },
  "sys.grade.notusable.action": { en: "We still collect it, but keep it out of compost.", tl: "Kinokolekta pa rin namin, pero inilalayo sa kompost." },

  "sys.privacy.label": { en: "Your details", tl: "Ang inyong detalye" },
  "sys.privacy.title1": { en: "Some things", tl: "May mga bagay na" },
  "sys.privacy.title2": { en: "stay", tl: "mananatiling" },
  "sys.privacy.title3": { en: "private.", tl: "pribado." },
  "sys.privacy.lede": {
    en: "We agree the pickup days and time with each shop when we visit. Those details, the contact person and how we reach the sack are for our collection team only. This website never shows them.",
    tl: "Ina-agree namin ang araw at oras ng pagkolekta sa bawat tindahan kapag bibisita kami. Ang mga detalyeng iyon, ang contact person, at kung paano namin maabot ang sako ay para lang sa aming collection team. Hindi ipinapakita ng website na ito.",
  },
  "sys.privacy.note": {
    en: "The public shop list shows just three things: the shop name, its barangay and its partnership status. Nothing that could tell an outsider where hair is kept.",
    tl: "Ang pampublikong listahan ng tindahan ay ipinapakita lang ang tatlong bagay: pangalan ng tindahan, barangay nito, at katayuan ng partnership. Walang makakapagsabi sa labas kung saan itinatago ang buhok.",
  },
  "sys.batch.label": { en: "Every batch", tl: "Bawat batch" },
  "sys.batch.title1": { en: "Why we write", tl: "Kung bakit isinusulat" },
  "sys.batch.title2": { en: "it", tl: "namin" },
  "sys.batch.title3": { en: "down.", tl: "ito." },
  "sys.batch.lede": {
    en: "We give every batch a number and write down what went into it and what came out. That way, if a laboratory result is ever questioned, we can trace it back to the sacks it came from.",
    tl: "Binibigyan namin ng numero ang bawat batch at isinusulat kung ano ang pumasok at lumabas. Sa gayon, kung pagdudahan ang resulta ng laboratoryo, kayang balikan kung saang sako ito nanggaling.",
  },
  "sys.batch.note": {
    en: "A batch is a chain of custody: weighed input from identified shops, a versioned recipe, daily temperature logs and a signed laboratory report.",
    tl: "Ang batch ay isang chain of custody: timbang na input mula sa kilalang tindahan, recipe na may version, daily na log ng temperatura, at pirmahang ulat ng laboratoryo.",
  },
  "sys.batch.labChecked": { en: "Lab checked", tl: "Sinusuri ng lab" },
  "sys.batch.aboutSixWeeks": { en: "About six weeks", tl: "Mga anim na linggo" },

  "sys.machine.label": { en: "The machine", tl: "Ang makina" },
  "sys.machine.title1": { en: "The drum that", tl: "Ang tambol na" },
  "sys.machine.title2": { en: "turns the", tl: "nagpapaging" },
  "sys.machine.title3": { en: "mix.", tl: "halo." },
  "sys.machine.lede": {
    en: "This is the only machine we use. Drag to turn it around, or tap a part to see its name. It mixes the hair with plant material while the compost rests.",
    tl: "Ito lang ang makinang ginagamit namin. Ihila para paikutin, o pindutin ang bahagi para makita ang pangalan nito. Hinalo nito ang buhok sa halaman habang pinatatagal ang kompost.",
  },
  "sys.machine.note": {
    en: "MCH-01 rotary drum, 8 rpm belt drive. Emergency stop, lid interlock and motor shutoff are wired locally; the web panel can only request start or stop on an approved cycle.",
    tl: "MCH-01 rotary drum, 8 rpm belt drive. Ang emergency stop, lid interlock, at motor shutoff ay naka-wired sa lugar; ang web panel ay pwedeng humiling lang ng start o stop sa aprubadong cycle.",
  },
  "sys.cta.label": { en: "Join us", tl: "Sumali sa amin" },
  "sys.cta.title1": { en: "Want your shop", tl: "Gusto ninyong ang inyong tindahan ay" },
  "sys.cta.title2": { en: "on the", tl: "ay nasa" },
  "sys.cta.title3": { en: "list?", tl: "listahan?" },
  "sys.cta.lede": {
    en: "It is free, it takes almost none of your time, and we do the paperwork. You keep cutting hair; we do the rest.",
    tl: "Libre ito, halos wala itong ginugugol na oras ninyo, at kami na ang bahala sa papeles. Tuloy lang ang paggupit ninyo; kami na ang bahala sa iba.",
  },

  /* --------------------------------------------------------------- impact */
  "impact.meta.label": { en: "Our Collection Results", tl: "Mga Resulta ng Pagkolekta" },
  "impact.meta.weighed": { en: "Weighed pickups", tl: "Pagkolektang tinimbang" },
  "impact.meta.net": { en: "Net collected", tl: "Kabuuang nakolekta" },
  "impact.meta.lab": { en: "Lab reports", tl: "Ulat ng laboratoryo" },
  "impact.meta.batches": { en: "Batches cured", tl: "Batch na natapos" },
  "impact.hero.title1": { en: "Our collection", tl: "Ang ating pagkolekta" },
  "impact.hero.title2": { en: "results,", tl: "na resulta," },
  "impact.hero.title3": { en: "in numbers.", tl: "sa mga numero." },
  "impact.hero.lede": {
    en: "Here is what we have collected so far — weighed on a scale and checked by a laboratory. No guesses, just real numbers from our barangay.",
    tl: "Ito ang aming nakolekta hanggang ngayon — tinimbang sa timbangan at sine-scheck ng laboratoryo. Walang hula, mga tunay na numero mula sa ating barangay.",
  },
  "impact.collection.label": { en: "Collection", tl: "Pagkolekta" },
  "impact.collection.title1": { en: "Ten weeks", tl: "Sampung linggo" },
  "impact.collection.title2": { en: "on the", tl: "sa" },
  "impact.collection.title3": { en: "scale.", tl: "timbangan." },
  "impact.collection.lede": {
    en: "Net kilograms, gross minus a standard 0.18 kg sack tare. Week 36 is the first full week with four enrolled shops; week 45 is the last complete week before this page was written.",
    tl: "Net na kilograms, gross minus ang standard 0.18 kg sack tare. Ang Week 36 ay ang unang buong linggo na may apat na enrolled na tindahan; ang Week 45 ay ang huling kumpletong linggo bago isulat ang pahinang ito.",
  },
  "impact.collection.firstWeek": { en: "First week", tl: "Unang linggo" },
  "impact.collection.lastWeek": { en: "Last week", tl: "Huling linggo" },
  "impact.batches.b2512in": { en: "Batch 2512 in", tl: "Batch 2512 pasok" },
  "impact.batches.b2512out": { en: "Batch 2512 out", tl: "Batch 2512 labas" },
  "impact.batches.reduction": { en: "Reduction", tl: "Pagbawas" },
  "impact.batches.b2601out": { en: "Batch 2601 out", tl: "Batch 2601 labas" },
  "impact.collection.growth": { en: "Growth", tl: "Paglago" },
  "impact.collection.avg": { en: "Average per pickup", tl: "Average bawat pagkolekta" },
  "impact.collection.viewLab": { en: "View Lab Results", tl: "Tingnan ang Resulta ng Lab" },
  "impact.collection.graphNote": {
    en: "A week-by-week chart. The detailed data lives in the staff workspace.",
    tl: "Isang chart na bawat linggo. Ang detalyadong datos ay nasa staff workspace.",
  },
  "impact.lab.label": { en: "Laboratory", tl: "Laboratoryo" },
  "impact.lab.title1": { en: "What the lab", tl: "Kung ano ang" },
  "impact.lab.title2": { en: "returned.", tl: "ibalik ng lab." },
  "impact.lab.note": {
    en: "External laboratory, dry basis unless noted. Re-tests are stored as new versions — nothing is overwritten.",
    tl: "External na laboratoryo, dry basis maliban kung may nota. Ang mga re-test ay naka-store bilang bagong version — walang ino-overwrite.",
  },
  "impact.lab.header.report": { en: "Report", tl: "Ulat" },
  "impact.lab.header.batch": { en: "Batch", tl: "Batch" },
  "impact.lab.header.n": { en: "N %", tl: "N %" },
  "impact.lab.header.p": { en: "P %", tl: "P %" },
  "impact.lab.header.k": { en: "K %", tl: "K %" },
  "impact.lab.header.ph": { en: "pH", tl: "pH" },
  "impact.lab.header.moisture": { en: "Moisture", tl: "Halumigmig" },
  "impact.lab.header.maturity": { en: "Maturity", tl: "Katandaan" },
  "impact.lab.header.pathogens": { en: "Pathogens", tl: "Pathogen" },
  "impact.lab.header.verdict": { en: "Verdict", tl: "Hatol" },
  "impact.lab.source": {
    en: "SOURCE: CENTRAL LUZON SOIL LABORATORY · BUREAU OF SOILS (RE-TEST) · METHOD: KJELDAHL, BRAY-2, AMMONIUM ACETATE",
    tl: "PINAGMULAN: CENTRAL LUZON SOIL LABORATORY · BUREAU OF SOILS (RE-TEST) · PARAAN: KJELDAHL, BRAY-2, AMMONIUM ACETATE",
  },
  "impact.batches.label": { en: "Batches", tl: "Mga batch" },
  "impact.batches.title1": { en: "Mass in,", tl: "Masa pumasok," },
  "impact.batches.title2": { en: "mass", tl: "masa" },
  "impact.batches.title3": { en: "out.", tl: "labas." },
  "impact.batches.lede": {
    en: "Composting is a mass-reduction process. The ratio between input hair and cured output is the honest efficiency number — not a percentage of waste diverted.",
    tl: "Ang pagkobposto ay proseso ng pagbawas ng masa. Ang ratio sa pagitan ng input na buhok at cured na output ay ang tapat na efficiency number — hindi percentage ng basurang nailayo.",
  },
  "impact.batches.in": { en: "in", tl: "pasok" },
  "impact.batches.now": { en: "now", tl: "ngayon" },
  "impact.batches.mass": { en: "MASS", tl: "MASA" },
  "impact.trials.label": { en: "Planting trials", tl: "Mga pagsubok sa paghatanim" },
  "impact.trials.title1": { en: "Does it", tl: "Tumutubo" },
  "impact.trials.title2": { en: "actually", tl: "ba" },
  "impact.trials.title3": { en: "grow?", tl: "ito nang totoo?" },
  "impact.trials.lede": {
    en: "Four supervised trials, each with a hair-compost treatment and a paired control. Height is measured weekly; nothing here is a yield claim yet.",
    tl: "Apat na supervised na trial, bawat isa ay may hair-compost treatment at paired control. Ang height ay sinusukat lingguhan; wala pang claim na yield dito.",
  },
  "impact.trials.note": {
    en: "PRELIMINARY · NOT PEER REVIEWED · n = 1 PER TREATMENT",
    tl: "PRELIMINARY · HINDI PEER REVIEWED · n = 1 BAWAT TREATMENT",
  },
  "impact.trials.header.crop": { en: "Crop", tl: "Pananim" },
  "impact.trials.header.treatment": { en: "Treatment", tl: "Treatment" },
  "impact.trials.header.control": { en: "Control", tl: "Control" },
  "impact.trials.header.dh": { en: "Δ height", tl: "Δ height" },
  "impact.trials.footer1": { en: "4 ACTIVE TRIALS · 2 COMPLETED", tl: "4 NA TRIAL · 2 TAPOS NA" },
  "impact.trials.footer2": { en: "68% COMPLETE", tl: "68% TAPOS" },
  "impact.method.label": { en: "Method", tl: "Paraan" },
  "impact.method.title1": { en: "How these", tl: "Kung paano" },
  "impact.method.title2": { en: "numbers were", tl: "gawa" },
  "impact.method.title3": { en: "made.", tl: "ang mga numero." },
  "impact.method.weight": { en: "Weight", tl: "Timbang" },
  "impact.method.weightText": {
    en: "Every pickup is weighed on a calibrated hanging scale. We subtract the weight of the empty sack (0.18 kg), so the number we record is the hair alone.",
    tl: "Ang bawat pagkolekta ay tinimbang sa calibrated na hanging scale. Binabawas namin ang bigat ng walang laman na sako (0.18 kg), kaya ang itinatalang numero ay ang buhok lang.",
  },
  "impact.method.grade": { en: "Grade", tl: "Klase" },
  "impact.method.gradeText": {
    en: "Assigned at the door by the collector against a three-level rubric. Grades are not re-scored later, so the record reflects what was actually seen.",
    tl: "Itinalaga sa pintuan ng collector ayon sa three-level na rubric. Hindi muling sinusuri ang klase, kaya ang record ay sumasalamin sa tunay na nakita.",
  },
  "impact.method.curing": { en: "Curing", tl: "Pagpapatagal" },
  "impact.method.curingText": {
    en: "Temperature and moisture logged on turning days. A batch is mature when it stops reheating and moisture stabilises below 30%.",
    tl: "Ang temperatura at halumigmig ay itinala sa mga araw ng paghahalo. Ang batch ay matured kapag tumigil ang pag-init at tumatag ang halumigmig sa ibaba ng 30%.",
  },
  "impact.method.limits": { en: "Limits", tl: "Limitasyon" },
  "impact.method.limitsText": {
    en: "One pilot barangay, four enrolled shops, ten weeks. The sample is small and the trials are unreplicated. This page reports what happened, not what will happen.",
    tl: "Isang pilot na barangay, apat na enrolled na tindahan, sampung linggo. Maliit ang sample at hindi napaulit-ulit ang trials. Ipinapakita ng pahinang ito ang nangyari, hindi ang mangyayari.",
  },
  "impact.method.spec": { en: "Read the specification", tl: "Basahin ang specification" },
  "impact.method.seeNetwork": { en: "See the shop network", tl: "Tingnan ang network ng tindahan" },

  /* ---------------------------------------------------------------- about */
  "about.meta.label": { en: "About us", tl: "Tungkol sa amin" },
  "about.meta.partner": { en: "Partner", tl: "Partner" },
  "about.meta.team": { en: "Team", tl: "Koponan" },
  "about.meta.started": { en: "Started", tl: "Nagsimula" },
  "about.meta.cost": { en: "Cost to join", tl: "Halaga para sumali" },
  "about.hero.title1": { en: "We turn hair", tl: "Ginagawa namin ang buhok" },
  "about.hero.title2": { en: "into", tl: "bilang" },
  "about.hero.title3": { en: "soil.", tl: "lupa." },
  "about.hero.lede": {
    en: "Hair2Harvest is a student capstone project with Barangay Novaliches Proper. We pick up hair clippings from barbershops and turn them into compost for planting beds nearby. We come to the shop, and we share the results with you.",
    tl: "Ang Hair2Harvest ay isang student capstone project kasama ang Barangay Novaliches Proper. Kinokolekta namin ang mga gupit na buhok mula sa mga barbero at ginagawang kompost para sa mga taniman malapit dito. Kami ang pupunta sa tindahan, at ibinabahagi namin ang resulta sa inyo.",
  },
  "about.story.label": { en: "Our story", tl: "Ang aming kwento" },
  "about.story.title1": { en: "We bring", tl: "Kami ang" },
  "about.story.title2": { en: "the", tl: "nagdadala ng" },
  "about.story.title3": { en: "sack to you.", tl: "sako sa inyo." },
  "about.story.p1": {
    en: "A barbershop sweeps out a few kilos of hair every week. Most of it goes into the bin with the tissue and plastic, because there is no separate container for it — and no time to take it anywhere.",
    tl: "Ang isang barbero ay nagwawalis ng ilang kilo ng buhok bawat linggo. Karamihan ay napupunta sa basurahan kasama ang tisyu at plastic, dahil walang hiwalay na lalagyan para dito — at walang oras para dalhin ito kahit saan.",
  },
  "about.story.p2": {
    en: "So we start at the shop. We bring a labelled sack, collect the hair on a day that suits the owner, and check what is in the sack at the door. Clean hair is weighed and mixed with dry leaves and other plant material. After about six weeks, a laboratory checks the compost before we use it.",
    tl: "Kaya nagsisimula kami sa tindahan. Nagdadala kami ng may tatak na sako, kinokolekta ang buhok sa araw na bagay sa may-ari, at sine-scheck kung ano ang laman ng sako sa pintuan. Ang malinis na buhok ay tinimbang at hinalo sa tuyong dahon at iba pang halaman. Pagkaraan ng mga anim na linggo, sine-scheck ng laboratoryo ang kompost bago namin gamitin.",
  },
  "about.story.p3": {
    en: "The shop gets a receipt and the lab result. The compost goes to planting beds in the same barangay. No app, no login and no extra work for the people behind the chair.",
    tl: "Ang tindahan ay nakakakuha ng resibo at resulta ng lab. Ang kompost ay mapupunta sa mga taniman sa parehong barangay. Walang app, walang login, at walang dagdag na trabaho sa mga nasa likod ng upuan.",
  },
  "about.story.p4": {
    en: "Hair2Harvest is a capstone project built together with Barangay Novaliches Proper, who back the programme and help us reach the shops in the community. We are glad to return compost the barangay can use on its own planting beds.",
    tl: "Ang Hair2Harvest ay isang capstone project na ginawa kasama ang Barangay Novaliches Proper, na sumusuporta sa programa at tumutulong na maabot namin ang mga tindahan sa komunidad. Ikinagagalak namin na makabalik ang kompost na magagamit ng barangay sa sarili nitong mga taniman.",
  },
  "about.team.label": { en: "Our team", tl: "Ang aming koponan" },
  "about.team.title1": { en: "The people", tl: "Ang mga taong" },
  "about.team.title2": { en: "behind it.", tl: "nasa likod nito." },
  "about.team.lede": {
    en: "Thirteen students, grouped by what each one looks after.",
    tl: "Labintatlong estudyante, na hinati ayon sa bawat ginagawa nila.",
  },
  "about.team.projectManagement": { en: "Project Management", tl: "Pamamahala ng Proyekto" },
  "about.team.developers": { en: "Developers", tl: "Mga Developer" },
  "about.team.documentation": { en: "Documentation", tl: "Dokumentasyon" },
  "about.team.qualityAssurance": { en: "Quality Assurance", tl: "Quality Assurance" },
  "about.team.pm": { en: "Project manager", tl: "Project manager" },
  "about.team.apm": { en: "Assistant project manager", tl: "Assistant project manager" },
  "about.team.secretary": { en: "Secretary", tl: "Secretary" },
  "about.team.leadDev": { en: "Lead developer", tl: "Lead developer" },
  "about.team.developer": { en: "Developer", tl: "Developer" },
  "about.team.docLead": { en: "Documentation lead", tl: "Documentation lead" },
  "about.team.documentationRole": { en: "Documentation", tl: "Dokumentasyon" },
  "about.team.qa": { en: "Quality assurance", tl: "Quality assurance" },
  "about.values.label": { en: "What we believe", tl: "Ang aming paniniwala" },
  "about.values.title1": { en: "Four simple", tl: "Apat na simpleng" },
  "about.values.title2": { en: "rules.", tl: "tuntunin." },
  "about.values.nothingWasted.k": { en: "Nothing is wasted", tl: "Walang nasasayang" },
  "about.values.nothingWasted.v": {
    en: "Hair that cannot be used is kept aside, never quietly thrown away.",
    tl: "Ang buhok na hindi magamit ay inilalayo, hindi tahimik na itinatapon.",
  },
  "about.values.checkWork.k": { en: "We check our work", tl: "Sine-scheck namin ang aming trabaho" },
  "about.values.checkWork.v": {
    en: "Every batch is checked by a laboratory before we call it compost.",
    tl: "Ang bawat batch ay sine-scheck ng laboratoryo bago namin tawaging kompost.",
  },
  "about.values.shopFirst.k": { en: "The shop comes first", tl: "Ang tindahan ang nauuna" },
  "about.values.shopFirst.v": {
    en: "No app, no login, no new habit. We go to the shop on its own schedule.",
    tl: "Walang app, walang login, walang bagong gawain. Kami ang pupunta sa tindahan ayon sa oras nito.",
  },
  "about.values.local.k": { en: "Local by design", tl: "Lokal sa disenyo" },
  "about.values.local.v": {
    en: "The hair is collected here, composted here, and the soil stays here.",
    tl: "Ang buhok ay kinokolekta dito, kinokompost dito, at ang lupa ay mananatili dito.",
  },
  "about.cta.label": { en: "Work with us", tl: "Makipagtulungan sa amin" },
  "about.cta.title1": { en: "Know a shop", tl: "Kilala ninyo ang isang tindahan" },
  "about.cta.title2": { en: "that could", tl: "na pwedeng" },
  "about.cta.title3": { en: "join?", tl: "sumali?" },
  "about.cta.para": {
    en: "Joining is free and takes almost none of your time. We do the paperwork, you keep cutting hair, and we tell you what happened to it.",
    tl: "Libre ang sumali at halos wala itong ginugugol na oras ninyo. Kami ang bahala sa papeles, tuloy lang ang paggupit ninyo, at sasabihin namin kung ano ang nangyari rito.",
  },

  /* -------------------------------------------------------------- network */
  "network.meta.label": { en: "Shop Partners", tl: "Mga Tindahang Partner" },
  "network.meta.joined": { en: "Shops joined", tl: "Mga tindahang sumali" },
  "network.meta.comingSoon": { en: "Coming soon", tl: "Malapit na" },
  "network.meta.hair": { en: "Hair collected", tl: "Buhok na nakolekta" },
  "network.meta.cost": { en: "Cost to join", tl: "Halaga para sumali" },
  "network.hero.title1": { en: "Shops already", tl: "Mga tindahang" },
  "network.hero.title2": { en: "with us.", tl: "kasama na namin." },
  "network.hero.lede": {
    en: "Real barbershops in Barangay Novaliches Proper taking part in Hair2Harvest. To protect every owner, we show only the shop name, barangay and partnership status here.",
    tl: "Tunay na mga barbero sa Barangay Novaliches Proper na kasali sa Hair2Harvest. Para protektahan ang bawat may-ari, ipinapakita lang namin ang pangalan ng tindahan, barangay, at katayuan ng partnership dito.",
  },
  "network.directory.label": { en: "Directory", tl: "Talaan" },
  "network.directory.title": { en: "The shop list.", tl: "Ang listahan ng tindahan." },
  "network.directory.note": {
    en: "You can filter by status or search a shop by name or barangay. The words under the list explain what each status means.",
    tl: "Pwede kayong mag-filter ayon sa katayuan o maghanap ng tindahan ayon sa pangalan o barangay. Ang mga salita sa ilalim ng listahan ay nagpapaliwanag kung ano ang ibig sabihin ng bawat katayuan.",
  },
  "network.directory.header.shop": { en: "Shop", tl: "Tindahan" },
  "network.directory.header.barangay": { en: "Barangay", tl: "Barangay" },
  "network.directory.header.status": { en: "Status", tl: "Katayuan" },
  "network.directory.allShops": { en: "All shops", tl: "Lahat ng tindahan" },
  "network.directory.allShopsDesc": { en: "Every shop on the list, in any status.", tl: "Lahat ng tindahan sa listahan, anumang katayuan." },
  "network.directory.enrolled": { en: "Enrolled", tl: "Kasali" },
  "network.directory.enrolledDesc": { en: "Actively collecting hair with us.", tl: "Aktibong kumokolekta ng buhok kasama namin." },
  "network.directory.candidate": { en: "Candidate", tl: "Kandidato" },
  "network.directory.candidateDesc": { en: "Agreed to join; visit or first pickup still pending.", tl: "Pumayag na sumali; visit o unang pagkolekta ay nakabinbin pa." },
  "network.directory.paused": { en: "Paused", tl: "Hinto" },
  "network.directory.pausedDesc": { en: "Temporarily not collecting — will start again.", tl: "Pansamantalang hindi kumokolekta — muli itong magsisimula." },
  "network.directory.withdrawn": { en: "Withdrawn", tl: "Umalis" },
  "network.directory.withdrawnDesc": { en: "Decided not to take part for now.", tl: "Decideng hindi muna lalahok." },
  "network.directory.search": { en: "Search shop, code or barangay", tl: "Hanapin ang tindahan, code, o barangay" },
  "network.directory.noMatch": { en: "No shops match that filter.", tl: "Walang tindahang tumugma sa filter na iyon." },
  "network.directory.records": { en: "RECORDS", tl: "REKORD" },
  "network.directory.inService": { en: "IN SERVICE AREA", tl: "NASA SERVICE AREA" },
  "network.directory.publicNote": {
    en: "PUBLIC DIRECTORY SHOWS SHOP NAME, BARANGAY & PARTNERSHIP STATUS ONLY. CONTACT AND ACCESS DETAILS ARE RESTRICTED TO THE HAIR2HARVEST COLLECTION TEAM.",
    tl: "ANG PAMPUBLIKONG TALAAN AY IPINAPAKITA LANG ANG PANGALAN NG TINDAHAN, BARANGAY, AT KATATUAN NG PARTNERSHIP. ANG DETALYE NG CONTACT AT ACCESS AY LIMITADO SA HAIR2HARVEST COLLECTION TEAM.",
  },
  "network.directory.statusMeans": { en: "What the status means", tl: "Kung ano ang ibig sabihin ng katayuan" },
  "network.directory.enrolledDef": { en: "Active partner. We pick up hair regularly.", tl: "Aktibong partner. Regular kaming kumokolekta ng buhok." },
  "network.directory.candidateDef": { en: "Interested or visited. Pickups have not started yet.", tl: "Interesado o nabisita na. Hindi pa nagsisimula ang pagkolekta." },
  "network.directory.pausedDef": { en: "Taking a break, but still part of the network.", tl: "Naghihintay sandali, pero parte pa rin ng network." },
  "network.directory.withdrawnDef": { en: "No longer taking part.", tl: "Hindi na lalahok." },

  "network.pickups.label": { en: "Pickups", tl: "Pagkolekta" },
  "network.pickups.title1": { en: "We fit your", tl: "Ina-angkop namin sa" },
  "network.pickups.title2": { en: "hours.", tl: "inyong oras." },
  "network.pickups.lede": {
    en: "Every shop is different, so we agree the pickup days and time together during the visit. Some shops want us twice a week, others once. We always come to you.",
    tl: "Ang bawat tindahan ay iba-iba, kaya ina-agree namin ang araw at oras ng pagkolekta nang magkasama sa visit. Ang ibang tindahan ay gusto kami dalawang beses sa isang linggo, ang iba ay isa. Kami ay laging pupunta sa inyo.",
  },
  "network.pickups.private": {
    en: "These details are private. Only the Hair2Harvest collection team can see them, so no one else knows when hair is collected or who to ask for.",
    tl: "Ang mga detalyeng ito ay pribado. Tanging ang Hair2Harvest collection team lamang ang makakakita nito, kaya walang ibang nakakaalam kung kailan kinokolekta ang buhok o kung kanino tatanong.",
  },
  "network.pickups.whatPrivate": { en: "What stays private", tl: "Kung ano ang mananatiling pribado" },
  "network.pickups.contactPerson": { en: "Contact person", tl: "Taong kontak" },
  "network.pickups.contactPersonDef": { en: "Who we call or message at the shop.", tl: "Kung sino ang tatawagan o tete-text namin sa tindahan." },
  "network.pickups.mobile": { en: "Mobile number", tl: "Numero ng mobile" },
  "network.pickups.mobileDef": { en: "Used only for pickup messages.", tl: "Ginagamit lang para sa mga mensahe ng pagkolekta." },
  "network.pickups.days": { en: "Pickup days and time", tl: "Araw at oras ng pagkolekta" },
  "network.pickups.daysDef": { en: "Agreed with the shop, never published.", tl: "Ina-agree sa tindahan, hindi inilalathala." },
  "network.pickups.access": { en: "Access notes", tl: "Nota sa pagpasok" },
  "network.pickups.accessDef": { en: "How we reach the sack on a visit.", tl: "Kung paano namin maabot ang sako sa isang visit." },
  "network.pickups.trips": { en: "Trips to the barangay hall", tl: "Biyahe sa hall ng barangay" },
  "network.pickups.tripsNote": { en: "We come to you", tl: "Kami ang pupunta sa inyo" },
  "network.pickups.accounts": { en: "Accounts for shops", tl: "Account para sa mga tindahan" },
  "network.pickups.accountsNote": { en: "A code on a sack is enough", tl: "Sapat na ang code sa sako" },
  "network.pickups.cost": { en: "Cost to join", tl: "Halaga para sumali" },
  "network.pickups.costNote": { en: "No fees, no equipment to buy", tl: "Walang fee, walang kagamitang bibilhin" },

  "network.joining.label": { en: "Joining", tl: "Paghahanda" },
  "network.joining.title1": { en: "Four easy", tl: "Apat na madaling" },
  "network.joining.title2": { en: "steps.", tl: "hakbang." },
  "network.joining.lede": {
    en: "No counter to visit, no paperwork to fill in by yourself. A collection team member comes to your shop and does it with you.",
    tl: "Walang counter na pupuntahan, walang papeles na pipunan ninyo mag-isa. Ang miyembro ng collection team ang pupunta sa inyong tindahan at gagawin ito kasama ninyo.",
  },
  "network.joining.visit": { en: "Visit", tl: "Bisita" },
  "network.joining.visitDef": { en: "We come at a quiet hour that suits you.", tl: "Kami ang pupunta sa tahimik na oras na bagay sa inyo." },
  "network.joining.form": { en: "Short form", tl: "Maikling form" },
  "network.joining.formDef": { en: "We ask a few simple questions and write them down for you.", tl: "Magtatanong kami ng ilang simpleng bagay at isusulat para sa inyo." },
  "network.joining.sack": { en: "Sack", tl: "Sako" },
  "network.joining.sackDef": { en: "We leave a labelled sack for your hair clippings.", tl: "Iiwan namin ang may tatak na sako para sa inyong mga gupit na buhok." },
  "network.joining.collect": { en: "Collect", tl: "Kolekta" },
  "network.joining.collectDef": { en: "We come back when we agreed. That is all.", tl: "Babalik kami sa oras na in-agree natin. Iyon lang." },

  /* --------------------------------------------------------------- partner */
  "partner.meta.label": { en: "Join us", tl: "Sumali sa amin" },
  "partner.meta.time": { en: "Your time", tl: "Inyong oras" },
  "partner.meta.almostNone": { en: "Almost none", tl: "Halos wala" },
  "partner.meta.cost": { en: "Cost", tl: "Halaga" },
  "partner.meta.account": { en: "Account needed", tl: "Kailangan ng account" },
  "partner.meta.firstPickup": { en: "First pickup", tl: "Unang pagkolekta" },
  "partner.meta.sameWeek": { en: "Same week", tl: "Sabay sa linggo" },
  "partner.hero.title1": { en: "We do the work.", tl: "Kami ang gumagawa ng trabaho." },
  "partner.hero.title2": { en: "You keep", tl: "Tuloy lang" },
  "partner.hero.title3": { en: "cutting hair.", tl: "ang paggupit ninyo." },
  "partner.hero.lede": {
    en: "A collection team member visits your shop and fills in a short form for you. We leave a labelled sack and agree on a good time to collect. It takes almost none of your time.",
    tl: "Ang miyembro ng collection team ay bibisita sa inyong tindahan at pipunan ang maikling form para sa inyo. Iiwan namin ang may tatak na sako at aagree sa magandang oras para sa pagkolekta. Halos wala itong ginugugol na oras ninyo.",
  },
  "partner.join.label": { en: "Joining", tl: "Paghahanda" },
  "partner.join.title": { en: "What we ask.", tl: "Kung ano ang hinihingi namin." },
  "partner.join.lede": {
    en: "Only a few simple details. We fill in the form ourselves when we visit.",
    tl: "Iilang simpleng detalye lang. Kami ang pipuno ng form kapag bibisita kami.",
  },
  "partner.join.para": {
    en: "Your shop name, a contact person, a mobile number and your barangay. That is all we need to start. We agree the pickup days together during the visit — you do not need to decide anything now.",
    tl: "Ang pangalan ng inyong tindahan, isang contact person, numero ng mobile, at inyong barangay. Iyon lang ang kailangan namin para magsimula. Ina-agree namin ang araw ng pagkolekta nang magkasama sa visit — hindi ninyo kailangang magdesisyon ngayon.",
  },
  "partner.join.passwords": { en: "Passwords to remember", tl: "Password na tatandaan" },
  "partner.join.sack": { en: "Sack, labelled for your shop", tl: "Sako, may tatak para sa inyong tindahan" },
  "partner.join.whatYouGet": { en: "What you get", tl: "Kung ano ang makukuha ninyo" },
  "partner.join.get1": { en: "A receipt every time we collect your hair.", tl: "Resibo sa bawat pagkolekta namin ng inyong buhok." },
  "partner.join.get2": { en: "A short message when your hair's compost has been checked.", tl: "Maikling mensahe kapag na-check na ang kompost ng inyong buhok." },
  "partner.join.get3": { en: "Compost for planting beds in your barangay.", tl: "Kompost para sa mga taniman sa inyong barangay." },

  "partner.contact.label": { en: "Contact", tl: "Makipag-ugnayan" },
  "partner.contact.title1": { en: "Talk to a", tl: "Makipag-usap sa" },
  "partner.contact.title2": { en: "person.", tl: "tao." },
  "partner.contact.lede": {
    en: "No ticket system, no support portal. Call or message us and a real person answers.",
    tl: "Walang ticket system, walang support portal. Tawagan o text ninyo kami at may totoong taong sasagot.",
  },
  "partner.contact.mobile": { en: "Mobile", tl: "Mobile" },
  "partner.contact.email": { en: "Email", tl: "Email" },
  "partner.contact.weAreIn": { en: "We are in", tl: "Nasa" },
  "partner.contact.pickup": { en: "Pickup", tl: "Pagkolekta" },
  "partner.contact.weAgree": { en: "We agree it together", tl: "Ina-agree namin ito" },
  "partner.contact.pickupNote": { en: "A time that suits your shop", tl: "Oras na bagay sa inyong tindahan" },

  /* ----------------------------------------------------------- partner form */
  "form.shopName": { en: "Shop name", tl: "Pangalan ng tindahan" },
  "form.shopNamePh": { en: "e.g. Barako Brothers Grooming", tl: "hal. Barako Brothers Grooming" },
  "form.contactPerson": { en: "Contact person", tl: "Taong kontak" },
  "form.contactPersonPh": { en: "Who should we ask for?", tl: "Kanino kami dapat magtanong?" },
  "form.mobile": { en: "Mobile number", tl: "Numero ng mobile" },
  "form.mobilePh": { en: "0917 402 1188", tl: "0917 402 1188" },
  "form.mobileHint": { en: "Numbers only, up to 11 digits.", tl: "Mga numero lang, hanggang 11 digit." },
  "form.mobileInvalid": { en: "Please enter a mobile number", tl: "Pakilagay ang numero ng mobile" },
  "form.countryCode": { en: "Country", tl: "Bansa" },
  "form.barangay": { en: "Barangay", tl: "Barangay" },
  "form.barangayOpt1": { en: "Nova Proper", tl: "Nova Proper" },
  "form.street": { en: "Street / building", tl: "Kalsada / gusali" },
  "form.streetPh": { en: "e.g. 123 Magsaysay St.", tl: "hal. 123 Magsaysay St." },
  "form.unit": { en: "Unit / floor (optional)", tl: "Unit / palapag (opsyonal)" },
  "form.unitPh": { en: "e.g. Unit 4B", tl: "hal. Unit 4B" },
  "form.pickupRules": { en: "Pickup rules", tl: "Tuntunin sa pagkuha" },
  "form.frequency": { en: "Frequency", tl: "Dalas" },
  "form.frequencyOpt1": { en: "Weekly", tl: "Lingguhan" },
  "form.frequencyOpt2": { en: "Twice a Week", tl: "Dalawang beses sa isang linggo" },
  "form.frequencyOpt3": { en: "Nightly", tl: "Gabi-gabi" },
  "form.startTime": { en: "Start time", tl: "Oras ng simula" },
  "form.endTime": { en: "End time", tl: "Oras ng wakas" },
  "form.optional": { en: "(Optional)", tl: "(Opsyonal)" },
  "form.intro": {
    en: "Fill in these few details and we will get in touch. A collection team member does the rest when we visit.",
    tl: "Punin ang ilang detalyeng ito at kami ay makikipag-ugnayan. Ang miyembro ng collection team ang bahala sa iba kapag bibisita kami.",
  },
  "form.consent": {
    en: "I agree that Hair2Harvest can collect hair clippings from my shop. A collection team member will explain the programme during the visit.",
    tl: "Sumasang-ayon ako na ang Hair2Harvest ay pwedeng kumolekta ng mga gupit na buhok mula sa aking tindahan. Ipapaliwanag ng miyembro ng collection team ang programa sa visit.",
  },
  "form.requestNote": {
    en: "FREE TO JOIN · NO PASSWORD · NO APP",
    tl: "LIBRE MAKISALI · WALANG PASSWORD · WALANG APP",
  },
  "form.submit": { en: "Ask for a visit", tl: "Humiling ng bisita" },
  "form.sending": { en: "Sending", tl: "Ipinapadala" },
  "form.thanks": { en: "Thank you!", tl: "Salamat!" },
  "form.thanksBody": {
    en: "We will message you to agree on a visit. A collection team member brings the labelled sack and fills in the short form for you. It takes almost none of your time.",
    tl: "Magte-text kami sa inyo para mag-agree ng bisita. Ang miyembro ng collection team ang magdadala ng may tatak na sako at pipuno ng maikling form para sa inyo. Halos wala itong ginugugol na oras ninyo.",
  },
  "form.thanksNote": {
    en: "NO ACCOUNT NEEDED · WE WILL MESSAGE YOU",
    tl: "WALANG ACCOUNT NA KAILANGAN · MAGTE-TEXT KAMI SA INYO",
  },
  "form.errorMsg": {
    en: "We could not send your request. Please call or message 0917 000 0000 and we will help you join on the visit.",
    tl: "Hindi namin maipadala ang inyong request. Pakitawag o mag-text sa 0917 000 0000 at tutulungan ka namin sumali sa visit.",
  },
  "form.privacy": {
    en: "Your details are kept private under the Data Privacy Act of 2012. We use them only to arrange your visit and pickup, and we never share them publicly.",
    tl: "Ang inyong detalye ay mananatiling pribado ayon sa Data Privacy Act of 2012. Ginagamit lang namin ito para ayusin ang inyong bisita at pagkolekta, at hindi namin ibinabahagi sa publiko.",
  },
  "form.requestOnly": {
    en: "This form is only a request for a free visit. Filling it in does not create an account. A team member will visit you to confirm.",
    tl: "Ang form na ito ay tanging request lang para sa libreng bisita. Ang pagpuno nito ay hindi nagkakaroon ng account. Bibisitahin kayo ng miyembro ng team para kumpirmahin.",
  },

  /* ---------------------------------------------------------- chatbot (UI) */
  "chat.aria.open": { en: "Chat with us — drag me anywhere", tl: "Mag-chat sa amin — hilahin ako kahit saan" },
  "chat.aria.close": { en: "Close the chat", tl: "Isara ang chat" },
  "chat.tooltip": { en: "Chat with us", tl: "Mag-chat sa amin" },
  "chat.name": { en: "Snip", tl: "Snip" },
  "chat.role": { en: "Your Hair2Harvest guide", tl: "Inyong gabay sa Hair2Harvest" },
  "chat.replying": { en: "Replying…", tl: "Sumasagot…" },
  "chat.aiAssisted": { en: "AI assisted · checked answers", tl: "AI assisted · sine-scheck na sagot" },
  "chat.online": { en: "Online", tl: "Online" },
  "chat.help.title": { en: "Where can I find it?", tl: "Saan ko ito makikita?" },
  "chat.help.lede": {
    en: "Tap any place below and we will take you straight there. You can also just ask me in English or Tagalog.",
    tl: "Pindutin ang anumang lugar sa ibaba at diretso kayong dadalin namin doon. Pwede rin kayong magtanong sa akin sa English o Tagalog.",
  },
  "chat.help.needPerson": { en: "Need a person instead?", tl: "Kailangan ninyo ng tao?" },
  "chat.help.back": { en: "Back to chat", tl: "Bumalik sa chat" },
  "chat.findHere": { en: "Find it here", tl: "Hanapin dito" },
  "chat.browse": { en: "Where can I find it? Browse the site", tl: "Saan ko ito makikita? Tingnan ang site" },
  "chat.placeholder": { en: "Write a message…", tl: "Magsulat ng mensahe…" },
  "chat.yourMessage": { en: "Your message", tl: "Ang inyong mensahe" },
  "chat.send": { en: "Send message", tl: "Ipadala ang mensahe" },
  "chat.welcome": {
    en: "Hi! I'm Snip, the Hair2Harvest helper. Ask me in English or Tagalog — what we do, what happens when you join, and how hair becomes compost. I can also show you where to find things on the site. Tap the ? button for help.",
    tl: "Kamusta! Ako si Snip, ang katulong ninyo sa Hair2Harvest. Maaari kayong magtanong sa English o Tagalog — kung ano ang ginagawa namin, kung ano ang mangyayari kapag sumali kayo, at kung paano nagiging kompost ang buhok. Pwede rin akong magpakita kung saan makikita ang mga bagay sa site. Pindutin ang button na ? para sa tulong.",
  },
  "chat.talkToRep": { en: "Talk to a Hair2Harvest Representative", tl: "Makipag-usap sa Kinatawan ng Hair2Harvest" },
  "chat.callUs": { en: "Call us", tl: "Tawagan kami" },
  "chat.emailUs": { en: "Email us", tl: "Email kami" },
  "chat.unmute": { en: "Unmute voice", tl: "I-on ang boses" },
  "chat.mute": { en: "Mute voice", tl: "Patayin ang boses" },
  "chat.tapSnip": {
    en: "Tap Snip: bounce · groove · scream · sad",
    tl: "Pindutin si Snip: bounce · groove · scream · sad",
  },
  "chat.group.learn": { en: "Learn", tl: "Aralin" },
  "chat.group.join": { en: "Join", tl: "Sumali" },
  "chat.group.forstaff": { en: "For staff", tl: "Para sa staff" },
  "chat.repTitle": { en: "Talk to a person", tl: "Makipag-usap sa tao" },
  "chat.repBlurb": {
    en: "Prefer to speak with someone? Call or message us and a real person will help.",
    tl: "Mas gusto ninyong makausap ang isang tao? Tawagan o text ninyo kami at tutulong ang isang totoong tao.",
  },

  /* ------------------------------------------------------- status pills etc */
  "status.Enrolled": { en: "Enrolled", tl: "Kasali" },
  "status.Candidate": { en: "Candidate", tl: "Kandidato" },
  "status.Paused": { en: "Paused", tl: "Hinto" },
  "status.Withdrawn": { en: "Withdrawn", tl: "Umalis" },
  "status.Enrolled.def": { en: "Active partner. We pick up hair regularly.", tl: "Aktibong partner. Regular kaming kumokolekta ng buhok." },
  "status.Candidate.def": {
    en: "Interested or visited. Pickups have not started yet.",
    tl: "Interesado o nabisita na. Hindi pa nagsisimula ang pagkolekta.",
  },
  "status.Paused.def": {
    en: "Taking a break, but still part of the network.",
    tl: "Naghihintay sandali, pero parte pa rin ng network.",
  },
  "status.Withdrawn.def": { en: "No longer taking part.", tl: "Hindi na lalahok." },
  "status.Pass": { en: "Pass", tl: "Pasa" },
  "status.Review": { en: "Review", tl: "Repaso" },
  "status.Fail": { en: "Fail", tl: "Bagtok" },
  "batch.Approved": { en: "Approved", tl: "Aprobado" },
  "batch.Curing": { en: "Curing", tl: "Pinatatagal" },
  "batch.Composting": { en: "Composting", tl: "Komposto" },
  "batch.Preparing": { en: "Preparing", tl: "Inihahanda" },
  "grade.Clean": { en: "Clean", tl: "Malinis" },
  "grade.Minor": { en: "Minor", tl: "Bahagya" },
  "grade.Mixed": { en: "Mixed", tl: "Halo" },
};

const STORAGE_KEY = "h2h-lang";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
};

const LangContext = createContext<LangContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("tl");

  // Restore a saved preference once on mount (default is Tagalog).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "tl") setLangState(saved);
    } catch {
      /* no-op */
    }
  }, []);

  // Keep <html lang> and the saved preference in sync.
  useEffect(() => {
    try {
      document.documentElement.lang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* no-op */
    }
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);
  const t = (key: string) => dict[key]?.[lang] ?? key;

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
