export default function arcjet() {
  return {
    protect: async (req, res, next) => next(),
    withRule: () => ({
      protect: async (req, res, next) => next(),
    }),
  };
}
