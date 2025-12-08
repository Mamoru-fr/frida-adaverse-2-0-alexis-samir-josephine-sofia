# Roles

Chaques roles disponibles dans le système sont décrits ci-dessous.

## Utilisateur non authentifié

- **Description**: Un utilisateur qui n'a pas encore créé de compte ou qui n'est pas connecté.
- **Permissions**:
  - Voir les pages publiques
  - S'inscrire
  - Se connecter
- **Restrictions**:
  - Ne peut pas accéder aux fonctionnalités réservées aux utilisateurs authentifiés.
  - Ne peut pas laisser de commentaires ou interagir avec le contenu.
  - Ne peut pas personnaliser les paramètres du compte.

## Utilisateur authentifié

- **Description**: Un utilisateur qui a créé un compte et est connecté au système.
- **Permissions**:
  - Accéder aux fonctionnalités de base du site
  - Se déconnecter
  - Proposer du contenu (des projets)
  - Laisser des commentaires
  - Personnaliser les paramètres du compte
  - Modifier / supprimer son propre contenu (commentaires, projets)
- **Restrictions**:
  - Ne peut pas accéder aux fonctionnalités administratives.
  - Ne peut pas gérer les utilisateurs ou le contenu global du site.
  - Ne peut pas modifier les paramètres du site.

## Administrateur

- **Description**: Un utilisateur avec des privilèges élevés qui gère le site.
- **Permissions**:
  - Accéder à toutes les fonctionnalités du site autorisées pour les utilisateurs authentifiés.
  - Gérer les utilisateurs (ajouter, supprimer, modifier les rôles, bannir des utilisateurs)
  - Gérer le contenu du site (accepter, refuser, modifier, supprimer des projets, modérer les commentaires (supprimer, cacher))