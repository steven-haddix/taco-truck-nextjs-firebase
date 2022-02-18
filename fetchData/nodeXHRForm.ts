const https = require("https");

const formatParams = (params: { [key: string]: string }) => {
  return Object.keys(params)
    .map((key) => {
      return encodeURIComponent(key) + "=" + encodeURIComponent(params[key]);
    })
    .join("&");
};

export default async function apiCall(
  host: string,
  path: string,
  data: { [key: string]: string },
  client?: string,
  secret?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    var options = {
      hostname: host,
      port: 443,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(`${client}:${secret}`).toString("base64"),
      },
    };
    var req = https.request(options, (res: any) => {
      res.setEncoding("utf8");

      // temporary data holder
      const body: string[] = [];

      // on every content chunk, push it to the data array
      res.on("data", (chunk: string) => body.push(chunk));

      // we are done, resolve promise with those joined chunks
      res.on("end", () => resolve(body.join("")));
    });

    req.on("error", (e: string) => {
      reject(e);
    });

    req.write(formatParams(data));
    req.end();
  });
}
