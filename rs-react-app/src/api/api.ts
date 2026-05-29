import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Character } from '../types';

const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || 60;

export interface CharactersResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };

  results: Character[];
}

type CharactersQueryParams = {
  search?: string;
  page?: number;
};

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/',
  }),

  tagTypes: ['Character'],

  endpoints: (builder) => ({
    getCharacters: builder.query<CharactersResponse, CharactersQueryParams>({
      query: ({ search = '', page = 1 }) => ({
        url: 'character',
        params: {
          name: search,
          page,
        },
      }),

      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: 'Character' as const,
                id,
              })),
              { type: 'Character', id: 'LIST' },
            ]
          : [{ type: 'Character', id: 'LIST' }],

      keepUnusedDataFor: CACHE_TTL,
    }),

    getCharacterById: builder.query<Character, number>({
      query: (id: number) => `character/${id}`,

      providesTags: (_result, _error, id) => [{ type: 'Character', id }],

      keepUnusedDataFor: CACHE_TTL,
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterByIdQuery } = api;
