/**
 * Public legal copy, adapted from the project's "Terms and Condition &
 * Privacy Policy" document (November 2026).
 *
 * Each block is bilingual so the partner-facing pages render in whichever
 * language the visitor selected. The barangay is written "Novaliches Proper" to
 * match the wording in the supplied PDF.
 */

export type LegalBlock =
  | { kind: "p"; text: { en: string; tl: string } }
  | { kind: "list"; items: { en: string; tl: string }[] };

export type LegalSection = {
  id: string;
  number: string;
  title: { en: string; tl: string };
  blocks: LegalBlock[];
};

export type LegalDocument = {
  eyebrow: { en: string; tl: string };
  title: { en: string; tl: string };
  lede: { en: string; tl: string };
  effective: { en: string; tl: string };
  sections: LegalSection[];
  closing?: { kind: "p"; text: { en: string; tl: string } };
};

export const termsDocument: LegalDocument = {
  eyebrow: { en: "Terms and Conditions", tl: "Mga Tuntunin at Kundisyon" },
  title: { en: "Participating barbershops", tl: "Para sa mga partner na barbero" },
  lede: {
    en: "These terms explain what Hair2Harvest is, who may join, and what every participating barbershop agrees to. They are written in plain language so you know exactly what to expect.",
    tl: "Ipinaliwanag sa mga tuntuning ito kung ano ang Hair2Harvest, sino ang pwedeng sumali, at ano ang pinapayagang mangyari sa bawat partner na barbero. Isinulat ito sa malinaw na wika para malaman ninyo ang inaasahan.",
  },
  effective: { en: "Effective November 2026", tl: "Magsisimula sa Nobyembre 2026" },
  sections: [
    {
      id: "purpose",
      number: "I",
      title: { en: "Purpose and project overview", tl: "Layunin at pangkalahatang-ideya" },
      blocks: [
        {
          kind: "p",
          text: {
            en: "By registering on the Hair2Harvest web platform, your shop (“Participating Barbershop”) agrees to take part voluntarily in Project Hair2Harvest — an academic capstone research initiative by fourth-year BS Information Technology students of Quezon City University (QCU), in coordination with Barangay Novaliches Proper. The platform supports the systematic collection, monitoring, and composting of discarded natural human hair into an organic soil amendment for the Joy of Urban Farming (JOUF) initiative.",
            tl: "Sa pagrehistro sa web platform ng Hair2Harvest, ang inyong tindahan (“Participating Barbershop”) ay sumasang-ayon na sumali nang boluntaryo sa Project Hair2Harvest — isang academic capstone research ng mga fourth-year BS Information Technology student ng Quezon City University (QCU), kasama ang Barangay Novaliches Proper. Sinusuportahan ng platform ang maayos na pagkolekta, pagsubaybay, at pagkomposta ng itinapong natural na buhok ng tao upang maging organikong pataba para sa Joy of Urban Farming (JOUF).",
          },
        },
      ],
    },
    {
      id: "eligibility",
      number: "II",
      title: { en: "Eligibility and registration", tl: "Kwalipikasyon at pagrehistro" },
      blocks: [
        {
          kind: "list",
          items: [
            {
              en: "Participation is open to commercial barbershops operating within Barangay Novaliches Proper, Quezon City.",
              tl: "Bukas ang paglahok sa mga komersyal na barbershop na nasa loob ng Barangay Novaliches Proper, Quezon City.",
            },
            {
              en: "During registration, the owner or authorized representative must give accurate business details: shop name, business address, contact information, and designated representative.",
              tl: "Sa pagrehistro, ang may-ari o awtorisadong kinatawan ay dapat magbigay ng tamang detalye: pangalan ng tindahan, address, impormasyon sa pakikipag-ugnayan, at itinalagang kinatawan.",
            },
            {
              en: "You are responsible for keeping your account credentials confidential and for the collection logs and schedule updates submitted under your shop's account.",
              tl: "Kayo ang may pananagutan sa pagpapanatiling pribado ng inyong account at sa mga talaan ng pagkolekta at update ng iskedyul na isinumite sa ilalim ng account ng inyong tindahan.",
            },
          ],
        },
      ],
    },
    {
      id: "segregation",
      number: "III",
      title: { en: "Accepted materials", tl: "Mga tinatanggap na materyales" },
      blocks: [
        {
          kind: "p",
          text: {
            en: "To keep the composting process safe and viable, every participating barbershop agrees to follow these source-separation rules:",
            tl: "Upang ligtas at matsagumpay ang pagkomposta, ang bawat partner na barbero ay sumasang-ayon na sundin ang mga tuntunin sa paghiwalay ng basura:",
          },
        },
        {
          kind: "list",
          items: [
            {
              en: "Accepted only: clean, dry, natural (untreated) human hair clippings from regular barbering services.",
              tl: "Tinatanggap lamang: malinis, tuyo, at natural (hindi ginamot) na gupit na buhok ng tao mula sa karaniwang serbisyo ng barbero.",
            },
            {
              en: "Do not include hair with synthetic dyes, bleaching agents, chemical perms, rebonding or straightening treatments, or other chemical residues.",
              tl: "Huwag isama ang buhok na may sintetikong tina, bleach, chemical perm, rebonding o straightening, at iba pang kemikal.",
            },
            {
              en: "Do not include razor blades, sharp objects, tissues, paper, plastic bottles, chemical containers, or general shop garbage.",
              tl: "Huwag isama ang labaha, matutulis na bagay, tisyu, papel, plastic bottles, lalagyan ng kemikal, o pangkalahatang basura ng tindahan.",
            },
            {
              en: "Store the separated hair in a clean, dry, designated container or bag while waiting for pickup.",
              tl: "Itago ang pinaghiwalay na buhok sa malinis, tuyo, at itinalagang lalagyan o sako habang hinihintay ang pagkolekta.",
            },
          ],
        },
      ],
    },
    {
      id: "collection",
      number: "IV",
      title: { en: "Weekly collection", tl: "Lingguhang pagkolekta" },
      blocks: [
        {
          kind: "list",
          items: [
            {
              en: "Hair is collected once a week on the schedule shown on the platform, with reasonable adjustments for holidays, weather, or operational needs.",
              tl: "Ang buhok ay kinokolekta isang beses sa isang linggo ayon sa iskedyul sa platform, na may makatwirang pagbabago para sa holidays, panahon, o pangangailangan ng operasyon.",
            },
            {
              en: "On collection day, make the container available at the agreed point for inspection, weighing, and turnover to authorized barangay or Hair2Harvest representatives.",
              tl: "Sa araw ng pagkolekta, ilabas ang lalagyan sa napagkasunduang lugar para sa inspeksyon, pagtimbang, at turnover sa awtorisadong kinatawan ng barangay o Hair2Harvest.",
            },
            {
              en: "Collectors record the date, shop name, and accepted weight on the platform for monitoring and research documentation.",
              tl: "Itinatala ng mga collector ang petsa, pangalan ng tindahan, at tinanggap na timbang sa platform para sa pagsubaybay at dokumentasyong pangresearch.",
            },
          ],
        },
      ],
    },
    {
      id: "financial",
      number: "V",
      title: { en: "Voluntary and free", tl: "Boluntaryo at libre" },
      blocks: [
        {
          kind: "list",
          items: [
            {
              en: "Participation is entirely voluntary.",
              tl: "Boluntaryo ang paglahok.",
            },
            {
              en: "No registration fee, membership charge, or contribution is required, and no payment is made for surrendered hair unless agreed in writing by all parties.",
              tl: "Walang registration fee, membership charge, o kontribusyon na kailangan, at walang bayad para sa ibinigay na buhok maliban na lang kung napagkasunduan nang nakasulat ng lahat ng panig.",
            },
            {
              en: "Joining does not create an employment, commercial partnership, or financial obligation between the shop, Barangay Novaliches Proper, and the project team.",
              tl: "Ang paglahok ay hindi lumilikha ng employer-employee, komersyal na partnership, o pinansyal na obligasyon sa pagitan ng tindahan, Barangay Novaliches Proper, at ng project team.",
            },
          ],
        },
      ],
    },
    {
      id: "use",
      number: "VI",
      title: { en: "Project use and disclaimer", tl: "Gamit sa proyekto at disclaimer" },
      blocks: [
        {
          kind: "list",
          items: [
            {
              en: "All collected hair is used only for approved Hair2Harvest research, composting trials, laboratory testing, and urban gardening distribution under JOUF.",
              tl: "Ang lahat ng nakolektang buhok ay ginagamit lamang para sa aprubadong research ng Hair2Harvest, mga pagsubok sa pagkomposta, pagsusuri sa laboratoryo, at pamamahagi sa urban gardening sa ilalim ng JOUF.",
            },
            {
              en: "Participating shops are acknowledged for their contribution in the project's academic documentation and waste-diversion reports.",
              tl: "Kilala ang mga partner na tindahan para sa kanilang kontribusyon sa academic documentation at waste-diversion reports ng proyekto.",
            },
            {
              en: "Hair2Harvest is a student capstone project. Registration on this site is not a formal institutional contract with Quezon City University unless expressly authorized in writing by the University.",
              tl: "Ang Hair2Harvest ay isang student capstone project. Ang pagrehistro sa site ay hindi pormal na kontrata sa Quezon City University maliban na lang kung hayad na awtorisado nang nakasulat ng Unibersidad.",
            },
          ],
        },
      ],
    },
    {
      id: "withdrawal",
      number: "VII",
      title: { en: "Withdrawal and termination", tl: "Pag-withdraw at pagwawakas" },
      blocks: [
        {
          kind: "list",
          items: [
            {
              en: "These terms run from your registration until the capstone project officially ends, unless ended earlier.",
              tl: "Ang mga tuntuning ito ay mananatili mula sa inyong pagrehistro hanggang sa pormal na pagwakas ng capstone project, maliban na lang kung mas maagang wakasan.",
            },
            {
              en: "You may withdraw at any time by giving written notice (or a formal request through the platform or barangay coordinator) at least seven (7) days before your intended withdrawal date.",
              tl: "Maaari kayong mag-withdraw anumang oras sa pamamagitan ng nakasulat na abiso (o pormal na kahilingan sa platform o sa barangay coordinator) nang hindi bababa sa pitong (7) araw bago ang nais na petsa ng pag-withdraw.",
            },
            {
              en: "Any pending pickup is coordinated with Barangay Novaliches Proper or the project team after withdrawal.",
              tl: "Ang anumang nakaiskedyul na pagkolekta ay pipiagkasunduan sa Barangay Novaliches Proper o sa project team pagkatapos mag-withdraw.",
            },
          ],
        },
      ],
    },
  ],
};

