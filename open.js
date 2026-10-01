// Dashboard thread links (bin/usage, host.json -> dashboard.linkBase) come here as
// <page>#h/<serverId>/agent/<agentId>. The ids travel only in the fragment, which browsers never
// send, and are checked against the id shapes of bin/usage (SERVER_ID_RE, AGENT_ID_RE); anything
// else shows "Not a Paseo thread link." and goes nowhere. The tap on the button is the path that
// must work: iOS may ignore a scripted custom-scheme redirect no tap started.
"use strict";

const SHAPE = /^#h\/(srv_[A-Za-z0-9]{6,40})\/agent\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/;

// {app, web} for a valid fragment, built only from the two captured ids; else null.
function target(hash) {
  const m = typeof hash === "string" ? SHAPE.exec(hash) : null;
  if (!m) return null;
  return {app: "paseo://h/" + m[1] + "/agent/" + m[2], web: "https://app.paseo.sh/h/" + m[1] + "/agent/" + m[2]};
}

if (typeof document !== "undefined") {
  const t = target(location.hash);
  if (t) {
    document.getElementById("app").href = t.app;
    document.getElementById("web").href = t.web;
    document.getElementById("links").hidden = false;
    try {
      location.replace(t.app);  // best effort; the button stays for the tap
    } catch (e) {
      // ignored: the button is there
    }
  } else {
    document.getElementById("bad").hidden = false;
  }
}

if (typeof module !== "undefined") module.exports = {target};
