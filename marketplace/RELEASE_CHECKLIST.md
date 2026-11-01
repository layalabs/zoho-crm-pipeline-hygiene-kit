# Marketplace Release Checklist

## Local candidate

- [ ] `npm test` passes.
- [ ] `npm run generate` changes no committed file.
- [ ] `npm pack --dry-run` lists all Marketplace files.
- [ ] The `Enabled` property gate appears before all CRM reads and email actions.
- [ ] The three image files have the required dimensions.

## Sigma build

- [ ] The extension name is `Pipeline Hygiene for Zoho CRM`.
- [ ] The namespace is `layalabspipelinehygiene`.
- [ ] The generated property API name is `layalabspipelinehygiene__Enabled`.
- [ ] The property default is `false`.
- [ ] The daily schedule uses the organization time zone.
- [ ] The schedule uses the tested Deluge function.

## Sandbox test

- [ ] The first installation run sends no email.
- [ ] Each synthetic rule produces the expected reason.
- [ ] A healthy Deal does not appear.
- [ ] A closed Deal does not appear.
- [ ] Zero remains a valid Amount.
- [ ] Customer text appears as escaped HTML.
- [ ] The function changes no Deal field.
- [ ] The function creates no Task.
- [ ] The function log has no error.

## Marketplace submission

- [ ] The owner reviews the privacy policy and terms.
- [ ] The owner completes the Zoho vendor profile.
- [ ] The owner supplies the support email, address, and telephone number.
- [ ] The public policy URLs open without authentication.
- [ ] The listing states the 25-deal limit.
- [ ] The listing states that installation is disabled by default.
- [ ] The uploaded screenshot uses synthetic data.
- [ ] The first version is free.
- [ ] The extension is submitted for Marketplace review.

## Evidence after submission

- [ ] Record the submitted version number.
- [ ] Record the submission date and status.
- [ ] Save the private installation URL for pilot testers.
- [ ] Do not call the extension public until Zoho approves the listing.
