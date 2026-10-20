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
    <section className="bg-gradient-to-b from-white to-[#FFF8FB] py-20 sm:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand">loved by many</span>
          <h2 className="mt-4 text-4xl sm:text-5xl">Loved by Many</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
            See what people are saying about their experience
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="flex h-full flex-col rounded-3xl border border-white bg-white p-6 shadow-softer"
            >
              <div className="flex gap-0.5 text-brand">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink/80">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-brand/10 pt-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-soft text-lg">
                  {testimonial.emoji}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink">{testimonial.name}</p>
                  <p className="text-xs text-muted">{testimonial.gift}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
