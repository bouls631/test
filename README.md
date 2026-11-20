# Suivi des tests — Escalade

Petite application web pour faire et noter ses tests d'escalade **jour par jour**. Les 11 tests, leurs règles de score et les programmes J1/J2/J3 sont repris de `Nouveau dossier (2)\Feuille de calcul sans titre.xlsx`. Les résultats sont stockés dans un fichier **`data.json`** sur GitHub (avec une copie locale dans le navigateur).

## Ce que fait l'appli

- **Nouveau test** : date + PDC (poids de corps), puis saisie des 11 tests. Le score est calculé selon la règle de l'Excel :
  - `(PDC + lesté) / PDC` pour suspension 20 mm, 3 doigts tendus et traction lestée 1RM ;
  - temps total pour les séries `5"On/5"Off`, `7"On/3"Off`, `3"On/3"Off` (nombre de répétitions × durée du cycle), blocage 1 bras (somme droite + gauche) et front lever (temps + position) ;
  - charge tenue ou nombre de répétitions pour le blocage lesté, les dips et la traction cluster.
  - Cases **P** (à travailler en priorité), **B** (bon potentiel), **F** (point fort) reprises du « Bilan des tests », plus un bilan libre.
  - Un rappel et une confirmation si une autre journée est à un jour d'écart (*1 jour de repos total entre chaque jour de test*).
- **Une page par jour** : chaque journée a sa propre URL `#/jour/AAAA-MM-DD` (ex. `https://bouls631.github.io/test/#/jour/2026-11-20`). La barre ‹ › permet de passer d'un jour à l'autre, « Aujourd'hui » d'y revenir, et « Nouveau jour » de repartir d'une feuille vierge. Enregistrer remplit la page du jour, sans toucher aux autres.
- **Historique** : une journée = une carte ; ouvrir amène sur sa page, supprimer la retire.
- **Progression** : un tableau avec une colonne par date (cliquable) et l'écart avec la journée précédente.
- **Programme** : les 3 journées d'entraînement de l'Excel (séries, répétitions, charge, repos, consignes, objectif, notes athlète), avec les liens vidéo cliquables.
- **Données** : lecture/écriture de `data.json` via l'API GitHub, export/import d'une copie locale.

## Utilisation en local

```bash
cd "suivi-tests"
python -m http.server 8000
```

Puis ouvrir http://localhost:8000 . La saisie fonctionne aussi en ouvrant `index.html` directement, mais le chargement de `data.json` et l'API GitHub demandent le serveur local ou GitHub Pages.

## Mettre sur GitHub

1. Créer un dépôt et y copier les 5 fichiers : `index.html`, `styles.css`, `defs.js`, `app.js`, `data.json`.
2. **Pages** : *Settings → Pages → Deploy from a branch → main / /(root)*.
3. **Jeton** : *Settings du compte → Developer settings → Personal access tokens*, droit **Contents: read and write** sur le dépôt (token classique : scope `repo`).
4. Dans l'appli, onglet **Données & GitHub** : owner, dépôt, branche (`main`), fichier (`data.json`), jeton → **Enregistrer la configuration**. Puis **Charger depuis GitHub** et **Envoyer sur GitHub** après chaque saisie.

Le jeton reste dans le `localStorage` du navigateur : à utiliser sur ton ordinateur seulement. Si `data.json` est modifié ailleurs, l'envoi refuse (conflit 409) : recharge avant d'envoyer. **Exporter data.json** fait une sauvegarde complète.

## Fichiers

- `defs.js` — généré depuis l'Excel : définitions des 11 tests et des 3 programmes (à régénérer si l'Excel change).
- `app.js` — calcul des scores, saisie, historique, progression, synchronisation GitHub.
- `data.json` — données utilisateur : `pdc` et `sessions` (une session par jour de test).
