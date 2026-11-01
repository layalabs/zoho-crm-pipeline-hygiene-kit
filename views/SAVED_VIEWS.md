# Saved view recipes

Create these views in the Zoho CRM Deals module. Use them to check the daily digest.

## Deals with an overdue closing date

Use these conditions:

1. Set `Stage` to exclude your closed stages.
2. Set `Closing Date` to before today.

## Deals with no next step

Use these conditions:

1. Set `Stage` to exclude your closed stages.
2. Set `Next Step` to empty.

## Deals with old activity

Use these conditions:

1. Set `Stage` to exclude your closed stages.
2. Set `Last Activity Time` to before the selected limit.

The generated function uses 14 days as its default limit.

## Deals with no open activity

Use the Deals advanced filter. Select deals without an upcoming activity.

Zoho can label filters differently across editions. Compare this view with the digest in your sandbox.
