# DCM Digital - Role-Based Access Control (RBAC) Matrix

*Dernière mise à jour : Février 2026*

## 1. Philosophie et Architecture
Le système RBAC (Role-Based Access Control) de l'infrastructure DCM Digital (Decision Intelligence Infrastructure) est conçu de manière "backend-enforced". Les mécanismes de sécurité s'assurent que le blocage n'est pas uniquement visuel côté client, mais logique sur l'accès aux flux de données (Via Supabase RLS et `SessionManager`).

Le mécanisme repose sur trois variables de contexte de l'utilisateur :
1.  **Identity (UUID)** : L'identifiant cryptographique unique.
2.  **Role (Profile)** : Le niveau hiérarchique au sein de l'organisation.
3.  **Tenant ID (Org_ID)** : Le cloisonnement organisationnel (Multi-tenant).

---

## 2. Matrice Rôles / Permissions

| Permission (Action) | `ADMIN` (Cro/Head) | `ANALYST` (Risk/Ops) | `VIEWER` (Board/Audit) | Description |
| :--- | :---: | :---: | :---: | :--- |
| **`BASIC_DASHBOARD`** | ✅ | ✅ | ✅ | Accès en lecture au cockpit principal (Dashboard V1). |
| **`BENCHMARK_DETAIL`**| ✅ | ✅ | ❌ | Visualisation approfondie des métriques de pairs (Peer comparison). |
| **`REPORT_EXPORT`** | ✅ | ✅ | ❌ | Génération de PDFs "Board-ready" avec injection de données live. |
| **`RISK_MODEL_EDIT`** | ✅ | ❌ | ❌ | Modification des pondérations de sensibilité du moteur principal. |
| **`AUDIT_VIEW`** | ✅ | ❌ | ❌ | Visualisation et contrôle d'intégrité de l'Audit Trail cryptographique. |
| **`USER_MANAGEMENT`** | ✅ | ❌ | ❌ | Gestion de l'équipe (Org Settings) : Invitations, suspensions, affectation de rôles. |

---

## 3. Implémentation de la Gouvernance

Chaque tentative d'action nécessitant une permission supérieure au rôle de l'utilisateur est :
1.  **Bloquée logiciellement** (`SessionManager.checkAccess(permission)`).
2.  **Logguée dans l'Audit Trail** via la fonction `AuditLogger.log()`. L'événement est enregistré avec le label `UNAUTHORIZED_ACCESS_ATTEMPT`, l'identifiant de la session en cours et la cible de l'action.

### Scénario de Test Dynamique d'Intégrité
*Extrait d'une simulation d'Audit Interne de Conformité.*

1.  **Action :** Un `ANALYST` tente de modifier la pondération de sensibilité (Liquidity Stress Test) d'un pool RWA.
2.  **Gating :** Le système détecte l'absence du rôle `ADMIN` (`checkAccess('RISK_MODEL_EDIT')` renvoie `false`).
3.  **Notification :** Un message de blocage d'interface est affiché à l'utilisateur.
4.  **Enregistrement :** L'action est persistée dans la blockchain/base de données (`audit_logs`) avec l'horodatage précis, le hash du bloc précédent, et le flag "Intrusion Logic".
5.  **Rapport (ReportEngine) :** Le CRO (`ADMIN`) retrouve cette tentative dans le module *Audit Trail Explorer* sous l'étiquette rouge de violation de politique. Les PDF générés trimestriellement incluent ces statistiques inviolables.
