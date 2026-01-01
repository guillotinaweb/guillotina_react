---
applyTo: '**'
---

# Guillotina React - Functional Context

Business domain knowledge for AI assistants working with this content management framework.

## Business Context

Guillotina React enables developers to build **custom admin interfaces** for Guillotina-based applications. The framework abstracts away common CMS patterns (CRUD operations, permissions, content traversal) while allowing full customization.

### Primary Use Cases
- **Content management portals**: Browse, create, edit, delete content objects
- **User/Group administration**: Manage users, groups, and role assignments
- **Permission management**: Configure access controls per content item
- **Workflow management**: Apply and transition workflow states
- **File/attachment handling**: Upload, preview, and manage files attached to content

## Domain Concepts

### Content Hierarchy (Traversal)
Guillotina organizes content in a tree structure accessible via REST API paths:
- **Application** → Top-level entry point (list of databases)
- **Database** → Contains containers
- **Container** → Root folder for content (like a "site")
- **Folder** → Contains child items (folderish)
- **Item** → Leaf content objects

The **path** represents location in this hierarchy: `/db/container/folder1/item1`

### Content Types
Guillotina content types define structure and behavior:
- `Folder`: Container for other objects
- `Item`: Basic content object
- `User`: System user (in UserManager)
- `Group`: User group (in GroupManager)
- Custom types defined by applications

### Behaviors
Behaviors are mixins that add functionality to content:
- `IDublinCore`: Metadata (title, description, dates, creators)
- `IAttachment`: Single file attachment
- `IMultiAttachment`: Multiple file attachments
- `IImageAttachment`: Image with scales
- `IWorkflow`: Workflow state management

### Permissions Model
Guillotina uses a fine-grained permission system:
- **Permissions**: Atomic rights (`guillotina.ViewContent`, `guillotina.ModifyContent`)
- **Roles**: Collections of permissions (`guillotina.Manager`, `guillotina.Editor`)
- **Principals**: Users and groups that receive role assignments

## Primary Workflows

### Content Browsing Flow
1. User navigates via path (URL query param `?path=/db/container/...`)
2. `Guillotina` component fetches context via `client.getContext(path)`
3. Permissions are checked via `client.canido(path, Permissions)`
4. Registry determines which view component to render based on content type
5. View renders tabs filtered by user permissions

### Content Creation Flow
1. User triggers `addItem` action with content type
2. Registry provides appropriate form component for type
3. Form collects data and calls REST API to create object
4. On success, context refreshes and navigates to new item

### Permission-Based Rendering
```
User Request → Fetch Context → Check Permissions → Filter UI
                                    ↓
                    TabsPanel shows only permitted tabs
                    Actions show only permitted operations
                    Fields render based on edit/view rights
```

## Business Rules

### UI Filtering Rules
- Tabs require specific permissions to display (e.g., Edit tab needs `guillotina.ModifyContent`)
- Actions check permissions before rendering buttons
- Properties panel respects `ViewContent` vs `ModifyContent`

### Content Type Rules
- Folderish types can contain children (Folder, Container)
- Non-folderish types are leaf nodes (Item)
- UserManager/GroupManager are special containers for principals

### Behavior Rules
- Behaviors listed in `__behaviors__` array are active on object
- `@static_behaviors` are always applied to the type
- Behavior components render only when behavior is active

## Integration Points

### Guillotina REST API
The framework expects a Guillotina server providing:
- `GET /{path}`: Fetch content object
- `POST /{path}`: Create child object
- `PATCH /{path}`: Update object
- `DELETE /{path}`: Delete object
- `GET /@canido`: Check permissions
- `GET /@types`: List available content types
- `GET /@search`: Search content (PostgreSQL or Elasticsearch)

### Authentication
Auth is handled via JWT tokens:
- `Auth` class manages token storage/refresh
- Tokens include user principal and roles
- Expiration triggers re-login

## Extension Philosophy

**Consumer applications should extend via registry, not fork**:
- Register custom views for new content types
- Override default forms with type-specific forms
- Add custom actions for domain operations
- Define behavior components for custom behaviors
- Configure column renderers for content lists
