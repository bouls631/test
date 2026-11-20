/* Définitions extraites de « Feuille de calcul sans titre.xlsx » — ne pas modifier à la main. */
const TEST_DEFS = [
 {
  "id": "susp20",
  "name": "suspension 20mm (5 sec max lesté)",
  "url": "https://youtu.be/7oOf49JIy6w",
  "rule": "score = (PDC+leste)/PDC",
  "mode": "ratio",
  "per": null,
  "fields": [
   {
    "key": "kg",
    "label": "Lesté (kg)",
    "step": 0.5
   }
  ]
 },
 {
  "id": "doigts3",
  "name": "3 doigts tendus : suspension 20mm (5 sec max lesté)",
  "url": "https://youtu.be/UXFN-x0aPsQ",
  "rule": "score = (PDC+leste)/PDC",
  "mode": "ratio",
  "per": null,
  "fields": [
   {
    "key": "kg",
    "label": "Lesté (kg)",
    "step": 0.5
   }
  ]
 },
 {
  "id": "traction1rm",
  "name": "Traction lesté (1RM)",
  "url": "https://youtu.be/_laVN1H4coM",
  "rule": "score = (PDC+leste)/PDC",
  "mode": "ratio",
  "per": null,
  "fields": [
   {
    "key": "kg",
    "label": "Lesté (kg)",
    "step": 0.5
   }
  ]
 },
 {
  "id": "onoff5",
  "name": "5\"On/ 5\"Off 20mm (PDC)",
  "url": "https://youtu.be/5DIch0Rj2Lc",
  "rule": "score = temps total tenu. exemple : échec à la rep 25 alors score = 250 sec",
  "mode": "reps",
  "per": 10,
  "fields": [
   {
    "key": "reps",
    "label": "Répétitions",
    "step": 1
   }
  ]
 },
 {
  "id": "blocageMax",
  "name": "Blocage 1 bras 90° PDC (max temps)",
  "url": "https://youtu.be/7RuzhWaaQ0c",
  "rule": "score = temps tenu en sec (somme bras droit + bras gauche)",
  "mode": "time2",
  "per": null,
  "fields": [
   {
    "key": "droit",
    "label": "Bras droit (s)",
    "step": 0.5
   },
   {
    "key": "gauche",
    "label": "Bras gauche (s)",
    "step": 0.5
   }
  ]
 },
 {
  "id": "blocageLeste",
  "name": "Blocage 1 bras 90° (5 sec max lesté)",
  "url": "https://youtu.be/mZal6-CKacM",
  "rule": "score = charge tenue au moins 3 sec. idéalement 5 sec",
  "mode": "charge",
  "per": null,
  "fields": [
   {
    "key": "kg",
    "label": "Charge tenue (kg)",
    "step": 0.5
   }
  ]
 },
 {
  "id": "frontLever",
  "name": "1/4 de Front lever (30sec+)",
  "url": "https://youtu.be/Htb4UyOxXQQ",
  "rule": "score = temps tenu en  sec + nom de la position tennue par exemple : 1/4 de front 24 sec",
  "mode": "position",
  "per": null,
  "fields": [
   {
    "key": "sec",
    "label": "Temps (s)",
    "step": 1
   },
   {
    "key": "pos",
    "label": "Position",
    "step": null
   }
  ]
 },
 {
  "id": "dips",
  "name": "Max de Dips au PDC",
  "url": "https://youtu.be/T7k2m7f1QnQ",
  "rule": "score = nb de reps ou charge max sur 1 rep",
  "mode": "repsOrKg",
  "per": null,
  "fields": [
   {
    "key": "reps",
    "label": "Répétitions",
    "step": 1
   },
   {
    "key": "kg",
    "label": "Si lesté (kg)",
    "step": 0.5
   }
  ]
 },
 {
  "id": "tractionCluster",
  "name": "Traction 2 bras (cluster 2 sec, max reps)",
  "url": "https://youtu.be/7KoIze8p8IU",
  "rule": "score = nb de reps ou charge additionelle + nb de reps",
  "mode": "repsOrKg",
  "per": null,
  "fields": [
   {
    "key": "reps",
    "label": "Répétitions",
    "step": 1
   },
   {
    "key": "kg",
    "label": "Charge ajoutée (kg)",
    "step": 0.5
   }
  ]
 },
 {
  "id": "onoff7",
  "name": "7\"On/3\"Off 20mm (PDC à l'échec)",
  "url": "https://youtu.be/OgbOUktAtkg",
  "rule": "score = temps total tenu. exemple : échec à la rep 25 alors score = 250 sec",
  "mode": "reps",
  "per": 10,
  "fields": [
   {
    "key": "reps",
    "label": "Répétitions",
    "step": 1
   }
  ]
 },
 {
  "id": "onoff3",
  "name": "3\"On/3\"Off (90% 1RM)",
  "url": "https://youtu.be/KgiJbrXJDa4",
  "rule": "score = temps total tenu. exemple : échec à la rep 25 alors score = 250 sec",
  "mode": "reps",
  "per": 6,
  "fields": [
   {
    "key": "reps",
    "label": "Répétitions",
    "step": 1
   }
  ]
 }
];

