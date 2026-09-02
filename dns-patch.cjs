// Loaded via --require before anything else runs.
// Patches Node.js DNS to use Google's servers so MongoDB Atlas SRV records resolve.
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
