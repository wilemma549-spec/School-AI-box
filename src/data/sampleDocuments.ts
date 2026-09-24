export interface SampleDocumentPhoto {
  id: string;
  title: string;
  subtitle: string;
  source: string;
  dateStr: string;
  previewUrl: string; // SVG or Canvas data URL of a realistic paper letter photo
  rawText: string;
  detectedSummary: string;
  tag: string;
}

// Helper to generate a realistic SVG paper letter document photo data URL
function createDocumentSvgUrl(
  schoolName: string,
  letterTitle: string,
  badgeText: string,
  paragraphs: string[],
  slipNote: string,
  accentColor: string = '#1e3a8a'
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
    <defs>
      <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.25"/>
      </filter>
      <linearGradient id="woodBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#451a03"/>
        <stop offset="50%" stop-color="#78350f"/>
        <stop offset="100%" stop-color="#291104"/>
      </linearGradient>
      <linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#ffffff"/>
        <stop offset="100%" stop-color="#fdfbf7"/>
      </linearGradient>
    </defs>

    <!-- Wood table background imitating parent kitchen table -->
    <rect width="600" height="850" fill="url(#woodBg)"/>

    <!-- Subtle wood grain lines -->
    <path d="M 0 120 Q 300 130 600 120" stroke="#92400e" stroke-width="1.5" opacity="0.3" fill="none"/>
    <path d="M 0 350 Q 250 360 600 340" stroke="#92400e" stroke-width="2" opacity="0.2" fill="none"/>
    <path d="M 0 620 Q 400 630 600 610" stroke="#92400e" stroke-width="1.5" opacity="0.3" fill="none"/>

    <!-- The physical paper letter with shadow and slight tilt -->
    <g transform="translate(45, 35) rotate(-0.5)" filter="url(#shadow)">
      <rect width="510" height="780" rx="4" fill="url(#paperGrad)"/>
      <rect width="510" height="780" rx="4" stroke="#e2e8f0" stroke-width="1" fill="none"/>

      <!-- Letterhead crest -->
      <g transform="translate(40, 40)">
        <rect width="44" height="44" rx="10" fill="${accentColor}"/>
        <path d="M 22 10 L 34 32 L 10 32 Z" fill="#ffffff" opacity="0.85"/>
        <circle cx="22" cy="20" r="4" fill="#fbbf24"/>
      </g>

      <!-- School name and address -->
      <text x="96" y="55" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#0f172a">${schoolName}</text>
      <text x="96" y="72" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">Church Road, St Albans, Hertfordshire AL1 3HG • Tel: 01727 854321</text>
      <text x="470" y="55" text-anchor="end" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="600" fill="#64748b">23 Sept 2026</text>

      <!-- Divider line -->
      <line x1="40" y1="98" x2="470" y2="98" stroke="#cbd5e1" stroke-width="1"/>

      <!-- Letter Title -->
      <rect x="40" y="112" width="430" height="34" rx="6" fill="#f1f5f9"/>
      <text x="52" y="134" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="${accentColor}">${letterTitle.toUpperCase()}</text>

      <!-- Badge tag on paper -->
      <rect x="365" y="118" width="95" height="20" rx="10" fill="#e0e7ff"/>
      <text x="412" y="132" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="800" fill="#3730a3">${badgeText}</text>

      <!-- Body paragraphs -->
      ${paragraphs
        .map(
          (para, i) =>
            `<text x="40" y="${175 + i * 54}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11.5" fill="#334155" width="430">
              ${para}
            </text>`
        )
        .join('')}

      <!-- Perforated tear-off slip at bottom -->
      <line x1="40" y1="620" x2="470" y2="620" stroke="#94a3b8" stroke-dasharray="6,4" stroke-width="1.5"/>
      <g transform="translate(40, 613)">
        <!-- Scissor icon -->
        <text font-size="12" fill="#64748b">✂---------------------------------------------------------------------------------------------------</text>
      </g>

      <rect x="40" y="635" width="430" height="115" rx="6" fill="#fafafa" stroke="#e2e8f0" stroke-width="1"/>
      <text x="55" y="655" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#0f172a">REPLY SLIP / PARENT CONSENT (Return to class teacher)</text>
      <text x="55" y="675" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#475569">${slipNote}</text>

      <text x="55" y="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">Child's Name: _______________________  Class: Year 4 Willow</text>
      <text x="55" y="725" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" fill="#64748b">Parent Signature: ___________________  Date: _______________</text>
    </g>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_DOCUMENT_PHOTOS: SampleDocumentPhoto[] = [
  {
    id: 'doc-photo-roman-trip',
    title: 'Year 4 Roman Day & Museum Trip Letter',
    subtitle: 'Printed paper notice on kitchen counter with tear-off consent slip',
    source: 'School Bookbag Paper Letter',
    dateStr: '23 Sept 2026',
    tag: 'Trip & Consent',
    previewUrl: createDocumentSvgUrl(
      "ST. PETER'S C.E. PRIMARY SCHOOL",
      'Year 4 Roman Verulamium Museum Expedition',
      'CONSENT & PAYMENT',
      [
        '<tspan x="40" dy="0">Dear Parents and Carers,</tspan><tspan x="40" dy="18">On Wednesday 7th October 2026, Year 4 will visit Verulamium Roman Museum.</tspan><tspan x="40" dy="18">The coach departs school promptly at 8:30 AM. Collection is at 3:50 PM.</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">Cost & Payment:</tspan><tspan x="40" dy="18">Voluntary contribution £14.50 via ParentPay by Friday 2nd October 2026.</tspan><tspan x="40" dy="18">Covers coach travel, admission, and Roman mosaic workshop.</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">What to wear & pack:</tspan><tspan x="40" dy="18">• Packed lunch in a 100% disposable bag (Strictly NUT-FREE school policy)</tspan><tspan x="40" dy="18">• Refillable water bottle with child\'s name • Warm waterproof winter coat</tspan>',
      ],
      'I give permission for my child to attend the Roman Museum Trip on 7 Oct. Return by 2 Oct 2026.',
      '#1e3a8a'
    ),
    rawText: `ST. PETER'S C.E. PRIMARY SCHOOL
Church Road, St Albans, Hertfordshire AL1 3HG • Tel: 01727 854321
Date: 23rd September 2026

YEAR 4 ROMAN VERULAMIUM MUSEUM EXPEDITION

Dear Parents and Carers,
On Wednesday 7th October 2026, Year 4 will visit Verulamium Roman Museum in St Albans.
The coach departs school promptly at 8:30 AM (please arrive by 8:20 AM). Collection is at 3:50 PM from the main playground.

Cost & Payment:
Voluntary contribution of £14.50 via ParentPay by Friday 2nd October 2026. This covers coach travel, entrance fee, and interactive Roman mosaic workshop.

What to wear & pack:
- Full school uniform with sturdy walking trainers (no open sandals).
- Warm waterproof winter coat.
- Packed lunch in a 100% disposable carrier bag (all items discarded after lunch; NO reusable lunchboxes).
- Refillable water bottle with child's name clearly labelled.
- STRICT REMINDER: We are a nut-free school. No peanut butter or Nutella sandwiches.

✂--------------------------------------------------------------------------------------
REPLY SLIP / PARENT CONSENT (Return to class teacher by Friday 2nd October 2026)
I give permission for my child to attend the Roman Museum Trip on 7th Oct 2026.
Child's Name: _______________________  Class: Year 4 Willow
Parent Signature: ___________________  Date: _______________`,
    detectedSummary: 'Year 4 Museum Trip: Consent & £14.50 ParentPay due 2 Oct. Nut-free packed lunch in disposable bag.',
  },
  {
    id: 'doc-photo-forest-school',
    title: 'Reception Forest School & Phonics Letter',
    subtitle: 'Printed letter from school welfare: named wellies & waterproof kit',
    source: 'School Bookbag Paper Letter',
    dateStr: '23 Sept 2026',
    tag: 'Kit & Workshop',
    previewUrl: createDocumentSvgUrl(
      'OAKWOOD INFANT & NURSERY SCHOOL',
      'Reception Phonics Workshop & Outdoor Forest School Kit',
      'KIT & DATES',
      [
        '<tspan x="40" dy="0">Dear Reception Families,</tspan><tspan x="40" dy="18">Welcome to the new school term! Two vital reminders for this coming week:</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">1. Phonics & Early Reading Parent Workshop:</tspan><tspan x="40" dy="18">Tuesday 29th September 2026 at 9:00 AM in the school hall.</tspan><tspan x="40" dy="18">Learn how we blend phonics sounds; collect free home reading pack.</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">2. Forest School Outdoor Kit (Due Wednesday 30th Sept):</tspan><tspan x="40" dy="18">• 1 pair named wellington boots (label outer heel in permanent marker)</tspan><tspan x="40" dy="18">• 1 waterproof puddle suit or all-in-one mud trousers • Spare socks bag</tspan>',
      ],
      'Please sign to confirm attendance at Phonics Workshop or receipt of Forest School guidance.',
      '#065f46'
    ),
    rawText: `OAKWOOD INFANT & NURSERY SCHOOL
Oakwood Way, Leeds, LS8 2AY • Tel: 0113 249 1100
Date: 23rd September 2026

RECEPTION PHONICS WORKSHOP & OUTDOOR FOREST SCHOOL KIT

Dear Reception Families,
Welcome to the new school term! Two vital reminders for this coming week:

1. Phonics & Early Reading Parent Workshop:
Tuesday 29th September 2026 at 9:00 AM in the school hall (straight after morning drop-off).
Learn how we blend phonics sounds and collect your child's free home reading pack.

2. Forest School Outdoor Kit (Due by Wednesday 30th September 2026):
Weekly woodland sessions start Thursday 1st October. Every child must bring in a named drawstring bag:
- 1 pair of named wellington boots (label outer heel in permanent marker)
- 1 waterproof puddle suit or all-in-one mud trousers
- 1 spare pair of thick socks and underwear in a plastic bag
Children without waterproof trousers and wellies cannot participate in muddy woods activities.

✂--------------------------------------------------------------------------------------
REPLY SLIP / ACKNOWLEDGEMENT (Return to class teacher by 30th Sept 2026)
Child's Name: _______________________  Class: Reception Acorns
Parent Signature: ___________________  Date: _______________`,
    detectedSummary: 'Phonics Workshop Tuesday 9 AM. Bring named wellies & waterproof puddle suit by Wednesday.',
  },
  {
    id: 'doc-photo-book-day',
    title: 'World Book Day & PTA Bake Sale Bulletin',
    subtitle: 'Printed paper bulletin folded in book bag: £1 donation, costume, cakes',
    source: 'PTA & School Flyer',
    dateStr: '23 Sept 2026',
    tag: 'Event & Donation',
    previewUrl: createDocumentSvgUrl(
      'GREENHILL PRIMARY ACADEMY',
      'World Book Day & PTA Autumn Bake Sale',
      'COSTUME & CAKES',
      [
        '<tspan x="40" dy="0">Dear Greenhill Families,</tspan><tspan x="40" dy="18">Please take note of upcoming events and actions for next week:</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">World Book Day (Friday 9th October 2026):</tspan><tspan x="40" dy="18">• Children come dressed as a book character or comfy pyjamas.</tspan><tspan x="40" dy="18">• £1 cash coin donation at gate for Book Aid • Bring 1 book for swap</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">PTA Bake Sale (Drop-off Thursday 8th Oct):</tspan><tspan x="40" dy="18">• Bring nut-free homemade or shop cakes to office Thursday morning.</tspan><tspan x="40" dy="18">• INSET DAY REMINDER: Friday 23rd October school is CLOSED to pupils.</tspan>',
      ],
      'PTA Volunteer Helper Slip: Tick if you can help sell cakes Friday 3:15 PM.',
      '#6b21a8'
    ),
    rawText: `GREENHILL PRIMARY ACADEMY
Greenhill Avenue, Manchester, M20 4QW
Date: 23rd September 2026

WORLD BOOK DAY & PTA AUTUMN BAKE SALE

Dear Greenhill Families,
Please take note of upcoming events and actions for next week:

1. World Book Day (Friday 9th October 2026):
- Children are invited to come dressed as their favourite book character or comfy pyjamas for reading hour.
- £1 cash coin donation at the school gate for Book Aid International.
- Please bring 1 pre-loved paperback book from home for the Great Book Swap.

2. PTA Friday Bake Sale:
- Please bring nut-free home-baked or shop-bought cakes to the school office on Thursday morning (8th October). Label reusable tins!
- Sale starts Friday 3:15 PM in the playground (treats 50p–£1.50).

3. INSET DAY ADVANCE NOTICE:
Friday 23rd October 2026 is a Staff INSET Day. School will be CLOSED to all pupils.

✂--------------------------------------------------------------------------------------
PTA VOLUNTEER SLIP (Return to school office)
Name: ______________________  Contact Tel: ___________________
[  ] I can help run the cake stall on Friday 9th October (3:00–3:45 PM)`,
    detectedSummary: 'World Book Day costume & £1 coin Friday 9 Oct. Nut-free cakes due Thursday morning.',
  },
  {
    id: 'doc-photo-medical',
    title: 'Urgent Medical Form & Flu Immunisation Letter',
    subtitle: 'Official letter from School Welfare: Pharmacy label inhaler & NHS e-consent',
    source: 'School Welfare Office Letter',
    dateStr: '23 Sept 2026',
    tag: 'Urgent Medical',
    previewUrl: createDocumentSvgUrl(
      'HIGHFIELD COMMUNITY PRIMARY SCHOOL',
      'Urgent: Prescribed Medication & NHS Flu Vaccine Notice',
      'DEADLINE 28 SEPT',
      [
        '<tspan x="40" dy="0">URGENT NOTICE TO ALL PARENTS & CARERS</tspan><tspan x="40" dy="18">Please complete two critical medical compliance requirements:</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">1. Asthma & Prescribed Medication Renewal (Due Mon 28 Sept):</tspan><tspan x="40" dy="18">Deliver in-date inhaler/EpiPen in original box with chemist dispensary label</tspan><tspan x="40" dy="18">showing child\'s full name. Sign the medical administration form at welfare.</tspan>',
        '<tspan x="40" dy="0" font-weight="bold" fill="#0f172a">2. NHS Nasal Flu Immunisation E-Consent (Due Mon 28 Sept 5pm):</tspan><tspan x="40" dy="18">NHS team visiting Wed 14 Oct. Submit online form even if declining consent.</tspan>',
      ],
      'Medical Room confirmation receipt: Hand delivered to Welfare Office.',
      '#9f1239'
    ),
    rawText: `HIGHFIELD COMMUNITY PRIMARY SCHOOL
Welfare & Attendance Office • Tel: 01865 765432
Date: 23rd September 2026

URGENT NOTICE: PRESCRIBED MEDICATION & NHS FLU VACCINE E-CONSENT

Dear Parents & Carers,
Please complete two critical medical compliance requirements by Monday 28th September 2026:

1. Annual Asthma & Prescribed Medication Plan:
If your child has prescribed medication kept in school (inhalers, antihistamines, EpiPens), school regulations require newly prescribed medication in its original box with the chemist dispensary label showing your child's full legal name and dosage instructions.
Please bring this to the welfare office by Monday 28th September 2026 and sign the renewed administration register.

2. NHS Nasal Flu Immunisation E-Consent:
The NHS school nursing team visits on Wednesday 14th October 2026.
Please complete the digital e-consent form via the NHS portal link sent to your email before 5:00 PM on Monday 28th September 2026. Even if you do NOT wish your child to receive the vaccination, you MUST submit the form to record your decline.

Welfare & Attendance Office`,
    detectedSummary: 'Urgent by 28 Sept: Bring named inhaler in original chemist box; complete NHS flu e-consent.',
  },
];
