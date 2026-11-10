# User stories : gestion des adhérents

> Périmètre de la première version : la gestion des adhérents d'un club sportif.
> Chaque story est accompagnée de critères d'acceptation testables, rédigés au format Gherkin (Étant donné / Quand / Alors).

---

## US-01 : Ajouter un adhérent

**En tant que** secrétaire du club,
**je veux** enregistrer un nouvel adhérent avec ses informations,
**afin de** tenir à jour la liste des membres.

### Critères d'acceptation

```gherkin
Scénario: Ajout d'un adhérent valide
  Étant donné que le formulaire d'ajout est vide
  Quand je saisis le prénom "Sami", le nom "Ben Ali", l'email "sami@club.tn" et la date de naissance "2012-03-15"
  Et que je valide le formulaire
  Alors l'adhérent "Sami Ben Ali" apparaît dans la liste
  Et le formulaire est réinitialisé

Scénario: Champs obligatoires manquants
  Quand je valide le formulaire sans saisir de nom
  Alors le message "Le nom est obligatoire." s'affiche
  Et aucun adhérent n'est ajouté

Scénario: Email invalide
  Quand je saisis l'email "sami.club.tn"
  Et que je valide le formulaire
  Alors le message "L'email n'est pas valide." s'affiche

Scénario: Email déjà utilisé
  Étant donné qu'un adhérent existe avec l'email "sami@club.tn"
  Quand j'ajoute un autre adhérent avec l'email "SAMI@club.tn"
  Alors le message "Cet email est déjà utilisé par un autre adhérent." s'affiche

Scénario: Date de naissance dans le futur
  Quand je saisis une date de naissance postérieure à aujourd'hui
  Alors le message "La date de naissance ne peut pas être dans le futur." s'affiche
```

---

## US-02 : Calculer automatiquement la catégorie d'âge

**En tant que** responsable sportif,
**je veux** que la catégorie de chaque adhérent soit calculée à partir de sa date de naissance,
**afin de** constituer les groupes d'entraînement sans erreur de saisie.

### Règle métier

La catégorie dépend de l'âge atteint au cours de la saison, c'est-à-dire l'âge au **31 décembre** de l'année de début de saison :

| Âge au 31 décembre | Catégorie |
|---|---|
| 9 ans et moins | U10 |
| 10 à 13 ans | U14 |
| 14 à 17 ans | U18 |
| 18 ans et plus | Senior |

### Critères d'acceptation

```gherkin
Plan du scénario: Catégorie selon l'âge (analyse des valeurs limites)
  Étant donné la saison qui commence en 2026
  Quand un adhérent atteint <âge> ans au 31 décembre 2026
  Alors sa catégorie est "<catégorie>"

  Exemples:
    | âge | catégorie |
    | 9   | U10       |
    | 10  | U14       |
    | 13  | U14       |
    | 14  | U18       |
    | 17  | U18       |
    | 18  | Senior    |
```

---

## US-03 : Rechercher et filtrer les adhérents

**En tant que** secrétaire du club,
**je veux** rechercher un adhérent par son nom et filtrer par catégorie,
**afin de** retrouver rapidement une personne ou un groupe.

### Critères d'acceptation

```gherkin
Scénario: Recherche par nom, insensible à la casse et aux accents
  Étant donné les adhérents "Sami Ben Ali" et "Élise Martin"
  Quand je recherche "elise"
  Alors seule "Élise Martin" est affichée

Scénario: Filtre par catégorie
  Quand je filtre sur la catégorie "U14"
  Alors seuls les adhérents de la catégorie U14 sont affichés

Scénario: Aucun résultat
  Quand ma recherche ne correspond à aucun adhérent
  Alors le message "Aucun adhérent ne correspond à votre recherche." s'affiche
```

---

## US-04 : Suivre les cotisations

**En tant que** trésorier,
**je veux** voir quels adhérents ont payé leur cotisation et marquer un paiement,
**afin de** relancer les retardataires.

### Critères d'acceptation

```gherkin
Scénario: Nouvel adhérent
  Quand j'ajoute un adhérent
  Alors sa cotisation est "Non payée"

Scénario: Enregistrer un paiement
  Étant donné un adhérent dont la cotisation est "Non payée"
  Quand je clique sur "Marquer comme payée"
  Alors sa cotisation passe à "Payée"
  Et le compteur des cotisations en attente diminue de 1
```

---

## US-05 : Retirer un adhérent

**En tant que** secrétaire du club,
**je veux** retirer un adhérent de la liste, avec une confirmation,
**afin d'** éviter les suppressions accidentelles.

### Critères d'acceptation

```gherkin
Scénario: Suppression confirmée
  Quand je clique sur "Retirer" pour un adhérent
  Et que je confirme
  Alors l'adhérent disparaît de la liste

Scénario: Suppression annulée
  Quand je clique sur "Retirer" pour un adhérent
  Et que j'annule
  Alors l'adhérent reste dans la liste
```
