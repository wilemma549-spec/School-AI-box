export interface SampleNotice {
  id: string;
  source: 'WhatsApp' | 'ParentPay' | 'School Email' | 'Arbor App' | 'School Letter';
  badgeColor: string;
  title: string;
  preview: string;
  text: string;
}

export const SAMPLE_NOTICES: SampleNotice[] = [
  {
    id: 'sample-chan-siu-ming',
    source: 'WhatsApp',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: 'St Mary’s Primary: 陳小明 (Leo) 露營活動通知',
    preview: '陳小明、St Mary’s Primary、Mr Smith，帶水樽、交 £25、星期五前交回條',
    text: `WhatsApp 訊息 — St Mary's Primary 家長群組

Dear Mrs Chan，
關於你嘅小朋友 陳小明 (Leo) 喺 St Mary's Primary 讀緊嘅 Year 3 戶外探險活動：

1. 費用：請於星期五前在 ParentPay 繳交 £25 活動費（包括巴士車費及農場門票）。
2. 回條：請列印並簽署家長同意書回條，星期五前交還畀 Mr Smith 班主任。
3. 攜帶物品：當日必須帶 refillable 水樽、雨褸、以及貼有小朋友名字嘅防敏感 nut-free packed lunch。
4. 集合時間：星期一朝早 8:15 AM 準時在學校正門集合。

如有任何查詢，請致電學校校務處 01727 854321 聯絡 Mr Smith。

St Mary's Primary School Office`,
  },
  {
    id: 'sample-trip',
    source: 'School Email',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    title: 'Year 4 Roman Day & Museum Trip',
    preview: 'Consent slip due 2 Oct, £14.50 on ParentPay, packed lunch (nut-free), early drop-off 8:30 AM',
    text: `Dear Parents and Carers of Year 4,

On Wednesday 7th October 2026, Year 4 will be visiting the Roman Verulamium Museum in St Albans to support our History topic on the Roman Empire.

The coach will depart school promptly at 8:45 AM, so please ensure your child arrives at school by 8:30 AM. We will return at approximately 3:45 PM. Children should be collected from the playground at 3:50 PM.

Cost & Consent:
The voluntary contribution for this trip is £14.50 per child (which covers museum entrance, interactive workshop, and coach transport). Please make payment and complete the digital consent form via ParentPay by Friday 2nd October 2026. If your child is entitled to Pupil Premium or you require financial support, please speak confidentially to Mrs Higgins in the school office.

What to wear & pack:
- Full school uniform with school jumper and comfortable walking trainers (no sandals).
- A waterproof warm coat.
- Packed lunch in a completely disposable plastic or paper carrier bag with child's name written on it (all items will be thrown away after lunch, please do NOT send reusable containers or lunch boxes).
- Refillable water bottle clearly labelled.
- STRICT REMINDER: We are an allergy-aware, nut-free school. Do NOT include peanut butter sandwiches, hazelnut spreads (like Nutella), or cereal bars containing nuts.

Thank you for your cooperation,
Mr Davies & Mrs Cooper (Year 4 Teaching Team)
St. Peter's CE Primary School`,
  },
  {
    id: 'sample-world-book-day',
    source: 'Arbor App',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    title: 'World Book Day & PTA Bake Sale',
    preview: 'Costume Friday 9 Oct, £1 donation, book swap, nut-free cake drop-off on Thursday',
    text: `Greenhill Primary School - Weekly Parent Bulletin

Upcoming Events & Key Actions for Next Week:

1. World Book Day Celebration (Friday 9th October 2026):
- Children are invited to come to school dressed as their favourite book character or wearing comfy pyjamas for our Bedtime Reading Hour.
- We kindly request a £1 cash donation at the school gates, with all proceeds supporting Book Aid International.
- Please also send your child with one good-condition paperback book from home to take part in our Great Book Swap!

2. PTA Friday After-School Bake Sale:
- We need your delicious cakes! Please bring nut-free home-baked or shop-bought cakes/cupcakes to the school office on Thursday morning (8th October).
- Please ensure any reusable tins or Tupperware containers are clearly marked with your child's name and class.
- The sale starts at 3:15 PM in the main playground. All treats 50p–£1.50.

3. Advance Notice:
Friday 23rd October 2026 is an INSET DAY. School will be CLOSED to all pupils for staff training.

Warm regards,
Mrs S. Walker (Headteacher)`,
  },
  {
    id: 'sample-forest-school',
    source: 'School Letter',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: 'Reception: Phonics Workshop & Forest School Kit',
    preview: 'Workshop Tuesday 9:00 AM, named wellies & puddle suits due by Wednesday',
    text: `Oakwood Infant School - Reception Class Notice

Dear Reception Families,

1. Early Reading & Phonics Parent Workshop:
We invite all parents to a 30-minute Phonics & Reading Workshop in the school hall on Tuesday 29th September 2026 at 9:00 AM (straight after classroom drop-off). We will explain how we introduce phonics, blending sounds, and provide take-home reading packs.

2. Forest School Preparation:
Our weekly outdoor Forest School sessions begin this Thursday 1st October 2026. Every child must bring their outdoor kit in a named drawstring bag by Wednesday 30th September:
- 1 pair of wellington boots (please write your child's name in permanent marker on the outer heel)
- 1 waterproof puddle suit or waterproof over-trousers
- 1 spare pair of thick socks and spare underwear in a plastic bag

Please note children cannot participate in the muddy woods without waterproof trousers and wellies.

Many thanks,
Miss Patel (Early Years Lead)`,
  },
  {
    id: 'sample-whatsapp-pta',
    source: 'WhatsApp',
    badgeColor: 'bg-green-100 text-green-800 border-green-200',
    title: 'Class 3B WhatsApp: Bottle Tombola & Volunteers',
    preview: 'Bring unopened bottle Friday, volunteers needed for 45min stall shift',
    text: `[Class 3B Parents Group Chat]
Sarah (PTA Rep): "Hi everyone! Message from the PTA about the Autumn Fair on Saturday 10th October (12:00–3:00 PM).

Year 3 is in charge of the Bottle Tombola stall this year! Here's what we need from every family:

1. This Friday 2nd October is a Mufti / Non-Uniform Day in exchange for bringing in 1 unopened bottle for the tombola (can be wine, prosecco, squash, shampoo, olive oil, bubble bath!). Drop it off with the PTA helpers at the front gates.

2. We urgently need 3 more parents to volunteer for 45-minute shifts on our stall (1:00–1:45 PM or 1:45–2:30 PM). Please DM me directly today if you can take a slot!

3. Hamper raffle tickets will be sent home in book bags on Monday—please return any sold ticket stubs and cash by next Thursday 8th Oct. Thanks everyone! 🙌"`,
  },
  {
    id: 'sample-medical',
    source: 'ParentPay',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    title: 'Urgent: Inhaler Renewal & Flu Immunisation',
    preview: 'Sign e-consent by 28 Sept, renew asthma inhalers with original pharmacy label',
    text: `Highfield Primary School - Important Health & Medical Update

Dear Parents & Carers,

1. Annual Asthma & Medication Plan Renewal:
If your child has prescribed medication kept in school (inhalers, antihistamines, EpiPens), school regulations require newly prescribed medication in its original box with the chemist dispensary label showing your child's name and dosage. Please bring this to the medical room by Monday 28th September 2026 and sign the renewed administration form.

2. NHS Nasal Flu Immunisation E-Consent:
The NHS school nursing team will visit on Wednesday 14th October 2026.
Please complete the online consent form via the NHS link sent to your email before 5:00 PM on Monday 28th September 2026. Even if you do NOT wish your child to receive the vaccination, you must submit the form to decline.

School Welfare Office`,
  },
];
