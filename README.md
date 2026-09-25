# 🌐 NexusPay Lab

### 💳 Simulateur de paiement — React (JavaScript) • Vite • Tailwind • Zustand

Projet front-end développé dans le cadre du parcours **Codecademy Front-End Developer**.

**NexusPay Lab** est un simulateur de paiement moderne, minimaliste et pédagogique, conçu pour illustrer :

- une architecture React propre ;
- une UX/UI soignée ;
- une logique métier claire et accessible.

Aucune base de données. Aucun compte. Pas de TypeScript.

Le projet utilise uniquement quatre librairies : **React**, **Vite**, **Tailwind CSS** et **Zustand** pour l’état global.  
Les icônes proviennent de **lucide-react**.

---

## ✨ Aperçu

Le simulateur propose :

- 🎨 Une interface **simple à appréhender**, pensée pour l’apprentissage
- 🧩 Une structure **intermédiaire premium**, propre et modulaire
- 🌗 Une expérience **UX/UI moderne**, thème sombre / clair
- 💼 Une logique front-end complète : panier, carte 3D, validation, feedback visuel
- 🔒 Un environnement **100 % local**, sans serveur ni backend

---

## 🧩 Stack & outils

- ⚛️ **React (JavaScript)** — idéal pour progresser sans complexité excessive
- ⚡ **Vite** — développement rapide et fluide
- 🎨 **Tailwind CSS** — design propre, responsive, thème clair / sombre
- 📦 **Zustand** — état global simple et efficace
- 🔗 **Lucide-react** — icônes modernes
- 🌍 **GitHub Pages** — hébergement de la démo en ligne

---

## 📁 Structure du projet

| Dossier | Rôle |
| --- | --- |
| `src/pages` | Pages : **Simulate**, **History**, **Learn**, **Study** |
| `src/components/checkout` | Panier, carte 3D, formulaire |
| `src/components/layout` | Barre du haut, logo, structure |
| `src/lib` | État global (Zustand), algorithme de Luhn, navigation |
| `src/styles.css` | Thèmes clair / sombre |

---

## 🗂️ Carte des dossiers

```text
src/
  main.jsx                 # démarre React
  App.jsx                  # choisit la page
  styles.css               # thème sombre et clair

  pages/
    Simulate.jsx           # paiement
    History.jsx            # historique local
    Learn.jsx              # leçon Luhn, PCI, UX
    Study.jsx              # case study

  components/
    layout/
      Shell.jsx            # navigation
      Logo.jsx
    checkout/
      Cart.jsx
      Method.jsx
      Details.jsx          # formulaire
      Card.jsx             # carte 3D
      Processing.jsx
      Receipt.jsx
      Steps.jsx

  lib/
    store.js               # Zustand
    nav.jsx                # liens entre pages, sans routeur externe
    payments/
      luhn.js
      cards.js
      catalog.js           # prix des produits
```

---

## 🔄 Parcours d’un paiement

- 🛒 **items** dans le store représente le panier.
- 💳 **draft** est la carte : chaque frappe reformate le numéro.
- ❗ **validateCard** dans `cards.js` produit les erreurs.
- ⚙️ **startProcessing** lance l’animation ; **finalize** écrit le reçu.
- 🔐 L’historique ne garde que les **4 derniers chiffres** ; le CVV est **jeté**.

---

## 🔢 Luhn (résumé)

Depuis la droite :

- un chiffre sur deux est **doublé** ;
- si le double dépasse **9**, on retire **9** ;
- la somme totale doit être divisible par **10**.

---

## 🛠️ Où modifier

| Quoi | Où |
| --- | --- |
| 💰 Un prix | `src/lib/payments/catalog.js` |
| ❗ Un message d’erreur | `validateCard` dans `cards.js` |
| 💳 Une carte de test | `TEST_CARDS` dans `cards.js` |
| 📘 Le case study | `src/pages/Study.jsx` |
| 🎨 Une couleur | variables en haut de `src/styles.css` |

---

## 🚀 Lancer la démo locale

```bash
npm install
npm run dev
```

Ouvre l’adresse affichée par Vite.  
Aucune donnée n’est envoyée à un serveur : tout est **local** et **simulé**.

---

## 💳 Cartes de test

- ✅ **Succès Visa** : `4532 0151 1283 0366` · `12/28` · `737`
- ❌ **Refus simulé** : `4000 0000 0000 0002`

---

## 📜 Licence

Aucune licence ajoutée pour le moment.