const PROGRAMS = [
 {
  "title": "Jour 1 : ",
  "header": [
   "Exercices",
   "Séries",
   "répétitions",
   "Charge (kg)",
   "Temps de repos",
   "Consignes particulières (tempo etc…)",
   "Objectif de l'exercice : ",
   "Notes athlète (RPE moyen des séries etc..."
  ],
  "rows": [
   [
    "suspension 20mm (5 sec max lesté) : https://youtu.be/7oOf49JIy6w",
    "Bien faire les suspensions en semi arqué (HC), càd index à 90°. ",
    "si tennue plus de 5 sec arrêter la série en cours et augmenter la charge",
    "montée en gamme par paliers de 5kg puis 2,5kg quand limite",
    "2 à 5 min de repos entre les séries",
    "épaules bien engagées, bras tendus, en apnée totale.",
    "déterminer ta force max en suspension sur 20mm pour 5 sec (entre 3 et 5 sec)",
    "score = (PDC+leste)/PDC"
   ],
   [
    "3 doigts tendus : suspension 20mm (5 sec max lesté) : https://youtu.be/UXFN-x0aPsQ",
    "Bien faire les suspensions en 3 doigts tendus",
    "si tennue plus de 5 sec arrêter la série en cours et augmenter la charge",
    "montée en gamme par paliers de 5kg puis 2,5kg quand limite",
    "2 à 5 min de repos entre les séries",
    "épaules bien engagées, bras tendus, en apnée totale. pour la charge : commencer à 85% du max en semi arqué (en comptant le PDC). exemple : si PDC = 75kg, et max lesté en HC = 25kg, alors 1RM = 100kg et 85% = 85kg auquel on soustrait le PDC, donc 85-75 = 10kg de lesté sur la susp 3 doigts tendus",
    "regarder si tu as un déficit entre semi arqué et tendu",
    "score = (PDC+leste)/PDC"
   ],
   [
    "Traction lesté (1RM) : https://youtu.be/_laVN1H4coM",
    "Traction pronation (cluster 1+1+1...) : https://youtube.com/shorts/9N3IYO4QrQ0 tuto : https://youtu.be/k_Rj90uE8AY",
    "1 rep, max de charge possible. montée en gamme progressive",
    "montée en gamme par paliers de 5kg puis 2,5kg quand limite",
    "2 à 5 min de repos entre les essais",
    "intention de vitesse maximale sur la montée, 1 sec de verrouillage haut.",
    "déterminer ta force max en tirage pour 1 répétition",
    "score = (PDC+leste)/PDC"
   ],
   [
    "5\"On/ 5\"Off 20mm (PDC) : https://youtu.be/5DIch0Rj2Lc",
    "Bien faire les suspensions en semi arqué (HC), càd index à 90°. ",
    "1 rep = 5 sec de suspension + 5 sec de repos. viser 36 reps",
    "PDC",
    "si tu tiens plus de 6min, alors arreter le test.",
    "à muerte, pense à predre de la pof en poudre",
    "estimation de ta force critique sans capteur de force",
    "score = temps total tenu. exemple : échec à la rep 25 alors score = 250 sec"
   ]
  ]
 },
 {
  "title": "Jour 2 : ",
  "header": [
   "Exercices",
   "Séries",
   "répétitions",
   "Charge (kg)",
   "Temps de repos",
   "Consignes particulières (tempo etc…)",
   "Objectif de l'exercice : ",
   "Notes athlète (RPE moyen des séries etc..."
  ],
  "rows": [
   [
    "Blocage 1 bras 90° PDC (max temps) : https://youtu.be/7RuzhWaaQ0c",
    "Blocage 1 bras 90° (barre) : https://youtube.com/shorts/0SCGkfE59LU",
    "s'aider de l'autre bras pour se placer. bien gainer le corps entier pour \"rester droit\"",
    "PDC",
    "2min30 entre les bras",
    "si moins de 5 sec au PDC, alors fais un blocage 90° à 2 bras lesté au meme poids que ton 1RM traction de lundi à l'échec : https://youtube.com/shorts/NoUpqKK8_Ws",
    "déterminer ton niveau de force en blocage ",
    "score = temps tenu en sec (somme bras droit + bras gauche)"
   ],
   [
    "Blocage 1 bras 90° (5 sec max lesté) : https://youtu.be/mZal6-CKacM",
    "Blocage 1 bras 90° (barre) : https://youtube.com/shorts/0SCGkfE59LU",
    "s'aider de l'autre bras pour se placer. bien gainer le corps entier pour \"rester droit\"",
    "montée en gamme par paliers de 5kg puis 2,5kg quand limite",
    "2min30 entre les bras",
    "si tu as tenu moins de 10 sec au PDC juste au dessus alors ne pas faire l'exercice lesté",
    "déterminer ton niveau de force en blocage ",
    "score = charge tenue au moins 3 sec. idéalement 5 sec"
   ],
   [
    "1/4 de Front lever (30sec+) : https://youtu.be/Htb4UyOxXQQ",
    "1/4 de front : https://youtube.com/shorts/p_P6x-CZbQE?feature=share",
    "de 0 à 30 sec",
    "si + de 30 sec en 1/4 alors passer en 1/2 après 5 min de repos. si + de 30 sec en 1/2 alors passer en full front après 5 min de repos",
    "5 min",
    "garder l'allignement \"cheville, hanche, épaules\"",
    "déterminer ton niveau de force en gainage ",
    "score = temps tenu en  sec + nom de la position tennue par exemple : 1/4 de front 24 sec"
   ],
   [
    "Max de Dips au PDC : https://youtu.be/T7k2m7f1QnQ",
    "Dips barres : https://youtu.be/rt04Y_rFlQ0",
    "Objectif 20 reps au PDC. si 20 reps alors 5 min de repos puis montée en gamme lesté 1RM comme pour les tractions",
    "PDC ou lesté si + de 20 reps",
    "2 à 5 min de repos entre les séries",
    "1 sec de blocage haut et 1 sec de blocage bas à chaque rep. bras tendus en haut, coudes à 90° en bas du mouvement. ",
    "déterminer ton niveau de force/endurance sur les muscles de poussée",
    "score = nb de reps ou charge max sur 1 rep"
   ]
  ]
 },
 {
  "title": "Jour 3 : ",
  "header": [
   "Exercices",
   "Séries",
   "répétitions",
   "Charge (kg)",
   "Temps de repos",
   "Consignes particulières (tempo etc…)",
   "Objectif de l'exercice : ",
   "Notes athlète (RPE moyen des séries etc..."
  ],
  "rows": [
   [
    "Traction 2 bras (cluster 2 sec, max reps) : https://youtu.be/7KoIze8p8IU",
    "Traction pronation (cluster 1+1+1...) : https://youtube.com/shorts/9N3IYO4QrQ0 tuto : https://youtu.be/k_Rj90uE8AY",
    "20 reps max. si + de 20 reps alors 10 min de repos puis lesté 5kg etc...",
    "PDC",
    "10 min de repos après la série",
    "intention de vitesse maximale sur la montée, 1 sec de verrouillage haut.",
    "endurance bras/puissance bras",
    "score = nb de reps ou charge additionelle + nb de reps"
   ],
   [
    "7\"On/3\"Off 20mm (PDC à l'échec) : https://youtu.be/OgbOUktAtkg",
    "Bien faire les suspensions en semi arqué (HC), càd index à 90°. ",
    "1 rep = 7 sec de suspension + 3 sec de repos. viser 24 reps",
    "PDC",
    "si tu tiens plus de 24 reps, alors arreter le test, 10 min de repos puis lesté 5kg etc...",
    "à muerte, pense à predre de la pof en poudre",
    "estimation de ta résistance sans capteur de force",
    "score = temps total tenu. exemple : échec à la rep 25 alors score = 250 sec"
   ],
   [
    "3\"On/3\"Off (90% 1RM) : https://youtu.be/KgiJbrXJDa4",
    "Bien faire les suspensions en semi arqué (HC), càd index à 90°. ",
    "1 rep = 3 sec de suspension + 3 sec de repos. viser un max reps",
    "PDC",
    "leste = 90% du 1 RM en comptant le PDC. voir vidéo.",
    "à muerte, pense à predre de la pof en poudre",
    "estimation de ton endurance de force sans capteur de force",
    "score = temps total tenu. exemple : échec à la rep 25 alors score = 250 sec"
   ]
  ]
 }
];
