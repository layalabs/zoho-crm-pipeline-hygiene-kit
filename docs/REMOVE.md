# Remove the beta

1. Disable the `pipeline_hygiene_digest` schedule.
2. Confirm that no later run appears in the function history.
3. Delete the scheduled function if you do not need it.
4. Delete the saved views only when your team no longer uses them.

The default function does not change deals. It also keeps follow-up task creation off.

If you enabled `createFollowUpTasks`, review those tasks before you remove them. Do not delete tasks by subject alone.

This kit creates no connection or external data store by default. Revoke a connection only if you added one during customization.
