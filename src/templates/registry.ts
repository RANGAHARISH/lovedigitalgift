import type { FieldDef, Occasion, TemplateDef, TemplateSummary } from "./types";
import { OCCASION_LABELS } from "./occasions";
import BirthdayConfetti from "./birthday-confetti";
import AnniversaryTimeline from "./anniversary-timeline";
import LoveLetter from "./love-letter";
import PhotoMemories from "./photo-memories";
import WeddingInvite from "./wedding-invite";
import ReasonsCards from "./reasons-cards";
import Celebration from "./celebration";

const birthdayFields: FieldDef[] = [
  { key: "name", label: "Birthday person's name", type: "text", max: 30, placeholder: "e.g. Sophie" },
  { key: "age", label: "Age (optional)", type: "text", max: 3, placeholder: "e.g. 25" },
  {
    key: "message",
    label: "Birthday message",
    type: "textarea",
    max: 260,
    placeholder: "Wish them a day as wonderful as they are…",
  },
  { key: "wish", label: "Final wish", type: "textarea", max: 240, help: "Shown at the very end of the gift." },
  { key: "from", label: "From", type: "text", max: 40, placeholder: "Your name" },
  { key: "photos", label: "Photos", type: "images", max: 8, captions: true },
];

const anniversaryFields: FieldDef[] = [
  { key: "names", label: "Your names", type: "text", max: 50, placeholder: "Maya & Sam" },
  { key: "since", label: "Together since", type: "date" },
  {
    key: "headline",
    label: "Headline",
    type: "text",
    max: 70,
    placeholder: "Six years of us",
  },
  {
    key: "milestones",
    label: "Timeline memories",
    type: "list",
    itemLabel: "Memory",
    max: 8,
    placeholder: "14 Feb 2019 — Our first date",
    help: "Start each line with a date, then a dash, then the memory.",
  },
  { key: "letter", label: "Love letter", type: "textarea", max: 900 },
  { key: "from", label: "Signed by", type: "text", max: 40 },
  { key: "photos", label: "Photos", type: "images", max: 9, captions: true },
];

const letterFields: FieldDef[] = [
  { key: "to", label: "To", type: "text", max: 40, placeholder: "Their name" },
  { key: "letter", label: "Your letter", type: "textarea", max: 1000 },
  { key: "from", label: "From", type: "text", max: 40, placeholder: "Your name" },
  {
    key: "question",
    label: "Question (optional)",
    type: "text",
    max: 90,
    placeholder: "Will you be my Valentine?",
    help: "Leave blank to hide the Yes / No moment.",
  },
  { key: "photos", label: "Photos (optional)", type: "images", max: 6 },
];

const albumFields: FieldDef[] = [
  { key: "title", label: "Album title", type: "text", max: 60 },
  { key: "subtitle", label: "Subtitle", type: "text", max: 120 },
  { key: "photos", label: "Photos", type: "images", max: 10, captions: true },
  { key: "message", label: "Closing message", type: "textarea", max: 400 },
  { key: "from", label: "From", type: "text", max: 40 },
];

const weddingFields: FieldDef[] = [
  { key: "couple", label: "Couple names", type: "text", max: 60, placeholder: "Amelia & Noah" },
  { key: "date", label: "Wedding date", type: "date" },
  { key: "time", label: "Time", type: "text", max: 40, placeholder: "4:00 in the afternoon" },
  { key: "venue", label: "Venue", type: "text", max: 90, placeholder: "The Garden House, Sonoma" },
  { key: "message", label: "Message to guests", type: "textarea", max: 400 },
  { key: "rsvp", label: "RSVP contact", type: "text", max: 90, placeholder: "rsvp@example.com" },
  { key: "hashtag", label: "Hashtag (optional)", type: "text", max: 40, placeholder: "#AmeliaAndNoah" },
  { key: "photos", label: "Photos", type: "images", max: 6, captions: true },
];

const reasonsFields: FieldDef[] = [
  { key: "title", label: "Title", type: "text", max: 60 },
  { key: "intro", label: "Intro", type: "textarea", max: 220 },
  { key: "reasons", label: "Reasons", type: "list", itemLabel: "Reason", max: 12 },
  { key: "closing", label: "Closing message", type: "textarea", max: 320 },
  { key: "from", label: "From", type: "text", max: 40 },
];

