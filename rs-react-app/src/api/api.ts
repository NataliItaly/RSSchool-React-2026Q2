import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { CharactersResponse } from '../types';

const CACHE_TTL = Number(import.meta.env.VITE_CACHE_TTL) || 60;

export const api = createApi({
  reducerPath: 'api',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://rickandmortyapi.com/api/',
  }),

  tagTypes: ['Character'],

  endpoints: (builder) => ({
    getCharacters: builder.query({
      query: (page = 1) => `character?page=${page}`,

      providesTags: ['Character'],

      keepUnusedDataFor: CACHE_TTL,
    }),

    getCharacterById: builder.query<CharactersResponse, number>({
      query: (id: number) => `character/${id}`,

      providesTags: ['Character'],

      keepUnusedDataFor: CACHE_TTL,
    }),
  }),
});

export const { useGetCharactersQuery, useGetCharacterByIdQuery } = api;
