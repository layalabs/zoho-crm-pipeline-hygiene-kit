# Install the beta in a Zoho CRM sandbox

Use a sandbox first. This beta has not completed a live Zoho test.

## Check the account

1. Confirm that your Zoho CRM edition supports scheduled functions.
2. Open **Setup → Developer Hub → APIs → API Names**.
3. Confirm the API names for every field in the Deals module.
4. Confirm that Tasks, Events, and Calls are related lists for Deals.
5. Confirm that the administrator email can send scheduled email.

The function expects these Deal API names:

`id`, `Deal_Name`, `Owner`, `Stage`, `Closing_Date`, `Last_Activity_Time`, `Next_Step`, and `Amount`.

## Set the function options

Open [`../dist/pipeline_hygiene.deluge`](../dist/pipeline_hygiene.deluge). Review the first settings inside the function.

```deluge
staleDays = 14;
maxDeals = 25;
createFollowUpTasks = false;
managerEmail = zoho.adminuserid;
closedStages = {"Closed Won","Closed Lost","Closed Lost to Competition"};
```

1. Set `staleDays` to your sales review limit.
2. Keep `maxDeals` at 25 or less for the first test.
3. Keep `createFollowUpTasks` set to `false`.
4. Set `managerEmail` to the fallback recipient.
5. Make `closedStages` match your pipeline stages.

## Add the scheduled function

1. Open the function area in your Zoho CRM sandbox.
2. Create a scheduled function named `pipeline_hygiene_digest`.
3. Copy the complete generated Deluge file into the editor.
4. Save the function.
5. Run it once with three controlled sample deals.
6. Check the function log and every received digest.
7. Schedule one daily run after the controlled test passes.

Zoho can change menu labels between editions. Use Zoho's function documentation if the path differs in your account.

Each deal can cause up to three related-record requests. Check your Zoho external-call limit before you increase `maxDeals`.

## Compare the results

Create the four [saved views](../views/SAVED_VIEWS.md). Compare each flagged deal with the related digest row.

Do not install the schedule in production until the [live checklist](TESTING.md) passes.
