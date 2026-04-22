export const supabase = new Proxy(
  {},
  {
    get() {
      throw new Error(
        "Supabase has been removed. This route has not been migrated to PostgreSQL yet.",
      );
    },
  },
) as any;
