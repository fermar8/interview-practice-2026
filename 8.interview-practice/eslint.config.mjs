import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import eslintComments from 'eslint-plugin-eslint-comments';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    { files: [`**/*.mts`], plugins: { js }, extends: ['js/recommended'] },
    { files: [`**/*.mts`], languageOptions: { globals: globals.node } },
    {
        files: [`**/*.mts`],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.base.json', './tsconfig.config.json', './tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    tseslint.configs.recommendedTypeChecked.map((config) =>
        config.name === 'typescript-eslint/recommended-type-checked'
            ? {
                  ...config,
                  // Add missing property to the config to avoid linting JSON files
                  files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
              }
            : config,
    ),
    {
        files: [`**/*.mts`],
        rules: {
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-floating-promises': 'error',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'linebreak-style': ['error', 'unix'],
            'max-len': ['error', { code: 120, tabWidth: 4, ignoreComments: true, ignoreStrings: true }],
            'no-console': 'off',
            'no-restricted-imports': ['error', { patterns: ['src/*'] }],
            'no-undef': 'error',
            'require-await': 'error',
            eqeqeq: 'error',
            quotes: ['error', 'single', { avoidEscape: true }],
        },
    },
    importPlugin.flatConfigs.typescript,
    {
        files: [`**/*.mts`],
        plugins: { 'simple-import-sort': simpleImportSort },
        rules: {
            'simple-import-sort/imports': 'error',
            'simple-import-sort/exports': 'error',
        },
    },
    {
        files: [`**/*.mts`],
        plugins: { 'eslint-comments': eslintComments },
        rules: {
            'eslint-comments/no-unused-disable': 'error',
        },
    },
    { files: ['**/*.json'], plugins: { json }, language: 'json/json', extends: ['json/recommended'] },
    { files: ['**/*.md'], plugins: { markdown }, language: 'markdown/gfm', extends: ['markdown/recommended'] },
    eslintPluginPrettierRecommended,
    { ignores: ['**/dist/**', '**/node_modules/**', '**/-lock.{json,yaml}'] },
]);
