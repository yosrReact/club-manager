# Stratégie de test

> Comment ce projet est testé, et pourquoi. La démarche suit le référentiel ISTQB : niveaux de test, techniques de conception et critères de sortie explicites.

---

## 1. Objectifs

- Vérifier que chaque critère d'acceptation des [user stories](./user-stories.md) est couvert par au moins un test automatisé.
- Détecter les régressions à chaque modification, en local et en intégration continue.
- Garder des tests **rapides, lisibles et centrés sur le comportement**, pas sur l'implémentation.

## 2. Niveaux de test (pyramide)

| Niveau | Outil | Ce qu'on teste | Volume |
|---|---|---|---|
| **Unitaire** | Vitest | Règles métier pures : validation, calcul de catégorie, filtrage, reducer | Beaucoup, très rapides |
| **Composant / intégration** | Vitest + React Testing Library | Parcours utilisateur dans la page, comme un utilisateur (rôles, libellés) | Un par scénario clé |
| **Documentation visuelle** | Storybook | États des composants (vide, erreur, liste remplie) | Un story par état |
| **Bout en bout** | Playwright | Le parcours complet dans un vrai navigateur, persistance comprise | Quelques scénarios critiques |

La logique métier est isolée dans des **fonctions pures** (`src/features/members/domain`). C'est ce qui permet de tester la majorité des règles au niveau unitaire, rapidement et sans navigateur.

## 3. Techniques de conception utilisées

- **Analyse des valeurs limites** : calcul de la catégorie d'âge (9/10, 13/14, 17/18 ans) et date de naissance (aujourd'hui / demain).
- **Partitions d'équivalence** : emails valides et invalides, champs vides ou remplis.
- **Tables de décision** : combinaisons de recherche et de filtre par catégorie.
- **Tests basés sur les scénarios** : chaque scénario Gherkin correspond à un test nommé de la même façon.

## 4. Principes

- **Requêtes accessibles** dans les tests de composants (`getByRole`, `getByLabelText`) : si un test ne trouve pas un élément par son rôle, l'accessibilité est probablement à revoir.
- **Pas de détails d'implémentation** : on ne teste ni l'état interne ni les noms de classes CSS.
- **Dates maîtrisées** : la date du jour est injectée, pour des tests déterministes.
- **Données de test explicites** : chaque test crée ce dont il a besoin.

## 5. Critères de sortie

- Tous les tests passent (`npm test`).
- Couverture de lignes supérieure à 90 % sur `src/features/members/domain`.
- Chaque critère d'acceptation est relié à un test dans la [matrice de traçabilité](./traceability.md).

## 6. Rôle de l'IA

Les cas de test ont été générés avec l'aide de l'IA à partir des user stories, puis **relus, corrigés et complétés** par un humain. La démarche, ses gains et ses limites sont décrits dans [ai-assisted-testing.md](./ai-assisted-testing.md).
