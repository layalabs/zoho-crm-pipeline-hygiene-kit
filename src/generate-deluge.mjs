#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { DEFAULT_OPTIONS } from "./classify.mjs";

const DEFAULT_LABELS = Object.freeze({
  overdue_closing_date: "Closing date is overdue",
  no_open_activity: "No open activity",
  stale_last_activity: "Last activity is stale",
  missing_next_step: "Next step is missing",
  missing_owner: "Owner is missing",
  missing_amount: "Amount is missing"
});

function delugeString(value) {
  return String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\r", "").replaceAll("\n", "\\n");
}

function validateOptions(options) {
  const maxDeals = options.maxDeals ?? 200;
  const staleDays = options.staleDays ?? DEFAULT_OPTIONS.staleDays;
  if (!Number.isInteger(maxDeals) || maxDeals < 1 || maxDeals > 200) {
    throw new RangeError("maxDeals must be between 1 and 200");
  }
  if (!Number.isInteger(staleDays) || staleDays < 0 || staleDays > 365) {
    throw new RangeError("staleDays must be between 0 and 365");
  }
  return { maxDeals, staleDays };
}

export function generateDeluge(options = {}) {
  const { maxDeals, staleDays } = validateOptions(options);
  const labels = { ...DEFAULT_LABELS, ...options.reasonLabels };
  const labelLines = Object.entries(labels)
    .map(([code, label]) => `reasonLabels.put("${delugeString(code)}","${delugeString(label)}");`)
    .join("\n\t");

  return `// Zoho CRM Pipeline Hygiene Kit v0.1.0
// Generated file. Run npm run generate to update it.
// Test this beta in a Zoho CRM sandbox before production use.

void scheduled.pipeline_hygiene_digest()
{
\tstaleDays = ${staleDays};
\tmaxDeals = ${maxDeals};
\tcreateFollowUpTasks = false;
\tmanagerEmail = zoho.adminuserid;
\tclosedStages = {"Closed Won","Closed Lost","Closed Lost to Competition"};
\treasonLabels = Map();
\t${labelLines}
\tqueryMap = Map();
\tqueryMap.put("fields","id,Deal_Name,Owner,Stage,Closing_Date,Last_Activity_Time,Next_Step,Amount");
\tdeals = zoho.crm.v8.getRecords("Deals",1,maxDeals,queryMap);
\townerRows = Map();
\townerNames = Map();
\tfor each deal in deals
\t{
\t\tstage = ifnull(deal.get("Stage"),"");
\t\tif(!closedStages.contains(stage))
\t\t{
\t\t\tdealId = deal.get("id");
\t\t\tdealName = ifnull(deal.get("Deal_Name"),"Unnamed deal").toString();
\t\t\treasons = List();
\t\t\tclosingDateText = ifnull(deal.get("Closing_Date"),"").toString();
\t\t\tif(closingDateText != "" && closingDateText.toDate("yyyy-MM-dd") < zoho.currentdate)
\t\t\t{
\t\t\t\treasons.add("overdue_closing_date");
\t\t\t}
\t\t\thasOpenActivity = false;
\t\t\ttasks = zoho.crm.v8.getRelatedRecords("Tasks","Deals",dealId,1,200,Map());
\t\t\tfor each task in tasks
\t\t\t{
\t\t\t\ttaskStatus = ifnull(task.get("Status"),"").toString();
\t\t\t\tif(taskStatus != "Completed" && taskStatus != "Deferred" && taskStatus != "Cancelled")
\t\t\t\t{
\t\t\t\t\thasOpenActivity = true;
\t\t\t\t}
\t\t\t}
\t\t\tif(!hasOpenActivity)
\t\t\t{
\t\t\t\tevents = zoho.crm.v8.getRelatedRecords("Events","Deals",dealId,1,200,Map());
\t\t\t\tfor each event in events
\t\t\t\t{
\t\t\t\t\teventStatus = ifnull(event.get("Event_Status"),"").toString();
\t\t\t\t\tif(eventStatus != "Completed" && eventStatus != "Cancelled")
\t\t\t\t\t{
\t\t\t\t\t\thasOpenActivity = true;
\t\t\t\t\t}
\t\t\t\t}
\t\t\t}
\t\t\tif(!hasOpenActivity)
\t\t\t{
\t\t\t\tcalls = zoho.crm.v8.getRelatedRecords("Calls","Deals",dealId,1,200,Map());
\t\t\t\tfor each call in calls
\t\t\t\t{
\t\t\t\t\tcallStatus = ifnull(call.get("Call_Status"),"").toString();
\t\t\t\t\tif(callStatus != "Completed" && callStatus != "Cancelled")
\t\t\t\t\t{
\t\t\t\t\t\thasOpenActivity = true;
\t\t\t\t\t}
\t\t\t\t}
\t\t\t}
\t\t\tif(!hasOpenActivity)
\t\t\t{
\t\t\t\treasons.add("no_open_activity");
\t\t\t}
\t\t\tlastActivityText = ifnull(deal.get("Last_Activity_Time"),"").toString();
\t\t\tif(lastActivityText != "")
\t\t\t{
\t\t\t\tlastActivityDate = lastActivityText.subString(0,10).toDate("yyyy-MM-dd");
\t\t\t\tif(lastActivityDate < zoho.currentdate.subDay(staleDays))
\t\t\t\t{
\t\t\t\t\treasons.add("stale_last_activity");
\t\t\t\t}
\t\t\t}
\t\t\tnextStep = ifnull(deal.get("Next_Step"),"").toString().trim();
\t\t\tif(nextStep == "")
\t\t\t{
\t\t\t\treasons.add("missing_next_step");
\t\t\t}
\t\t\towner = deal.get("Owner");
\t\t\townerName = "";
\t\t\townerEmail = "";
\t\t\tif(owner != null)
\t\t\t{
\t\t\t\townerName = ifnull(owner.get("name"),"").toString();
\t\t\t\townerEmail = ifnull(owner.get("email"),"").toString().toLowerCase();
\t\t\t}
\t\t\tif(ownerName == "" || ownerEmail == "")
\t\t\t{
\t\t\t\treasons.add("missing_owner");
\t\t\t\townerEmail = managerEmail;
\t\t\t\townerName = "Sales manager";
\t\t\t}
\t\t\tif(deal.get("Amount") == null)
\t\t\t{
\t\t\t\treasons.add("missing_amount");
\t\t\t}
\t\t\tif(reasons.size() > 0)
\t\t\t{
\t\t\t\treasonText = "";
\t\t\t\tfor each reason in reasons
\t\t\t\t{
\t\t\t\t\tif(reasonText != "")
\t\t\t\t\t{
\t\t\t\t\t\treasonText = reasonText + ", ";
\t\t\t\t\t}
\t\t\t\t\treasonText = reasonText + reasonLabels.get(reason);
\t\t\t\t}
\t\t\t\tsafeName = dealName.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
\t\t\t\tsafeStage = stage.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
\t\t\t\trow = "<tr><td>" + safeName + "</td><td>" + safeStage + "</td><td>" + closingDateText + "</td><td>" + reasonText + "</td></tr>";
\t\t\t\texistingRows = ifnull(ownerRows.get(ownerEmail),"");
\t\t\t\townerRows.put(ownerEmail,existingRows + row);
\t\t\t\townerNames.put(ownerEmail,ownerName);
\t\t\t\tif(createFollowUpTasks)
\t\t\t\t{
\t\t\t\t\ttaskData = Map();
\t\t\t\t\ttaskData.put("Subject","Review pipeline hygiene: " + dealName);
\t\t\t\t\ttaskData.put("Due_Date",zoho.currentdate.addDay(1));
\t\t\t\t\ttaskData.put("$se_module","Deals");
\t\t\t\t\ttaskData.put("What_Id",dealId);
\t\t\t\t\tzoho.crm.createRecord("Tasks",taskData);
\t\t\t\t}
\t\t\t}
\t\t}
\t}
\tfor each recipient in ownerRows.keys()
\t{
\t\tmessageBody = "<h1>Pipeline hygiene digest</h1><p>" + ownerNames.get(recipient) + ", these deals need attention.</p><table><thead><tr><th>Deal</th><th>Stage</th><th>Closing date</th><th>Reasons</th></tr></thead><tbody>" + ownerRows.get(recipient) + "</tbody></table>";
\t\tsendmail
\t\t[
\t\t\tfrom : zoho.adminuserid
\t\t\tto : recipient
\t\t\tsubject : "Zoho CRM pipeline hygiene digest"
\t\t\tmessage : messageBody
\t\t]
\t}
}
`;
}

async function writeArtifact() {
  const output = fileURLToPath(new URL("../dist/pipeline_hygiene.deluge", import.meta.url));
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, generateDeluge(), "utf8");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeArtifact().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
