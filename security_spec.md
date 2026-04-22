# Security Specification - Piux Dex Firestore

## Data Invariants
1. **Subjects**: Read-only for authenticated users. Updates restricted to authorized administrators.
2. **Tasks**: Strictly isolated by `ownerId`. A user can only read, create, update, or delete their own tasks.
3. **Resources**: Collaborative. Authenticated users can read and create. Deletion restricted to owner or admin.
4. **Clipboard**: Single shared instance. Authenticated users can read and update.

## The Dirty Dozen (Attack Vectors)
1. **The ID Poisoning**: Attempting to create a task with a document ID that is 20KB of junk data.
2. **The Shadow Task**: Attempting to create a task for another user by spoofing `ownerId`.
3. **The Unauthorized Snooping**: Attempting to list tasks belonging to another user.
4. **The Resource Eraser**: Attempting to delete a resource uploaded by another student.
5. **The Admin Escalation**: Attempting to update subject syllabus as a regular student.
6. **The Clipboard Wipe**: Attempting to set clipboard content to null or invalid types.
7. **The Type Injection**: Sending a boolean where a string (Topic Name) is expected.
8. **The Oversized Payload**: Attempting to store a 1MB string in the material label.
9. **The Orphaned Resource**: Creating a resource with a non-existent subject ID.
10. **The Update Gap**: Modifying the `creatorId` of a resource during an update.
11. **The Future task**: Creating a task with a date that exceeds reasonable bounds.
12. **The Unverified Access**: Attempting to write data with an unverified email (if applicable).

## Test Assertions
- `get /tasks/another_user_task` -> **PERMISSION_DENIED**
- `create /tasks/my_task` with `ownerId: other_uid` -> **PERMISSION_DENIED**
- `update /subjects/BTCOC401` -> **PERMISSION_DENIED**
- `update /clipboard/global` with `content: 123` (number) -> **PERMISSION_DENIED**
