import { Category } from '@/app/categories/components/categories-table';

export const actionsRealTimeCategory = () => {
  const actions: Record<
    string,
    (categories: Category[], payload: any) => Category[]
  > = {
    INSERT: (categories: Category[], payload: any) => {
      return [...categories, payload.new];
    },
    DELETE: (categories: Category[], payload: any) => {
      return categories.filter(
        (item) => item.categories_id !== payload.old.categories_id
      );
    },
    UPDATE: (categories: Category[], payload: any) => {
      const selectCategory = categories.find(
        (category) => category.categories_id === payload.new.categories_id
      );
      return selectCategory
        ? categories.map((item) =>
            item.categories_id === payload.new.categories_id
              ? ({ ...payload.new, status: selectCategory } as Category)
              : item
          )
        : categories;
    },
  };
  return { actions };
};
