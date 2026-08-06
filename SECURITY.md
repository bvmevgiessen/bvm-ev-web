# Security Policy

## Overview

The BVM e.V. website is hosted on GitHub Pages and maintained through the public repository.

We take the security of this website and its dependencies seriously and continuously monitor for security vulnerabilities.

To help maintain a secure platform, we use:

- GitHub Dependabot for automated dependency vulnerability detection and updates
- Aikido Security for continuous security and supply chain monitoring
- GitHub Security Advisories and Alerts
- Automated CI/CD validation through GitHub Actions

## Supported Versions

Security updates are only provided for the latest version deployed from the `main` branch.

| Version | Supported |
|----------|-----------|
| Latest (main) | ✅ |
| Older revisions | ❌ |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

### Please do NOT

- Open a public GitHub Issue for security vulnerabilities
- Publish exploit details before a fix is available
- Share sensitive information publicly

### Preferred Reporting Method

Please use GitHub's private vulnerability reporting feature:

1. Navigate to the repository's **Security** tab.
2. Select **Report a vulnerability**.
3. Submit the details confidentially.

### Alternative Contact

If GitHub private reporting is unavailable, contact the maintainers directly:

**Email:** security@bvmevgiessen.de

Please include:

- Description of the vulnerability
- Steps to reproduce
- Impact assessment
- Affected URL, page, or component
- Proof of concept (if available)

## Disclosure Process

After receiving a report, we will:

1. Acknowledge receipt of the report.
2. Assess the severity and impact.
3. Develop and test a fix.
4. Deploy the remediation.
5. Coordinate responsible disclosure where appropriate.

## Security Measures

This repository implements several security controls:

### Dependency Security

- GitHub Dependabot scans dependencies for known vulnerabilities.
- Dependabot Pull Requests are reviewed before being merged.
- Dependency updates are monitored continuously.

### Supply Chain Security

- Aikido Security monitors:
  - Open-source dependencies
  - Known CVEs
  - License risks
  - Supply chain threats
  - Repository security posture

### Source Control Security

- Changes are managed through GitHub Pull Requests.
- Repository history is fully auditable.
- Automated workflows validate deployments.

## Scope

This policy applies to:

- The public website
- GitHub Actions workflows
- Website dependencies and packages
- Build and deployment configuration

Third-party services and external websites linked from this project are outside the scope of this policy.

## Responsible Disclosure

We appreciate security researchers and users who report vulnerabilities responsibly and help improve the security of this project.

Thank you for helping keep the BVM e.V. website secure.

## Automated Security Monitoring

This repository uses multiple automated security solutions to detect and remediate vulnerabilities.

### GitHub Dependabot

Dependabot is enabled for this repository and provides:

- Dependency vulnerability monitoring
- Automated security alerts
- Security update pull requests for vulnerable dependencies
- Version update pull requests for supported package ecosystems

When Dependabot identifies a vulnerable dependency:

1. A security alert is generated in GitHub.
2. A pull request may be automatically created with a patched version.
3. Repository maintainers review the proposed changes.
4. The update is tested through the CI/CD pipeline.
5. After successful validation, the update is merged and deployed.

Contributors should review Dependabot pull requests with the same level of scrutiny as any other code change.

### Aikido Security

Aikido Security continuously monitors the repository for:

- Vulnerable dependencies
- Known CVEs
- Supply chain threats
- License compliance risks
- Repository security issues
- Secrets exposure (where applicable)

Security findings are reviewed by repository maintainers and prioritized based on severity and impact.

### Security Update Policy

Repository maintainers strive to:

- Apply Critical vulnerabilities as soon as possible.
- Review High severity vulnerabilities promptly.
- Regularly evaluate Medium and Low severity findings.
- Keep dependencies reasonably up to date, even when no active vulnerability exists.

### Enabling Dependabot Security Updates

For repository administrators:

1. Open **Settings** → **Security & analysis**.
2. Enable:
   - ✅ Dependabot alerts
   - ✅ Dependabot security updates
   - ✅ Dependency graph
   - ✅ Dependabot version updates
3. Ensure a valid `.github/dependabot.yml` configuration exists.
4. Review and merge Dependabot pull requests regularly.

Example configuration:

```yaml
version: 2

updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

For GitHub Pages projects that use npm-based build tooling, Dependabot automatically checks dependencies against GitHub's vulnerability database and proposes fixes when available.

### GitHub Actions Security

GitHub Actions workflows should:

- Use pinned action versions where possible.
- Minimize token permissions.
- Avoid storing secrets directly in workflow files.
- Regularly update GitHub Actions dependencies.
- Review third-party actions before adoption.
