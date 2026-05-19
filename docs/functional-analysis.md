Rol: Ets un dissenyador de producte / UI especialitzat en aplicacions web complexes, panells d’administració i sistemes de disseny.

Tasca: Proposar una nova interfície per a Guillotina React (@guillotinaweb/react-gmi): panell d’administració sobre l’API Guillotina, mantenint tota la funcionalitat i el model d’extensibilitat (registry) descrits al document funcional que t’adjunto.

Document adjunt: L’anàlisi funcional és la font única de veritat per al domini, pantalles, fluxos, permisos, API, components, i18n, configuració i glossari. Llegeix-lo sencer abans de proposar solucions; no cal que en resumeixi el contingut al teu lliurament si ja està cobert allà.

Objectiu del disseny: Evolucionar la UX i l’estètica de forma radicalment millor (navegació, jerarquia visual, patrons per a llistes, formularis, permisos, modals, feedback), sense trencar el model conceptual ni els punts d’extensió que el document detalla. On proposis canvis d’interacció (p. ex. selector visual de destí en moure/copiar, sidebar amb arbre), explica quina necessitat d’usuari resols respecte als “pain points” indicats al document.

Entregables esperats: Principis UX breus, mapa d’informació / wireframes, sistema visual (incloent dark mode i responsive), biblioteca de components alineada amb els patrons del document, i propostes concretes per als problemes de navegació, Move/Copy i vista de permisos — sempre coherents amb el document adjunt.

Idioma: Pots treballar en català o anglès; els textos de mockup poden ser en anglès com a placeholder si el disseny contempla els tres idiomes de la UI (en, es, ca) indicats al document.

# Guillotina React — Anàlisi Funcional i d'Integració amb l'API

> **Objectiu d'aquest document**: Proporcionar a un agent de disseny tota la informació funcional necessària per replantejar completament la interfície d'usuari actual i evolucionar-la cap a un disseny modern i intuïtiu, sense necessitat de llegir el codi font.

---

## 1. Visió General del Producte

### 1.1 Què és?
Guillotina React (`@guillotinaweb/react-gmi`) és una **llibreria React** que proporciona una interfície d'administració per gestionar contingut emmagatzemat en un servidor [Guillotina](https://guillotina.io/). Funciona com un CMS headless admin panel: l'usuari navega per una jerarquia de contingut (similar a un explorador de fitxers), pot crear, editar, moure, copiar i eliminar objectes, gestionar permisos, i administrar usuaris i grups.

### 1.2 Usuaris Objectiu
- **Desenvolupadors** que construeixen panells d'administració sobre Guillotina
- **Administradors de contingut** que gestionen objectes, permisos i configuracions
- **Administradors de sistema** que gestionen usuaris, grups, rols i addons

### 1.3 Limitacions Actuals de la UI
- Estètica basada en **Bulma CSS**, funcional però amb aparença "d'admin panel genèric"
- Navegació exclusivament per **breadcrumb + query params** (no hi ha sidebar, arbre de navegació, ni dashboard)
- Les accions s'executen via **modals bàsics** amb inputs de text pla (ex: moure un objecte demana escriure un path manualment)
- No hi ha vista de dashboard, mètriques, ni activitat recent
- La gestió de permisos es mostra en taules denses difícils de comprendre
- No hi ha drag & drop per reorganitzar contingut (excepte en imatges ordenades)
- La cerca és bàsica: un camp de text amb filtres per tipus
- No hi ha previsualització de contingut ni vista "card/grid"

---

## 2. Model de Dades i Jerarquia de Contingut

### 2.1 Estructura en Arbre
Guillotina organitza tot el contingut en una jerarquia en arbre accessible per REST API:

```
Application (arrel)
├── Database "db"
│   ├── Container "site1"
│   │   ├── UserManager
│   │   │   ├── User "admin"
│   │   │   └── User "editor1"
│   │   ├── GroupManager
│   │   │   ├── Group "editors"
│   │   │   └── Group "reviewers"
│   │   ├── Folder "documents"
│   │   │   ├── Item "report-2024"
│   │   │   ├── Folder "images"
│   │   │   │   └── Item "logo.png"
│   │   │   └── Item "draft"
│   │   └── Folder "news"
│   │       └── Item "announcement"
│   └── Container "site2"
│       └── ...
└── Database "db2"
    └── ...
```

### 2.2 Tipus de Contingut Base

