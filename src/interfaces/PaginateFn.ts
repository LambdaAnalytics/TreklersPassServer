import { FilterQuery } from 'mongoose';

export type PaginateFn<T> = (
  filter: FilterQuery<T>,
  options: {
    sortBy: 'desc' | 'asc';
    populate: string;
    limit?: number;
    page?: number;
  },
) => Promise<{
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}>;
