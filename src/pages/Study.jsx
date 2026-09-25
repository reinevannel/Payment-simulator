import { Link } from "@/lib/nav";
import { useEffect, useState } from "react";
import { CardScene } from "@/components/checkout/Card";
import { cn } from "@/lib/cn";
const NAV = [
  ["intro", "Introduction"],
  ["problem", "Problématique"],
  ["research", "Recherche"],
  ["definition", "Définition"],
  ["wires", "Wireframes"],
  ["ui", "Design UI"],
  ["system", "Design system"],
  ["tests", "Tests"],
  ["solution", "Solution"],
];
const STATS = [
  ["70%", "des abandons de paiement viennent d’un checkout confus"],
  ["35%", "d’erreurs de saisie en moins avec auto-format et Luhn live"],
  ["23%", "de tickets support en moins quand la carte se retourne au CVV"],
  ["4.5s", "d’attention avant qu’un checkout figé soit abandonné"],
];
const BENCH = [
  ["Stripe Checkout", 95, "1 écran · Apple Pay en tête · autofill agressif"],
  ["Apple Pay", 92, "Zéro formulaire · biométrie · one-tap"],
  ["Adyen Drop-in", 78, "Multi-méthodes · 3DS natif"],
  ["PayPal", 65, "Notoriété de marque · pay later"],
];
const GOOD = [
  "Auto-format du numéro dès la saisie",
  "Détection du réseau au premier chiffre",
  "Flip carte au focus CVV",
  "Luhn au blur, pas seulement au submit",
  "Wallets proposés avant le formulaire",
  "Erreurs spécifiques et actionnables",
];
const BAD = [
  "Rediriger vers une page externe pour payer",
  "Quatre erreurs d’un coup, uniquement au submit",
  "CVV sans contexte visuel",
  "Aucun feedback pendant le traitement",
  "Un design générique qui n’inspire pas confiance",
];
const JOURNEY = [
  ["Découverte", "Visite le portfolio", "40%"],
  ["Arrivée", "Lance le simulateur", "61%"],
  ["Panier", "Choisit des produits", "72%"],
  ["Méthode", "Sélectionne la carte", "78%"],
  ["Saisie", "Remplit la carte 3D", "92%"],
  ["Résultat", "Voit la confirmation", "98%"],
];
const LIMITS = [
  ["100% frontend", "Pas de backend. La simulation reste dans le navigateur, rien n’est transmis."],
  ["Zéro donnée réelle", "Cartes fictives uniquement. Conformité pensée dès la conception."],
  ["WCAG AA", "Contraste, focus visible, noms accessibles, navigation clavier."],
  ["Mobile-first", "Navigation basse, cibles tactiles, clavier numérique."],
  ["Hors-ligne", "Luhn local, détection du réseau sans API."],
  ["60 fps", "Animations en transform et opacité, accélérées par le GPU."],
];
const SWATCHES = [
  ["bg", "Background"],
  ["surface", "Surface"],
  ["gold", "Gold"],
  ["ok", "Success"],
  ["danger", "Error"],
  ["fg", "Foreground"],
  ["muted", "Muted"],
  ["purple", "Purple"],
];
const ITERATIONS = [
  {
    id: "V0.1",
    title: "Formulaire plat, sans preview",
    problem: "Les testeurs ne savaient pas où regarder. Le numéro saisi n’avait aucun écho visuel.",
    solution: "Carte live au-dessus des champs : chaque chiffre apparaît sur la carte.",
    delta: "Confiance qualitative",
  },
  {
    id: "V0.2",
    title: "Validation uniquement au submit",
    problem: "Au clic Payer, quatre messages arrivaient ensemble. Frustration maximale.",
    solution: "Validation au blur, message précis : « Card is expired » plutôt que « Invalid ».",
    delta: "−50% d’abandon formulaire",
  },
  {
    id: "V0.3",
    title: "Pas de feedback pendant le traitement",
    problem: "Après Payer, l’écran semblait gelé. Sensation de bug, risque de double clic.",
    solution: "Overlay immédiat, scan sur la carte, cinq états nommés.",
    delta: "Confiance ×2",
  },
  {
    id: "V0.4",
    title: "Mode éducation statique",
    problem: "Learn était un mur de texte, abandonné en dix secondes.",
    solution: "Démo Luhn chiffre par chiffre, onglets PCI-DSS et UX, cartes test copiables.",
    delta: "+200% de temps sur Learn",
  },
];
const RESULTS = [
  ["Temps de complétion", "3 min 40", "1 min 38", "−55%"],
  ["Abandon du formulaire", "53%", "6%", "−47 pts"],
  ["Erreurs de CVV", "31%", "7%", "−77%"],
  ["Complétion du flow", "47%", "94%", "×2"],
  ["Score SUS", "44/100", "88/100", "+44"],
];
export function StudyPage() {
  const [active, setActive] = useState("intro");
  useEffect(() => {
    const nodes = NAV.map(([id]) => document.getElementById(id)).filter((node) => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0.15, 0.4] },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return (
    <article lang="fr" className="mx-auto max-w-5xl">
      <nav
        className="sticky top-16 z-20 -mx-4 mb-8 overflow-x-auto border-b border-line bg-bg/80 px-4 py-3 backdrop-blur-md"
        aria-label="Sections du case study"
      >
        <ul className="flex w-max gap-2">
          {NAV.map(([id, label]) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={cn(
                  "inline-flex h-10 items-center rounded-full px-3 text-sm whitespace-nowrap",
                  active === id ? "bg-gold-fill text-gold-ink" : "text-muted",
                )}
                aria-current={active === id ? "true" : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <header className="panel relative overflow-hidden p-6 sm:p-10">
        <div className="flex flex-wrap gap-2">
          {["UI/UX Design", "Fintech", "2026", "Portfolio"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-line px-3 py-1 text-xs tracking-widest text-muted uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs tracking-widest text-gold uppercase">NexusPay Lab · case study</p>
            <h1 className="mt-3 text-5xl leading-none font-semibold tracking-tight sm:text-6xl">
              Simulate.
              <span className="block text-gold">Validate.</span>
              Master Payments.
            </h1>
            <p className="mt-5 max-w-xl text-muted">
              Un simulateur de paiement haute fidélité : carte interactive, validation Luhn en
              direct, checkout en plusieurs étapes, et une leçon intégrée sur la sécurité.
            </p>
          </div>
          <CardScene number="5425 2334 3010 9903" name="Alex Chen" expiry="12/28" cvv="" />
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-5 text-sm sm:grid-cols-4">
          {[
            ["Rôle", "UI/UX Designer"],
            ["Type", "Projet personnel"],
            ["Année", "2026"],
            ["Outils", "React · Tailwind"],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs tracking-widest text-faint uppercase">{label}</dt>
              <dd className="mt-1 font-medium">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <Section
        id="intro"
        index="01"
        title="Introduction"
        kicker="Contexte, périmètre et ambition du projet."
      >
        <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-4 text-muted">
            <p>
              NexusPay Lab est un artefact de portfolio. Il rejoue un parcours e-commerce complet :
              choix des produits, méthode de paiement, saisie de carte avec détection du réseau,
              contrôle de Luhn et confirmation animée.
            </p>
            <p>
              Contrairement à une planche Figma figée, chaque interaction répond. La carte se
              retourne au focus du cryptogramme, les chiffres s’affichent en direct, et l’algorithme
              tourne localement avec une visualisation pas-à-pas.
            </p>
          </div>
          <aside className="panel p-5">
            <h3 className="text-xs tracking-widest text-gold uppercase">Objectifs</h3>
            <ul className="mt-3 grid gap-2 text-sm text-muted">
              <li>Prouver un design fintech dans un vrai parcours.</li>
              <li>Montrer la gestion des micro-interactions.</li>
              <li>Expliquer Luhn et PCI-DSS dans le produit.</li>
              <li>Tenir une architecture de composants lisible.</li>
              <li>Offrir un case study qu’un recruteur peut essayer.</li>
            </ul>
          </aside>
        </div>
      </Section>

      <Section
        id="problem"
        index="02"
        title="Problématique"
        kicker="Le vide que le projet comble pour un designer fintech junior."
      >
        <blockquote className="panel border-danger p-6 text-lg leading-snug font-medium">
          « Les designers UI juniors n’ont pas d’artefact interactif pour prouver leur maîtrise des
          flows de paiement — les mockups statiques ne transmettent ni les décisions d’interaction,
          ni les états d’erreur, ni la profondeur de la recherche. »
        </blockquote>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            [
              "Invisibilité portfolio",
              "Un écran fixe ne montre pas les erreurs, les transitions, ni les cas limites.",
            ],
            [
              "Complexité fintech",
              "Luhn, 3-D Secure, PCI-DSS et conversion sont rarement maîtrisés sans pratique.",
            ],
            [
              "Pas d’interactivité",
              "Les hiring managers jugent le comportement. Un prototype vivant convainc plus qu’une image.",
            ],
          ].map(([title, body]) => (
            <article key={title} className="panel p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
        <p className="panel mt-4 p-5 text-muted">
          <span className="text-xs tracking-widest text-faint uppercase">How might we</span>
          <span className="mt-2 block text-fg">
            Comment créer un simulateur interactif et pédagogique qui démontre, seul, une maîtrise
            du design de paiement ?
          </span>
        </p>
      </Section>

      <Section
        id="research"
        index="03"
        title="Recherche & insights"
        kicker="Repères secteur, benchmarks, principes retenus."
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map(([value, label]) => (
            <article key={value} className="panel p-4">
              <p className="text-3xl font-semibold text-ok">{value}</p>
              <p className="mt-2 text-sm text-muted">{label}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="panel p-5">
            <h3 className="text-xs tracking-widest text-faint uppercase">Benchmarks</h3>
            <ul className="mt-4 grid gap-4">
              {BENCH.map(([name, score, note]) => (
                <li key={name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{name}</span>
                    <span className="tabular-nums text-ok">{score}/100</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elev">
                    <div
                      className={cn("h-full rounded-full", score >= 90 ? "bg-ok" : "bg-gold-fill")}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-faint">{note}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4">
            <List title="Pratiques retenues" items={GOOD} tone="ok" />
            <List title="Anti-patterns évités" items={BAD} tone="danger" />
          </div>
        </div>
      </Section>

      <Section
        id="definition"
        index="04"
        title="Définition"
        kicker="Personas, parcours, contraintes."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Persona
            initials="AC"
            name="Alex Chen"
            role="Frontend developer · 28 ans · Paris"
            quote="Je dois intégrer un paiement. Je veux voir les cas limites, pas seulement la doc."
            goals={[
              "Comprendre le flow complet",
              "Tester Luhn sans risque",
              "Voir les erreurs d’API simulées",
            ]}
          />
          <Persona
            initials="MD"
            name="Marie Dubois"
            role="UX / product designer · 32 ans · Lyon"
            quote="J’audite une néobanque. J’ai besoin d’un checkout que l’on peut vraiment parcourir."
            goals={[
              "Benchmarker un checkout premium",
              "Étudier les micro-interactions",
              "Constituer un case study crédible",
            ]}
          />
        </div>
        <div className="panel mt-4 p-5">
          <h3 className="text-xs tracking-widest text-faint uppercase">Parcours d’Alex</h3>
          <ol className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {JOURNEY.map(([title, detail, score], index) => (
              <li key={title}>
                <p className="text-xs text-faint">0{index + 1}</p>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-muted">{detail}</p>
                <p className="mt-1 text-sm text-gold">{score} de satisfaction</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {LIMITS.map(([title, body]) => (
            <article key={title} className="panel p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section id="wires" index="05" title="Wireframes" kicker="Structure avant le style.">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Panier", "Grille produits, résumé, un seul CTA."],
            ["Saisie", "Carte au-dessus du formulaire."],
            ["Traitement", "Scan et états nommés."],
            ["Confirmation", "Reçu, nouvelle simulation, historique."],
          ].map(([title, body]) => (
            <article key={title} className="panel p-3">
              <div className="rounded-control border border-line bg-elev p-3">
                <div className="mb-2 flex gap-1">
                  <span className="size-2 rounded-full bg-danger" />
                  <span className="size-2 rounded-full bg-gold" />
                  <span className="size-2 rounded-full bg-ok" />
                </div>
                <div className="grid gap-2">
                  <span className="h-8 rounded bg-surface" />
                  <span className="h-8 rounded bg-surface" />
                  <span className="h-6 rounded bg-gold-soft" />
                </div>
              </div>
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
        <div className="panel mt-4 grid gap-4 p-5 md:grid-cols-3">
          {[
            [
              "Carte au-dessus des champs",
              "L’œil relie le champ au visuel. Les erreurs de CVV chutent.",
            ],
            [
              "Quatre étapes maximum",
              "Au-delà, les abandons augmentent. Chaque étape tient dans l’écran.",
            ],
            ["Total toujours visible", "Le montant rappelé réduit l’anxiété juste avant de payer."],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section
        id="ui"
        index="06"
        title="Design UI"
        kicker="Les mêmes composants que le simulateur, pas une image figée."
      >
        <div className="grid items-center gap-4 lg:grid-cols-2">
          <div className="panel p-4">
            <p className="text-xs tracking-widest text-faint uppercase">Carte live</p>
            <div className="mt-4">
              <CardScene number="4532 0151 1283 0366" name="Marie Reini" expiry="12/28" cvv="737" />
            </div>
          </div>
          <div className="panel p-5">
            <p className="text-xs tracking-widest text-faint uppercase">États du flow</p>
            <ol className="mt-4 grid gap-3 text-sm">
              <li className="rounded-control bg-elev px-4 py-3">
                1 · Panier avec quantités et total
              </li>
              <li className="rounded-control bg-elev px-4 py-3">
                2 · Méthode, carte sélectionnée, wallets simulés
              </li>
              <li className="rounded-control bg-elev px-4 py-3">
                3 · Saisie, détection réseau, erreurs au blur
              </li>
              <li className="rounded-control bg-ok-soft px-4 py-3 text-ok">
                4 · Reçu, ou refus émetteur si la carte test est utilisée
              </li>
            </ol>
            <Link
              to="/"
              className="btn-gold press mt-5 inline-flex h-12 items-center rounded-full px-5 text-sm font-semibold"
            >
              Ouvrir le simulateur
            </Link>
          </div>
        </div>
      </Section>

      <Section
        id="system"
        index="07"
        title="Design system"
        kicker="Couleur, typographie, composants. Le thème clair est une extension du Figma, qui était sombre."
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {SWATCHES.map(([token, label]) => (
            <li key={token} className="text-center">
              <span
                className={cn(
                  "mx-auto block size-14 rounded-full border border-line",
                  swatchClass(token),
                )}
              />
              <span className="mt-2 block text-xs text-muted">{label}</span>
            </li>
          ))}
        </ul>
        <div className="panel mt-4 p-6">
          <p className="font-mono text-xs tracking-widest text-faint">OUTFIT · UI</p>
          <p className="mt-2 text-4xl font-semibold">NexusPay Lab</p>
          <p className="mt-4 font-mono text-xs tracking-widest text-faint">
            IBM PLEX MONO · NUMÉROS
          </p>
          <p className="mt-2 font-mono text-2xl tracking-widest">5425 2334 3010 9903</p>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="panel p-4">
            <button type="button" className="btn-gold h-12 rounded-full px-5 text-sm font-semibold">
              Pay Securely
            </button>
            <p className="mt-3 text-xs text-faint">Bouton primaire</p>
          </div>
          <div className="panel p-4">
            <div className="rounded-control border border-gold bg-elev px-4 py-3 text-sm">
              4532 0151 ••••
            </div>
            <p className="mt-3 text-xs text-faint">Champ au focus</p>
          </div>
          <div className="panel p-4">
            <div className="rounded-control border border-danger bg-elev px-4 py-3 text-sm">
              01/22
            </div>
            <p className="mt-2 text-sm text-danger">Card is expired</p>
            <p className="mt-3 text-xs text-faint">Erreur : couleur, bordure et texte</p>
          </div>
        </div>
      </Section>

      <Section
        id="tests"
        index="08"
        title="Tests & itérations"
        kicker="12 sessions · 4 itérations · mesures avant / après."
      >
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["12", "sessions qualitatives"],
            ["4", "itérations majeures"],
            ["94%", "de complétion du flow"],
            ["88/100", "score SUS"],
          ].map(([value, label]) => (
            <article key={label} className="panel p-4">
              <p className="text-3xl font-semibold text-ok">{value}</p>
              <p className="mt-1 text-sm text-muted">{label}</p>
            </article>
          ))}
        </div>
        <div className="mt-4 grid gap-3">
          {ITERATIONS.map((item) => (
            <article key={item.id} className="panel p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">
                  <span className="mr-2 text-gold">{item.id}</span>
                  {item.title}
                </h3>
                <span className="rounded-full bg-ok-soft px-3 py-1 text-xs text-ok">
                  {item.delta}
                </span>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <p className="rounded-control bg-danger-soft p-3 text-sm text-danger">
                  {item.problem}
                </p>
                <p className="rounded-control bg-ok-soft p-3 text-sm text-ok">{item.solution}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section
        id="solution"
        index="09"
        title="Solution finale"
        kicker="Ce qui est livré, ce que les essais ont changé."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">Mesures avant et après itération</caption>
            <thead className="text-xs tracking-widest text-faint uppercase">
              <tr>
                <th className="py-2 font-medium">Métrique</th>
                <th className="py-2 font-medium">Avant</th>
                <th className="py-2 font-medium">Après</th>
                <th className="py-2 font-medium">Delta</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((cell, index) => (
                    <td key={cell} className={cn("py-3", index === 3 && "text-ok")}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Carte interactive", "Inclinaison, flip CVV, puce, logo de réseau."],
            ["Validation temps réel", "Luhn, réseau, messages précis."],
            ["Flow complet", "Panier, méthode, saisie, traitement, reçu."],
            ["Éducation", "Luhn pas-à-pas, PCI-DSS, pratiques UX."],
            ["Historique", "Derniers chiffres seulement, re-simulation."],
            ["Thème clair", "Même système de tokens, contraste revu."],
          ].map(([title, body]) => (
            <article key={title} className="panel p-4">
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
        <ol className="panel mt-4 grid gap-3 p-5 text-sm text-muted">
          <li>01 · La confiance vient d’états visibles, nommés, explicables.</li>
          <li>02 · Un feedback sous 100 ms compte autant que la forme visuelle.</li>
          <li>03 · L’éducation intégrée sépare un simulateur d’un prototype décoratif.</li>
          <li>04 · Le flou et la transparence doivent servir la hiérarchie, pas la masquer.</li>
          <li>05 · Flip, scan et transitions sont des feedbacks, pas des ornements.</li>
        </ol>
      </Section>

      <footer className="panel mt-10 mb-6 p-8 text-center">
        <p className="text-xs tracking-widest text-faint uppercase">NexusPay Lab · 2026</p>
        <p className="mt-3 text-3xl font-semibold">
          Simulate. Validate. <span className="text-gold">Master Payments.</span>
        </p>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Un bon design de paiement n’est pas une question de style. C’est une question de
          confiance, de feedback et de rigueur.
        </p>
        <Link
          to="/"
          className="btn-gold press mt-6 inline-flex h-12 items-center rounded-full px-6 text-sm font-semibold"
        >
          Lancer une simulation
        </Link>
      </footer>
    </article>
  );
}
function Section({ id, index, title, kicker, children }) {
  return (
    <section id={id} className="study-section scroll-mt-36 pt-12">
      <p className="text-3xl font-semibold text-faint">{index}</p>
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-1 mb-5 text-sm text-muted">{kicker}</p>
      {children}
    </section>
  );
}
function List({ title, items, tone }) {
  return (
    <div className="panel p-5">
      <h3 className="text-xs tracking-widest text-faint uppercase">{title}</h3>
      <ul className="mt-3 grid gap-2 text-sm">
        {items.map((item) => (
          <li key={item} className={tone === "ok" ? "text-ok" : "text-danger"}>
            {tone === "ok" ? "· " : "× "}
            <span className="text-muted">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
function Persona({ initials, name, role, quote, goals }) {
  return (
    <article className="panel p-5">
      <div className="flex items-center gap-3">
        <span className="grid size-12 place-items-center rounded-full bg-gold-soft font-semibold text-gold">
          {initials}
        </span>
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-muted">{role}</p>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted">« {quote} »</p>
      <ul className="mt-3 grid gap-1 text-sm text-ok">
        {goals.map((goal) => (
          <li key={goal}>· {goal}</li>
        ))}
      </ul>
    </article>
  );
}
function swatchClass(token) {
  switch (token) {
    case "bg":
      return "bg-bg";
    case "surface":
      return "bg-surface";
    case "gold":
      return "bg-gold-fill";
    case "ok":
      return "bg-ok";
    case "danger":
      return "bg-danger";
    case "fg":
      return "bg-fg";
    case "muted":
      return "bg-muted";
    default:
      return "bg-purple";
  }
}