const celebrationFields: FieldDef[] = [
  { key: "headline", label: "Headline", type: "text", max: 70 },
  { key: "subtitle", label: "Subtitle", type: "text", max: 120 },
  { key: "date", label: "Event date (optional)", type: "date", help: "Adds a live countdown." },
  { key: "message", label: "Message", type: "textarea", max: 450 },
  { key: "from", label: "From", type: "text", max: 40 },
  { key: "photos", label: "Photos", type: "images", max: 6, captions: true },
];

const BASE_TEMPLATES: TemplateDef[] = [
  {
    slug: "birthday-confetti",
    name: "Birthday Confetti",
    occasion: "birthday",
    description:
      "Balloons, an age reveal, a photo carousel and a cake you can blow out. The full birthday party in one link.",
    emoji: "🎂",
    gradient: ["#D7263D", "#FF8FA3"],
    accent: "#D7263D",
    fields: birthdayFields,
    defaultContent: {
      name: "Sophie",
      age: "27",
      message:
        "Another year of you being the brightest part of my world. I hope today feels as special as you make every ordinary day feel.",
      wish: "Happy birthday, my favourite person. Here's to more late-night talks, terrible dance moves and a year that finally deserves you.",
      from: "Alex",
      photos: [],
    },
    Component: BirthdayConfetti,
  },
  {
    slug: "birthday-balloons",
    name: "Balloon Countdown",
    occasion: "birthday",
    description: "A soft strawberry-pink birthday page with floating balloons, a photo reel and a candle-blowing moment.",
    emoji: "🎈",
    gradient: ["#A4122A", "#FFC9D3"],
    accent: "#A4122A",
    fields: birthdayFields,
    defaultContent: {
      name: "Dad",
      age: "",
      message:
        "You taught me how to ride a bike, how to laugh at myself, and how to make the best cup of tea in the world. Happy birthday, old man.",
      wish: "Thank you for being the calm in every storm. We love you more than words, and we're so glad you were born.",
      from: "The kids",
      photos: [],
    },
    Component: BirthdayConfetti,
  },
  {
    slug: "birthday-midnight",
    name: "Midnight Surprise",
    occasion: "birthday",
    description: "A confetti-drenched midnight countdown page for the friend who deserves a whole celebration.",
    emoji: "🎊",
    gradient: ["#E2455C", "#FFD9E0"],
    accent: "#B01E33",
    fields: celebrationFields,
    defaultContent: {
      headline: "Happy Birthday, Nina!",
      subtitle: "The clock struck twelve and the confetti hasn't stopped falling since.",
      date: "",
      message:
        "Every year I think: this is the year Nina can't possibly get more wonderful. And every year you prove me wrong. Have the loudest, brightest, most ridiculous birthday.",
      from: "Your favourite people",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "anniversary-timeline",
    name: "Anniversary Timeline",
    occasion: "anniversary",
    description:
      "A living counter of your years together, a scroll-through timeline of memories and a letter at the end.",
    emoji: "❤️",
    gradient: ["#B01E33", "#FFA6B5"],
    accent: "#9D174D",
    fields: anniversaryFields,
    defaultContent: {
      names: "Maya & Sam",
      since: "2018-06-14",
      headline: "Six years of us",
      milestones: [
        "14 Jun 2018 — The night we met and talked until the café closed",
        "02 Sep 2018 — Our first road trip, one wrong turn, zero regrets",
        "21 Dec 2019 — The tiny flat with the terrible heater",
        "14 Jun 2022 — You said yes on the beach at sunset",
        "14 Jun 2024 — Still choosing each other, every single day",
      ],
      letter:
        "Six years ago I had no idea that a borrowed pen and a bad joke would turn into a whole life. Thank you for the quiet mornings, the loud kitchens, and for being the person I want to tell everything to. Here's to the next six, and the six after that.",
      from: "Sam",
      photos: [],
    },
    Component: AnniversaryTimeline,
  },
  {
    slug: "anniversary-letter",
    name: "A Sealed Letter",
    occasion: "anniversary",
    description: "A wax-sealed envelope that opens into a typed love letter, with floating hearts and photos.",
    emoji: "💌",
    gradient: ["#C33B52", "#FFB7C5"],
    accent: "#C33B52",
    fields: letterFields,
    defaultContent: {
      to: "My love",
      letter:
        "I still get butterflies when your name lights up my phone. I still steal the blanket. I still think you're the most interesting person in any room.\n\nThank you for another year of choosing us — even on the days when us was hard work. I'd do it all again, and I'd pick you first every time.",
      from: "Your person",
      question: "",
      photos: [],
    },
    Component: LoveLetter,
  },
  {
    slug: "anniversary-reasons",
    name: "Reasons I'd Marry You Again",
    occasion: "anniversary",
    description: "Twelve flip cards, each hiding a reason. A gentle, playful way to say 'still you, always you'.",
    emoji: "💗",
    gradient: ["#9D174D", "#FFC1CF"],
    accent: "#E2455C",
    fields: reasonsFields,
    defaultContent: {
      title: "Reasons I'd marry you again",
      intro: "One for every year, plus a few for luck. Tap a card to turn it over.",
      reasons: [
        "You make ordinary Tuesdays feel like a small celebration",
        "The way you laugh at your own jokes before you finish them",
        "How you always know when I need tea and silence",
        "You never let me walk into a room alone",
        "Your terrible, wonderful singing in the car",
        "The way you look after the people you love",
        "You remember the small things I mention once",
        "How safe the world feels when you're holding my hand",
        "Your endless patience with my 11pm ideas",
        "The way you say my name when you're proud of me",
      ],
      closing: "Ten down, a lifetime of reasons to go. I'd choose you again in every version of this life.",
      from: "Always yours",
    },
    Component: ReasonsCards,
  },
  {
    slug: "wedding-invitation",
    name: "Wedding Invitation",
    occasion: "wedding",
    description:
      "An elegant, serif invitation with a live countdown, the details, a photo strip and your RSVP line.",
    emoji: "💍",
    gradient: ["#D7263D", "#FF8FA3"],
    accent: "#D7263D",
    fields: weddingFields,
    defaultContent: {
      couple: "Amelia & Noah",
      date: "2026-09-19",
      time: "4:00 in the afternoon",
      venue: "The Garden House, Sonoma",
      message:
        "We can't wait to celebrate with the people who made us who we are. Bring your dancing shoes, your appetite, and your very best wishes.",
      rsvp: "rsvp@ameliaandnoah.com",
      hashtag: "#AmeliaAndNoah",
      photos: [],
    },
    Component: WeddingInvite,
  },
  {
    slug: "save-the-date",
    name: "Save the Date",
    occasion: "wedding",
    description: "A short, beautiful save-the-date page with a countdown and the story so far.",
    emoji: "📅",
    gradient: ["#A4122A", "#FFC9D3"],
    accent: "#A4122A",
    fields: weddingFields,
    defaultContent: {
      couple: "Priya & Theo",
      date: "2027-05-08",
      time: "Late afternoon",
      venue: "Villa Lucia, Lake Como",
      message:
        "Two flights, one very delayed train and a shared umbrella later — we're getting married. Keep the date free; we'll send the details soon.",
      rsvp: "priyaandtheo@example.com",
      hashtag: "#PriyaAndTheo",
      photos: [],
    },
    Component: WeddingInvite,
  },
  {
    slug: "valentine-love-letter",
    name: "Valentine Love Letter",
    occasion: "valentine",
    description: "A sealed envelope, a typed-out letter and hearts drifting up the screen. Simple and devastating.",
    emoji: "💘",
    gradient: ["#E2455C", "#FFD9E0"],
    accent: "#B01E33",
    fields: letterFields,
    defaultContent: {
      to: "Emma",
      letter:
        "I've rewritten this four times because nothing felt big enough. So here is the plain truth: you are my favourite part of every day.\n\nThank you for the way you listen, the way you forgive, and the way you make me want to be better without ever asking me to change. Happy Valentine's Day, my love.",
      from: "James",
      question: "",
      photos: [],
    },
    Component: LoveLetter,
  },
  {
    slug: "valentine-be-mine",
    name: "Will You Be My Valentine?",
    occasion: "valentine",
    description: "The classic question, with a 'No' button that simply refuses to be caught. Ends in confetti.",
    emoji: "🌹",
    gradient: ["#B01E33", "#FFA6B5"],
    accent: "#9D174D",
    fields: letterFields,
    defaultContent: {
      to: "Charlie",
      letter:
        "There's a version of this letter where I play it cool. This isn't that letter.\n\nI like you. I like the way you text in full sentences. I like that you always order the thing I almost ordered. I like that my ordinary days are better when you're in them.\n\nSo — one question.",
      from: "Riley",
      question: "Will you be my Valentine?",
      photos: [],
    },
    Component: LoveLetter,
  },
  {
    slug: "valentine-reasons",
    name: "Ten Reasons You're My Person",
    occasion: "valentine",
    description: "A wall of little love notes that flip open one by one. Perfect for the 'I'm not good with words' crowd.",
    emoji: "💝",
    gradient: ["#C33B52", "#FFB7C5"],
    accent: "#C33B52",
    fields: reasonsFields,
    defaultContent: {
      title: "Ten reasons you're my person",
      intro: "I could do a hundred. Ten felt like a reasonable place to start.",
      reasons: [
        "You laugh with your whole face",
        "You make even the queue at the airport fun",
        "You always share your chips, even the good ones",
        "You ask how I am and actually wait for the answer",
        "Your playlists are chaotic and perfect",
        "You are kind when nobody is watching",
        "You let me be dramatic for exactly four minutes",
        "You remember our tiny anniversaries",
        "You give the world's best hugs",
        "You chose me back",
      ],
      closing: "That's ten. Catch me tomorrow for the next ten.",
      from: "Yours",
    },
    Component: ReasonsCards,
  },
  {
    slug: "graduation-pride",
    name: "Graduation Pride",
    occasion: "graduation",
    description: "A crimson-and-confetti page for the cap toss moment, with photos and a message from the family.",
    emoji: "🎓",
    gradient: ["#9D174D", "#FFC1CF"],
    accent: "#E2455C",
    fields: celebrationFields,
    defaultContent: {
      headline: "You did it, Jordan!",
      subtitle: "Late nights, long essays, and one very stubborn dissertation — all worth it.",
      date: "",
      message:
        "We watched you start this degree nervous and finished watching you walk across that stage like you owned it. We are so proud of the person you've become, not just the letters after your name.",
      from: "Mum, Dad & Maya",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "graduation-years",
    name: "The Best Four Years",
    occasion: "graduation",
    description: "A polaroid scrapbook of university memories, ending with a note about what comes next.",
    emoji: "📚",
    gradient: ["#D7263D", "#FF8FA3"],
    accent: "#D7263D",
    fields: albumFields,
    defaultContent: {
      title: "The best four years",
      subtitle: "Freshers' week to final exams — every blurry photo in between.",
      photos: [],
      message:
        "Four years ago we didn't know each other's names. Now I can't imagine a life where I don't know yours. Whatever comes next, I'm in your corner.",
      from: "Your flatmates",
    },
    Component: PhotoMemories,
  },
  {
    slug: "christmas-snowfall",
    name: "Christmas Snowfall",
    occasion: "christmas",
    description: "Falling snow, warm lights and a keepsake message for the people you'd spend every Christmas with.",
    emoji: "🎄",
    gradient: ["#A4122A", "#FFC9D3"],
    accent: "#A4122A",
    fields: celebrationFields,
    defaultContent: {
      headline: "Merry Christmas, Mum & Dad",
      subtitle: "Snow outside, chaos inside, and the tree leaning exactly like it does every year.",
      date: "2026-12-25",
      message:
        "Thank you for the traditions, the terrible cracker jokes and the year-round welcome home. This little gift is a small thank you for a lifetime of them.",
      from: "Us, always",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "christmas-memories",
    name: "Christmas Through the Years",
    occasion: "christmas",
    description: "A festive flip through your Christmas photos — the matching pyjamas, the burnt turkey, all of it.",
    emoji: "🎁",
    gradient: ["#E2455C", "#FFD9E0"],
    accent: "#B01E33",
    fields: albumFields,
    defaultContent: {
      title: "Christmas through the years",
      subtitle: "Swipe through the pyjamas, the paper hats and the one year we nearly burnt the turkey.",
      photos: [],
      message:
        "Every year the tree gets a little lopsided and the house gets a little louder — and it's still my favourite place in the world.",
      from: "With all my love",
    },
    Component: PhotoMemories,
  },
  {
    slug: "new-year-fireworks",
    name: "New Year Fireworks",
    occasion: "new-year",
    description: "A countdown to midnight with fireworks, confetti and a letter for the year ahead.",
    emoji: "🎆",
    gradient: ["#B01E33", "#FFA6B5"],
    accent: "#9D174D",
    fields: celebrationFields,
    defaultContent: {
      headline: "Happy New Year",
      subtitle: "Same us, brand new year, and the fireworks are just getting started.",
      date: "2027-01-01",
      message:
        "If this year gives us even half of the adventures we're planning, it's going to be a good one. Thank you for being my favourite person to stay up until midnight with.",
      from: "Yours",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "new-year-letter",
    name: "New Year, Same Us",
    occasion: "new-year",
    description: "A reflective, rosy new year page — a letter looking back and a countdown to what's next.",
    emoji: "🥂",
    gradient: ["#C33B52", "#FFB7C5"],
    accent: "#C33B52",
    fields: celebrationFields,
    defaultContent: {
      headline: "New Year, same us",
      subtitle: "A little recap of our year before the clock resets.",
      date: "2027-01-01",
      message:
        "This year we moved flats, missed a flight, learned to make pasta from scratch and laughed more than the year before. That's a good year. Here's to the next one.",
      from: "Me",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "friendship-forever",
    name: "Friends Forever",
    occasion: "friendship",
    description: "A scrapbook for the friend who has seen it all — polaroids, captions and an inside-joke ending.",
    emoji: "🫶",
    gradient: ["#9D174D", "#FFC1CF"],
    accent: "#E2455C",
    fields: albumFields,
    defaultContent: {
      title: "The chaos crew",
      subtitle: "Twelve years, four cities, one group chat that never sleeps.",
      photos: [],
      message:
        "Distance, jobs, relationships, questionable haircuts — we survived all of it. Thanks for being the friend I never have to explain myself to.",
      from: "Your favourite menace",
    },
    Component: PhotoMemories,
  },
  {
    slug: "friendship-reasons",
    name: "Reasons You're My Person",
    occasion: "friendship",
    description: "Flip through the reasons your best friend is irreplaceable. Strangely effective at making people cry.",
    emoji: "🧡",
    gradient: ["#D7263D", "#FF8FA3"],
    accent: "#D7263D",
    fields: reasonsFields,
    defaultContent: {
      title: "Reasons you're my person",
      intro: "For the friend who answers the phone at 2am and never makes it weird.",
      reasons: [
        "You always know which story I'm about to tell",
        "You've seen me at my worst and stayed",
        "Your house always smells like something baking",
        "You give the honest answer, even when it's not the easy one",
        "You remember everyone's birthday",
        "You make new places feel less scary",
        "We can sit in silence and it's still fun",
        "You hype me up like it's your job",
      ],
      closing: "You're stuck with me. That's the whole message.",
      from: "Your person",
    },
    Component: ReasonsCards,
  },
  {
    slug: "thank-you-note",
    name: "A Thank You Note",
    occasion: "thank-you",
    description: "A sealed thank-you letter with a slow reveal. For the people who helped when it mattered.",
    emoji: "🌷",
    gradient: ["#A4122A", "#FFC9D3"],
    accent: "#A4122A",
    fields: letterFields,
    defaultContent: {
      to: "Aunt Rosa",
      letter:
        "I don't think you know how much those weeks meant to me. You fed me, you let me cry on your sofa, and you never once made me feel like a burden.\n\nI hope this little note goes some way to saying what a thank-you card never could: I'm so glad you're in my life.",
      from: "Your niece",
      question: "",
      photos: [],
    },
    Component: LoveLetter,
  },
  {
    slug: "thank-you-memories",
    name: "Thank You, Truly",
    occasion: "thank-you",
    description: "A warm gratitude page with hearts, photos and the words you've been meaning to say.",
    emoji: "🙏",
    gradient: ["#E2455C", "#FFD9E0"],
    accent: "#B01E33",
    fields: celebrationFields,
    defaultContent: {
      headline: "Thank you, truly",
      subtitle: "Some people make the world gentler just by being in it.",
      date: "",
      message:
        "You showed up when it would have been easier not to. You gave your time, your patience and your very good soup. I won't forget it — and I'm so grateful.",
      from: "With love",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "apology-letter",
    name: "I'm Sorry",
    occasion: "apology",
    description: "A quiet, honest apology letter that opens from an envelope. No jokes, just the words.",
    emoji: "🕊️",
    gradient: ["#B01E33", "#FFA6B5"],
    accent: "#9D174D",
    fields: letterFields,
    defaultContent: {
      to: "Sam",
      letter:
        "I've been sitting with this for a while, because I wanted to get it right.\n\nI'm sorry. Not the easy kind of sorry that means 'let's move on' — the kind that means I understand what I did and I understand why it hurt. You deserved better from me.\n\nI'm not asking you to be okay straight away. I'm asking for the chance to show up better, for as long as it takes.",
      from: "Me",
      question: "",
      photos: [],
    },
    Component: LoveLetter,
  },
  {
    slug: "mothers-day",
    name: "For Mum",
    occasion: "other",
    occasionLabel: "Mother's Day",
    description: "A card full of the reasons she's the best — flip cards, warm colours and a message that lands.",
    emoji: "🌹",
    gradient: ["#C33B52", "#FFB7C5"],
    accent: "#C33B52",
    fields: reasonsFields,
    defaultContent: {
      title: "Reasons you're the best mum",
      intro: "You've done everything from school runs to midnight advice. This is a very small thank you.",
      reasons: [
        "You always answer the phone",
        "You make the best roast potatoes in the world",
        "You tell the truth, gently",
        "You worry about me quietly and never make it my problem",
        "You find the good in people who don't deserve it",
        "You've never once given up on me",
        "Your hugs fix almost everything",
        "You taught me to be kind first",
      ],
      closing: "Happy Mother's Day. I hope you know how loved you are.",
      from: "Your favourite child (don't tell the others)",
    },
    Component: ReasonsCards,
  },
  {
    slug: "fathers-day",
    name: "For Dad",
    occasion: "other",
    occasionLabel: "Father's Day",
    description: "A confetti-filled Father's Day page — the sage advice, the dad jokes, and the photos.",
    emoji: "👔",
    gradient: ["#9D174D", "#FFC1CF"],
    accent: "#E2455C",
    fields: celebrationFields,
    defaultContent: {
      headline: "Happy Father's Day, Dad",
      subtitle: "For the man who taught me to fix a bike, a fuse and, usually, my own problems.",
      date: "",
      message:
        "You never made a big deal of it, but I saw you put everything down whenever I needed you. I learned how to be a good person by watching you be one. Thank you, for all of it.",
      from: "Your kid",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "baby-shower",
    name: "A Little One Is Coming",
    occasion: "other",
    occasionLabel: "Baby Shower",
    description: "A soft, cloud-like page to celebrate the bump, the nursery and the name debate.",
    emoji: "👶",
    gradient: ["#D7263D", "#FF8FA3"],
    accent: "#D7263D",
    fields: celebrationFields,
    defaultContent: {
      headline: "A little one is on the way",
      subtitle: "Tiny socks, big plans, and a family that already loves them.",
      date: "2026-11-14",
      message:
        "You're about to meet the smallest, loudest love of your life. We can't wait to spoil them, babysit them, and hand them back when they cry.",
      from: "With all our love",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "get-well-soon",
    name: "Get Well Soon",
    occasion: "other",
    occasionLabel: "Get Well Soon",
    description: "Hearts, warm words and a gentle reminder that the world is waiting for them to feel better.",
    emoji: "🌻",
    gradient: ["#A4122A", "#FFC9D3"],
    accent: "#A4122A",
    fields: celebrationFields,
    defaultContent: {
      headline: "Feel better soon, Grace",
      subtitle: "The world is a little quieter without you in it. Take your time.",
      date: "",
      message:
        "No pressure to reply, no pressure to be brave. Rest, drink the tea, rewatch the bad show. We'll be here with a chaotic visit and a very large cake the moment you're up for it.",
      from: "Your friends",
      photos: [],
    },
    Component: Celebration,
  },
  {
    slug: "proposal",
    name: "The Proposal",
    occasion: "other",
    occasionLabel: "Proposal",
    description: "An envelope, a letter, then one enormous question with a Yes button and a very elusive No.",
    emoji: "💍",
    gradient: ["#E2455C", "#FFD9E0"],
    accent: "#B01E33",
    fields: letterFields,
    defaultContent: {
      to: "Ali",
      letter:
        "Three years ago you sat next to me on a delayed train and offered me half a croissant. I've been trying to be that generous back ever since.\n\nI love our ordinary life — the shopping lists, the Sunday walks, the way you sing to the kettle. I want a thousand more years of it.\n\nSo, I have a question, and I'd like to ask it officially.",
      from: "Morgan",
      question: "Will you marry me?",
      photos: [],
    },
    Component: LoveLetter,
  },
  {
    slug: "congratulations",
    name: "Congratulations!",
    occasion: "other",
    occasionLabel: "Congratulations",
    description: "A big, celebratory page for the new job, the big move or the dream finally coming true.",
    emoji: "🎉",
    gradient: ["#B01E33", "#FFA6B5"],
    accent: "#9D174D",
    fields: celebrationFields,
    defaultContent: {
      headline: "Congratulations, Alex!",
      subtitle: "The offer is in. The champagne is out. We always knew it.",
      date: "",
      message:
        "You worked for this in the quiet hours, after the day job and before the alarm. Nobody saw the grind — but everybody's about to see the shine. So, so proud of you.",
      from: "Everyone who loves you",
      photos: [],
    },
    Component: Celebration,
  },
];

/** Celebration templates share one component and differ by these content keys. */
const CELEBRATION_OPTIONS: Record<string, { effect: string; emoji: string; theme: string }> = {
  "birthday-midnight": { effect: "confetti", emoji: "🎊", theme: "warm" },
  "graduation-pride": { effect: "confetti", emoji: "🎓", theme: "violet" },
  "christmas-snowfall": { effect: "snow", emoji: "🎄", theme: "snow" },
  "new-year-fireworks": { effect: "fireworks", emoji: "🎆", theme: "gold" },
  "new-year-letter": { effect: "confetti", emoji: "🥂", theme: "gold" },
  "thank-you-memories": { effect: "hearts", emoji: "🙏", theme: "gold" },
  "fathers-day": { effect: "confetti", emoji: "👔", theme: "snow" },
  "baby-shower": { effect: "hearts", emoji: "👶", theme: "violet" },
  "get-well-soon": { effect: "hearts", emoji: "🌻", theme: "gold" },
  congratulations: { effect: "confetti", emoji: "🎉", theme: "warm" },
};

export const TEMPLATES: TemplateDef[] = BASE_TEMPLATES.map((template) => {
  const options = CELEBRATION_OPTIONS[template.slug];
  if (!options) return template;
  return {
    ...template,
    defaultContent: { ...template.defaultContent, ...options },
  };
});

/** Serializable template data — safe to pass from server components to client components. */
export const TEMPLATE_SUMMARIES: TemplateSummary[] = TEMPLATES.map(
  ({ fields: _fields, defaultContent: _defaultContent, Component: _Component, ...summary }) => summary,
);

export function getTemplate(slug: string): TemplateDef | undefined {
  return TEMPLATES.find((template) => template.slug === slug);
}

export function getFeaturedTemplates(count = 6): TemplateSummary[] {
  const featuredSlugs = [
    "birthday-confetti",
    "anniversary-timeline",
    "valentine-love-letter",
    "wedding-invitation",
    "graduation-pride",
    "christmas-snowfall",
  ];
  return featuredSlugs
    .map((slug) => TEMPLATE_SUMMARIES.find((template) => template.slug === slug))
    .filter((template): template is TemplateSummary => Boolean(template))
    .slice(0, count);
}

export function templateOccasionLabel(template: TemplateSummary) {
  return template.occasionLabel ?? OCCASION_LABELS[template.occasion];
}

export { FILTER_OCCASIONS } from "./occasions";

export function countByOccasion(occasion: Occasion) {
  return TEMPLATES.filter((template) => template.occasion === occasion).length;
}
