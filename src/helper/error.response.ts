import { Response } from 'express';

export const Ok = (response: Response, message: string, body: any) => {
  return response.send({
    status: true,
    code: 200,
    message: message ? message : null,
    data: body ? body : null,
  });
};

export const BadRequest = (response: Response, body: any) => {
  const code = body?.code || 400;
  return body
    ? response.status(code).send({
        status: false,
        code: code,
        error: { message: body ? body.message : 'somthing wrong !' },
      })
    : response.status(code).send({ status: false });
};
