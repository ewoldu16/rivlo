import { defineConfig, globalIgnores } from 'eslint/config';
import next from 'eslint-config-next/core-web-vitals';
export default defineConfig([...next,globalIgnores(['.next/**','.tools/**','test-results/**','playwright-report/**'])]);
