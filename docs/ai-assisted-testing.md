# Tests assistés par l'IA : démarche, gains et limites

> Ce projet a été construit avec un assistant IA (Claude Code). Ce document explique **comment** l'IA a été utilisée pour concevoir les tests, et surtout **ce que la relecture humaine a corrigé**. L'IA accélère ; elle ne remplace pas le jugement d'une testeuse.

---

## 1. Le flux de travail

```
User stories + critères d'acceptation (Gherkin)
        │
        ▼
Génération par l'IA : cas de test, données, code de test
        │
        ▼
Relecture humaine : couverture, techniques ISTQB, lisibilité, faux positifs
        │
        ▼
Exécution, analyse des échecs, corrections
        │
        ▼
Traçabilité : chaque critère d'acceptation relié à un test
```

1. **Les user stories viennent d'abord.** Elles sont rédigées avec des critères d'acceptation précis et vérifiables ([user-stories.md](./user-stories.md)). La qualité des tests générés dépend directement de la qualité des critères.
2. **L'IA propose** les cas de test, les données et le code, à partir des stories et de la [stratégie de test](./test-strategy.md).
3. **La relecture humaine** vérifie que les techniques de conception sont bien appliquées, que chaque test échouerait vraiment si le comportement cassait, et que les tests restent lisibles.
4. **L'exécution** révèle ce que la relecture a manqué.

## 2. Exemple de prompt

> « À partir des critères d'acceptation de US-02, écris des tests unitaires Vitest pour `getCategory`. Applique l'analyse des valeurs limites : teste chaque frontière de catégorie des deux côtés. Utilise `it.each` avec un tableau lisible, et des noms de tests qui décrivent la règle métier. »

Un prompt efficace **nomme la technique de test attendue**. Sans cela, l'IA a tendance à produire des cas « typiques » (un enfant de 12 ans, un adulte de 30 ans) qui passent à côté des frontières, là où se cachent les bugs.

## 3. Ce que la relecture et l'exécution ont corrigé

Exemples réels rencontrés sur ce projet :

| Problème | Comment il a été détecté | Correction |
|---|---|---|
| Les tests de composants échouaient tous au premier lancement : l'environnement `jsdom` n'était pas configuré | Exécution | Configuration de Vitest complétée |
| Un test de bout en bout ciblait le champ « Nom » par son libellé, mais la recherche approximative trouvait aussi « Prénom » | Exécution (échec Playwright) | Recherche de libellé exacte (`exact: true`) |
| Les cas de test initiaux de la catégorie d'âge ne testaient pas chaque frontière des deux côtés | Relecture | Table de valeurs limites complète (9/10, 13/14, 17/18 ans) |
| Le test de date de naissance dépendait de la date du jour, donc pouvait échouer un autre jour | Relecture | Date du jour injectée dans les composants et les fonctions |
| Quand le club était vide, l'application affichait « Aucun adhérent ne correspond à votre recherche » alors qu'aucune recherche n'était faite | Test exploratoire manuel | Message dédié au club vide, et un test pour le garantir |

## 4. Ce que l'IA fait bien

- Produire rapidement une **première couverture large** à partir de critères bien écrits.
- Générer des **données de test variées** (emails invalides, noms accentués).
- Écrire le code répétitif (mise en place, helpers), ce qui laisse plus de temps pour réfléchir aux cas importants.

## 5. Ce qui reste une responsabilité humaine

- **Décider quoi tester** et à quel niveau (unitaire, composant, bout en bout).
- **Vérifier qu'un test peut échouer** : un test qui passe toujours ne protège de rien.
- **Repérer les tests fragiles** : dépendance à la date, à l'ordre d'exécution, à des sélecteurs ambigus.
- **Garder la cohérence** avec la stratégie de test et la traçabilité.

## 6. Résultat

- 53 tests unitaires et de composants, 10 stories testées automatiquement dans un vrai navigateur (avec contrôle d'accessibilité), 3 scénarios de bout en bout.
- 100 % de couverture des lignes sur la logique de la fonctionnalité.
- Chaque critère d'acceptation est relié à au moins un test : voir la [matrice de traçabilité](./traceability.md).
