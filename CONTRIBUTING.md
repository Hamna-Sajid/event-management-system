# Commit and Branching Guidelines

### Purpose

This document defines how commits, branches, and pull requests should be handled in this repository.
The goal is to keep the codebase stable, the history clean, and collaboration straightforward.

---

## 1. Branching Strategy: GitHub Flow

We implement the **GitHub Flow** strategy. This model is chosen for its simplicity and its support for continuous delivery by strictly enforcing that the **`main`** branch is always in a deployable state.

### Branch Structure

| Branch Type                 | Purpose                                                        | Source | Destination               | Key Note                                                                  |
| :-------------------------- | :------------------------------------------------------------- | :----- | :------------------------ | :------------------------------------------------------------------------ |
| **`main`**                  | The authoritative source for **production-ready code**.        | N/A    | N/A                       | **Protected Branch.** Merges require prior review and successful testing. |
| **`feature/<description>`** | Development work for new features, bug fixes, or enhancements. | `main` | `main` (via Pull Request) | **Short-lived.** Create one branch for each distinct feature or task.     |

### Workflow Rules

1. **Direct Commits Prohibited:** Committing directly to the `main` branch is strictly forbidden.
2. **Branch Creation:** Start all new work by creating a branch from the latest state of `main`:

   ```bash
   git checkout main
   git pull origin main
   git checkout -b feature/login-auth-flow
   ```
3. **Isolation:** All development changes must be committed exclusively to the feature branch.
4. **Integration:** Upon completion, open a Pull Request (PR) with `main` as the target branch.

---

## 2. Commit Message Convention: Conventional Commits

All commits must adhere to the **Conventional Commits** specification. This ensures a predictable history and supports tooling for tasks like automatic changelog generation.

### Format

```
<type>(optional scope): <short, imperative description>

[optional body]

[optional footer]
```

### Allowed Commit Types

| Type           | Description                                                                       |
| :------------- | :-------------------------------------------------------------------------------- |
| **`feat`**     | Introduces a new feature or capability.                                           |
| **`fix`**      | Resolves a bug or issue.                                                          |
| **`docs`**     | Changes to documentation only (e.g., README, technical comments).                 |
| **`style`**    | Code style or formatting changes (e.g., whitespace, semicolons; no logic impact). |
| **`refactor`** | Code restructuring that does not alter existing behavior.                         |
| **`perf`**     | Code changes focused on improving performance.                                    |
| **`test`**     | Adding or modifying unit or integration tests.                                    |
| **`chore`**    | Maintenance, tooling, or build-related updates (e.g., updating dependencies).     |

### Commit Rules

* **Subject Line:** The subject line must be concise and remain **under 72 characters**.
* **Tone:** Use the **imperative mood** (e.g., "Add," "Fix," "Update").
* **Focus:** Group related changes into a single, cohesive commit; avoid unrelated modifications.
* **Clarity:** Include a descriptive body for complex or significant changes, explaining *what* was changed and *why*.
* **Cleanliness:** Do not commit broken, untested, or incomplete code. Remove all debug statements (`console.log`, etc.) and commented-out code prior to committing.

---

## 3. Pull Request (PR) and Merge Process

The Pull Request is the official gateway for merging code into `main`.

### PR Workflow

1. **Submission:** Push your feature branch to the remote repository and open a Pull Request targeting the `main` branch.
2. **Automated Checks:** GitHub Actions will automatically run:
   - ESLint (code quality)
   - Build verification
   - Test suite (all tests must pass)
3. **Review:** A review from a designated team member is mandatory.
4. **Approval:** The reviewer/tester must verify functionality and provide explicit approval.
5. **Merging:** Once approved and all checks pass, the feature branch must be merged into `main` using the **squash and merge** option. This ensures that the feature's entire history is consolidated into a single, clean commit on `main`.
6. **Cleanup:** The feature branch must be deleted immediately after a successful merge.

### Testing Requirements

**All new features and bug fixes must include tests.** This is mandatory for PR approval.

- **New functions in `lib/`** require unit tests
- **New React components in `components/`** require component tests
- **Bug fixes** must include a regression test

Refer to **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** for detailed testing instructions, templates, and examples.

### Pull Request Template

When creating a Pull Request on GitHub, a template will automatically populate with the following sections:

- Description of changes
- Type of change (feature, bug fix, etc.)
- Testing checklist
- Test coverage details
- Related issues

The template is located at `.github/pull_request_template.md` and will appear automatically when you create a new PR.

---

## 4. Summary of Best Practices

| Action            | **Do**                                                                   | **Do Not**                                                  |
| :---------------- | :----------------------------------------------------------------------- | :---------------------------------------------------------- |
| **Branching**     | Write clear, descriptive branch names (e.g., `feature/user-profile-ui`). | Push directly to `main` under any circumstance.             |
| **Committing**    | Keep commits small, focused, and aligned with a single task.             | Use vague or generic commit messages (e.g., "update code"). |
| **Quality**       | Ensure all code is reviewed, tested, and approved before merging.        | Commit code that has not been tested or is incomplete.      |
| **History**       | Reference relevant issue numbers or tickets in the commit body/footer.   | Include temporary or experimental files in final commits.   |
| **Documentation** | Update documentation or code comments when necessary.                    | Merge without full review and testing sign-off.             |
