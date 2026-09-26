import { useEffect, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

const IMG = {
  hero: "https://images.pexels.com/photos/17928232/pexels-photo-17928232.jpeg?cs=srgb&dl=pexels-pritam-sengupta-685216574-17928232.jpg&fm=jpg",
  plantation: "https://images.pexels.com/photos/36906757/pexels-photo-36906757.jpeg?cs=srgb&dl=pexels-mohit-gupta-489013576-36906757.jpg&fm=jpg",
  leaves: "https://images.pexels.com/photos/16886315/pexels-photo-16886315.jpeg?cs=srgb&dl=pexels-simlibas-16886315.jpg&fm=jpg",
  ritual: "https://images.pexels.com/photos/37187551/pexels-photo-37187551.jpeg?cs=srgb&dl=pexels-jahratreza-37187551.jpg&fm=jpg"
};

const ingredients = [
  ["Camellia sinensis", "Caffeine · L-theanine · theaflavins"],
  ["Rosemary", "Rosmarinic acid · carnosic acid · aroma"],
  ["Orange peel", "Citrus oils · flavonoids · phenolics"],
  ["Sweet lime", "Fresh citrus volatiles · organic acids"],
  ["Roselle", "Organic acids · anthocyanins"],
  ["Amla", "Ascorbic acid · gallic & ellagic phenolics"]
];

function Scene({ image, eyebrow, title, text, align = "left", className = "" }) {
  return (
    <section className={`scene ${className}`} data-scene>
      <div className="scene__image" style={{ backgroundImage: `url("${image}")` }} />
      <div className="scene__veil" />
      <div className="scene__mist scene__mist--one" />
      <div className="scene__mist scene__mist--two" />
      <div className="scene__content" data-reveal data-align={align}>
        <span className="eyebrow">{eyebrow}</span>
        <h2 data-title>{title}</h2>
        <p>{text}</p>
      </div>
      <span className="scene__index">0{className === "scene--leaf" ? "2" : className === "scene--detail" ? "3" : "4"}</span>
    </section>
  );
}

export default function App() {
  const root = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false, lerp: 0.075, smoothWheel: true });
    lenisRef.current = lenis;

    const raf = (time) => {
      lenis.raf(time);
      ScrollTrigger.update();
      requestAnimationFrame(raf);
    };
    const frame = requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    const anchors = [...document.querySelectorAll('a[href^="#"]')];
    anchors.forEach((anchor) => {
      anchor.addEventListener("click", (event) => {
        const id = anchor.getAttribute("href");
        const target = document.querySelector(id);
        if (!target) return;
        event.preventDefault();
        lenis.scrollTo(target, { offset: -24, duration: 1.25 });
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      anchors.forEach((anchor) => {
        anchor.replaceWith(anchor.cloneNode(true));
      });
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set("[data-reveal]", { opacity: 0, y: 36 });
      gsap.to("[data-reveal]", {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: "[data-reveal]",
          start: "top 82%",
          once: true
        }
      });

      document.querySelectorAll("[data-scene]").forEach((scene) => {
        const image = scene.querySelector(".scene__image");
        const title = scene.querySelector("[data-title]");
        const mistOne = scene.querySelector(".scene__mist--one");
        const mistTwo = scene.querySelector(".scene__mist--two");

        gsap.to(image, {
          scale: 1.16,
          yPercent: 5,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.fromTo(title, { y: 36, letterSpacing: "0.01em" }, {
          y: -24,
          letterSpacing: "-0.025em",
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to(mistOne, {
          xPercent: 18,
          yPercent: -8,
          scaleX: 1.08,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });

        gsap.to(mistTwo, {
          xPercent: -14,
          yPercent: 6,
          scaleX: 0.92,
          ease: "none",
          scrollTrigger: {
            trigger: scene,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });

      gsap.from(".hero__title-line", {
        yPercent: 110,
        duration: 1.15,
        stagger: 0.12,
        ease: "power4.out",
        delay: 0.18
      });
      gsap.from(".hero__intro > *", {
        opacity: 0,
        y: 22,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.55
      });
      gsap.to(".hero__image", {
        scale: 1.09,
        xPercent: 1.5,
        yPercent: -1.5,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
      gsap.to(".hero__sun", {
        xPercent: -10,
        yPercent: 6,
        scale: 1.15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.utils.toArray("[data-card]").forEach((card) => {
        gsap.from(card, {
          y: 55,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            once: true
          }
        });
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, []);

  const smoothTo = (selector) => {
    const target = document.querySelector(selector);
    if (target && lenisRef.current) lenisRef.current.scrollTo(target, { offset: -24, duration: 1.2 });
  };

  return (
    <div ref={root} className="site-shell">
      <header className="nav">
        <a className="nav__logo" href="#top">VKOLT</a>
        <nav>
          <a href="#blend">The Blend</a>
          <a href="#science">Science</a>
          <a href="#reserve">Reserve</a>
          <a href="#organic">Organic</a>
          <a href="#enquire">Enquire</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero__image" style={{ backgroundImage: `url("${IMG.hero}")` }} />
          <div className="hero__overlay" />
          <div className="hero__sun" />
          <div className="hero__content">
            <div className="hero__intro">
              <span className="eyebrow">VKOLT · Patented Signature Tea</span>
              <div className="hero__title">
                <div className="hero__title-mask"><span className="hero__title-line">Rosemary.</span></div>
                <div className="hero__title-mask"><span className="hero__title-line">Black tea.</span></div>
                <div className="hero__title-mask"><span className="hero__title-line hero__title-line--accent">One identity.</span></div>
              </div>
              <p>A patented rosemary-led blend composed for a distinctive aromatic signature, layered depth and a premium tea ritual.</p>
              <div className="hero__actions">
                <button onClick={() => smoothTo("#blend")} className="button button--light">Discover the blend</button>
                <button onClick={() => smoothTo("#enquire")} className="button button--ghost">Hospitality enquiries</button>
              </div>
              <div className="hero__proof">
                <span>Patented formulation</span>
                <span>Rosemary-led</span>
                <span>Premium hospitality</span>
              </div>
            </div>
          </div>
          <div className="hero__scroll">Scroll to enter <span>↓</span></div>
        </section>

        <Scene
          image={IMG.plantation}
          eyebrow="The origin"
          title="A tea experience begins before the cup."
          text="Landscape, leaf, aroma, preparation and expectation all shape how a tea is experienced. VKOLT begins there — with the world around the leaf."
          className="scene--origin"
        />

        <section className="split-section" id="blend">
          <div className="split-section__copy" data-reveal>
            <span className="eyebrow">The signature blend</span>
            <h2>Not a collection of flavours. A recognisable profile.</h2>
            <p>The patented VKOLT formulation puts rosemary at the centre of a black-tea foundation, supported by citrus, roselle and amla. The intention is a clear aromatic identity with depth, lift and a memorable finish.</p>
            <div className="micro-copy">Patent · Formulation · Sensory identity</div>
          </div>
          <div className="ingredient-wall">
            {ingredients.map(([name, detail], index) => (
              <article key={name} data-card className="ingredient-card">
                <span>0{index + 1}</span>
                <h3>{name}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <Scene
          image={IMG.leaves}
          eyebrow="The botanical layer"
          title="Rosemary changes the conversation."
          text="Its aroma gives the blend a botanical point of view. The goal is not to hide the tea, but to make the first impression unmistakably VKOLT."
          className="scene--leaf"
        />

        <section className="science" id="science">
          <div className="science__head" data-reveal>
            <span className="eyebrow">Science, without hype</span>
            <h2>The chemistry is layered.</h2>
            <p>Tea contributes caffeine and L-theanine alongside its polyphenol system. Rosemary contributes compounds such as rosmarinic and carnosic acids plus volatile aroma compounds. Citrus, roselle and amla add their own organic acids, flavonoids, anthocyanins and phenolics.</p>
          </div>
          <div className="science__grid">
            <article data-card><span>01</span><h3>Attention</h3><p>Human tea research reports acute effects involving alertness and some attention measures, particularly around caffeine and L-theanine.</p></article>
            <article data-card><span>02</span><h3>Rosemary aroma</h3><p>Small human studies make rosemary aroma scientifically interesting, but they do not establish a clinical cognitive benefit from VKOLT.</p></article>
            <article data-card><span>03</span><h3>Own the evidence</h3><p>Our long-term goal is an analytical fingerprint of the finished blend and, later, properly designed human pilot research.</p></article>
          </div>
          <div className="science__links">
            <a href="https://pubmed.ncbi.nlm.nih.gov/40314930/" target="_blank" rel="noreferrer">Tea & cognition research ↗</a>
            <a href="https://pubmed.ncbi.nlm.nih.gov/23983963/" target="_blank" rel="noreferrer">Rosemary aroma research ↗</a>
          </div>
        </section>

        <Scene
          image={IMG.ritual}
          eyebrow="The ritual"
          title="From formulation to a moment worth remembering."
          text="Warm light, clear glass, rising steam. VKOLT is designed to feel at home where tea is part of the experience — in premium hospitality, gifting and considered private rituals."
          align="right"
          className="scene--ritual"
        />

        <section className="reserve" id="reserve">
          <div className="reserve__header" data-reveal>
            <span className="eyebrow">VKOLT Reserve</span>
            <h2>Rarity should be real.</h2>
            <p>Future reserve releases can explore exceptional cultivars, small harvests and traceable lots without diluting the patented signature blend.</p>
          </div>
          <div className="reserve__steps">
            {[
              ["01","Exceptional cultivar","Unusual plant genetics and provenance."],
              ["02","Micro-batch harvest","Controlled quantity with a named batch."],
              ["03","Documented provenance","Origin, processing and testing records."],
              ["04","Collector presentation","Designed for premium gifting and hospitality."]
            ].map(([n,t,d]) => (
              <div data-card key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </section>

        <section className="organic" id="organic">
          <div className="organic__copy" data-reveal>
            <span className="eyebrow">Organic by design</span>
            <h2>Earn the organic claim.</h2>
            <p>VKOLT is being developed around certified-organic raw materials, traceable sourcing and controlled handling. The objective is a legitimate organic certification pathway — not a marketing shortcut.</p>
            <a className="text-link" href="https://jaivikbharat.fssai.gov.in/consumer_guidance.php" target="_blank" rel="noreferrer">FSSAI / Jaivik Bharat guidance ↗</a>
          </div>
          <div className="organic__rail">
            <div data-card><span>01</span><h3>Source</h3><p>Certified-organic tea, rosemary and botanicals from approved suppliers.</p></div>
            <div data-card><span>02</span><h3>Control</h3><p>Segregation, records, traceability and controlled processing.</p></div>
            <div data-card><span>03</span><h3>Verify</h3><p>Testing and certification before certified-organic positioning.</p></div>
          </div>
        </section>

        <section className="closing" id="enquire">
          <div className="closing__inner" data-reveal>
            <span className="eyebrow">For discerning customers & hospitality</span>
            <h2>The signature belongs where detail matters.</h2>
            <p>For premium tea enquiries, hotel partnerships, distribution, gifting or strategic collaborations.</p>
            <a className="button button--dark" href="mailto:contact@vkolt.com">Start a conversation</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>© 2026 VKOLT EDGE PRIVATE LIMITED</span>
        <span>Patented Signature Tea · India</span>
      </footer>
    </div>
  );
}