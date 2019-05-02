// eslint-disable-next-line import/prefer-default-export
export function error(res, message, status = 400) {
  res.status(status).json({
    error: { status, message },
  });
}