export const privacyDocument: LegalDocument = {
  eyebrow: { en: "Privacy Policy", tl: "Patakaran sa Privacy" },
  title: { en: "How we handle your data", tl: "Kung paano namin pinangangasiwaan ang inyong datos" },
  lede: {
    en: "The Hair2Harvest team respects your privacy and protects the personal and business information you share with us, in line with the Data Privacy Act of 2012 (Republic Act No. 10173).",
    tl: "Iginagalang ng Hair2Harvest team ang inyong privacy at pinapangalagaan ang personal at pangnegosyong impormasyong ibinabahagi ninyo sa amin, alinsunod sa Data Privacy Act of 2012 (Republic Act No. 10173).",
  },
  effective: { en: "Effective November 2026", tl: "Magsisimula sa Nobyembre 2026" },
  sections: [
    {
      id: "collect",
      number: "I",
      title: { en: "Information we collect", tl: "Impormasyong kinokolekta namin" },
      blocks: [
        {
          kind: "p",
          text: {
            en: "We collect only what is needed to coordinate collection and document the research:",
            tl: "Kinokolekta namin lamang ang kailangan upang mag-ayos ng pagkolekta at maidokumento ang research:",
          },
        },
        {
          kind: "list",
          items: [
            {
              en: "Registration and contact details: shop name, address within Barangay Novaliches Proper, owner or representative name, mobile number, email address, and encrypted login credentials.",
              tl: "Mga detalye sa pagrehistro at pakikipag-ugnayan: pangalan ng tindahan, address sa loob ng Barangay Novaliches Proper, pangalan ng may-ari o kinatawan, mobile number, email, at naka-encrypt na login credentials.",
            },
            {
              en: "Operational records: pickup schedule, collection dates and times, accepted weight in kilograms, and batch traceability logs.",
              tl: "Mga talaan ng operasyon: iskedyul ng pagkolekta, petsa at oras, tinanggap na timbang sa kilograms, at batch traceability logs.",
            },
          ],
        },
      ],
    },
    {
      id: "use",
      number: "II",
      title: { en: "How we use your information", tl: "Kung paano namin ginagamit ang inyong impormasyon" },
      blocks: [
        {
          kind: "list",
          items: [
            {
              en: "To create, authenticate, and manage your shop's account.",
              tl: "Upang likhain, patunayan, at pangasiwaan ang account ng inyong tindahan.",
            },
            {
              en: "To schedule, coordinate, and verify weekly pickups with barangay personnel and collectors.",
              tl: "Upang mag-iskedyul, mag-ayos, at mapatunayan ang lingguhang pagkolekta kasama ang mga tauhan ng barangay at mga collector.",
            },
            {
              en: "To keep accurate waste-diversion records, batch logs, and research datasets.",
              tl: "Upang mapanatiling tumpak ang waste-diversion records, batch logs, at research datasets.",
            },
            {
              en: "To acknowledge your shop in the capstone manuscript and community sustainability reports.",
              tl: "Upang kilalanin ang inyong tindahan sa capstone manuscript at community sustainability reports.",
            },
          ],
        },
      ],
    },
    {
      id: "sharing",
      number: "III",
      title: { en: "Sharing and disclosure", tl: "Pagbabahagi at pagsisiwalat" },
      blocks: [
        {
          kind: "p",
          text: {
            en: "We do not sell, rent, or trade your personal or business information. Access is limited to:",
            tl: "Hindi namin ibinebenta, inuupahan, o ipinagpapalit ang inyong personal o pangnegosyong impormasyon. Limitado ang access sa:",
          },
        },
        {
          kind: "list",
          items: [
            {
              en: "Authorized Hair2Harvest proponents, for administration, logging, and research.",
              tl: "Mga awtorisadong proponent ng Hair2Harvest, para sa administrasyon, pagtatala, at research.",
            },
            {
              en: "Authorized Barangay Novaliches Proper personnel, to verify community collection.",
              tl: "Mga awtorisadong tauhan ng Barangay Novaliches Proper, upang mapatunayan ang pagkolekta sa komunidad.",
            },
            {
              en: "The capstone adviser and academic evaluators at Quezon City University, strictly for academic review.",
              tl: "Ang capstone adviser at academic evaluators ng Quezon City University, para lamang sa academic review.",
            },
          ],
        },
      ],
    },
    {
      id: "security",
      number: "IV",
      title: { en: "Storage, security, and retention", tl: "Imbakan, seguridad, at pagpapanatili" },
      blocks: [
        {
          kind: "list",
          items: [
            {
              en: "Passwords are encrypted and data is stored in a secured database with role-based access, so representatives see only their own shop's profile and collection history.",
              tl: "Naka-encrypt ang mga password at nakaimbak ang datos sa secured database na may role-based access, kaya nakikita lang ng kinatawan ang profile at collection history ng sarili nilang tindahan.",
            },
            {
              en: "Data is kept only for the duration of the capstone project and required reporting. After completion and grading, contact details are securely deleted or anonymized in published datasets.",
              tl: "Pinanatili ang datos hanggang sa tagal ng capstone project at ng kinakailangang reporting. Pagkatapos makumpleto at magrado, ligtas na binubura o ginawang anonymous ang mga contact details sa mga published datasets.",
            },
          ],
        },
      ],
    },
    {
      id: "rights",
      number: "V",
      title: { en: "Your rights", tl: "Inyong mga karapatan" },
      blocks: [
        {
          kind: "p",
          text: {
            en: "As a data subject under Republic Act No. 10173, you have the right to:",
            tl: "Bilang data subject sa ilalim ng Republic Act No. 10173, may karapatan kayong:",
          },
        },
        {
          kind: "list",
          items: [
            {
              en: "Be informed about how your business and contact data is collected and used.",
              tl: "Mabatid kung paano kinokolekta at ginagamit ang inyong datos pangnegosyo at pakikipag-ugnayan.",
            },
            {
              en: "Access and review your shop profile and collection history through the dashboard.",
              tl: "I-access at repasuhin ang profile ng inyong tindahan at collection history sa dashboard.",
            },
            {
              en: "Rectify or update inaccurate shop details, addresses, or representative information.",
              tl: "Itama o i-update ang maling detalye ng tindahan, address, o impormasyon ng kinatawan.",
            },
            {
              en: "Withdraw consent and request deletion of your account and contact records with at least seven (7) days' written notice.",
              tl: "Bawiin ang pahintulot at humiling ng pagbura ng account at contact records nang hindi bababa sa pitong (7) araw na nakasulat na abiso.",
            },
          ],
        },
      ],
    },
    {
      id: "contact",
      number: "VI",
      title: { en: "Contact us", tl: "Makipag-ugnayan" },
      blocks: [
        {
          kind: "p",
          text: {
            en: "For questions about these terms, privacy concerns, or requests to update or delete your records, contact: Mikylla Tulba — Project Manager, Hair2Harvest; Adviser: Ms. Joan F. Lawan, MAIE, LPT; College of Computer Studies, Quezon City University, 673 Quirino Highway, San Bartolome, Novaliches, Quezon City.",
            tl: "Para sa mga tanong tungkol sa mga tuntuning ito, alalahanin sa privacy, o kahilingang i-update o burahin ang inyong records, makipag-ugnayan sa: Mikylla Tulba — Project Manager, Hair2Harvest; Adviser: Ms. Joan F. Lawan, MAIE, LPT; College of Computer Studies, Quezon City University, 673 Quirino Highway, San Bartolome, Novaliches, Quezon City.",
          },
        },
      ],
    },
  ],
  closing: {
    kind: "p",
    text: {
      en: "I confirm that I am the owner or authorized representative of the registering barbershop in Barangay Novaliches Proper, and I have read and agree to the Hair2Harvest Terms and Conditions — including the exclusion of chemically treated hair and general shop trash — and Privacy Policy.",
      tl: "Pinapapatunayan ko na ako ang may-ari o awtorisadong kinatawan ng nagrehistrong barbershop sa Barangay Novaliches Proper, at nabasa ko at sumasang-ayon ako sa Hair2Harvest Terms and Conditions — kabilang ang pagbubukod ng kemikal na ginamot na buhok at pangkalahatang basura ng tindahan — at Privacy Policy.",
    },
  },
};
