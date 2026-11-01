# Build the Extension in Zoho Sigma

This guide creates the extension candidate in the Zoho Developer Console. Zoho CRM extensions can only be created in the US data center.

## Create the extension

1. Sign in to [Zoho Sigma](https://sigma.zoho.com/).
2. Create or open the Laya Labs workspace.
3. Create a public extension for Zoho CRM.
4. Set the name to `Pipeline Hygiene for Zoho CRM`.
5. Set the namespace to `layalabspipelinehygiene`.
6. Use the description from `marketplace/submission.json`.

Do not change the namespace after creation. The Deluge function uses it for the activation property.

## Add the activation property

1. Open **Custom Properties**.
2. Create a read-write property.
3. Set **Field Name** to `Enabled`.
4. Set **API Name** to `Enabled`.
5. Set the default value to `false`.
6. Save the property.

Confirm that Sigma creates the API name `layalabspipelinehygiene__Enabled`.

## Add the daily schedule

1. Open **Automate → Schedules**.
2. Create a daily schedule.
3. Set the name to `Daily Pipeline Hygiene Digest`.
4. Set the description to `Checks open deals and emails one hygiene digest to each owner.`
5. Set the execution time to `08:00`.
6. Create the function `Pipeline Hygiene Digest`.
7. Paste `dist/pipeline_hygiene.deluge` into the Deluge editor.
8. Save the function and schedule.

Sigma can supply a function declaration in the editor. If it does, keep the Sigma declaration. Copy only the code between the outer braces.

Zoho runs an extension schedule once after installation. The `Enabled` property makes this first run a no-op.

## Test the extension

1. Select **Test Your Extension**.
2. Open the isolated test organization.
3. Confirm that `Enabled` has the value `false`.
4. Install the extension.
5. Confirm that the first schedule run sends no email.
6. Add synthetic Deals for all six rules.
7. Change `Enabled` to `true`.
8. Run the schedule once.
9. Compare the digest with the expected synthetic results.
10. Confirm that the extension changes no Deal records.
11. Change `Enabled` to `false` after the test.

Record the organization edition, data center, run time, log result, recipients, and unexpected changes.

## Prepare the public submission

1. Open the extension details page.
2. Publish the tested version as public.
3. Use `marketplace/submission.json` for the Marketplace fields.
4. Upload the files from `marketplace/assets`.
5. Use `docs/PRIVACY.md` for the privacy URL.
6. Use `docs/TERMS.md` for the terms URL.
7. Use `docs/ADMIN_GUIDE.md` for user education.
8. Select **Free** for the first release.
9. Submit the extension for Marketplace review.

Do not submit before the sandbox test passes. Zoho reviews the installation, behavior, documentation, and Marketplace content.
