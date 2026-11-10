# Matrice de traçabilité

> Chaque critère d'acceptation des [user stories](./user-stories.md) est relié aux tests qui le vérifient.

| Story | Critère d'acceptation | Tests unitaires | Tests de composant | Stories Storybook | Bout en bout |
|---|---|---|---|---|---|
| US-01 | Ajout d'un adhérent valide | `validation.test.ts` | `MembersPage.test.tsx` | `MemberForm / SuccessfulSubmission`, `MembersPage / AddAndSearch` | `members.spec.ts` (conservation après rechargement) |
| US-01 | Champs obligatoires manquants | `validation.test.ts` | `MembersPage.test.tsx` | `MemberForm / WithValidationErrors` | `members.spec.ts` (erreurs de saisie) |
| US-01 | Email invalide | `validation.test.ts` | | `MemberForm / WithValidationErrors` | `members.spec.ts` (erreurs de saisie) |
| US-01 | Email déjà utilisé | `validation.test.ts` | `MembersPage.test.tsx` | | |
| US-01 | Date de naissance dans le futur | `validation.test.ts` (valeurs limites) | | | |
| US-02 | Catégorie selon l'âge | `category.test.ts` (valeurs limites) | `MembersPage.test.tsx` | `MemberList / WithMembers` | |
| US-03 | Recherche insensible à la casse et aux accents | `filter.test.ts` | `MembersPage.test.tsx` | `MembersPage / AddAndSearch` | |
| US-03 | Filtre par catégorie | `filter.test.ts` (table de décision) | `MembersPage.test.tsx` | | |
| US-03 | Aucun résultat | `filter.test.ts` | `MembersPage.test.tsx` | `MemberList / Empty` | `members.spec.ts` (parcours trésorier) |
| US-04 | Nouvel adhérent non payé | `membersReducer.test.ts` | `MembersPage.test.tsx` | | `members.spec.ts` (conservation) |
| US-04 | Enregistrer un paiement | `membersReducer.test.ts` | `MembersPage.test.tsx` | `MemberList / MarkFeeAsPaid` | `members.spec.ts` (parcours trésorier) |
| US-05 | Suppression confirmée | `membersReducer.test.ts` | `MembersPage.test.tsx` | `MemberList / RemovalConfirmation` | `members.spec.ts` (parcours trésorier) |
| US-05 | Suppression annulée | | `MembersPage.test.tsx` | `MemberList / RemovalConfirmation` | |
| Transverse | Persistance et données corrompues | `storage.test.ts` | | | `members.spec.ts` (rechargement) |
| Transverse | Accessibilité (axe) | | | Toutes les stories (`a11y: error`) | |
