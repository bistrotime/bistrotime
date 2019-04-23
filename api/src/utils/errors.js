export default (res, msg) => {
  res.status(422).json({
    errors: [{ msg }],
  });
};
