import { NextApiRequest, NextApiResponse } from "next";

export { errorHandler };

function errorHandler(err: string | Error, res: NextApiResponse) {
  if (typeof err === "string") {
    // custom application error
    const is404 = err.toLowerCase().endsWith("not found");
    const statusCode = is404 ? 404 : 400;
    return res.status(statusCode).json({ message: err });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Invalid Token" });
  }

  // default to 500 server error
  console.error(err);
  return res.status(500).json({ message: err.message });
}

export interface IApiHandler {
  [key: string]: (req: NextApiRequest, res: NextApiResponse) => {};
}

export function apiHandler(handler: IApiHandler) {
  // @ts-ignore
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const method = req.method?.toLowerCase();

    // check handler supports HTTP method
    if (!method || !handler[method])
      return res.status(405).end(`Method ${req.method} Not Allowed`);

    try {
      // route handler
      await handler[method](req, res);
    } catch (err) {
      // global error handler
      errorHandler(err, res);
    }
  };
}
