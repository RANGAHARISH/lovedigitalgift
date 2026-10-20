import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    emoji: "🎂",
    name: "Josh B.",
    gift: "Anniversary Gift",
    quote:
      "I made this for my girlfriend's birthday and she literally cried happy tears. The template was so beautiful and easy to customize!",
  },
  {
    emoji: "💕",
    name: "Dylan S.",
    gift: "Valentine's Gift",
    quote:
      "Sent this to my wife on Valentine's Day. She said it was the most thoughtful gift she's ever received. Absolutely love this platform!",
  },
  {
    emoji: "🥂",
    name: "Keith W.",
    gift: "Anniversary Gift",
    quote:
      "The templates are stunning. I used it for my parents' anniversary and the whole family was amazed. Will definitely use again!",
  },
];

export function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-white to-[#FFF8FA] py-20 sm:py-28">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">loved by many</span>
          <h2 className="mt-4 text-[2.3rem] sm:text-[3.2rem]">Loved by Many</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            See what people are saying about their experience
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col rounded-[1.6rem] border border-brand/10 bg-white p-6 shadow-[0_2px_12px_rgba(43,26,32,0.05)] transition duration-300 hover:-translate-y-1 hover:border-brand/20 hover:shadow-soft"
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-0.5 text-brand">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-display text-3xl leading-none text-brand/20">&ldquo;</span>
              </div>
              <blockquote className="mt-3 flex-1 text-[14px] leading-[1.7] text-ink/75">
                {testimonial.quote}
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-brand/10 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-lg ring-1 ring-white">
                  {testimonial.emoji}
                </span>
                <div>
                  <p className="text-[13px] font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-[11px] text-muted">{testimonial.gift}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
