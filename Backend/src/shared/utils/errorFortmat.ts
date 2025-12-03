export const errorFormat = (error: unknown) =>
  error instanceof Error
    ? { message: error.message, cause: error.cause, stack: error.stack, name: error.name }
    : { message: String(error) };
