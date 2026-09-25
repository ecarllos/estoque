import { main } from './seeds';

main().catch((error) => {
  console.error('❌ Erro durante o seed: ', error);
  process.exit(1);
});