| Tipus | Folderish? | Descripció | Icona Actual |
|-------|-----------|------------|--------------|
| **Application** | Sí | Punt d'entrada. Llista de bases de dades | — |
| **Database** | Sí | Conté containers | `fa-database` |
| **Container** | Sí | "Site" o espai de treball. Conté tot el contingut | `fa-archive` |
| **Folder** | Sí | Carpeta que conté fills | `fa-folder` |
| **Item** | No | Objecte de contingut bàsic (fulla de l'arbre) | `fa-file` |
| **UserManager** | Sí | Contenidor especial d'usuaris | `fa-user-cog` |
| **GroupManager** | Sí | Contenidor especial de grups | `fa-users-cog` |
| **User** | No | Objecte d'usuari | `fa-user` |
| **Group** | No | Objecte de grup | `fa-users` |

> Les aplicacions consumidores poden definir **tipus personalitzats** (ex: `Article`, `Product`, `Event`). La UI ha de ser genèrica i extensible.

### 2.3 Propietats Comunes de Tot Objecte

Cada objecte de Guillotina té:

| Propietat | Descripció |
|-----------|------------|
| `@id` | URL absoluta de l'objecte |
| `@name` | Identificador únic dins del pare |
| `@type` / `type_name` | Tipus de contingut (Folder, Item, User...) |
| `@uid` / `uuid` | UUID universal |
| `title` | Títol llegible per humans |
| `creation_date` | Data de creació |
| `modification_date` | Data d'última modificació |
| `is_folderish` | Si pot contenir fills |
| `parent` | Referència al pare (`@id`, `@name`, `@type`, `@uid`) |
| `__behaviors__` | Llista de behaviors dinàmics actius |
| `@static_behaviors` | Behaviors estàtics (sempre presents) |

### 2.4 Behaviors (Mixins)

Els behaviors afegeixen funcionalitat extra als objectes:

| Behavior | Funcionalitat |
|----------|--------------|
| **IDublinCore** | Metadades: `title`, `description`, `effective_date`, `expiration_date`, `creators`, `tags`, `contributors` |
| **IAttachment** | Fitxer adjunt únic (`file`: filename, content_type, size, md5) |
| **IMultiAttachment** | Múltiples fitxers adjunts (diccionari `files`) |
| **IImageAttachment** | Imatge amb escalats (thumbnails) |
| **IMultiImageAttachment** | Múltiples imatges amb escalats |
| **IMultiImageOrderedAttachment** | Múltiples imatges ordenables (drag & drop) |
| **IWorkflowBehavior** | Estat del workflow (`review_state`, `history`, transicions) |

### 2.5 Propietats d'Usuari

| Camp | Descripció |
|------|------------|
| `username` | Nom d'usuari (únic) |
| `email` | Correu electrònic |
| `fullname` / `name` | Nom complet |
| `password` | Contrasenya (hash) |
| `disabled` | Booleà, si l'usuari està desactivat |
| `user_roles` | Llista de rols assignats |
| `user_groups` | Llista de grups als que pertany |
| `user_permissions` | Permisos directes |

### 2.6 Propietats de Grup

| Camp | Descripció |
|------|------------|
| `title` | Nom del grup |
| `users` | Llista d'IDs d'usuaris membres |
| `user_roles` | Llista de rols assignats al grup |

---

## 3. Pantalles i Fluxos Funcionals Actuals

### 3.1 Pantalla de Login

**Estat actual**: Formulari mínim amb username, password i selector de schema (opcional).

**Camps**:
- Username (text)
- Password (password)
- Schema selector (dropdown, només si hi ha múltiples schemas)
- Botó Login

**Flux**:
1. L'usuari introdueix credencials
2. Es fa POST a `{url}@login`
3. Si OK (200): es rep JWT token + expiració, es guarda a `localStorage`
4. Si KO: es mostra missatge d'error ("Invalid credentials" o "Backend not running")
5. El token es refresca automàticament abans d'expirar via `@login-renew`

**Mancances detectades**:
- No hi ha "recordar-me", recuperació de contrasenya, ni indicador visual de sessió
- L'error es mostra com a text pla sense estil

---

### 3.2 Layout Principal (Post-Login)

**Estructura actual**:
```
┌────────────────────────────────────────────────────┐
│  NAVBAR (Logo + Logout button)                     │
├────────────────────────────────────────────────────┤
│  BREADCRUMB (🏠 > db > container > folder > item)  │
├────────────────────────────────────────────────────┤
│  FLASH MESSAGE (notificacions success/error)       │
├────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────┐  │
│  │  MAIN PANEL (box blanc)                      │  │
│  │  ┌──────────────────────────────────────────┐│  │
│  │  │  TABS + TOOLBAR                          ││  │
│  │  │  [Items] [Properties] [Behaviors] [...]  ││  │
│  │  │                     [Search] [Filter] [+]││  │
│  │  ├──────────────────────────────────────────┤│  │
│  │  │  TAB CONTENT                             ││  │
│  │  │  (taula d'items, formulari, permisos...) ││  │
│  │  └──────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

**Navegació**: La URL conté query params `?path=/db/container/folder&tab=Items&page=0&q=search`. No hi ha rutes reals, tot és controlat per search params.

---

### 3.3 Vista Application (Arrel `/`)

**Funció**: Mostra la llista de bases de dades disponibles.

**Contingut**:
- Títol "Databases"
- Taula simple amb nom de cada BD com a link navegable
- Icona `fa-database` per cada fila

**Interaccions**: Clicar una BD navega a `/db/`

---

### 3.4 Vista Database (`/db/`)

**Funció**: Mostra la llista de containers dins la BD.

**Contingut**:
- Títol "Containers"
- Taula amb nom de cada container com a link
- Icona `fa-archive` per cada fila
- Botó "Create" (groc) a la dreta del títol

**Interaccions**:
- Clicar un container navega a `/db/container/`
- Botó "Create" obre modal per crear un nou container (camp ID)

---

### 3.5 Vista Container (`/db/container/`)

**Funció**: Punt d'entrada principal de gestió d'un site. Mostra pestanyes.

**Pestanyes disponibles** (filtrades per permisos):

| Pestanya | Permís Requerit | Contingut |
|----------|----------------|-----------|
| **Items** | `ViewContent` | Llistat d'objectes fills (taula paginada, cercable, filtrable per tipus) |
| **Addons** | `ManageAddons` | Gestió d'addons (instal·lar/desinstal·lar) |
| **Registry** | `ReadConfiguration` | No implementat (placeholder) |
| **Behaviors** | `ModifyContent` | Gestió de behaviors (estàtics, dinàmics, disponibles) |
| **Permissions** | `SeePermissions` | Gestió de permisos (role-perm, principal-perm, principal-role) |
| **Actions** | Varies | Botons d'acció (eliminar, moure, copiar) |

**Toolbar** (a la dreta de les pestanyes):
- Camp de cerca amb botó
- Selector de tipus (dropdown per filtrar per type_name)
- Botó "+" per afegir contingut (dropdown si múltiples tipus, botó directe si un sol tipus)

---

### 3.6 Vista Folder (`/db/container/folder/`)

**Funció**: Idèntica a Container però amb Propietats i sense Addons/Registry.

**Pestanyes**:

| Pestanya | Permís Requerit | Contingut |
|----------|----------------|-----------|
| **Items** | `ViewContent` | Llistat d'objectes fills |
| **Properties** | `ViewContent` | Propietats de l'objecte + behaviors visuals |
| **Behaviors** | `ModifyContent` | Gestió de behaviors |
| **Permissions** | `SeePermissions` | Gestió de permisos |
| **Actions** | Varies | Botons d'acció |

**Toolbar**: Cerca + filtre per tipus + botó afegir (igual que Container)

---

### 3.7 Vista Item (`/db/container/folder/item/`)

**Funció**: Mostra i permet editar un objecte no-folderish.

**Pestanyes**:

| Pestanya | Permís Requerit | Contingut |
|----------|----------------|-----------|
| **Properties** | `ViewContent` | Propietats editables inline |
| **Behaviors** | `ModifyContent` | Gestió de behaviors |
| **Permissions** | `SeePermissions` | Gestió de permisos |
| **Actions** | Varies | Botons d'acció |

**No té pestanya Items** perquè no és folderish ni toolbar de cerca.

---

### 3.8 Vista UserManager (`/db/container/users/`)

**Funció**: Llista tots els usuaris del container.

**Contingut**: Tab únic "Users" amb taula d'usuaris.

**Toolbar**:
- Camp de cerca (filtra per id, email, user_name)
- Botó "Add User" (icona `fa-user`)

---

### 3.9 Vista User (`/db/container/users/admin/`)

**Funció**: Detall i edició d'un usuari.

**Layout a dues columnes**:

**Columna esquerra**:
- Títol amb icona `fa-user`
- Info bàsica: username (email), data creació, data modificació
- Botó "Change Password"
- Formulari d'edició: username, email, name, disabled (checkbox)
- Botó "Save"

**Columna dreta**:
- Widget de Tags "Groups": llista de grups amb possibilitat d'afegir/eliminar
- Widget de Tags "Roles": llista de rols amb possibilitat d'afegir/eliminar

---

### 3.10 Vista GroupManager (`/db/container/groups/`)

**Funció**: Llista tots els grups.

**Toolbar**:
- Camp de cerca
- Botó "Add Group" (icona `fa-users`)

---

### 3.11 Vista Group (`/db/container/groups/editors/`)

**Funció**: Detall i edició d'un grup.

**Layout a tres columnes**:
1. **Títol editable** del grup
2. **Rols**: selector per afegir rols + tags per als rols assignats (eliminables)
3. **Usuaris**: camp de cerca d'usuaris per afegir-ne + tags per als membres (eliminables)

---

## 4. Panells de Detall (Tabs)

### 4.1 Panel Items

**Funció**: Llistat paginat d'objectes fills amb cerca, filtratge i ordenació.

**Estructura visual**:
```
┌──────────────────────────────────────────────────────────┐
│ [Filtres avançats (opcionals, si schema ho defineix)]    │
├──────────────────────────────────────────────────────────┤
│ [Choose action... ▾]        [Tags de cerca] [1/5 of 48] │
├──────────────────────────────────────────────────────────┤
│ ☐ │ 🎨  │ type  │ id/name        │ created   │ modified │
│ ☐ │ 📁  │ Folder│ documents      │ 15/03/24  │ 20/03/24│
│ ☐ │ 📄  │ Item  │ report.pdf     │ 10/03/24  │ 18/03/24│
│ ☐ │ 👤  │ User  │ admin          │ 01/01/24  │ 15/03/24│
├──────────────────────────────────────────────────────────┤
│                    ← 1 / 5 of 48 items →                 │
└──────────────────────────────────────────────────────────┘
```

**Columnes per defecte**:
1. Checkbox de selecció
2. Icona (segons tipus)
3. Type tag
4. Nom/títol (link navegable) + path en mode cerca
5. Data de creació
6. Data de modificació
7. Botó eliminar (🗑️)

**Funcionalitats**:
- **Selecció múltiple**: checkbox individual + "select all"
- **Accions en batch**: dropdown "Choose action..." amb Delete, Move, Copy (filtrades per permisos)
- **Ordenació**: columnes clicables (id/name, created, modified) amb indicadors ↑↓
- **Paginació**: navegació per pàgines amb info "X / Y of Z items"
- **Cerca**: text lliure que filtra per títol (o camps configurables)
- **Filtre per tipus**: dropdown de types
- **Filtres avançats**: configurables via registry (select, input, vocabulary)
- **Labels de cerca**: tags visuals per als filtres actius (eliminables)

**Filtres avançats (Schema Filters)**:
El registre permet definir filtres personalitzats per tipus de contingut:
- `select`: dropdown amb opcions estàtiques o vocabulari remot
- `input`: camp de text (text, number, date, etc.)

---

### 4.2 Panel Properties

**Funció**: Mostra i permet editar les propietats d'un objecte.

**Estructura**:
```
┌──────────────────────────────────────────────────────────┐
│ 📄 Títol de l'objecte                   [Botons custom] │
│ ──────────────────────────────────────────────────────── │
│ Propietat       │ Valor                                  │
│ @id             │ http://localhost:8080/db/container/...  │
│ @name           │ my-object                               │
│ @uid            │ abc-123-def-456                          │
│ ──────────────────────────────────────────────────────── │
│ Propietat       │ Valor                                  │
│ description     │ Click to edit  ✏️                       │
│ tags            │ [tag1] [tag2]  ✏️                       │
│ ──────────────────────────────────────────────────────── │
│ [Panels custom via registry]                             │
│ ──────────────────────────────────────────────────────── │
│ ▸ IDublinCore                                             │
│   title          │ My Document  ✏️                        │
│   description    │ Click to edit  ✏️                      │
│   creation_date  │ 2024-03-15                             │
│   creators       │ [admin]                                │
│ ──────────────────────────────────────────────────────── │
│ ▸ IAttachment                                             │
│   file           │ report.pdf (2.3MB) ⬇️  ✏️              │
│ ──────────────────────────────────────────────────────── │
│ ▸ IWorkflowBehavior                                       │
│   Current state: Published                                │
│   Actions: [Submit] [Reject] [Publish]                    │
└──────────────────────────────────────────────────────────┘
```

**Seccions**:
1. **Capçalera**: icona + títol/nom + botons personalitzats (via registry)
2. **Propietats bàsiques**: @id, @name, @uid (només lectura)
3. **Propietats del schema**: camps definits al type schema, editables inline si l'usuari té `ModifyContent`
4. **Panels personalitzats**: via registry
5. **Behaviors**: un bloc per cada behavior actiu (IDublinCore, IAttachment, IWorkflow, etc.)

**Edició Inline (EditableField)**:
- Clicar en un camp editable el converteix en input
- Botons "Save" / "Cancel" / "Delete" (si aplica)
- El tipus d'input s'adapta al schema:
  - `string` → text input
  - `integer` → number input
  - `boolean` → checkbox
  - `datetime` → datetime-local input
  - `textarea` / `richtext` → textarea
  - `file` → file upload
  - `select` → dropdown (amb opcions estàtiques o vocabulari remot)
  - `array` de strings → input list (afegir/eliminar valors)
  - `search` → camp de cerca amb autocomplete
  - `search_list` → llista de cerca múltiple
  - `object` → renderitzat recursiu de sub-camps

---

### 4.3 Panel Behaviors

**Funció**: Gestionar behaviors (activar/desactivar) d'un objecte.

**Tres seccions en taula**:

| Secció | Descripció | Acció |
|--------|------------|-------|
| **Static** | Behaviors que sempre estan actius al tipus | Botó "Disable" (desactivat) |
| **Enabled** | Behaviors dinàmics activats | Botó "Disable" (vermell) |
| **Available** | Behaviors disponibles per activar | Botó "Enable" (blau) |

---

### 4.4 Panel Permissions

**Funció**: Visualitzar i gestionar permisos de l'objecte actual.

**Layout a dues columnes**:

**Columna esquerra (8/12)** — Lectura:
1. **Role Permissions**: taula amb rol → permís → setting (Allow/Deny/Unset)
2. **Principal Permissions**: taula amb principal → permís → setting
3. **Principal Roles**: taula amb principal → rol → setting

**Columna dreta (4/12)** — Edició (si té `ChangePermissions`):
- Selector de tipus: "Role Permissions" / "Principal Permissions" / "Principal Roles"
- Segons selecció, formulari per afegir:
  - **Role-Permission**: selector de rol + selector de permís + operació (Allow/Deny/AllowSingle/Unset)
  - **Principal-Permission**: selector de principal + selector de permís + operació
  - **Principal-Role**: selector de principal + selector de rol + operació

**Dades carregades**:
- Permisos via `@sharing` endpoint
- Rols disponibles via `@available-roles`
- Principals (usuaris + grups) via `@users` + `@groups`
- Tots els permisos via `@all_permissions`

---

### 4.5 Panel Actions

**Funció**: Mostra botons d'acció disponibles per l'objecte actual.

**Accions per defecte** (filtrades per permisos):

| Acció | Permís | Comportament |
|-------|--------|-------------|
| **Delete** | `DeleteContent` | Modal de confirmació → DELETE l'objecte → navega al pare |
| **Move** | `MoveContent` | Modal amb input de path destí → POST `@move` → navega al nou path |
| **Copy** | `DuplicateContent` | Modal amb input de path destí + nou ID → POST `@duplicate` → refresca |

> Les aplicacions consumidores poden registrar accions personalitzades via registry.

---

### 4.6 Panel Addons (només Container)

**Funció**: Gestionar addons del container.

**Layout a dues columnes**:
- **Available Addons**: llista amb botó "Install" (blau)
- **Installed Addons**: llista amb botó "Remove" (vermell)

---

## 5. Accions i Modals

### 5.1 Afegir Contingut (AddItem)

**Trigger**: Botó "+" a la toolbar o dropdown de tipus.

**Flux**:
1. S'obre modal amb el formulari del tipus seleccionat
2. **Formulari base** (per Folder, Item, etc.): camps Title + ID (auto-generat des del títol)
3. **Formulari d'usuari**: camps username, email, name, password, disabled
4. L'aplicació consumidora pot registrar formularis personalitzats via registry
5. Submit → POST al path actual → flash "Content created!" o error → tanca modal

### 5.2 Eliminar Objecte (RemoveItem)

**Trigger**: Botó a panel Actions o botó 🗑️ a la fila de la taula.

**Flux**:
1. Modal de confirmació: "Are you sure to remove: {name}?"
2. Confirm → DELETE l'objecte → navega al pare → flash success
3. Cancel → tanca modal

### 5.3 Eliminar Múltiples (RemoveItems)

**Trigger**: Seleccionar items + dropdown "Choose action..." > Delete.

**Flux**: Modal de confirmació amb llista dels items a eliminar → DELETE cadascun → refresca.

### 5.4 Moure Objecte (MoveItem)

**Trigger**: Panel Actions > Move.

**Flux**:
1. Modal "Move to..." amb input de text per escriure el path destí (ex: `/folder`)
2. Nota: "Example: /folder (without /db/container on front)"
3. Confirm → POST `@move` amb `{ destination, new_id }` → navega al nou path

**Mancança important**: No hi ha tree picker ni cap forma visual de seleccionar el destí. L'usuari ha d'escriure el path manualment.

### 5.5 Copiar Objecte (CopyItem)

**Trigger**: Panel Actions > Copy.

**Flux**: Igual que Move però amb possibilitat de canviar l'ID de la còpia. Usa `@duplicate` endpoint.

### 5.6 Canviar Contrasenya (ChangePassword)

**Trigger**: Botó "Change Password" a la vista d'usuari.

**Flux**: Modal amb camp de nova contrasenya → PATCH l'objecte usuari.

### 5.7 Accions en Batch (sobre múltiples items)

**Trigger**: Seleccionar items via checkbox + dropdown d'accions.

**Accions disponibles**: Delete, Move, Copy (les mateixes que individuals però aplicades en batch).

---

## 6. Integració amb l'API de Guillotina

### 6.1 Autenticació

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `@login` | POST | Login amb `{ username, password }` → `{ token, exp }` |
| `@login-renew` | POST | Renovar token JWT (amb Bearer token actual) |

El token JWT es guarda a `localStorage` (`auth` + `auth_expires`). L'autenticació es gestiona de forma transparent: quan el token està a punt de caducar, es refresca automàticament.

### 6.2 Navegació i Context

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `GET /` | GET | Llista de databases → `{ databases: ["db1", "db2"] }` |
| `GET /db/` | GET | Llista de containers → `{ containers: ["site1", "site2"] }` |
| `GET /db/container/` | GET | Objecte container amb totes les propietats |
| `GET /db/container/path/to/object` | GET | Qualsevol objecte amb totes les propietats i behaviors |

### 6.3 Permisos

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{path}@canido?permissions=p1,p2,...` | GET | Retorna `{ "p1": true, "p2": false }` |
| `{path}@sharing` | GET | Retorna permisos locals i heretats |
| `{path}@all_permissions` | GET | Retorna tots els permisos definits (arbre complet) |
| `{container}@available-roles` | GET | Llista de rols disponibles |
| `{container}@users` | GET | Llista d'usuaris |
| `{container}@groups` | GET | Llista de grups |

**Permisos utilitzats per filtrar la UI**:

| Permís | Controls d'UI |
|--------|--------------|
| `guillotina.ViewContent` | Veure pestanyes Items, Properties |
| `guillotina.ModifyContent` | Editar camps, gestionar behaviors, transicions workflow |
| `guillotina.AddContent` | Botó afegir contingut |
| `guillotina.DeleteContent` | Botons eliminar, acció Delete |
| `guillotina.MoveContent` | Acció Move |
| `guillotina.DuplicateContent` | Acció Copy |
| `guillotina.SeePermissions` | Pestanya Permissions |
| `guillotina.ChangePermissions` | Formulari d'edició de permisos |
| `guillotina.ManageAddons` | Pestanya Addons |
| `guillotina.ReadConfiguration` | Pestanya Registry |

### 6.4 CRUD d'Objectes

| Operació | Endpoint | Mètode | Body |
|----------|----------|--------|------|
| Crear | `{path}` | POST | `{ "@type": "Folder", "id": "my-folder", "title": "My Folder" }` |
| Llegir | `{path}` | GET | — |
| Actualitzar | `{path}` | PATCH | `{ "title": "New Title" }` (parcial) |
| Eliminar | `{path}` | DELETE | — |
| Moure | `{path}@move` | POST | `{ "destination": "/target-folder", "new_id": "name" }` |
| Copiar | `{path}@duplicate` | POST | `{ "destination": "/target-folder", "new_id": "copy-name" }` |

### 6.5 Cerca

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{path}@search?params` | GET | Cerca dins del path especificat |

**Paràmetres de cerca (PostgreSQL)**:
- `b_start`: offset de paginació
- `b_size`: mida de pàgina
- `depth`: profunditat de cerca (1 = fills directes)
- `title__in`: cerca per títol
- `type_name`: filtre per tipus
- `_sort_asc` / `_sort_des`: ordenació per camp
- `__or`: condicions OR (per cercar en múltiples camps)

**Paràmetres de cerca (Elasticsearch)**:
- `_from`, `_size`: paginació
- `_metadata`: `*` per retornar tota la metadata
- `depth`: profunditat
- `path__wildcard`: filtre de path

**Resposta de cerca**:
```json
{
  "items": [...],
  "items_total": 48
}
```

### 6.6 Tipus i Schemas

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{container}@addable-types` | GET | Llista de tipus que es poden crear en aquest context |
| `{container}@types/{TypeName}` | GET | JSON Schema del tipus (propietats, required, definitions) |

**Schema d'un tipus** (exemple simplificat):
```json
{
  "title": "Item",
  "type": "object",
  "required": ["title"],
  "properties": {
    "title": { "type": "string", "title": "Title" },
    "description": { "type": "string", "title": "Description", "widget": "textarea" },
    "tags": { "type": "array", "items": { "type": "string" } }
  },
  "definitions": {
    "guillotina.behaviors.dublincore.IDublinCore": {
      "properties": { "title": {...}, "description": {...}, ... }
    }
  }
}
```

### 6.7 Fitxers i Imatges

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{path}@upload/{field}` | PATCH | Upload de fitxer (amb headers `Content-Type`, `X-UPLOAD-FILENAME`) |
| `{path}@download/{field}` | GET | Descarrega fitxer |

### 6.8 Behaviors

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{path}@behaviors` | GET | `{ static: [...], dynamic: [...], available: [...] }` |
| `{path}@behaviors` | PATCH | Activar behavior: `{ "behavior": "interface.name" }` |
| `{path}@behaviors` | DELETE | Desactivar behavior: `{ "behavior": "interface.name" }` |

### 6.9 Workflow

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{path}@workflow` | GET | Estat actual + transicions disponibles + historial |
| `{path}@workflow/{action}` | POST | Executar transició (ex: `@workflow/publish`) |

**Resposta de @workflow**:
```json
{
  "@id": "http://localhost:8080/db/container/item/@workflow",
  "history": [
    { "actor": "admin", "time": "2024-03-15", "title": "publish", "type": "workflow", "data": { "review_state": "published" } }
  ],
  "transitions": [
    { "@id": "http://.../@workflow/retract", "title": "Retract", "metadata": { "translated_title": { "en": "Retract", "ca": "Retirar" } } }
  ]
}
```

### 6.10 Addons

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{path}@addons` | GET | `{ available: [...], installed: [...] }` |
| `{path}@addons` | POST | Instal·lar addon: `{ "id": "addon-key" }` |
| `{path}@addons` | DELETE | Desinstal·lar addon: `{ "id": "addon-key" }` |

### 6.11 Vocabularis

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{container}@vocabularies/{name}` | GET | `{ items: [{ title, token }], items_total }` |

S'utilitzen per selectors de workflow states, categories, etc.

### 6.12 Gestió de Grups (via endpoints especials)

| Endpoint | Mètode | Descripció |
|----------|--------|------------|
| `{container}@groups/{groupId}` | PATCH | Actualitzar membres: `{ "users": { "user1": true, "user2": false } }` |

---

## 7. Sistema de Permisos Aplicat a la UI

### 7.1 Filtratge de Pestanyes

Cada vista defineix un mapa `tabs → permissions`. Només es mostren les pestanyes per les quals l'usuari té el permís:

```
Vista Container:
  Items    → guillotina.ViewContent
  Addons   → guillotina.ManageAddons
  Registry → guillotina.ReadConfiguration
  Behaviors → guillotina.ModifyContent
  Permissions → guillotina.SeePermissions
  Actions  → (sense permís específic, les accions internes es filtren)
```

### 7.2 Filtratge d'Accions

Les accions (Delete, Move, Copy) es mostren/habiliten segons:
- `guillotina.DeleteContent` → Delete
- `guillotina.MoveContent` → Move
- `guillotina.DuplicateContent` → Copy

Tant per accions individuals com per batch, el dropdown desactiva les opcions sense permís.

### 7.3 Edició de Camps

Els camps a Properties es mostren com a editables (amb icona ✏️) només si:
1. L'usuari té `guillotina.ModifyContent`
2. El camp no és `readonly` al schema

---

## 8. Internacionalització (i18n)

### 8.1 Idiomes Suportats
- **Anglès** (en) — per defecte
- **Castellà** (es)
- **Català** (ca)

### 8.2 Sistema
Utilitza `react-intl` amb missatges compilats. Cada cadena de text visible a la UI té un `id` i un `defaultMessage`.

### 8.3 Missatges Genèrics Clau
Tots els textos d'interfície estan definits com a missatges internacionalitzables: botons (Save, Cancel, Delete, Create), labels (Title, Property, Value, Role, Permission, Setting), estats (Loading, No results), i missatges de feedback (Field updated, Content created, Error).

---

## 9. Sistema d'Extensibilitat (Registry)

### 9.1 Què es Pot Personalitzar

El sistema de registry permet a les aplicacions consumidores personalitzar completament la UI sense modificar el codi font:

| Clau | Funció |
|------|--------|
| `views` | Components de vista per tipus de contingut (ex: `{ Article: ArticleView }`) |
| `forms` | Formularis de creació per tipus (ex: `{ Article: ArticleForm }`) |
| `actions` | Accions disponibles (ex: `{ publish: PublishAction }`) |
| `behaviors` | Renderitzadors de behaviors |
| `itemsColumn` | Columnes personalitzades per la taula d'items |
| `properties` | Configuració de propietats visibles, buttons i panels |
| `schemas` | Filtres avançats per la vista d'items |
| `paths` | Components per paths específics (ex: `{ "/db/container/tags/": TagsView }`) |
| `components` | Override de components bàsics (Path, EditComponent, RenderFieldComponent) |
| `fieldsToFilter` | Camps en què cercar per tipus |
| `defaultSortValue` | Ordenació per defecte per tipus |
| `actionsList` | Accions personalitzades per la taula d'items |

### 9.2 Implicacions per al Disseny

**Qualsevol nou disseny ha de mantenir**:
- La capacitat de registrar vistes personalitzades per tipus
- La capacitat de registrar formularis personalitzats per tipus
- La capacitat d'afegir accions personalitzades
- La capacitat de personalitzar columnes de la taula
- La capacitat d'afegir panells/botons personalitzats a la vista de propietats
- L'extensibilitat dels filtres de cerca

---

## 10. Mapa de Totes les Pantalles i Fluxos

### 10.1 Diagrama de Navegació

```
[Login] ──────────────────────────────────────────────────────
    │
    ▼
[Application] ── llista DB
    │
    ▼
[Database] ── llista Containers ── [+ Create Container]
    │
    ▼
[Container] ─┬─ [Items] ── llista objects ─┬─ click item ── [Item/Folder]
             │                              ├─ select + action ── [Modal Batch]
             │                              ├─ + add ── [Modal AddItem]
             │                              └─ 🗑️ delete ── [Modal Confirm]
             ├─ [Addons] ── instal·lar/desinstal·lar
             ├─ [Behaviors] ── activar/desactivar
             ├─ [Permissions] ── veure/editar permisos
             └─ [Actions] ── delete/move/copy ── [Modal]
                    │
[Folder] ────┬─ [Items] ── (igual que Container)
             ├─ [Properties] ── veure/editar propietats + behaviors
             ├─ [Behaviors] ── activar/desactivar
             ├─ [Permissions] ── veure/editar permisos
             └─ [Actions] ── delete/move/copy ── [Modal]
                    │
[Item] ──────┬─ [Properties] ── veure/editar propietats + behaviors + workflow
             ├─ [Behaviors] ── activar/desactivar
             ├─ [Permissions] ── veure/editar permisos
             └─ [Actions] ── delete/move/copy ── [Modal]
                    │
[UserManager] ── [Users] ── llista users ── [+ Add User]
    │
    ▼
[User] ── detall + edició + grups + rols + [Change Password]
                    │
[GroupManager] ── [Groups] ── llista grups ── [+ Add Group]
    │
    ▼
[Group] ── detall + rols + membres
```

### 10.2 Diagrama de Flux de Dades

```
URL change (?path=X)
    │
    ▼
Guillotina Component
    │
    ├─► GET {path} ──────────► context object
    │
    ├─► GET {path}@canido ──► permissions map
    │
    ▼
Registry.getPathComponent(context, path)
    │
    ▼
View Component (Container/Folder/Item/User...)
    │
    ├─► filterTabs(tabs, tabsPermissions)
    │
    ▼
TabsPanel
    │
    ├─► Tab: Items ──► GET {path}@search ──► items list
    ├─► Tab: Properties ──► GET @types/{type} ──► schema ──► render fields
    ├─► Tab: Behaviors ──► GET @behaviors ──► static/dynamic/available
    ├─► Tab: Permissions ──► GET @sharing + @available-roles + @users + @groups
    ├─► Tab: Addons ──► GET @addons
    └─► Tab: Actions ──► registry.getActionsList()
```

---

## 11. Notificacions i Feedback

### 11.1 Flash Messages
Sistema de notificació tipus "toast" a la part superior de la pàgina:
- **Success** (verd/primary): "Content created!", "Field updated!", "User updated"
- **Danger** (vermell): "An error has occurred: {message}", "Failed to delete item!"
- **Warning** (groc): usat per accions
- Tanca automàtica via botó × (no hi ha auto-dismiss)
- Scroll automàtic al top de la pàgina

### 11.2 Loading States
- **Loading global**: Spinner centrat quan es carrega el context
- **Loading de taula**: Barra de progrés (`.progress-line`) sobre la taula d'items
- **Loading de botons**: Classe `is-loading` de Bulma als botons durant peticions

### 11.3 Estats d'Error
- **401/404**: Pantalla "NotAllowed" (no es pot accedir al contingut)
- **Error Boundary**: Captura errors de renderitzat amb fallback

---

## 12. Resum de Pain Points i Oportunitats de Millora

### 12.1 Navegació
- ❌ No hi ha sidebar ni arbre de navegació persistent
- ❌ No hi ha "favorits" ni "recent"
- ❌ Breadcrumb com a únic mecanisme de navegació
- ❌ No hi ha dashboard ni pàgina d'inici post-login
- ✨ Oportunitat: sidebar amb arbre de contingut, favorits, accesos ràpids

### 12.2 Gestió de Contingut
- ❌ Moure/Copiar requereix escriure paths manualment
- ❌ No hi ha vista de previsualització
- ❌ No hi ha vista grid/card (només taula)
- ❌ No hi ha drag & drop per reordenar o moure contingut
- ❌ No hi ha indicació visual de workflow state a la llista
- ✨ Oportunitat: tree picker per moure/copiar, vistes grid/kanban, drag & drop

### 12.3 Formularis
- ❌ Edició inline és funcional però poc elegant (clica → apareix input → save/cancel)
- ❌ No hi ha mode "formulari complet" per editar totes les propietats de cop
- ❌ No hi ha validació visual dels camps (no errors inline)
- ✨ Oportunitat: mode edició complet amb validació, autosave, drafts

### 12.4 Permisos
- ❌ La vista de permisos és molt densa i difícil de comprendre
- ❌ No hi ha visualització jeràrquica (heretats vs locals)
- ❌ No hi ha indicadors visuals de nivell d'accés
- ✨ Oportunitat: matriu visual de permisos, mode simplificat per rols comuns

### 12.5 Usuaris i Grups
- ❌ La gestió és funcional però bàsica
- ❌ No hi ha cerca/filtratge avançat d'usuaris
- ❌ No hi ha indicador d'activitat dels usuaris
- ✨ Oportunitat: panell d'administració d'usuaris complet, audit trail

### 12.6 UX General
- ❌ Estètica "admin panel genèric" amb Bulma
- ❌ No hi ha mode fosc
- ❌ No hi ha responsive design optimitzat per mòbil
- ❌ Feedback asíncron poc sofisticat (flash message al top)
- ❌ Confirmacions bàsiques (text pla sense context visual)
- ✨ Oportunitat: design system modern, dark mode, mobile-first, toasts contextuals

---

## 13. Inventari Complet de Components UI

### 13.1 Components d'Entrada (Input)

| Component | Descripció | Variants |
|-----------|------------|----------|
| `Input` | Camp de text genèric | text, number, date, datetime-local, time, email, password |
| `Textarea` | Àrea de text multilínia | — |
| `Checkbox` | Checkbox booleà | — |
| `Select` | Selector dropdown | single, multiple, amb `appendDefault` |
| `SelectVocabulary` | Selector que carrega opcions des d'un vocabulari remot | single, multiple |
| `SearchInput` | Camp de cerca amb autocomplete (cerca objectes al servidor) | — |
| `SearchInputList` | Igual però per selecció múltiple | — |
| `InputList` | Llista d'inputs per arrays de strings (afegir/eliminar) | — |
| `FileUpload` | Upload de fitxers | — |
| `Dropdown` | Menú desplegable amb opcions clicables | — |
| `Button` | Botó amb suport de loading state | — |
| `FormBuilder` | Genera formularis automàticament a partir d'un JSON Schema | — |

### 13.2 Components UI Base

| Component | Descripció |
|-----------|------------|
| `Icon` | Wrapper per icones FontAwesome |
| `Loading` | Spinner de càrrega |
| `Table` | Taula amb headers opcionals |
| `Tag` | Etiqueta amb botó d'eliminar |
| `TagsWidget` | Widget de tags amb selector per afegir |
| `Notification` | Missatge de notificació (success, danger, warning) |
| `Delete` | Botó × per eliminar/tancar |
| `Modal` | Modal amb overlay i botó de tancar |
| `Confirm` | Modal de confirmació (Cancel/Confirm) |
| `PathTree` | Modal amb input de path (per Move/Copy) |
| `Pagination` | Navegació per pàgines amb comptador |

### 13.3 Components Estructurals

| Component | Descripció |
|-----------|------------|
| `Layout` | Navbar + logout + section principal |
| `Guillotina` | Component arrel que gestiona state, routing, i18n |
| `TraversalProvider` | Context provider amb la instància Traversal |
| `TabsPanel` | Container de pestanyes amb toolbar |
| `Path` | Breadcrumb de navegació |
| `Flash` | Àrea de notificacions flash |
| `ErrorBoundary` | Captura errors de renderitzat |
| `ContextToolbar` | Barra d'eines amb cerca + filtre + botó afegir |

---

## 14. Configuració Disponible

| Paràmetre | Per Defecte | Descripció |
|-----------|-------------|------------|
| `DisabledTypes` | `['UserManager', 'GroupManager']` | Tipus que no apareixen al selector de filtre |
| `PageSize` | `10` | Items per pàgina |
| `DelayActions` | `200` | Delay per accions (ms) |
| `SearchEngine` | `'PostreSQL'` | Motor de cerca (`PostreSQL` o `Elasticsearch`) |
| `SizeImages` | — | Mides d'imatge disponibles |
| `icons` | — | Mapa de tipus → icona personalitzada |
| `properties_default` | `['@id', '@name', '@uid']` | Propietats bàsiques a mostrar |
| `properties_ignore_fields` | `[behaviors, metadata...]` | Camps a ignorar a Properties |

---

## 15. Glossari

| Terme | Definició |
|-------|-----------|
| **Traversal** | Patró de navegació per path. Cada URL resol a un objecte de l'arbre de contingut |
| **Context** | L'objecte Guillotina corresponent al path actual |
| **Registry** | Sistema de plugins que permet sobreescriure components per tipus de contingut |
| **Behavior** | Mixin que afegeix funcionalitat extra a un objecte (metadata, fitxers, workflow) |
| **Container** | Espai de treball equivalent a un "site web" dins una base de dades |
| **Folderish** | Objecte que pot contenir fills (Folder, Container) vs. Item (fulla) |
| **Principal** | Entitat amb identitat: User o Group |
| **Sharing** | Mapa de permisos assignats a un objecte |
| **Addon** | Extensió instal·lable que afegeix funcionalitat al container |
| **Vocabulary** | Llista d'opcions predefinides carregada des del servidor |
| **Flash** | Missatge de notificació temporal a la part superior de la pàgina |
| **Schema** | Definició JSON de l'estructura d'un tipus de contingut |

---

> **Nota per l'agent de disseny**: Aquest document descriu l'estat funcional actual. L'objectiu és mantenir tota la funcionalitat descrita (i el sistema d'extensibilitat via registry) però millorar radicalment l'experiència d'usuari, la navegació, i l'estètica visual. Considereu també les oportunitats de millora llistades a la secció 12.
